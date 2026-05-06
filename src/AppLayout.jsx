import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { supabase } from './supabase'

function AppLayout({ session }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [subLoading, setSubLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'

  useEffect(() => { fetchSubscription(); fetchReviews() }, [])

  useEffect(() => {
    if (!subLoading && isSuccess) navigate('/dashboard', { replace: true })
  }, [subLoading])

  // Ferme le menu mobile quand on change de page
  useEffect(() => { setMobileMenuOpen(false) }, [pathname])

  const fetchSubscription = async (retries = 8) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', session.user.id).eq('status', 'active').maybeSingle()
    if (!data && retries > 0 && isSuccess) { setTimeout(() => fetchSubscription(retries - 1), 2000); return }
    setSubscription(data)
    setSubLoading(false)
  }

  const fetchReviews = async () => {
    const { data, error } = await supabase.from('reviews').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })
    if (!error) setReviews(data.map(r => ({ ...r, aiReply: null, loading: false, manualReply: undefined, showManual: false })))
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

  const markAsReplied = async (id) => {
    await supabase.from('reviews').update({ replied: true }).eq('id', id)
    setReviews(prev => prev.map(r => r.id === id ? { ...r, replied: true, aiReply: null, showManual: false, manualReply: undefined } : r))
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

  if (subLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400 text-sm">{isSuccess ? 'Activation de votre abonnement...' : 'Chargement...'}</p>
      </div>
    </div>
  )

  if (!subscription && !isInTrial) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre essai a expiré</h2>
        <p className="text-gray-400 text-sm mb-8">Choisissez un plan pour continuer à utiliser Reviewly.</p>
        <div className="space-y-3">
          <button onClick={() => navigate('/')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            Voir les plans →
          </button>
          <button onClick={() => supabase.auth.signOut()} className="w-full text-gray-400 text-sm hover:text-gray-600">Se déconnecter</button>
        </div>
      </div>
    </div>
  )

  const navItem = (to, icon, label, badge) => {
    const isActive = pathname === to
    return (
      <Link key={to} to={to} style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px', borderRadius: '8px',
        fontSize: '12px', textDecoration: 'none', transition: 'background 0.15s',
        backgroundColor: isActive ? '#1e293b' : 'transparent',
        color: isActive ? '#f1f5f9' : '#64748b',
      }}>
        {icon}
        <span>{label}</span>
        {badge != null && badge > 0 && (
          <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#6366f1', color: 'white' }}>{badge}</span>
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

  const outletContext = { reviews, setReviews, subscription, generateReply, markAsReplied, addReview, loading, pendingCount, session }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 min-h-screen flex-col px-4 py-6 fixed top-0 left-0" style={{ backgroundColor: '#0f172a' }}>
        <div onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 px-2" style={{ cursor: 'pointer' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>
        <div className="px-2 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: subscription ? '#1e3a5f' : '#1e293b', color: subscription ? '#60a5fa' : '#94a3b8' }}>
            {subscription ? `Plan ${subscription.plan.toUpperCase()}` : `Trial — ${daysLeft}j`}
          </span>
        </div>
        <nav className="space-y-0.5 flex-1">{navLinks}</nav>
        <div className="border-t px-2 pt-4" style={{ borderColor: '#1e293b' }}>
          <p className="text-xs truncate mb-2" style={{ color: '#475569' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} className="text-xs transition-colors" style={{ color: '#475569' }}>Sign out →</button>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 px-4 py-3 flex items-center justify-between z-20" style={{ backgroundColor: '#0f172a' }}>
        <Link to="/" style={{ textDecoration: 'none' }} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </Link>
        {/* Hamburger */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: '#94a3b8' }}>
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          )}
        </button>
      </nav>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-12 left-0 right-0 z-10 px-4 py-4 space-y-1" style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b' }}>
          <div className="mb-3 px-2">
            <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: subscription ? '#1e3a5f' : '#1e293b', color: subscription ? '#60a5fa' : '#94a3b8' }}>
              {subscription ? `Plan ${subscription.plan.toUpperCase()}` : `Trial — ${daysLeft}j`}
            </span>
          </div>
          {navLinks}
          <div className="border-t pt-3 mt-3" style={{ borderColor: '#1e293b' }}>
            <p className="text-xs truncate mb-2 px-3" style={{ color: '#475569' }}>{session.user.email}</p>
            <button onClick={() => supabase.auth.signOut()} className="text-xs px-3" style={{ color: '#475569' }}>Sign out →</button>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-8 mt-12 md:mt-0">
        {!subscription && isInTrial && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center justify-between" style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}>
            <span>Free trial — <strong>{daysLeft} days remaining</strong></span>
            <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300) }} className="text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#6366f1' }}>
              Upgrade now
            </button>
          </div>
        )}
        <Outlet context={outletContext} />
      </main>
    </div>
  )
}

export default AppLayout