import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

function Footer({ onStartFree }) {
  const [sectionRef, inView] = useInView()

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(28px)',
    transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
  })

  return (
    <footer ref={sectionRef} style={{
      background: '#05080F',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      overflow: 'hidden',
      position: 'relative',
    }}>

      {/* CTA section */}
      <div style={{ padding: '120px 48px', textAlign: 'center', position: 'relative' }}>

        {/* Glows */}
        <div style={{
          position: 'absolute', bottom: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '700px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 65%)',
          pointerEvents: 'none',
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
            marginBottom: '36px',
            ...fade(0),
          }}>
            <span style={{
              background: '#6366F1', color: '#fff',
              fontSize: '11px', fontWeight: '700',
              padding: '3px 10px', borderRadius: '100px',
            }}>Free</span>
            14-day trial — no credit card required
          </div>

          {/* H2 */}
          <h2 style={{
            fontSize: 'clamp(36px, 5vw, 58px)', fontWeight: '900',
            letterSpacing: '-2.5px', lineHeight: '1.05', color: '#F1F5F9',
            marginBottom: '20px',
            ...fade(0.08),
          }}>
            Your reputation<br />
            starts{' '}
            <span style={{
              background: 'linear-gradient(135deg, #A5B4FC, #818CF8 40%, #22D3EE)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>right now.</span>
          </h2>

          <p style={{
            fontSize: '17px', color: '#475569', marginBottom: '44px', lineHeight: '1.6',
            ...fade(0.14),
          }}>
            Join hundreds of local businesses already using Replios<br />
            to reply faster, score higher, and win more customers.
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex', gap: '14px', justifyContent: 'center',
            flexWrap: 'wrap', marginBottom: '48px',
            ...fade(0.2),
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
            <a
              href="https://chromewebstore.google.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '14px 28px', fontSize: '15px', fontWeight: '500',
                color: '#94A3B8', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '11px',
                cursor: 'pointer', textDecoration: 'none',
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
              🧩 Install Chrome extension
            </a>
          </div>

          {/* Trust badges */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '32px', flexWrap: 'wrap',
            ...fade(0.26),
          }}>
            {[
              { icon: '🔒', label: 'GDPR compliant' },
              { icon: '🛡️', label: 'SSL secured' },
              { icon: '💳', label: 'No card needed' },
              { icon: '✕', label: 'Cancel anytime' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', color: '#334155',
              }}>
                <span style={{ fontSize: '13px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        padding: '24px 48px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '24px',
        ...fade(0.3),
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '6px',
            background: '#6366F1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '900', color: '#fff',
          }}>R</div>
          <span style={{ fontSize: '15px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>
            Replios
          </span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
          {[
            { label: 'Privacy', to: '/privacy', isLink: true },
            { label: 'Terms', to: '/terms', isLink: true },
            { label: 'Contact', href: 'mailto:contact@replios.com', isLink: false },
            { label: 'Blog', href: '#', isLink: false },
          ].map(({ label, to, href, isLink }) => (
            isLink ? (
              <Link key={label} to={to} style={{
                fontSize: '12px', color: '#334155', textDecoration: 'none', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={e => e.currentTarget.style.color = '#334155'}
              >{label}</Link>
            ) : (
              <a key={label} href={href} style={{
                fontSize: '12px', color: '#334155', textDecoration: 'none', transition: 'color 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={e => e.currentTarget.style.color = '#334155'}
              >{label}</a>
            )
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: '12px', color: '#1E293B', textAlign: 'right' }}>
          © 2026 Replios · Made in France 🇫🇷
        </div>

      </div>
    </footer>
  )
}

export default Footer
