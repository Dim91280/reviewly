const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const HOOK_SECRET = Deno.env.get('SEND_EMAIL_HOOK_SECRET')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-signature',
}

function base64ToArrayBuffer(b64: string): ArrayBuffer {
  const binaryStr = atob(b64)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }
  return bytes.buffer as ArrayBuffer
}

async function verifyHookSignature(req: Request, body: string): Promise<boolean> {
  try {
    if (!HOOK_SECRET) {
      console.log('[HMAC] No secret — skipping')
      return true
    }

    const signature = req.headers.get('x-supabase-signature')
    console.log('[HMAC] Signature:', signature ? signature.slice(0, 30) + '...' : 'MISSING')
    console.log('[HMAC] Secret starts with:', HOOK_SECRET.slice(0, 20))

    if (!signature) {
      console.log('[HMAC] No signature — allowing')
      return true
    }

    const rawSecret = HOOK_SECRET.startsWith('v1,whsec_')
      ? HOOK_SECRET.slice('v1,whsec_'.length)
      : HOOK_SECRET

    const keyBuffer = base64ToArrayBuffer(rawSecret)
    const key = await crypto.subtle.importKey(
      'raw', keyBuffer,
      { name: 'HMAC', hash: 'SHA-256' },
      false, ['verify']
    )

    const rawSig = signature.startsWith('v1,') ? signature.slice(3) : signature
    const sigBuffer = base64ToArrayBuffer(rawSig)
    const bodyBuffer = new TextEncoder().encode(body)

    const valid = await crypto.subtle.verify('HMAC', key, sigBuffer, bodyBuffer)
    console.log('[HMAC] Valid:', valid)
    return valid

  } catch (e) {
    console.error('[HMAC] Error:', e)
    return true
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log('[START] Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())))

  try {
    const body = await req.text()
    console.log('[BODY] Length:', body.length, '| Preview:', body.slice(0, 200))

    if (!body) {
      return new Response(JSON.stringify({ error: 'Empty body' }), { status: 400, headers: corsHeaders })
    }

    const valid = await verifyHookSignature(req, body)
    if (!valid) {
      console.warn('[HMAC] Invalid signature — continuing for debug')
    }

    const payload = JSON.parse(body)
    const email = payload?.user?.email
    const token = payload?.email_data?.token
    const emailActionType = payload?.email_data?.email_action_type

    console.log('[PAYLOAD] type:', emailActionType, '| email:', email, '| hasToken:', !!token)

    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email' }), { status: 400, headers: corsHeaders })
    }

    let subject = ''
    let html = ''

    if (emailActionType === 'signup' || emailActionType === 'email_change') {
      subject = 'Your Replios verification code'
      html = getOtpEmailHtml(token)
    } else if (emailActionType === 'recovery') {
      subject = 'Reset your Replios password'
      html = getRecoveryEmailHtml(payload?.email_data?.token_hash, payload?.email_data?.redirect_to)
    } else {
      subject = 'Action required on your Replios account'
      html = getOtpEmailHtml(token)
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Replios <noreply@replios.com>',
        to: [email],
        subject,
        html,
      }),
    })

    const data = await res.json()
    console.log('[RESEND] Status:', res.status, '| Response:', JSON.stringify(data))

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), { status: 500, headers: corsHeaders })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: corsHeaders })

  } catch (err) {
    console.error('[ERROR]', err)
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500, headers: corsHeaders })
  }
})

function getOtpEmailHtml(token: string): string {
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0f172a;padding:28px 40px;">
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Replios</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.5px;">Verify your email</p>
              <p style="margin:0 0 32px;font-size:15px;color:#94a3b8;line-height:1.6;">Enter this code in the Replios app to confirm your account and start your 14-day free trial.</p>
              <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="margin:0 0 8px;font-size:11px;color:#94a3b8;letter-spacing:0.08em;text-transform:uppercase;font-weight:500;">Verification code</p>
                <p style="margin:0;font-size:40px;font-weight:700;letter-spacing:12px;color:#111827;">${token}</p>
              </div>
              <p style="margin:0;font-size:13px;color:#cbd5e1;line-height:1.6;">This code expires in 1 hour. If you didn't create a Replios account, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">© 2026 Replios · <a href="https://replios.com/privacy" style="color:#6366f1;text-decoration:none;">Privacy</a> · <a href="https://replios.com/terms" style="color:#6366f1;text-decoration:none;">Terms</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function getRecoveryEmailHtml(tokenHash: string, redirectTo: string): string {
  const resetUrl = `https://replios.com/reset-password?token_hash=${tokenHash}&type=recovery&redirect_to=${redirectTo || 'https://replios.com'}`
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
          <tr>
            <td style="background:#0f172a;padding:28px 40px;">
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px;">Replios</span>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;letter-spacing:-0.5px;">Reset your password</p>
              <p style="margin:0 0 32px;font-size:15px;color:#94a3b8;line-height:1.6;">Click the button below to reset your Replios password. This link expires in 1 hour.</p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#6366f1;border-radius:10px;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Reset password →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#cbd5e1;line-height:1.6;">If you didn't request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#cbd5e1;">© 2026 Replios · <a href="https://replios.com/privacy" style="color:#6366f1;text-decoration:none;">Privacy</a> · <a href="https://replios.com/terms" style="color:#6366f1;text-decoration:none;">Terms</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
