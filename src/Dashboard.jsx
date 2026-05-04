import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Account from './Account'

function Dashboard({ session, onShowPricing, isSuccess }) {
  const [showAccount, setShowAccount] = useState(false)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [subLoading, setSubLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    text: '',
    platform: 'Google'
  })

  useEffect(() => {
    fetchSubscription()
    fetchReviews()
  }, [])

  const fetchSubscription = async (retries = 8) => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle()
    if (!data && retries > 0 && isSuccess) {
      setTimeout(() => fetchSubscription(retries - 1), 2000)
      return
    }
    setSubscription(data)
    setSubLoading(false)
  }

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
    if (!error) setReviews(data.map(r => ({ ...r, aiReply: null, loading: false, manualReply: undefined, showManual: false })))
    setLoading(false)
  }

  const generateReply = async (review) => {
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, loading: true } : r))
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { reviewText: review.text, rating: review.rating, authorName: review.author }
      })
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

  const addReview = async () => {
    if (!newReview.author || !newReview.text) return
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ author: newReview.author, rating: newReview.rating, text: newReview.text, platform: newReview.platform, replied: false, user_id: session.user.id }])
      .select()
    if (!error) {
      setReviews(prev => [{ ...data[0], aiReply: null, loading: false, manualReply: undefined, showManual: false }, ...prev])
      setNewReview({ author: '', rating: 5, text: '', platform: 'Google' })
      setShowForm(false)
    }
  }

  const stars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? '#6366f1' : '#e5e7eb' }}>★</span>
  ))

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const pendingCount = reviews.filter(r => !r.replied).length

  const avatarColors = ['#e0e7ff', '#fce7f3', '#d1fae5', '#fef3c7', '#e0f2fe']
  const avatarTextColors = ['#4338ca', '#9d174d', '#065f46', '#92400e', '#0369a1']
  const getAvatarColor = (name) => {
    const i = name.charCodeAt(0) % avatarColors.length
    return { bg: avatarColors[i], text: avatarTextColors[i] }
  }

  const platformStyles = {
    'Google': { bg: '#e0e7ff', color: '#4338ca' },
    'TripAdvisor': { bg: '#d1fae5', color: '#065f46' },
    'Facebook': { bg: '#dbeafe', color: '#1d4ed8' },
  }

  if (subLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">{isSuccess ? 'Activation de votre abonnement...' : 'Chargement...'}</p>
        </div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Choisissez votre plan</h2>
          <p className="text-gray-400 text-sm mb-8">Accédez à votre dashboard en choisissant un plan Reviewly.</p>
          <div className="space-y-3">
            <button
              onClick={() => { onShowPricing(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 200) }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              Voir les plans →
            </button>
            <button onClick={() => supabase.auth.signOut()} className="w-full text-gray-400 text-sm hover:text-gray-600">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showAccount) {
    return <Account session={session} subscription={subscription} onBack={() => setShowAccount(false)} />
  }
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 min-h-screen flex-col px-4 py-6 fixed top-0 left-0" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>

        <div className="px-2 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: '#1e3a5f', color: '#60a5fa' }}>
            Plan {subscription.plan.toUpperCase()}
          </span>
        </div>

        <nav className="space-y-0.5 flex-1">
          {[
            { label: 'Dashboard', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, active: true },
            { label: 'Reviews', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, badge: pendingCount > 0 ? pendingCount : null },
            { label: 'Analytics', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
            { label: 'Account', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, onClick: () => setShowAccount(true) },
          ].map(item => (
            <div key={item.label} onClick={item.onClick} className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors"
              style={{ backgroundColor: item.active ? '#1e293b' : 'transparent', color: item.active ? '#f1f5f9' : '#64748b' }}>
              {item.icon}
              <span>{item.label}</span>
              {item.badge && <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: '#6366f1', color: 'white' }}>{item.badge}</span>}
            </div>
          ))}
        </nav>

        <div className="border-t px-2 pt-4" style={{ borderColor: '#1e293b' }}>
          <p className="text-xs truncate mb-2" style={{ color: '#475569' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} className="text-xs transition-colors" style={{ color: '#475569' }}>
            Sign out →
          </button>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 px-4 py-3 flex items-center justify-between z-10" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-xs" style={{ color: '#64748b' }}>Sign out</button>
      </nav>

      {/* Main */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-8 mt-12 md:mt-0">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Monitor and respond to your reviews</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
            style={{ backgroundColor: '#6366f1' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add review
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total reviews', value: reviews.length, sub: 'All time', subColor: '#22c55e' },
            { label: 'Pending replies', value: pendingCount, sub: 'Need attention', subColor: pendingCount > 0 ? '#f59e0b' : '#22c55e', valueColor: pendingCount > 0 ? '#f59e0b' : '#111827' },
            { label: 'Average rating', value: avgRating, suffix: '/5', sub: `Based on ${reviews.length} reviews`, subColor: '#22c55e' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border" style={{ borderColor: '#f1f5f9' }}>
              <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
              <p className="text-2xl font-semibold mb-1" style={{ color: stat.valueColor || '#111827' }}>
                {stat.value}{stat.suffix && <span className="text-sm font-normal text-gray-400">{stat.suffix}</span>}
              </p>
              <p className="text-xs" style={{ color: stat.subColor }}>{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Form ajout avis */}
        {showForm && (
          <div className="bg-white rounded-xl border p-5 mb-5" style={{ borderColor: '#f1f5f9' }}>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Add a new review</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Author name"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                style={{ borderColor: '#e5e7eb' }}
              />
              <textarea
                placeholder="Review text"
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                style={{ borderColor: '#e5e7eb' }}
              />
              <div className="flex gap-3">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
                </select>
                <select
                  value={newReview.platform}
                  onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <option>Google</option>
                  <option>TripAdvisor</option>
                  <option>Facebook</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={addReview} className="text-white text-sm px-4 py-2 rounded-lg" style={{ backgroundColor: '#6366f1' }}>
                  Save review
                </button>
                <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm px-4 py-2 rounded-lg hover:text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-xl border" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f8fafc' }}>
            <h2 className="text-sm font-medium text-gray-900">Recent reviews</h2>
            <span className="text-xs text-gray-400">{pendingCount} pending</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#f1f5f9' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p className="text-sm text-gray-400">No reviews yet</p>
              <p className="text-xs text-gray-300 mt-1">Add your first review to get started</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
              {reviews.map((review) => {
                const av = getAvatarColor(review.author)
                const plat = platformStyles[review.platform] || { bg: '#f3f4f6', color: '#374151' }
                return (
                  <div key={review.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                          style={{ backgroundColor: av.bg, color: av.text }}>
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.author}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs">{stars(review.rating)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ backgroundColor: plat.bg, color: plat.color }}>
                              {review.platform}
                            </span>
                          </div>
                        </div>
                      </div>
                      {review.replied ? (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Replied</span>
                      ) : (
                        <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#fefce8', color: '#ca8a04' }}>Pending</span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 mb-3 leading-relaxed pl-10">{review.text}</p>

                    {/* Réponse IA générée */}
                    {review.aiReply && (
                      <div className="ml-10 rounded-xl p-3.5 mb-3" style={{ backgroundColor: '#eef2ff' }}>
                        <p className="text-xs font-medium mb-2" style={{ color: '#4338ca' }}>AI suggested reply</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{review.aiReply}</p>
                        <button
                          onClick={() => markAsReplied(review.id)}
                          className="mt-3 text-white text-xs px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: '#16a34a' }}
                        >
                          ✓ Mark as replied
                        </button>
                      </div>
                    )}

                    {/* Réponse manuelle */}
                    {review.showManual && (
                      <div className="ml-10 mt-2">
                        <textarea
                          value={review.manualReply || ''}
                          onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, manualReply: e.target.value } : r))}
                          placeholder="Write your reply..."
                          className="w-full border rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                          style={{ borderColor: '#e5e7eb' }}
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => markAsReplied(review.id)}
                            className="text-white text-xs px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: '#16a34a' }}
                          >
                            ✓ Mark as replied
                          </button>
                          <button
                            onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: false, manualReply: undefined } : r))}
                            className="text-gray-400 text-xs px-3 py-1.5 rounded-lg hover:text-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Boutons d'action */}
                    {!review.replied && !review.aiReply && !review.showManual && (
                      <div className="ml-10 flex items-center gap-2">
                        <button
                          onClick={() => generateReply(review)}
                          disabled={review.loading}
                          className="text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          style={{ borderColor: '#e0e7ff', color: '#6366f1', backgroundColor: '#fafafa' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          {review.loading ? 'Generating...' : 'Reply with AI'}
                        </button>
                        <button
                          onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: '' } : r))}
                          className="text-xs px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5"
                          style={{ borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#fafafa' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Reply manually
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard