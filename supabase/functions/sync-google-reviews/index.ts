import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!

const STAR_RATING: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
}

async function refreshToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  })
  return res.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Authenticate user via JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Missing Authorization header')

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )
    const { data: { user }, error: userError } = await anonClient.auth.getUser()
    if (userError || !user) throw new Error('Unauthorized')

    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch stored Google connection
    const { data: conn, error: connError } = await adminClient
      .from('google_connections')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (connError || !conn) throw new Error('Google account not connected')

    // Refresh access token if expired
    let accessToken = conn.access_token
    if (new Date(conn.expires_at) <= new Date()) {
      const refreshed = await refreshToken(conn.refresh_token)
      if (!refreshed.access_token) throw new Error('Failed to refresh Google token')
      accessToken = refreshed.access_token
      await adminClient.from('google_connections').update({
        access_token: accessToken,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    }

    // Auto-discover account_id if not stored
    let accountId = conn.account_id
    if (!accountId) {
      const accountsRes = await fetch(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const accountsData = await accountsRes.json()
      const firstAccount = accountsData.accounts?.[0]
      if (!firstAccount) throw new Error('No Google Business account found')
      // name is "accounts/123456789"
      accountId = firstAccount.name.split('/')[1]
    }

    // Auto-discover location_id if not stored
    let locationId = conn.location_id
    if (!locationId) {
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const locData = await locRes.json()
      const firstLocation = locData.locations?.[0]
      if (!firstLocation) throw new Error('No location found on this Google Business account')
      // name is "locations/987654321"
      locationId = firstLocation.name.split('/')[1]

      await adminClient.from('google_connections').update({
        account_id: accountId,
        location_id: locationId,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    }

    // Fetch reviews from Google Business Profile API
    const reviewsRes = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const reviewsData = await reviewsRes.json()

    if (reviewsData.error) throw new Error(`GBP API error: ${reviewsData.error.message}`)

    const googleReviews = reviewsData.reviews ?? []

    // Upsert into reviews table, deduplicating on google_review_id
    if (googleReviews.length > 0) {
      const rows = googleReviews.map((r: any) => ({
        user_id: user.id,
        author: r.reviewer?.displayName || 'Anonymous',
        rating: STAR_RATING[r.starRating] ?? 3,
        text: r.comment ?? '',
        platform: 'Google',
        replied: !!r.reviewReply,
        google_review_id: r.reviewId,
        created_at: r.createTime,
      }))

      const { error: upsertError } = await adminClient
        .from('reviews')
        .upsert(rows, { onConflict: 'google_review_id', ignoreDuplicates: false })

      if (upsertError) throw new Error(`Upsert failed: ${upsertError.message}`)
    }

    return new Response(
      JSON.stringify({ synced: googleReviews.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
