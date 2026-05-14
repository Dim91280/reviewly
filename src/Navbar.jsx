import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar({ onStartFree, onSignIn, session }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: '64px',
      background: scrolled ? 'rgba(5,8,15,0.92)' : 'rgba(5,8,15,0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      boxShadow: scrolled ? '0 1px 30px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.35s ease',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '7px',
          background: '#6366F1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '900', color: '#fff', letterSpacing: '-1px',
          flexShrink: 0,
        }}>R</div>
        <span style={{ fontSize: '17px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>
          Replios
        </span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '28px', listStyle: 'none' }} className="hidden md:flex">
        {[
          { label: 'Product', href: '#features' },
          { label: 'Extension', href: '#extension' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Testimonials', href: '#testimonials' },
        ].map(({ label, href }) => (
          <a key={label} href={href} style={{
            fontSize: '13px', color: '#64748B', textDecoration: 'none',
            fontWeight: '450', transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
          >
            {label}
          </a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {session ? (
          <Link to="/dashboard" style={{
            padding: '7px 16px', fontSize: '13px', fontWeight: '600',
            color: '#fff', background: '#6366F1', border: 'none',
            borderRadius: '7px', cursor: 'pointer', textDecoration: 'none',
            transition: 'all 0.2s', display: 'inline-block',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#4F46E5'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#6366F1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Dashboard →
          </Link>
        ) : (
          <>
            <button onClick={onSignIn} style={{
              padding: '7px 15px', fontSize: '13px', fontWeight: '500',
              color: '#64748B', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '7px', cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#F1F5F9'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#64748B'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              Sign in
            </button>
            <button onClick={onStartFree} style={{
              padding: '7px 16px', fontSize: '13px', fontWeight: '600',
              color: '#fff', background: '#6366F1', border: 'none',
              borderRadius: '7px', cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#4F46E5'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#6366F1'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Start free →
            </button>
          </>
        )}
      </div>

    </nav>
  )
}

export default Navbar
