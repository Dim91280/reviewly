import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const PRICE_SOLO = 'price_1TTicgB0aG7UyaOPr2HonNB7'
const PRICE_PRO = 'price_1TTifSB0aG7UyaOPdWJfXheQ'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

function Pricing({ onStartFree }) {
  const [loading, setLoading] = useState(null)
  const [session, setSession] = useState(null)
  const [sectionRef, inView] = useInView()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [])

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  const handleCheckout = async (priceId, planName) => {
    setLoading(planName)
    try {
      const currentSession = session || (await supabase.auth.getSession()).data.session
      if (!currentSession) { onStartFree(); return }
      const response = await fetch(
        'https://wfjsynilylbjymwjusvi.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({ priceId, userId: currentSession.user.id, userEmail: currentSession.user.email }),
        }
      )
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (err) {
      alert('Erreur : ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  const soloFeatures = [
    '1 Google Business location',
    'Unlimited AI-generated replies',
    'Chrome extension',
    'Email notifications for new reviews',
    'Replios Score dashboard',
  ]

  const proFeatures = [
    'Up to 3 Google Business locations',
    'Unlimited AI-generated replies',
    'Chrome extension',
    'Crisis mode — alert on 3 bad reviews in 24h',
    'Weekly reputation report by email',
    'Priority support',
  ]

  return (
    <section id="pricing" ref={sectionRef} style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)',
      background: '#05080F',
      position: 'relative', overflow: 'hidden',
    }}>

      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '700px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '820px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', ...fade(0) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#818CF8', marginBottom: '16px',
          }}>
            <span style={{ width: '24px', height: '1px', background: '#6366F1', display: 'inline-block' }} />
            Pricing
            <span style={{ width: '24px', height: '1px', background: '#6366F1', display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: '900',
            letterSpacing: '-2px', lineHeight: '1.05', color: '#F1F5F9', marginBottom: '12px',
          }}>
            Simple pricing.<br />Serious results.
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.65' }}>
            14-day free trial on every plan. No credit card required.
          </p>
        </div>

        {/* Cards — stacked on mobile, side by side on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px', marginTop: '48px',
        }}>

          {/* Solo */}
          <div style={{
            background: '#0D1220',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px', padding: '32px',
            transition: 'border-color 0.2s',
            ...fade(0.1),
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#475569', marginBottom: '12px' }}>Solo</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: '600', color: '#64748B', alignSelf: 'flex-start', marginTop: '6px' }}>€</span>
              <span style={{ fontSize: 'clamp(44px, 10vw, 56px)', fontWeight: '900', letterSpacing: '-3px', color: '#F1F5F9' }}>19</span>
              <span style={{ fontSize: '14px', color: '#475569', marginLeft: '4px' }}>/month</span>
            </div>
            <p style={{
              fontSize: '13px', color: '#475569', lineHeight: '1.55',
              marginBottom: '24px', paddingBottom: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              For solo owners managing one location. Everything you need to take control of your reputation.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {soloFeatures.map((ft, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
                  <span style={{ fontSize: '14px', color: '#10B981', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {ft}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_SOLO, 'solo')}
              disabled={loading === 'solo'}
              style={{
                width: '100%', padding: '13px', fontSize: '14px', fontWeight: '700',
                borderRadius: '10px', cursor: loading === 'solo' ? 'not-allowed' : 'pointer',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)', color: '#94A3B8',
                transition: 'all 0.2s', opacity: loading === 'solo' ? 0.5 : 1,
              }}
            >
              {loading === 'solo' ? 'Loading...' : 'Start free trial'}
            </button>
          </div>

          {/* Pro */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))',
            border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '18px', padding: '32px',
            position: 'relative',
            transition: 'border-color 0.2s',
            ...fade(0.18),
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'}
          >
            <div style={{
              position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
              background: '#6366F1', color: '#fff',
              fontSize: '10px', fontWeight: '800', padding: '4px 16px',
              borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap',
            }}>Most popular</div>

            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#818CF8', marginBottom: '12px' }}>Pro</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: '600', color: '#818CF8', alignSelf: 'flex-start', marginTop: '6px' }}>€</span>
              <span style={{ fontSize: 'clamp(44px, 10vw, 56px)', fontWeight: '900', letterSpacing: '-3px', color: '#F1F5F9' }}>29</span>
              <span style={{ fontSize: '14px', color: '#475569', marginLeft: '4px' }}>/month</span>
            </div>
            <p style={{
              fontSize: '13px', color: '#475569', lineHeight: '1.55',
              marginBottom: '24px', paddingBottom: '24px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              For ambitious businesses that want to dominate their local market and protect their reputation at scale.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {proFeatures.map((ft, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
                  <span style={{ fontSize: '14px', color: '#10B981', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {ft}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(PRICE_PRO, 'pro')}
              disabled={loading === 'pro'}
              style={{
                width: '100%', padding: '13px', fontSize: '14px', fontWeight: '700',
                borderRadius: '10px', cursor: loading === 'pro' ? 'not-allowed' : 'pointer',
                border: 'none', background: '#6366F1', color: '#fff',
                transition: 'all 0.2s', opacity: loading === 'pro' ? 0.5 : 1,
              }}
            >
              {loading === 'pro' ? 'Loading...' : 'Start free trial →'}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#334155', marginTop: '28px', ...fade(0.3) }}>
          🔒 Secure payment · GDPR compliant · Cancel anytime
        </p>
      </div>
    </section>
  )
}

export default Pricing
