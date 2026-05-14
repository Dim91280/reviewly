import { useEffect, useRef, useState } from 'react'

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

function Features() {
  const [sectionRef, inView] = useInView()

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  const cardBase = {
    background: '#0D1220',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '14px',
    padding: '24px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'border-color 0.2s, transform 0.2s',
  }

  return (
    <section id="features" ref={sectionRef} style={{ padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)', background: '#05080F' }}>

      {/* Header */}
      <div style={{ marginBottom: '48px', ...fade(0) }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
          letterSpacing: '0.12em', color: '#22D3EE', marginBottom: '16px',
        }}>
          <span style={{ width: '24px', height: '1px', background: '#22D3EE', display: 'inline-block' }} />
          Features
          <span style={{ width: '24px', height: '1px', background: '#22D3EE', display: 'inline-block' }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: '900',
          letterSpacing: '-2px', lineHeight: '1.05', color: '#F1F5F9', marginBottom: '12px',
        }}>
          Built for owners,<br />not for analysts.
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.65', maxWidth: '440px' }}>
          Every feature is designed for one thing: help you reply faster, better, and protect your reputation effortlessly.
        </p>
      </div>

      {/* Cards — responsive grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* Row 1 — AI replies (full width on mobile, 2/3 on desktop) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>

          {/* Card 1 — AI replies */}
          <div style={{ ...cardBase, background: 'linear-gradient(135deg, rgba(99,102,241,0.18), rgba(99,102,241,0.06))', borderColor: 'rgba(99,102,241,0.25)', ...fade(0.08) }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>✨</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.3px' }}>
              AI replies that sound like you
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '16px' }}>
              Replios learns your sector, your tone, and even the words you never use. Every reply is uniquely yours — warm, professional, personal.
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 'clamp(36px, 8vw, 48px)', fontWeight: '900', letterSpacing: '-3px',
                background: 'linear-gradient(135deg, #818CF8, #22D3EE)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>8 sec</span>
              <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>average time to generate a perfect reply</span>
            </div>
          </div>

          {/* Card 2 — Replios Score */}
          <div style={{ ...cardBase, ...fade(0.14) }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🛡️</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.3px' }}>
              Replios Score
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '16px' }}>
              Your personal reputation indicator. Track your score weekly and see exactly what to improve.
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '44px' }}>
              {[40, 55, 48, 68, 62, 80, 90].map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`, borderRadius: '3px 3px 0 0',
                  background: i === 6 ? '#6366F1' : `rgba(99,102,241,${0.25 + i * 0.07})`,
                }} />
              ))}
            </div>
          </div>
        </div>

        {/* Row 2 — Alerts + Language */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>

          {/* Card 3 — Alerts */}
          <div style={{ ...cardBase, ...fade(0.2) }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🔔</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.3px' }}>
              Instant negative alerts
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '14px' }}>
              Get notified the moment a bad review lands. Respond before the damage spreads.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '7px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '13px', flexShrink: 0 }}>⚡</span>
                <span style={{ fontSize: '11px', color: '#FCA5A5', fontWeight: '500' }}>New 2★ review — Sophie B. just posted</span>
              </div>
              <div style={{
                background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '7px', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ fontSize: '13px', flexShrink: 0 }}>📊</span>
                <span style={{ fontSize: '11px', color: '#FCD34D', fontWeight: '500' }}>Weekly report ready — score up +4 pts</span>
              </div>
            </div>
          </div>

          {/* Card 4 — Language */}
          <div style={{ ...cardBase, ...fade(0.26) }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
              background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
            }}>🌐</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.3px' }}>
              Auto language detection
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '14px' }}>
              Reviews in French, English, Spanish, Italian? Replios replies in the same language automatically.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { flag: '🇫🇷', lang: 'Français', active: true },
                { flag: '🇬🇧', lang: 'English', active: true },
                { flag: '🇪🇸', lang: 'Español', active: false },
                { flag: '🇩🇪', lang: 'Deutsch', active: false },
                { flag: '🇮🇹', lang: 'Italiano', active: false },
                { flag: '🇵🇹', lang: 'Português', active: false },
              ].map(({ flag, lang, active }) => (
                <span key={lang} style={{
                  padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: '600',
                  background: active ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  color: active ? '#818CF8' : '#475569',
                }}>{flag} {lang}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3 — Chrome extension (full width) */}
        <div style={{
          ...cardBase,
          background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(34,211,238,0.02))',
          borderColor: 'rgba(34,211,238,0.15)',
          ...fade(0.32),
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.35)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,211,238,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px', marginBottom: '16px',
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
          }}>🧩</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#F1F5F9', marginBottom: '8px', letterSpacing: '-0.3px' }}>
            Chrome extension — reply without leaving Google Business
          </div>
          <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65', marginBottom: '16px' }}>
            Install the Replios extension, open Google Business, click "Reply with AI" on any review. The reply is generated and injected directly into Google's text field. One click to publish. Zero friction.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {[
              { num: '1', text: 'Install in 30 seconds' },
              { num: '2', text: 'Button on every review' },
              { num: '3', text: 'Click → publish' },
            ].map(({ num, text }) => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                  background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700', color: '#22D3EE',
                }}>{num}</div>
                <span style={{ fontSize: '12px', color: '#64748B' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

export default Features
