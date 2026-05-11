const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!

Deno.serve(async (req) => {
  try {
    const { email, name } = await req.json()

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400 })
    }

    const firstName = name?.split(' ')[0] || 'there'

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:#0f172a;padding:32px 40px;">
              <img src="https://replios.com/replio-logo-wordmark-white.svg" alt="Replio" height="28" style="display:block;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#0f172a;">
                Welcome to Replio, ${firstName} 👋
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#475569;line-height:1.7;">
                You're all set. Replio will help you reply to every Google review in seconds — with AI that knows your business.
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:24px;margin-bottom:28px;">
                <tr>
                  <td>
                    <p style="margin:0 0 16px;font-size:13px;font-weight:600;color:#0f172a;text-transform:uppercase;letter-spacing:0.05em;">Get started in 3 steps</p>
                    ${[
                      ['1', 'Connect your Google Business Profile', 'Link your account in the Account tab'],
                      ['2', 'Set your reply tone', 'Tell Replio how you like to communicate'],
                      ['3', 'Reply to your first review', 'One click and your AI reply is ready'],
                    ].map(([num, title, desc]) => `
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px;">
                      <tr>
                        <td width="28" valign="top">
                          <div style="width:24px;height:24px;background:#6366f1;border-radius:50%;text-align:center;line-height:24px;font-size:11px;font-weight:700;color:white;">${num}</div>
                        </td>
                        <td style="padding-left:12px;">
                          <p style="margin:0;font-size:14px;font-weight:600;color:#0f172a;">${title}</p>
                          <p style="margin:2px 0 0;font-size:13px;color:#64748b;">${desc}</p>
                        </td>
                      </tr>
                    </table>`).join('')}
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#6366f1;border-radius:10px;">
                    <a href="https://replios.com/dashboard" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Go to my dashboard →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:14px;color:#94a3b8;line-height:1.6;">
                Your 14-day free trial has started. No credit card needed.<br>
                Questions? Reply to this email — I read every message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">
                © 2026 Replio · <a href="https://replios.com/privacy" style="color:#94a3b8;">Privacy</a> · <a href="https://replios.com/terms" style="color:#94a3b8;">Terms</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
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
        from: 'Dimitri from Replio <contact@replios.com>',
        to: [email],
        subject: 'Welcome to Replio 👋',
        html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Resend error:', data)
      return new Response(JSON.stringify({ error: data }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 })

  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
})
