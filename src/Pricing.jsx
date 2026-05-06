import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const PRICE_SOLO = 'price_1TTicgB0aG7UyaOPr2HonNB7'
const PRICE_PRO = 'price_1TTifSB0aG7UyaOPdWJfXheQ'

function useInView(threshold = 0.2) {
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

  return (
    <section id="pricing" ref={sectionRef} className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>

      {/* Dégradé décoratif */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)'
      }} />

      <div className="max-w-3xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease'
        }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Simple, honest pricing</h2>
          <p className="mt-3 text-sm" style={{ color: '#475569' }}>No contract. Cancel anytime.</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-5">

          {/* Solo */}
          <div
            className="flex-1 rounded-2xl p-7"
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid rgba(99,102,241,0.15)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(32px)',
              transition: 'all 0.6s ease 0.1s',
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#475569' }}>Solo</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">€19</span>
              <span className="text-sm" style={{ color: '#475569' }}>/month</span>
            </div>
            <p className="text-xs mb-7" style={{ color: '#475569' }}>Perfect to get started</p>

            <ul className="space-y-3 mb-8">
              {["Google monitoring", "Real-time alerts", "AI-powered replies", "1 location"].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#94a3b8' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(99,102,241,0.2)' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(PRICE_SOLO, 'solo')}
              disabled={loading === 'solo'}
              className="w-full font-medium py-3 rounded-xl text-sm disabled:opacity-50 transition-all"
              style={{ border: '1px solid rgba(99,102,241,0.3)', color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.05)' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.15)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'rgba(99,102,241,0.05)'
                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
              }}
            >
              {loading === 'solo' ? 'Loading...' : 'Start free trial'}
            </button>
          </div>

          {/* Pro */}
          <div
            className="flex-1 rounded-2xl p-7 relative"
            style={{
              background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)',
              border: '1px solid rgba(99,102,241,0.4)',
              boxShadow: '0 0 40px rgba(99,102,241,0.15)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(32px)',
              transition: 'all 0.6s ease 0.2s',
            }}
          >
            {/* Badge Popular */}
            <span
              className="absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-lg"
              style={{ backgroundColor: '#6366f1', color: 'white' }}
            >
              POPULAR
            </span>

            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6366f1' }}>Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">€29</span>
              <span className="text-sm" style={{ color: '#475569' }}>/month</span>
            </div>
            <p className="text-xs mb-7" style={{ color: '#475569' }}>For growing businesses</p>

            <ul className="space-y-3 mb-8">
              {["Everything in Solo", "SMS review requests", "Facebook + TripAdvisor", "Analytics dashboard", "3 locations"].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: '#cbd5e1' }}>
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(99,102,241,0.3)' }}>
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(PRICE_PRO, 'pro')}
              disabled={loading === 'pro'}
              className="w-full text-white font-medium py-3 rounded-xl text-sm disabled:opacity-50 transition-all"
              style={{ backgroundColor: '#6366f1' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#4f46e5'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#6366f1'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {loading === 'pro' ? 'Loading...' : 'Start free trial'}
            </button>
          </div>
        </div>

        {/* Garantie */}
        <p className="text-center text-xs mt-8" style={{
          color: '#334155',
          opacity: inView ? 1 : 0,
          transition: 'all 0.6s ease 0.4s'
        }}>
          🔒 Secure payment · GDPR compliant · Cancel anytime
        </p>
      </div>
    </section>
  )
}

export default Pricing