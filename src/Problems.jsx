import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.15) {
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

const problems = [
  {
    emoji: '😓',
    title: 'Manual monitoring',
    text: "You check Google reviews manually every morning — wasting 30 minutes you don't have.",
    accent: 'rgba(239,68,68,0.15)',
    border: 'rgba(239,68,68,0.2)',
  },
  {
    emoji: '😤',
    title: 'Slow responses',
    text: 'A negative review stays unanswered for days, damaging your reputation while you sleep.',
    accent: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.2)',
  },
  {
    emoji: '😕',
    title: 'No visibility',
    text: 'You have no idea what your overall reputation score is or how you compare to competitors.',
    accent: 'rgba(99,102,241,0.12)',
    border: 'rgba(99,102,241,0.2)',
  },
]

function Problems() {
  const [sectionRef, inView] = useInView()

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  return (
    <section ref={sectionRef} style={{
      background: '#05080F',
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Subtle glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '300px',
        background: 'radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', ...fade(0) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#F87171', marginBottom: '16px',
          }}>
            <span style={{ width: '24px', height: '1px', background: '#EF4444', display: 'inline-block' }} />
            The problem
            <span style={{ width: '24px', height: '1px', background: '#EF4444', display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '900',
            letterSpacing: '-1.5px', lineHeight: '1.05', color: '#F1F5F9',
            marginBottom: '12px',
          }}>
            Sound familiar?
          </h2>
          <p style={{ fontSize: '15px', color: '#475569' }}>
            Managing reviews manually is a losing battle.
          </p>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px',
        }}>
          {problems.map((p, i) => (
            <div key={i} style={{
              background: p.accent,
              border: `1px solid ${p.border}`,
              borderRadius: '14px',
              padding: '28px 24px',
              transition: 'transform 0.2s, border-color 0.2s',
              cursor: 'default',
              ...fade(0.1 + i * 0.12),
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)'
                e.currentTarget.style.borderColor = p.border.replace('0.2', '0.4')
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = p.border
              }}
            >
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}>{p.emoji}</span>
              <h3 style={{
                fontSize: '15px', fontWeight: '700', color: '#E2E8F0',
                marginBottom: '10px', letterSpacing: '-0.3px',
              }}>{p.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.65' }}>{p.text}</p>
            </div>
          ))}
        </div>

        {/* Bridge arrow */}
        <div style={{
          textAlign: 'center', marginTop: '48px',
          ...fade(0.4),
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '12px',
            padding: '12px 24px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '100px',
            fontSize: '13px', color: '#818CF8', fontWeight: '500',
          }}>
            <span>There's a better way</span>
            <span style={{ fontSize: '16px' }}>↓</span>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Problems
