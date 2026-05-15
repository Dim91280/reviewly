import { useState, useEffect, useRef } from 'react'
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'

const D = {
  bg: '#05080F',
  sidebar: '#080C14',
  surface: '#0D1220',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  text: '#F1F5F9',
  text2: '#64748B',
  text3: '#334155',
}

function AppLayout({ session }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [subLoading, setSubLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const retryTimerRef = useRef(null)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => { fetchSubscription(); fetchReviews() }, [])
  useEffect(() => {
    if (!subLoading && isSuccess) navigate('/dashboard', { replace: true })
  }, [subLoading, isSuccess])
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])
  useEffect(() => () => { clearTimeout(retryTimerRef.current) }, [])

  const fetchSubscription = async (retries = 8) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', session.user.id).eq('status', 'active').maybeSingle()
    if (!data && retries > 0 && isSuccess) {
      retryTimerRef.current = setTimeout(() => fetchSubscription(retries - 1), 2000)
      return
    }
    setSubscription(data)
    setSubLoading(false)
  }

  const fetchReviews = async () => {
    const { data, error } = await supabase.from('reviews').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (!error && data) {
      setReviews(data.map(r => ({ ...r, aiReply: null, loading: false, manualReply: undefined, showManual: false })))
    }
    setLoading(false)
  }

  const generateReply = async (review) => {
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, loading: true } : r))
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', { body: { reviewText: review.text, rating: review.rating, authorName: review.author } })
      if (error) throw error
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, loading: false, aiReply: data.reply } : r))
    } catch (err) {
      console.error(err)
      setReviews(prev => prev.map(r => r.id === review.id ? { ...r, loading: false } : r))
    }
  }

  const addReview = async (reviewData) => {
    if (!reviewData.author || !reviewData.text) return false
    const { data, error } = await supabase.from('reviews').insert([{
      author: reviewData.author, rating: reviewData.rating, text: reviewData.text,
      platform: reviewData.platform, replied: false, user_id: session.user.id,
    }]).select()
    if (!error) {
      setReviews(prev => [{ ...data[0], aiReply: null, loading: false, manualReply: undefined, showManual: false }, ...prev])
      return true
    }
    return false
  }

  const pendingCount = reviews.filter(r => !r.replied).length
  const accountAge = Math.floor((Date.now() - new Date(session.user.created_at)) / (1000 * 60 * 60 * 24))
  const isInTrial = accountAge < 14
  const daysLeft = 13 - accountAge

  // Loading screen
  if (subLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: D.bg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '36px', height: '36px', border: `3px solid rgba(99,102,241,0.2)`,
          borderTopColor: D.indigo, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
        }}/>
        <p style={{ fontSize: '13px', color: D.text2 }}>{isSuccess ? 'Activating your subscription...' : 'Loading...'}</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  // Trial expired
  if (!subscription && !isInTrial) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: D.bg }}>
      <div style={{ background: D.surface, borderRadius: '20px', border: `1px solid ${D.border}`, padding: '48px 40px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: D.text, marginBottom: '8px', letterSpacing: '-0.5px' }}>Your trial has expired</h2>
        <p style={{ fontSize: '14px', color: D.text2, marginBottom: '32px', lineHeight: '1.6' }}>Choose a plan to continue using Replios.</p>
        <button onClick={() => { window.location.href = 'https://replios.com/#pricing' }} style={{
          width: '100%', padding: '12px', fontSize: '14px', fontWeight: '600',
          color: '#fff', background: D.indigo, border: 'none', borderRadius: '10px', cursor: 'pointer',
          marginBottom: '12px', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.boxShadow = 'none' }}
        >View plans →</button>
        <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '13px', color: D.text2, background: 'none', border: 'none', cursor: 'pointer' }}>
          Sign out
        </button>
      </div>
    </div>
  )

  const navItem = (to, icon, label, badge) => {
    const isActive = pathname === to
    return (
      <Link key={to} to={to} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '9px 12px', borderRadius: '8px',
        fontSize: '13px', textDecoration: 'none', transition: 'all 0.15s', fontWeight: '500',
        background: isActive ? 'rgba(99,102,241,0.12)' : 'transparent',
        color: isActive ? D.indigoLight : D.text2,
        border: `1px solid ${isActive ? 'rgba(99,102,241,0.2)' : 'transparent'}`,
      }}
        onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = D.text } }}
        onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = D.text2 } }}
      >
        {icon}
        <span style={{ flex: 1 }}>{label}</span>
        {badge != null && badge > 0 && (
          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 7px', borderRadius: '100px', background: D.indigo, color: '#fff' }}>{badge}</span>
        )}
      </Link>
    )
  }

  const navLinks = (
    <>
      {navItem('/dashboard',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
        'Dashboard'
      )}
      {navItem('/reviews',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
        'Reviews', pendingCount
      )}
      {navItem('/account',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
        'Account'
      )}
    </>
  )

  const outletContext = { reviews, setReviews, subscription, generateReply, addReview, loading, pendingCount, session }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: D.bg }}>

      {/* Sidebar desktop */}
      <aside style={{
        width: '220px', minHeight: '100vh', display: 'none',
        flexDirection: 'column', padding: '24px 16px',
        position: 'fixed', top: 0, left: 0,
        background: D.sidebar,
        borderRight: `1px solid ${D.border}`,
      }} className="app-sidebar">

        {/* Logo */}
        <div onClick={() => { window.location.href = 'https://replios.com' }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', paddingLeft: '4px', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: D.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: '#fff', flexShrink: 0 }}>R</div>
          <span style={{ fontSize: '16px', fontWeight: '800', color: D.text, letterSpacing: '-0.5px' }}>Replios</span>
        </div>

        {/* Plan badge */}
        <div style={{ marginBottom: '20px', paddingLeft: '4px' }}>
          <span style={{
            fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '7px',
            background: subscription ? 'rgba(96,165,250,0.1)' : 'rgba(99,102,241,0.1)',
            color: subscription ? '#60A5FA' : D.indigoLight,
            border: `1px solid ${subscription ? 'rgba(96,165,250,0.2)' : 'rgba(99,102,241,0.2)'}`,
          }}>
            {subscription ? `✦ ${subscription.plan.toUpperCase()}` : `⏱ Trial — ${daysLeft}d left`}
          </span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>{navLinks}</nav>

        {/* Footer */}
        <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: '16px', paddingLeft: '4px' }}>
          <p style={{ fontSize: '11px', color: D.text3, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '12px', color: D.text2, background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = D.text}
            onMouseLeave={e => e.currentTarget.style.color = D.text2}
          >Sign out →</button>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav style={{
        display: 'flex', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        padding: '0 20px', height: '56px',
        alignItems: 'center', justifyContent: 'space-between',
        background: D.sidebar, borderBottom: `1px solid ${D.border}`,
      }} className="app-mobile-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: D.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: '#fff' }}>R</div>
          <span style={{ fontSize: '15px', fontWeight: '800', color: D.text, letterSpacing: '-0.5px' }}>Replios</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: D.text2, background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          {mobileMenuOpen
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          }
        </button>
      </nav>

      {/* Mobile menu */}
      <div style={{
        position: 'fixed', top: '56px', left: 0, right: 0, zIndex: 19,
        background: D.sidebar, borderBottom: `1px solid ${D.border}`,
        padding: mobileMenuOpen ? '12px 16px 16px' : '0 16px',
        maxHeight: mobileMenuOpen ? '400px' : '0',
        overflow: 'hidden', transition: 'max-height 0.3s ease, padding 0.3s ease',
      }} className="app-mobile-menu">
        <div style={{ marginBottom: '12px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '7px', background: 'rgba(99,102,241,0.1)', color: D.indigoLight, border: '1px solid rgba(99,102,241,0.2)' }}>
            {subscription ? `✦ ${subscription.plan.toUpperCase()}` : `⏱ Trial — ${daysLeft}d left`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>{navLinks}</div>
        <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: '12px' }}>
          <p style={{ fontSize: '11px', color: D.text3, marginBottom: '6px' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} style={{ fontSize: '12px', color: D.text2, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out →</button>
        </div>
      </div>

      {/* Main content */}
      <main style={{
        flex: 1,
        padding: 'clamp(16px, 3vw, 32px)',
        marginTop: '56px',
        minHeight: 'calc(100vh - 56px)',
      }} className="app-main">

        {/* Trial banner */}
        {!subscription && isInTrial && (
          <div style={{
            marginBottom: '20px', padding: '12px 16px',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)',
            flexWrap: 'wrap', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <span style={{ fontSize: '13px', color: D.indigoLight }}>
                Free trial — <strong style={{ color: D.text }}>{daysLeft} days remaining</strong>
              </span>
            </div>
            <button onClick={() => { window.location.href = 'https://replios.com/#pricing' }} style={{
              fontSize: '12px', fontWeight: '600', padding: '7px 14px',
              color: '#fff', background: D.indigo, border: 'none', borderRadius: '8px', cursor: 'pointer',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.transform = 'translateY(0)' }}
            >Upgrade now →</button>
          </div>
        )}

        <Outlet context={outletContext} />
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media(min-width: 768px) {
          .app-sidebar { display: flex !important; }
          .app-mobile-nav { display: none !important; }
          .app-mobile-menu { display: none !important; }
          .app-main { margin-left: 220px !important; margin-top: 0 !important; min-height: 100vh !important; }
        }
      `}</style>
    </div>
  )
}

export default AppLayout
