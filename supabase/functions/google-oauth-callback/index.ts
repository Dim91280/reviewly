import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID')!
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET')!
const REDIRECT_URI = 'https://wfjsynilylbjymwjusvi.supabase.co/functions/v1/google-oauth-callback'
const APP_URL = Deno.env.get('APP_URL') || 'https://reviewly.vercel.app'

Deno.serve(async (req) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state') // Supabase JWT passed by the frontend

  if (!code || !state) {
    return Response.redirect(`${APP_URL}?error=missing_params`, 302)
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      console.error('Token exchange failed:', tokens)
      return Response.redirect(`${APP_URL}?error=token_exchange_failed`, 302)
    }

    // Identify the user from the JWT in state
    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${state}` } } }
    )
    const { data: { user }, error: userError } = await anonClient.auth.getUser()
    if (userError || !user) {
      console.error('Auth failed:', userError)
      return Response.redirect(`${APP_URL}?error=auth_failed`, 302)
    }

    // Persist tokens using service role (bypasses RLS)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: upsertError } = await adminClient.from('google_connections').upsert({
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (upsertError) {
      console.error('DB upsert failed:', upsertError)
      return Response.redirect(`${APP_URL}?error=db_error`, 302)
    }

    return Response.redirect(`${APP_URL}?google_connected=true`, 302)
  } catch (err) {
    console.error('Unexpected error:', err)
    return Response.redirect(`${APP_URL}?error=server_error`, 302)
  }
})
