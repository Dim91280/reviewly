const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    if (!body) return new Response(JSON.stringify({ error: 'Empty body' }), { status: 400, headers: corsHeaders })

    const payload = JSON.parse(body)
    const review = payload.record

    if (!review) return new Response(JSON.stringify({ error: 'No record' }), { status: 400, headers: corsHeaders })

    // Récupérer l'email de l'utilisateur via l'API admin
    const userRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${review.user_id}`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    })
    const userData = await userRes.json()
    const userEmail = userData?.email
    if (!userEmail) return new Response(JSON.stringify({ error: 'User email not found' }), { status: 400, headers: corsHeaders })

    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
    const ratingColor = review.rating >= 4 ? '#16a34a' : review.rating === 3 ? '#ca8a04' : '#dc2626'

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#0f172a;padding:24px 40px;">
            <img src="https://replios.com/replio-logo-wordmark-white.svg" alt="Replio" height="24" style="display:block;">
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.05em;">New review</p>
            <p style="margin:0 0 24px;font-size:20px;font-weight:700;color:#0f172a;">
              ${review.author} left you a review
            </p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr>
                <td>
                  <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                    <span style="font-size:20px;color:${ratingColor};font-weight:700;">${stars}</span>
                    <span style="font-size:13px;font-weight:600;color:${ratingColor};">${review.rating}/5</span>
                  </div>
                  <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;font-style:italic;">
                    "${review.text}"
                  </p>
                </td>
              </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td style="background:#6366f1;border-radius:10px;">
                  <a href="https://replios.com/reviews" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Reply now →
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.6;">
              Responding quickly improves your Google ranking and builds customer trust.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
            <p style="margin:0;font-size:12px;color:#cbd5e1;">
              © 2026 Replio · <a href="https://replios.com/privacy" style="color:#94a3b8;">Privacy</a> · <a href="https://replios.com/terms" style="color:#94a3b8;">Terms</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Replio <noreply@replios.com>',
        to: [userEmail],
        subject: `⭐ New ${review.rating}★ review from ${review.author}`,
        html,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('Resend error:', data)
      return new Response(JSON.stringify({ error: data }), { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders })

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: corsHeaders })
  }
})