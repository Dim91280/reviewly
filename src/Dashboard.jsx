import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabase'
import Account from './Account'
import Reviews from './Reviews'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function Dashboard({ session, onShowPricing, isSuccess }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [showAccount, setShowAccount] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [subLoading, setSubLoading] = useState(true)

  useEffect(() => { fetchSubscription(); fetchReviews() }, [])

  const fetchSubscription = async (retries = 8) => {
    const { data } = await supabase.from('subscriptions').select('*').eq('user_id', session.user.id).eq('status', 'active').maybeSingle()
    if (!data && retries > 0 && isSuccess) { setTimeout(() => fetchSubscription(retries - 1), 2000); return }
    setSubscription(data); setSubLoading(false)
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
      author: reviewData.author,
      rating: reviewData.rating,
      text: reviewData.text,
      platform: reviewData.platform,
      replied: false,
      user_id: session.user.id,
    }]).select()
    if (!error) {
      setReviews(prev => [{ ...data[0], aiReply: null, loading: false, manualReply: undefined, showManual: false }, ...prev])
      return true
    }
    return false
  }

  const pendingCount = reviews.filter(r => !r.replied).length
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null
  const reputationScore = avgRating !== null ? Math.round((avgRating / 5) * 100) : null
  const responseRate = reviews.length > 0 ? Math.round((reviews.filter(r => r.replied).length / reviews.length) * 100) : null
  const negativeUnanswered = reviews.filter(r => r.rating <= 2 && !r.replied)

  const weeklyData = useMemo(() => {
    const buckets = {}
    reviews.forEach(r => {
      const d = new Date(r.created_at)
      const jan1 = new Date(d.getFullYear(), 0, 1)
      const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
      const key = `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
      if (!buckets[key]) buckets[key] = { week: `W${week}`, sum: 0, count: 0, ts: d.getTime() }
      buckets[key].sum += r.rating
      buckets[key].count += 1
    })
    return Object.values(buckets)
      .sort((a, b) => a.ts - b.ts)
      .slice(-8)
      .map(b => ({ week: b.week, avg: Math.round((b.sum / b.count) * 10) / 10, count: b.count }))
  }, [reviews])

  const trendDelta = weeklyData.length >= 2
    ? Math.round((weeklyData[weeklyData.length - 1].avg - weeklyData[weeklyData.length - 2].avg) * 10) / 10
    : null

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border rounded-lg px-3 py-2 shadow-sm text-xs" style={{ borderColor: '#e5e7eb' }}>
        <p className="font-medium text-gray-900">★ {d.avg.toFixed(1)}</p>
        <p className="text-gray-400">{d.count} review{d.count !== 1 ? 's' : ''}</p>
      </div>
    )
  }

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
          <button onClick={() => { onShowPricing(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 200) }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors">
            Voir les plans →
          </button>
          <button onClick={() => supabase.auth.signOut()} className="w-full text-gray-400 text-sm hover:text-gray-600">Se déconnecter</button>
        </div>
      </div>
    </div>
  )

  if (showAccount) return <Account session={session} subscription={subscription} onBack={() => setShowAccount(false)} />

  const navItems = [
    {
      label: 'Dashboard',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      onClick: () => { setActivePage('dashboard'); setShowAccount(false) },
      active: activePage === 'dashboard' && !showAccount,
    },
    {
      label: 'Reviews',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
      onClick: () => { setActivePage('reviews'); setShowAccount(false) },
      active: activePage === 'reviews' && !showAccount,
      badge: pendingCount > 0 ? pendingCount : null,
    },
    {
      label: 'Analytics',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    },
    {
      label: 'Account',
      icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      onClick: () => setShowAccount(true),
    },
  ]

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>
      <aside className="hidden md:flex w-56 min-h-screen flex-col px-4 py-6 fixed top-0 left-0" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2 mb-8 px-2">
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
        <nav className="space-y-0.5 flex-1">
          {navItems.map(item => (
            <div key={item.label} onClick={item.onClick} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors"
              style={{ backgroundColor: item.active ? '#1e293b' : 'transparent', color: item.active ? '#f1f5f9' : '#64748b' }}>
              {item.icon}<span>{item.label}</span>
              {item.badge && <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#6366f1', color: 'white' }}>{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="border-t px-2 pt-4" style={{ borderColor: '#1e293b' }}>
          <p className="text-xs truncate mb-2" style={{ color: '#475569' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} className="text-xs transition-colors" style={{ color: '#475569' }}>Sign out →</button>
        </div>
      </aside>

      <nav className="md:hidden fixed top-0 left-0 right-0 px-4 py-3 flex items-center justify-between z-10" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-xs" style={{ color: '#64748b' }}>Sign out</button>
      </nav>

      <main className="md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-8 mt-12 md:mt-0">
        {!subscription && isInTrial && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center justify-between" style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}>
            <span>Free trial — <strong>{daysLeft} days remaining</strong></span>
            <button onClick={() => { onShowPricing(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 200) }}
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: '#6366f1' }}>
              Upgrade now
            </button>
          </div>
        )}

        {activePage === 'dashboard' && (
          <>
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
              <p className="text-xs text-gray-400 mt-0.5">Your reputation at a glance</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-xs text-gray-400 mb-2">Reputation score</p>
                <p className="text-3xl font-semibold text-gray-900 mb-1">
                  {reputationScore !== null ? reputationScore : '—'}
                  {reputationScore !== null && <span className="text-sm font-normal text-gray-400">/100</span>}
                </p>
                <p className="text-xs" style={{ color: reputationScore === null ? '#94a3b8' : reputationScore >= 80 ? '#22c55e' : reputationScore >= 60 ? '#f59e0b' : '#ef4444' }}>
                  {reputationScore === null ? 'No reviews yet' : reputationScore >= 80 ? 'Excellent' : reputationScore >= 60 ? 'Good' : 'Needs improvement'}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-xs text-gray-400 mb-2">Average rating</p>
                <p className="text-3xl font-semibold text-gray-900 mb-1">
                  {avgRating !== null ? avgRating.toFixed(1) : '—'}
                  {avgRating !== null && <span className="text-sm font-normal text-gray-400">/5</span>}
                </p>
                <p className="text-xs text-gray-400">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f5f9' }}>
                <p className="text-xs text-gray-400 mb-2">Response rate</p>
                <p className="text-3xl font-semibold mb-1" style={{ color: responseRate !== null && responseRate < 50 ? '#f59e0b' : '#111827' }}>
                  {responseRate !== null ? `${responseRate}%` : '—'}
                </p>
                <p className="text-xs" style={{ color: responseRate === null ? '#94a3b8' : responseRate >= 80 ? '#22c55e' : '#f59e0b' }}>
                  {responseRate === null ? 'No reviews yet' : responseRate >= 80 ? 'Great job' : 'Reply to more reviews'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border p-5 mb-6" style={{ borderColor: '#f1f5f9' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900">Rating trend</p>
                  <p className="text-xs text-gray-400 mt-0.5">Weekly average over the last 8 weeks</p>
                </div>
                {trendDelta !== null && (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{
                    backgroundColor: trendDelta >= 0 ? '#f0fdf4' : '#fef2f2',
                    color: trendDelta >= 0 ? '#16a34a' : '#ef4444',
                  }}>
                    {trendDelta >= 0 ? '+' : ''}{trendDelta} vs last week
                  </span>
                )}
              </div>
              {weeklyData.length < 2 ? (
                <div className="flex items-center justify-center h-32 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  <p className="text-xs text-gray-400">Not enough data yet — add reviews across multiple weeks</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                    <CartesianGrid vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e0e7ff', strokeWidth: 1 }} />
                    <Line type="monotone" dataKey="avg" stroke="#6366f1" strokeWidth={2} dot={{ r: 3, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#6366f1' }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {negativeUnanswered.length > 0 ? (
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#fee2e2' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fef2f2' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {negativeUnanswered.length} negative review{negativeUnanswered.length > 1 ? 's' : ''} without a reply
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">Reviews rated 1–2 stars need your attention</p>
                    </div>
                  </div>
                  <button onClick={() => setActivePage('reviews')} className="text-xs font-medium px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#ef4444' }}>
                    View reviews →
                  </button>
                </div>
              </div>
            ) : reviews.length > 0 ? (
              <div className="bg-white rounded-xl border p-5" style={{ borderColor: '#f1f5f9' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f0fdf4' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">All negative reviews have been addressed</p>
                    <p className="text-xs text-gray-400 mt-0.5">Keep up the great work!</p>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}

        {activePage === 'reviews' && (
          <Reviews
            reviews={reviews}
            setReviews={setReviews}
            generateReply={generateReply}
            markAsReplied={markAsReplied}
            addReview={addReview}
            loading={loading}
          />
        )}
      </main>
    </div>
  )
}

export default Dashboard
