import { useEffect, useState } from 'react'

function FloatingIcon({ style, children }) {
  return (
    <div style={{
      position: 'absolute',
      borderRadius: '16px',
      padding: '10px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(99,102,241,0.2)',
      backgroundColor: 'rgba(15,23,42,0.8)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      animation: 'float 3s ease-in-out infinite',
      ...style
    }}>
      {children}
    </div>
  )
}

function Hero({ onStartFree }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)
  }, [])

  return (
    <section className="relative overflow-hidden flex flex-col items-center text-center px-6 py-28 md:py-36" style={{ backgroundColor: '#0f172a' }}>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Dégradé lumineux */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.35) 0%, transparent 70%)'
      }} />

      {/* Grille décorative */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Icônes flottantes - desktop only */}
      <div className="hidden md:block">
        {/* Google - haut gauche */}
        <FloatingIcon style={{ top: '15%', left: '8%', animationDuration: '3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#f1f5f9' }}>Google</div>
              <div style={{ fontSize: '9px', color: '#fbbf24' }}>★★★★★</div>
            </div>
          </div>
        </FloatingIcon>

        {/* Notification - haut droit */}
        <FloatingIcon style={{ top: '12%', right: '7%', animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#f1f5f9' }}>New review!</div>
              <div style={{ fontSize: '9px', color: '#64748b' }}>2 seconds ago</div>
            </div>
          </div>
        </FloatingIcon>

        {/* AI Reply - milieu droit */}
        <FloatingIcon style={{ top: '42%', right: '4%', animationDuration: '3.8s', animationDelay: '0.8s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#f1f5f9' }}>AI replied</div>
              <div style={{ fontSize: '9px', color: '#22c55e' }}>✓ Sent</div>
            </div>
          </div>
        </FloatingIcon>

        {/* Score - bas droit */}
        <FloatingIcon style={{ bottom: '25%', right: '6%', animationDuration: '3.2s', animationDelay: '0.3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px' }}>📈</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', fontWeight: '600', color: '#f1f5f9' }}>Score 95/100</div>
              <div style={{ fontSize: '9px', color: '#22c55e' }}>↑ +5 this week</div>
            </div>
          </div>
        </FloatingIcon>
      </div>

      <div className="relative z-10 flex flex-col items-center">

        {/* Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          border: '1px solid rgba(99,102,241,0.4)',
          color: '#a5b4fc', backgroundColor: 'rgba(99,102,241,0.1)',
          borderRadius: '9999px', padding: '6px 16px',
          fontSize: '12px', fontWeight: '500', marginBottom: '32px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all 0.6s ease'
        }}>
          <span style={{ color: '#6366f1' }}>●</span>
          AI-powered replies for local businesses
        </div>

        {/* Titre */}
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6 tracking-tight text-white" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.1s'
        }}>
          All your reviews.<br />
          One place.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            2 minutes a day.
          </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-lg max-w-lg mb-10 leading-relaxed" style={{
          color: '#94a3b8',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.2s'
        }}>
          Connect your Google Business Profile and reply to every review in one click with AI.
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.3s'
        }}>
          <button onClick={onStartFree}
            className="text-white font-semibold px-8 py-3.5 rounded-xl text-base"
            style={{ backgroundColor: '#6366f1', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#6366f1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Try free 14 days →
          </button>
          <p className="text-xs" style={{ color: '#475569' }}>No credit card required · Cancel anytime</p>
        </div>

        {/* Compteurs */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '48px', marginTop: '56px',
          opacity: visible ? 1 : 0,
          transition: 'all 0.7s ease 0.5s'
        }}>
          {[
            { value: '< 1min', label: 'to reply' },
            { value: '100%', label: 'response rate' },
            { value: 'GDPR', label: 'compliant' },
          ].map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'white' }}>{stat.value}</span>
              <span style={{ fontSize: '11px', marginTop: '4px', color: '#475569' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Mockup dashboard */}
        <div style={{
          marginTop: '64px', width: '100%', maxWidth: '768px',
          borderRadius: '16px', overflow: 'hidden',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) perspective(1000px) rotateX(2deg)' : 'translateY(30px) perspective(1000px) rotateX(5deg)',
          transition: 'all 0.9s ease 0.6s',
          boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', backgroundColor: '#1e293b' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <div style={{ flex: 1, margin: '0 16px', height: '20px', borderRadius: '6px', backgroundColor: '#0f172a', maxWidth: '200px' }} />
          </div>
          <div style={{ padding: '24px', backgroundColor: '#f8fafc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Reputation score', value: '95', sub: 'Excellent', color: '#22c55e' },
                { label: 'Average rating', value: '4.8', sub: 'Based on 124 reviews', color: '#6366f1' },
                { label: 'Response rate', value: '100%', sub: 'Great job', color: '#22c55e' },
              ].map((s, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{s.value}</p>
                  <p style={{ fontSize: '10px', color: s.color }}>{s.sub}</p>
                </div>
              ))}
            </div>
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              {[
                { name: 'Marie D.', stars: 5, platform: 'Google', replied: true },
                { name: 'Thomas B.', stars: 4, platform: 'Google', replied: false },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i === 0 ? '1px solid #f8fafc' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#6366f1' }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#111827' }}>{r.name}</p>
                      <p style={{ fontSize: '10px', color: '#f59e0b' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '500', padding: '3px 10px', borderRadius: '6px',
                    backgroundColor: r.replied ? '#f0fdf4' : '#fefce8',
                    color: r.replied ? '#16a34a' : '#ca8a04'
                  }}>
                    {r.replied ? '✓ Replied' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero
