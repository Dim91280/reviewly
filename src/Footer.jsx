import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

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

function Footer({ onStartFree }) {
  const [sectionRef, inView] = useInView(0.1)

  return (
    <footer ref={sectionRef} className="relative overflow-hidden px-6 pt-24 pb-10" style={{ backgroundColor: '#0f172a' }}>

      {/* Dégradé décoratif */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 70%)'
      }} />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* CTA principal */}
        <div className="text-center mb-16" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.7s ease'
        }}>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-medium" style={{
            backgroundColor: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc'
          }}>
            <span style={{ color: '#6366f1' }}>●</span>
            14-day free trial — no credit card required
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to take control<br />of your reputation?
          </h2>
          <p className="mb-8 text-sm" style={{ color: '#475569' }}>
            Join 500+ local businesses across Europe.
          </p>

          <button
            onClick={onStartFree}
            className="text-white font-semibold px-8 py-4 rounded-xl text-base"
            style={{ backgroundColor: '#6366f1', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#6366f1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Start your free trial →
          </button>

          {/* Logos plateformes */}
          <div className="flex items-center justify-center gap-6 mt-10">
            {[
              { label: 'Google', color: '#4285F4' },
              { label: 'TripAdvisor', color: '#00aa6c' },
              { label: 'Facebook', color: '#1877f2' },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-2 text-xs" style={{ color: '#334155' }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mb-8" style={{ borderTop: '1px solid #1e293b' }} />

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            opacity: inView ? 1 : 0,
            transition: 'all 0.7s ease 0.3s'
          }}
        >
          <div className="flex items-center gap-2">
  <img src="/replio-logo-wordmark-white.svg" alt="Replio" style={{ height: '28px' }} />
</div>

          <div className="flex gap-6 text-xs" style={{ color: '#334155' }}>
            <Link to="/privacy" className="transition-colors" style={{ color: '#334155' }}
  onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
  onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
  Privacy
</Link>
            <Link to="/terms" className="transition-colors" style={{ color: '#334155' }}
  onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
  onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
  Terms
</Link>
            <a href="mailto:contact@replios.com" className="transition-colors" style={{ color: '#334155' }}
  onMouseEnter={e => e.currentTarget.style.color = '#94a3b8'}
  onMouseLeave={e => e.currentTarget.style.color = '#334155'}>
  Contact
</a>
          </div>

          <div className="flex items-center gap-4 text-xs" style={{ color: '#334155' }}>
            <span>GDPR compliant</span>
            <span>© 2026 Replio</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer