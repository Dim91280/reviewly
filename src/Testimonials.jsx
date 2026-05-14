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

const testimonials = [
  {
    name: 'Jean-Marc P.',
    role: 'Restaurant owner · Lyon',
    avatar: 'JM',
    avatarBg: 'linear-gradient(135deg, #6366F1, #818CF8)',
    platform: 'Restaurant',
    text: 'Before Replios, I was ignoring half my reviews out of time. Now I reply to everything in minutes. My rating went from 4.1 to 4.7 in 3 months.',
    featured: true,
  },
  {
    name: 'Sophie L.',
    role: 'Hotel manager · Paris',
    avatar: 'SL',
    avatarBg: 'linear-gradient(135deg, #22D3EE, #0EA5E9)',
    platform: 'Hôtel',
    text: "The Chrome extension is a game changer. I open Google Business, see a review, click once, and it's done. Ten seconds flat. I can't imagine going back.",
    featured: false,
  },
  {
    name: 'Amandine B.',
    role: 'Beauty salon · Bordeaux',
    avatar: 'AB',
    avatarBg: 'linear-gradient(135deg, #F97316, #F59E0B)',
    platform: 'Beauty',
    text: 'The replies sound exactly like me — not like a robot. My clients even complimented the quality of my responses. I was shocked at first.',
    featured: false,
  },
]

function Testimonials() {
  const [sectionRef, inView] = useInView()

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  })

  return (
    <section id="testimonials" ref={sectionRef} style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)',
      background: '#090D18',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px', ...fade(0) }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '10px',
          fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
          letterSpacing: '0.12em', color: '#22D3EE', marginBottom: '16px',
        }}>
          <span style={{ width: '24px', height: '1px', background: '#22D3EE', display: 'inline-block' }} />
          What they say
          <span style={{ width: '24px', height: '1px', background: '#22D3EE', display: 'inline-block' }} />
        </div>
        <h2 style={{
          fontSize: 'clamp(28px, 5vw, 46px)', fontWeight: '900',
          letterSpacing: '-2px', lineHeight: '1.05', color: '#F1F5F9',
        }}>
          Owners love it.<br />Customers notice it.
        </h2>
      </div>

      {/* Grid — 1 col mobile, 3 col desktop */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {testimonials.map((t, i) => (
          <div key={i} style={{
            background: t.featured
              ? 'linear-gradient(135deg, rgba(99,102,241,0.1), #0D1220)'
              : '#0D1220',
            border: `1px solid ${t.featured ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: '14px',
            padding: '24px',
            transition: 'border-color 0.2s, transform 0.2s',
            ...fade(0.1 + i * 0.1),
          }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = t.featured ? 'rgba(99,102,241,0.45)' : 'rgba(255,255,255,0.14)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = t.featured ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.07)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#F59E0B', letterSpacing: '2px' }}>★★★★★</div>
              <div style={{ fontSize: '10px', color: '#475569', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.platform}</div>
            </div>

            <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.7', marginBottom: '18px', fontStyle: 'italic' }}>
              <span style={{
                fontSize: '20px', color: t.featured ? '#818CF8' : '#334155',
                lineHeight: 0, verticalAlign: '-6px', marginRight: '2px', fontStyle: 'normal',
              }}>"</span>
              {t.text}
            </p>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%', background: t.avatarBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: '700', color: '#fff', flexShrink: 0,
              }}>{t.avatar}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#CBD5E1' }}>{t.name}</div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '1px' }}>{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social proof — 2x2 grid on mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px',
        maxWidth: '600px',
        margin: '48px auto 0',
        ...fade(0.4),
      }}>
        {[
          { num: '+2 400', label: 'Reviews answered with AI' },
          { num: '+0.6 ★', label: 'Avg rating improvement' },
          { num: '94%', label: 'Reply rate (vs 42% avg)' },
          { num: '8 sec', label: 'Average time to reply' },
        ].map(({ num, label }, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '16px' }}>
            <div style={{
              fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: '800', letterSpacing: '-1px',
              background: 'linear-gradient(135deg, #818CF8, #22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>{num}</div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '500', marginTop: '4px', lineHeight: '1.4' }}>{label}</div>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Testimonials
