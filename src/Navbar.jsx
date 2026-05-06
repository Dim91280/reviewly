import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar({ onStartFree, onSignIn, session }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4 sticky top-0 z-50"
      style={{
  backgroundColor: scrolled ? 'rgba(255,255,255,0.90)' : 'transparent',
  backdropFilter: scrolled ? 'blur(12px)' : 'none',
  WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
  borderBottom: scrolled ? '1px solid rgba(241,245,249,0.8)' : '1px solid transparent',
  boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.05)' : 'none',
  transition: 'all 0.4s ease',
}}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
  <img
    src={scrolled ? '/replio-logo-wordmark.svg' : '/replio-logo-wordmark-white.svg'}
    alt="Replio"
    style={{ height: '30px' }}
  />
</div>

      {/* Navigation */}
      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#features" className="transition-colors" style={{ color: scrolled ? '#64748b' : '#94a3b8' }}
          onMouseEnter={e => e.currentTarget.style.color = scrolled ? '#111827' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.color = scrolled ? '#64748b' : '#94a3b8'}>
          Features
        </a>
        <a href="#pricing" className="transition-colors" style={{ color: scrolled ? '#64748b' : '#94a3b8' }}
          onMouseEnter={e => e.currentTarget.style.color = scrolled ? '#111827' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.color = scrolled ? '#64748b' : '#94a3b8'}>
          Pricing
        </a>
        <a href="#testimonials" className="transition-colors" style={{ color: scrolled ? '#64748b' : '#94a3b8' }}
          onMouseEnter={e => e.currentTarget.style.color = scrolled ? '#111827' : '#f1f5f9'}
          onMouseLeave={e => e.currentTarget.style.color = scrolled ? '#64748b' : '#94a3b8'}>
          Testimonials
        </a>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-2">
        {session ? (
          <Link
            to="/dashboard"
            className="text-white text-sm font-medium px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#6366f1', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
          >
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <button
              onClick={onSignIn}
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ color: scrolled ? '#64748b' : '#94a3b8' }}
              onMouseEnter={e => e.currentTarget.style.color = scrolled ? '#111827' : '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.color = scrolled ? '#64748b' : '#94a3b8'}
            >
              Sign in
            </button>
            <button
              onClick={onStartFree}
              className="text-white text-sm font-medium px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#6366f1', transition: 'all 0.2s' }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#4f46e5'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#6366f1'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Start free
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar