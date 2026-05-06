import { useState, useEffect } from 'react'
import { supabase } from './supabase'

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
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>

        {/* Décorations géométriques */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.15)',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '220px', height: '220px', borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.1)',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute', bottom: '80px', left: '-60px',
          width: '240px', height: '240px', borderRadius: '50%',
          border: '1px solid rgba(99,102,241,0.08)',
          pointerEvents: 'none'
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}/>

        {/* Logo */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'all 0.6s ease'
        }}>
          <img src="/replio-logo-wordmark-white.svg" alt="Replio" style={{ height: '32px' }} />
        </div>

        {/* Testimonial */}
        <div style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease 0.2s'
        }}>
          {/* Stats rapides */}
          <div className="flex gap-6 mb-10">
            {[
              { value: '500+', label: 'businesses' },
              { value: '4.8★', label: 'avg rating boost' },
              { value: '< 1min', label: 'reply time' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-white font-semibold text-lg">{s.value}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="rounded-2xl p-6 mb-6 relative" style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              position: 'absolute', top: '-1px', left: '24px',
              width: '40px', height: '2px',
              backgroundColor: '#6366f1'
            }}/>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#6366f1">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#94a3b8' }}>
              "Since using Replio, I reply to every review in under a minute. My rating went from 4.1 to 4.6 in 3 months."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ backgroundColor: '#6366f1' }}>
                M
              </div>
              <div>
                <p className="text-white font-medium text-sm">Marie Dubois</p>
                <p className="text-xs" style={{ color: '#475569' }}>Restaurant owner, Lyon</p>
              </div>
            </div>
          </div>

          {/* Logos plateformes */}
          <div className="flex items-center gap-4">
            <p className="text-xs" style={{ color: '#334155' }}>Works with</p>
            {[
              { label: 'Google', color: '#4285F4' },
              { label: 'TripAdvisor', color: '#00aa6c' },
              { label: 'Facebook', color: '#1877f2' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: '#475569' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: p.color }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs" style={{ color: '#1e293b' }}>© 2025 Replio. All rights reserved.</p>
      </div>

      {/* Panel droit */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm" style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.1s'
        }}>

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-10 md:hidden">
            <img src="/replio-logo-wordmark.svg" alt="Replio" style={{ height: '28px' }} />
          </div>

          {/* Badge trial — uniquement signup */}
          {!isLogin && (
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-6 text-xs font-medium" style={{
              backgroundColor: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.2)',
              color: '#6366f1'
            }}>
              <span style={{ color: '#6366f1' }}>●</span>
              14-day free trial — no credit card
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
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{
                  border: '1px solid #e5e7eb',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
                onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
                onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
                style={{
                  border: '1px solid #e5e7eb',
                  color: '#111827',
                  backgroundColor: 'white',
                }}
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

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white font-medium py-2.5 rounded-xl mt-5 text-sm disabled:opacity-50 transition-all"
            style={{ backgroundColor: '#6366f1' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#6366f1'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Loading...
                </span>
              : isLogin ? 'Sign in →' : 'Create account →'
            }
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1" style={{ height: '1px', backgroundColor: '#f1f5f9' }}/>
            <span className="text-xs" style={{ color: '#cbd5e1' }}>or</span>
            <div className="flex-1" style={{ height: '1px', backgroundColor: '#f1f5f9' }}/>
          </div>

          <p className="text-center text-xs" style={{ color: '#94a3b8' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} className="font-medium transition-colors" style={{ color: '#6366f1' }}
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

          {/* Trust badges */}
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
