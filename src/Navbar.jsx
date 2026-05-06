import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar({ onStartFree, onSignIn, session }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="w-full flex items-center justify-between px-8 py-4 sticky top-0 z-50"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(241,245,249,0.8)' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <span className="font-semibold text-gray-900 text-sm tracking-tight">Reviewly</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm">
        <a href="#features" className="transition-colors hover:text-gray-900" style={{ color: '#64748b' }}>Features</a>
        <a href="#pricing" className="transition-colors hover:text-gray-900" style={{ color: '#64748b' }}>Pricing</a>
        <a href="#testimonials" className="transition-colors hover:text-gray-900" style={{ color: '#64748b' }}>Testimonials</a>
      </div>

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
              style={{ color: '#64748b' }}
              onMouseEnter={e => e.currentTarget.style.color = '#111827'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
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