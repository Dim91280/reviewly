import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'

const REVIEWS = [
  {
    id: 1, author: 'Thomas M.', platform: 'Google', rating: 3, initials: 'TM', color: '#4285F4',
    text: "Decent place but the wait was too long and staff seemed overwhelmed during peak hours.",
    reply: "Hi Thomas, thank you for your honest feedback. We're actively working on our staffing during peak hours. We'd love to welcome you back for a better experience!",
  },
  {
    id: 2, author: 'Sophie L.', platform: 'TripAdvisor', rating: 5, initials: 'SL', color: '#00aa6c',
    text: "Absolutely amazing experience! The food was outstanding and service was impeccable.",
    reply: "Sophie, thank you so much for these kind words! It means the world to our team. We look forward to seeing you again very soon!",
  },
  {
    id: 3, author: 'Marc D.', platform: 'Facebook', rating: 2, initials: 'MD', color: '#1877f2',
    text: "Disappointed with our visit. The reservation was lost and we waited 40 minutes.",
    reply: "Marc, we sincerely apologize for this experience. This is not our standard. Please contact us directly so we can make it right for you.",
  },
]

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= rating ? '#f59e0b' : 'rgba(255,255,255,0.1)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function LiveDemo({ mounted }) {
  const [phase, setPhase] = useState('idle')
  const [reviewIndex, setReviewIndex] = useState(0)
  const [typedReply, setTypedReply] = useState('')
  const [repliedCount, setRepliedCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const typingRef = useRef(null)
  const cycleRef = useRef(null)

  const review = REVIEWS[reviewIndex % REVIEWS.length]

  const runCycle = (idx) => {
    const currentReview = REVIEWS[idx % REVIEWS.length]
    setVisible(false)
    setTypedReply('')
    setPhase('idle')

    setTimeout(() => { setVisible(true); setPhase('incoming') }, 600)
    setTimeout(() => setPhase('thinking'), 2400)
    setTimeout(() => {
      setPhase('typing')
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTypedReply(currentReview.reply.slice(0, i))
        if (i >= currentReview.reply.length) {
          clearInterval(typingRef.current)
          setTimeout(() => {
            setPhase('done')
            setRepliedCount(c => c + 1)
          }, 400)
        }
      }, 20)
    }, 4200)
  }

  useEffect(() => {
    if (!mounted) return
    const t = setTimeout(() => runCycle(0), 800)
    return () => clearTimeout(t)
  }, [mounted])

  useEffect(() => {
    if (phase === 'done') {
      cycleRef.current = setTimeout(() => {
        const next = (reviewIndex + 1) % REVIEWS.length
        setReviewIndex(next)
        runCycle(next)
      }, 2800)
    }
    return () => clearTimeout(cycleRef.current)
  }, [phase])

  useEffect(() => () => { clearInterval(typingRef.current); clearTimeout(cycleRef.current) }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span style={{ fontSize: '10px', color: '#475569', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live preview</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' }}/>
          <span style={{ fontSize: '10px', color: '#22c55e' }}>AI active</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { label: 'Pending', value: Math.max(0, 3 - repliedCount), color: '#f59e0b' },
          { label: 'Replied', value: repliedCount, color: '#22c55e' },
          { label: 'Avg rating', value: '4.6★', color: '#818cf8' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, padding: '8px 10px', borderRadius: '10px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Card review animée */}
      <div style={{
        borderRadius: '14px', overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(255,255,255,0.03)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.99)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Review */}
        <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: review.color + '22',
                border: `1px solid ${review.color}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 600, color: review.color
              }}>{review.initials}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#e2e8f0' }}>{review.author}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>{review.platform}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Stars rating={review.rating} />
              {phase === 'incoming' && (
                <span style={{
                  fontSize: '9px', padding: '1px 6px', borderRadius: '4px',
                  backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b',
                  border: '1px solid rgba(245,158,11,0.2)', animation: 'fadeIn 0.3s ease'
                }}>New</span>
              )}
              {phase === 'done' && (
                <span style={{
                  fontSize: '9px', padding: '1px 6px', borderRadius: '4px',
                  backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}>Replied ✓</span>
              )}
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{review.text}</p>
        </div>

        {/* AI zone */}
        <div style={{ padding: '12px 16px', minHeight: '70px' }}>
          {phase === 'idle' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span style={{ fontSize: '10px', color: '#334155' }}>Waiting for new reviews...</span>
            </div>
          )}
          {phase === 'thinking' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="#6366f1"><circle cx="12" cy="12" r="10"/></svg>
              </div>
              <span style={{ fontSize: '11px', color: '#818cf8' }}>Replio AI is analyzing...</span>
              <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#6366f1',
                    animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`
                  }}/>
                ))}
              </div>
            </div>
          )}
          {(phase === 'typing' || phase === 'done') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>
                </div>
                <span style={{ fontSize: '10px', color: '#818cf8', fontWeight: 500 }}>AI Reply</span>
                {phase === 'typing' && <div style={{ width: '1.5px', height: '11px', backgroundColor: '#6366f1', animation: 'blink 0.8s step-end infinite' }}/>}
                {phase === 'done' && <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#22c55e' }}>✓ Ready to send</span>}
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>{typedReply}</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '2px' }}>
        {REVIEWS.map((_, i) => (
          <div key={i} style={{
            width: i === reviewIndex % REVIEWS.length ? '14px' : '5px',
            height: '5px', borderRadius: '3px',
            backgroundColor: i === reviewIndex % REVIEWS.length ? '#6366f1' : 'rgba(99,102,241,0.2)',
            transition: 'all 0.4s ease'
          }}/>
        ))}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}

function Auth({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else { setSuccess(true); setMessage('Check your email to confirm your account!') }
    }
    setLoading(false)
  }

  const switchMode = () => { setIsLogin(!isLogin); setMessage(''); setSuccess(false) }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>

      {/* Panel gauche */}
      <div className="hidden md:flex flex-col w-1/2 p-10 relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.1)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: '-55px', right: '-55px', width: '230px', height: '230px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.07)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(99,102,241,0.14) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-12px)', transition: 'all 0.6s ease', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
          <img src="/replio-logo-wordmark-white.svg" alt="Replio" style={{ height: '30px' }} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s', position: 'relative', zIndex: 1 }}>
          <LiveDemo mounted={mounted} />
        </div>

        <p style={{ fontSize: '11px', color: '#1e293b', position: 'relative', zIndex: 1, marginTop: '14px' }}>© 2025 Replio. All rights reserved.</p>
      </div>

      {/* Panel droit */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm" style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s' }}>

          <div className="flex items-center gap-2 mb-10 md:hidden">
            <img src="/replio-logo-wordmark.svg" alt="Replio" style={{ height: '28px' }} />
          </div>

          {!isLogin && (
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-medium" style={{ backgroundColor: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', color: '#6366f1' }}>
              <span>●</span> 14-day free trial — no credit card
            </div>
          )}

          <h1 className="text-2xl font-bold mb-1" style={{ color: '#111827', letterSpacing: '-0.5px' }}>
            {isLogin ? 'Welcome back' : 'Start for free'}
          </h1>
          <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>
            {isLogin ? 'Sign in to continue to your dashboard' : 'Create your account in seconds'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Email</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{ border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white' }}
                onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{ border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white' }}
                onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
              />
            </div>
          </div>

          {message && (
            <div className="mt-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2" style={{
              backgroundColor: success ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.08)',
              color: success ? '#059669' : '#6366f1',
              border: `1px solid ${success ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}`
            }}>
              {success ? '✓' : 'ℹ'} {message}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full text-white font-medium py-2.5 rounded-xl mt-5 text-sm disabled:opacity-50 transition-all"
            style={{ backgroundColor: '#6366f1' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.boxShadow = 'none' }}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Loading...
                </span>
              : isLogin ? 'Sign in →' : 'Create account →'
            }
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: '1px', backgroundColor: '#f1f5f9' }}/>
            <span className="text-xs" style={{ color: '#cbd5e1' }}>or</span>
            <div className="flex-1" style={{ height: '1px', backgroundColor: '#f1f5f9' }}/>
          </div>

          <p className="text-center text-xs" style={{ color: '#94a3b8' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} className="font-medium" style={{ color: '#6366f1' }}
              onMouseEnter={e => e.currentTarget.style.color = '#4f46e5'}
              onMouseLeave={e => e.currentTarget.style.color = '#6366f1'}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p className="text-center mt-5">
            <button onClick={onBack} className="text-xs transition-colors" style={{ color: '#cbd5e1' }}
              onMouseEnter={e => e.currentTarget.style.color = '#64748b'}
              onMouseLeave={e => e.currentTarget.style.color = '#cbd5e1'}
            >
              ← Back to home
            </button>
          </p>

          <div className="flex items-center justify-center gap-4 mt-8 pt-6" style={{ borderTop: '1px solid #f1f5f9' }}>
            {['SSL secured', 'GDPR compliant', 'No card needed'].map((t, i) => (
              <div key={i} className="flex items-center gap-1 text-xs" style={{ color: '#cbd5e1' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
