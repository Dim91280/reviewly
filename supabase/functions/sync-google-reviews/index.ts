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

    let accountId = conn.account_id
    let locationId = conn.location_id

    if (!accountId || !locationId) {
      // Approche 1 : lister les comptes normalement
      const accountsRes = await fetch(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const accountsData = await accountsRes.json()
      console.log('Accounts response:', JSON.stringify(accountsData))

      let accounts = accountsData.accounts ?? []

      // Approche 2 : si pas de comptes, essayer avec le profil personnel
      if (accounts.length === 0) {
        // Récupérer l'info utilisateur Google pour avoir son ID
        const userInfoRes = await fetch(
          'https://www.googleapis.com/oauth2/v2/userinfo',
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const userInfo = await userInfoRes.json()
        console.log('User info:', JSON.stringify(userInfo))

        // Essayer de lister les locations directement via le compte personnel
        const personalLocRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${userInfo.id}/locations?readMask=name,title`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const personalLocData = await personalLocRes.json()
        console.log('Personal locations:', JSON.stringify(personalLocData))

        if (personalLocData.locations?.length > 0) {
          accountId = userInfo.id
          locationId = personalLocData.locations[0].name.split('/')[1]
        } else {
          // Approche 3 : chercher via l'API v1 locations directement
          const locSearchRes = await fetch(
            'https://mybusinessbusinessinformation.googleapis.com/v1/googleLocations:search',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ pageSize: 5 }),
            }
          )
          const locSearchData = await locSearchRes.json()
          console.log('Location search:', JSON.stringify(locSearchData))

          if (!accountId) throw new Error(`No Google Business account found. Debug: ${JSON.stringify(accountsData)}`)
        }
      } else {
        accountId = accounts[0].name.split('/')[1]

        // Trouver la location
        const locRes = await fetch(
          `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations?readMask=name`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )
        const locData = await locRes.json()
        console.log('Locations response:', JSON.stringify(locData))

        const firstLocation = locData.locations?.[0]
        if (!firstLocation) throw new Error('No location found on this Google Business account')
        locationId = firstLocation.name.split('/')[1]
      }

      // Sauvegarder account_id et location_id
      await adminClient.from('google_connections').update({
        account_id: accountId,
        location_id: locationId,
        updated_at: new Date().toISOString(),
      }).eq('user_id', user.id)
    }

    // Fetch reviews
    const reviewsRes = await fetch(
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    const reviewsData = await reviewsRes.json()
    console.log('Reviews response:', JSON.stringify(reviewsData))

    if (reviewsData.error) throw new Error(`GBP API error: ${JSON.stringify(reviewsData.error)}`)

    const googleReviews = reviewsData.reviews ?? []

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
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
