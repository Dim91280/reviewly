import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional: 'Use a professional, formal and polished tone. Be respectful and business-oriented.',
  friendly: 'Use a warm, friendly and approachable tone. Be conversational and make the customer feel welcome.',
  enthusiastic: 'Use an energetic, positive and enthusiastic tone. Show genuine excitement and appreciation.',
  empathetic: 'Use a caring, understanding and empathetic tone. Show that you truly understand the customer\'s feelings.',
  concise: 'Be very concise and direct. Use short sentences. Get straight to the point in 1-2 sentences maximum.',
  luxury: 'Use an elegant, refined and premium tone. Be sophisticated and convey exclusivity and excellence.',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { reviewText, rating, authorName, businessName: bodyBusinessName } = await req.json()

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

    // Try to get user's tone preference
    let tone = 'professional'
    let businessName = bodyBusinessName || 'our business'

    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_ANON_KEY')!,
          { global: { headers: { Authorization: authHeader } } }
        )
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const adminClient = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
          )
          const { data: profile } = await adminClient
            .from('business_profiles')
            .select('tone, business_name')
            .eq('user_id', user.id)
            .maybeSingle()
          if (profile) {
            tone = profile.tone || 'professional'
            businessName = profile.business_name || bodyBusinessName || 'our business'
          }
        }
      } catch {
        // Fallback to default tone if profile fetch fails
      }
    }

    const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional

    const prompt = `You are responding to a customer review on behalf of ${businessName}.

Tone instruction: ${toneInstruction}

Write a reply (2-3 sentences max) to this ${rating}-star review from ${authorName || 'a customer'}:
"${reviewText}"

Rules:
- Stay in character with the tone instruction
- Be genuine, don't use generic phrases
- If negative review (1-2 stars): acknowledge the issue and offer to make it right
- If positive review (4-5 stars): express genuine gratitude
- If neutral review (3 stars): acknowledge feedback and show commitment to improvement
- Never mention the star rating explicitly
- Reply directly, no preamble`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const reply = data.content[0].text

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
