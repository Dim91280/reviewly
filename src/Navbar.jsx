import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

function Navbar({ onStartFree, onSignIn, session }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { label: 'Product', href: '#features' },
    { label: 'Extension', href: '#extension' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ]

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: '60px',
        background: scrolled ? 'rgba(5,8,15,0.95)' : 'rgba(5,8,15,0.7)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        transition: 'all 0.35s ease',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px', background: '#6366F1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '900', color: '#fff', flexShrink: 0,
          }}>R</div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>
            Replios
          </span>
        </div>

        {/* Desktop links */}
        <div style={{ display: 'none', gap: '28px' }} className="md-flex">
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{
              fontSize: '13px', color: '#64748B', textDecoration: 'none', fontWeight: '450', transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >{label}</a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div style={{ display: 'none', gap: '10px', alignItems: 'center' }} className="md-flex">
          {session ? (
            <Link to="/dashboard" style={{
              padding: '7px 16px', fontSize: '13px', fontWeight: '600',
              color: '#fff', background: '#6366F1', borderRadius: '7px', textDecoration: 'none',
            }}>Dashboard →</Link>
          ) : (
            <>
              <button onClick={onSignIn} style={{
                padding: '7px 15px', fontSize: '13px', fontWeight: '500', color: '#64748B',
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '7px', cursor: 'pointer',
              }}>Sign in</button>
              <button onClick={onStartFree} style={{
                padding: '7px 16px', fontSize: '13px', fontWeight: '600',
                color: '#fff', background: '#6366F1', border: 'none', borderRadius: '7px', cursor: 'pointer',
              }}>Start free →</button>
            </>
          )}
        </div>

        {/* Mobile right */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }} className="md-hide">
          {session ? (
            <Link to="/dashboard" style={{
              padding: '7px 14px', fontSize: '13px', fontWeight: '600',
              color: '#fff', background: '#6366F1', borderRadius: '7px', textDecoration: 'none',
            }}>Dashboard</Link>
          ) : (
            <button onClick={onStartFree} style={{
              padding: '7px 14px', fontSize: '13px', fontWeight: '600',
              color: '#fff', background: '#6366F1', border: 'none', borderRadius: '7px', cursor: 'pointer',
            }}>Start free</button>
          )}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: '36px', height: '36px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', cursor: 'pointer',
            }}
          >
            {menuOpen ? (
              <span style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1 }}>✕</span>
            ) : (
              <>
                <span style={{ width: '14px', height: '1.5px', background: '#94A3B8', borderRadius: '1px' }} />
                <span style={{ width: '14px', height: '1.5px', background: '#94A3B8', borderRadius: '1px' }} />
                <span style={{ width: '14px', height: '1.5px', background: '#94A3B8', borderRadius: '1px' }} />
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      <div style={{
        position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 199,
        background: 'rgba(5,8,15,0.98)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: menuOpen ? '8px 20px 20px' : '0 20px',
        maxHeight: menuOpen ? '400px' : '0px',
        overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
      }}>
        {links.map(({ label, href }) => (
          <a key={label} href={href}
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '14px 0',
              fontSize: '15px', fontWeight: '500', color: '#94A3B8',
              textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#F1F5F9'}
            onMouseLeave={e => e.currentTarget.style.color = '#94A3B8'}
          >{label}</a>
        ))}
        {!session && (
          <button onClick={() => { setMenuOpen(false); onSignIn() }} style={{
            display: 'block', width: '100%', marginTop: '12px',
            padding: '13px', fontSize: '14px', fontWeight: '500', color: '#94A3B8',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px', cursor: 'pointer', textAlign: 'center',
          }}>Sign in</button>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-flex { display: flex !important; }
          .md-hide { display: none !important; }
        }
      `}</style>
    </>
  )
}

export default Navbar
