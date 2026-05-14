import { useEffect, useState } from 'react'

function Hero({ onStartFree }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setVisible(true), 80)
  }, [])

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(22px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  })

  return (
    <section style={{
      background: '#05080F',
      padding: '96px 48px 80px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Glows */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '900px', height: '600px',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.22) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '200px', left: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px 5px 6px',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '100px',
          fontSize: '12px', color: '#818CF8', fontWeight: '500',
          marginBottom: '36px', cursor: 'default',
          ...fade(0),
        }}>
          <span style={{
            background: '#6366F1', color: '#fff',
            fontSize: '11px', fontWeight: '700',
            padding: '3px 10px', borderRadius: '100px', letterSpacing: '0.02em',
          }}>New</span>
          <span style={{
            width: '5px', height: '5px', borderRadius: '50%', background: '#22D3EE',
            animation: 'rpBlink 2s ease-in-out infinite', display: 'inline-block',
          }} />
          Chrome extension available — reply from Google Business
        </div>

        {/* H1 */}
        <h1 style={{
          fontSize: 'clamp(42px, 6vw, 72px)',
          fontWeight: '900',
          letterSpacing: '-3px',
          lineHeight: '1.02',
          color: '#F1F5F9',
          marginBottom: '8px',
          ...fade(0.08),
        }}>
          Your reviews,<br />
          <span style={{
            background: 'linear-gradient(135deg, #A5B4FC 0%, #818CF8 30%, #22D3EE 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>answered instantly.</span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '18px', color: '#64748B', lineHeight: '1.65',
          maxWidth: '500px', margin: '24px auto 48px', fontWeight: '400',
          ...fade(0.16),
        }}>
          Replios is the AI assistant that turns{' '}
          <span style={{ color: '#94A3B8', fontWeight: '500' }}>every Google review</span>{' '}
          into a perfectly crafted reply — in your tone, your language, in seconds.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex', gap: '14px', justifyContent: 'center',
          marginBottom: '20px', flexWrap: 'wrap',
          ...fade(0.24),
        }}>
          <button
            onClick={onStartFree}
            style={{
              padding: '14px 28px', fontSize: '15px', fontWeight: '700',
              color: '#fff', background: '#6366F1', border: 'none',
              borderRadius: '11px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#4F46E5'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#6366F1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            🚀 Start free — 14 days
          </button>
          <button style={{
            padding: '14px 28px', fontSize: '15px', fontWeight: '500',
            color: '#94A3B8', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: '11px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#F1F5F9'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#94A3B8'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            ▶ See it in action
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#334155', letterSpacing: '0.02em', ...fade(0.28) }}>
          No credit card · Cancel anytime · GDPR compliant
        </p>

        {/* Dashboard preview */}
        <div style={{
          margin: '64px auto 0',
          maxWidth: '900px',
          position: 'relative',
          ...fade(0.36),
        }}>
          {/* Glow border */}
          <div style={{
            position: 'absolute', inset: '-2px', borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(34,211,238,0.15), transparent 60%)',
            zIndex: 0, filter: 'blur(1px)',
          }} />

          {/* Window */}
          <div style={{
            position: 'relative', zIndex: 1,
            background: '#0D1220',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            {/* Window bar */}
            <div style={{
              background: '#0A0E1A', padding: '14px 18px',
              display: 'flex', alignItems: 'center', gap: '8px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28CA42' }} />
              <div style={{
                flex: 1, margin: '0 16px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '6px',
                padding: '5px 12px', fontSize: '12px', color: '#334155',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>
                <span style={{ color: '#22D3EE', fontSize: '13px' }}>🔒</span>
                replios.com/dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div style={{ padding: '24px' }}>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Replios Score', value: '87', trend: '↑ +4 pts this month', color: '#6366F1', trendColor: '#10B981' },
                  { label: 'Average rating', value: '4.8 ★', trend: '↑ +0.3 vs last month', color: '#F59E0B', trendColor: '#10B981' },
                  { label: 'Reply rate', value: '94%', trend: '↑ Industry avg: 42%', color: '#22D3EE', trendColor: '#10B981' },
                  { label: 'Pending replies', value: '3', trend: '⚠ 1 negative review', color: '#10B981', trendColor: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px', padding: '16px 18px',
                    borderTop: `2px solid ${s.color}`,
                  }}>
                    <div style={{ fontSize: '11px', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: '600', marginBottom: '10px' }}>{s.label}</div>
                    <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-1px', color: '#F1F5F9', marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: s.trendColor }}>{s.trend}</div>
                  </div>
                ))}
              </div>

              {/* Mini charts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { title: 'Rating trend', badge: '+0.3 this month', badgeColor: '#10B981', bars: [60, 65, 55, 72, 78, 82, 88, 90], barColor: '#6366F1' },
                  { title: 'Reviews this month', badge: '+12 new', badgeColor: '#22D3EE', bars: [40, 55, 50, 70, 65, 85, 75, 95], barColor: '#22D3EE' },
                ].map((c, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '10px', padding: '16px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{c.title}</span>
                      <span style={{
                        fontSize: '10px', padding: '2px 8px', borderRadius: '100px',
                        background: `rgba(${c.badgeColor === '#10B981' ? '16,185,129' : '34,211,238'},0.1)`,
                        color: c.badgeColor, fontWeight: '600',
                      }}>{c.badge}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '56px' }}>
                      {c.bars.map((h, j) => (
                        <div key={j} style={{
                          flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                          background: j === c.bars.length - 1 ? c.barColor : `${c.barColor}${Math.round(30 + j * 8).toString(16)}`,
                          opacity: 0.7 + j * 0.04,
                        }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reviews list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { initials: 'MR', name: 'Marie R.', text: 'Excellent accueil, plats savoureux. Je recommande vivement !', stars: 5, starColor: '#F59E0B', tag: '✓ Replied', tagStyle: { color: '#10B981', background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.2)' }, ava: 'linear-gradient(135deg,#6366F1,#818CF8)' },
                  { initials: 'TL', name: 'Thomas L.', text: 'Service un peu lent, mais la qualité est toujours au rendez-vous.', stars: 4, starColor: '#F59E0B', tag: 'Reply with AI', tagStyle: { color: '#818CF8', background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)' }, ava: 'linear-gradient(135deg,#22D3EE,#0EA5E9)' },
                  { initials: 'SB', name: 'Sophie B.', text: 'Déçue par la réponse du personnel lors de ma réclamation.', stars: 2, starColor: '#EF4444', tag: '⚡ Reply now', tagStyle: { color: '#F87171', background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }, ava: 'linear-gradient(135deg,#EF4444,#F97316)' },
                ].map((r, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '8px', padding: '11px 14px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                      <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: r.ava, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '11px', fontWeight: '700',
                        color: '#fff', flexShrink: 0,
                      }}>{r.initials}</div>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: '#CBD5E1', marginBottom: '2px' }}>{r.name}</div>
                        <div style={{ fontSize: '11px', color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>{r.text}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: r.starColor, letterSpacing: '1px' }}>
                        {'★'.repeat(r.stars)}{'★'.repeat(5 - r.stars).split('').map(() => '☆').join('')}
                      </span>
                      <span style={{
                        padding: '4px 10px', borderRadius: '5px',
                        fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                        border: '1px solid', ...r.tagStyle,
                      }}>{r.tag}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes rpBlink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }
      `}</style>

    </section>
  )
}

export default Hero
