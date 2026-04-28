import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Dashboard({ session, onShowPricing }) {
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

  const fetchSubscription = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .maybeSingle()
    setSubscription(data)
    setSubLoading(false)
  }

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) {
      setReviews(data.map(r => ({ ...r, aiReply: null, loading: false })))
    }
    setLoading(false)
  }

  const generateReply = async (review) => {
    setReviews(prev => prev.map(r =>
      r.id === review.id ? { ...r, loading: true } : r
    ))
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: {
          reviewText: review.text,
          rating: review.rating,
          authorName: review.author
        }
      })
      if (error) throw error
      setReviews(prev => prev.map(r =>
        r.id === review.id ? { ...r, loading: false, aiReply: data.reply } : r
      ))
    } catch (err) {
      console.error(err)
      setReviews(prev => prev.map(r =>
        r.id === review.id ? { ...r, loading: false } : r
      ))
    }
  }

  const markAsReplied = async (id) => {
    await supabase.from('reviews').update({ replied: true }).eq('id', id)
    setReviews(prev => prev.map(r =>
      r.id === id ? { ...r, replied: true, aiReply: null } : r
    ))
  }

  const addReview = async () => {
    if (!newReview.author || !newReview.text) return
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        author: newReview.author,
        rating: newReview.rating,
        text: newReview.text,
        platform: newReview.platform,
        replied: false
      }])
      .select()
    if (!error) {
      setReviews(prev => [{ ...data[0], aiReply: null, loading: false }, ...prev])
      setNewReview({ author: '', rating: 5, text: '', platform: 'Google' })
      setShowForm(false)
    }
  }

  const stars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-orange-400" : "text-gray-200"}>★</span>
    ))
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—'

  const pendingCount = reviews.filter(r => !r.replied).length

  // Loading abonnement
  if (subLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  // Pas d'abonnement actif → paywall
  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⭐</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-3">Choisissez votre plan</h2>
          <p className="text-gray-400 mb-8">Accédez à votre dashboard en choisissant un plan Reviewly.</p>
          <div className="space-y-3">
            <button
              onClick={() => { onShowPricing(); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 200) }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl"
            >
              Voir les plans →
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full text-gray-400 text-sm hover:text-gray-600"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-blue-900 min-h-screen flex-col px-6 py-8 fixed top-0 left-0">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">★</span>
          </div>
          <span className="text-white font-bold text-lg">Reviewly</span>
        </div>
        <div className="mb-6">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${subscription.plan === 'pro' ? 'bg-orange-500 text-white' : 'bg-blue-800 text-blue-200'}`}>
            Plan {subscription.plan.toUpperCase()}
          </span>
        </div>
        <nav className="space-y-1 flex-1">
          <div className="flex items-center gap-3 bg-blue-800 text-white px-4 py-3 rounded-xl">
            <span>📊</span>
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 text-blue-300 px-4 py-3 rounded-xl hover:bg-blue-800 cursor-pointer">
            <span>⭐</span>
            <span className="text-sm">Reviews</span>
          </div>
          <div className="flex items-center gap-3 text-blue-300 px-4 py-3 rounded-xl hover:bg-blue-800 cursor-pointer">
            <span>📈</span>
            <span className="text-sm">Analytics</span>
          </div>
          <div className="flex items-center gap-3 text-blue-300 px-4 py-3 rounded-xl hover:bg-blue-800 cursor-pointer">
            <span>⚙️</span>
            <span className="text-sm">Settings</span>
          </div>
        </nav>
        <div className="border-t border-blue-800 pt-4">
          <p className="text-blue-300 text-xs truncate mb-2">{session.user.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-blue-300 text-sm hover:text-white"
          >
            Sign out →
          </button>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 bg-blue-900 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">★</span>
          </div>
          <span className="text-white font-bold">Reviewly</span>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="text-blue-300 text-sm">Sign out</button>
      </nav>

      <main className="md:ml-64 flex-1 px-4 md:px-8 py-4 md:py-8 mt-14 md:mt-0">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Monitor and respond to your reviews</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl"
          >
            + Add review
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">Total Reviews</p>
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{reviews.length}</p>
            <p className="text-green-500 text-xs mt-2">All time</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">Pending Replies</p>
              <span className="text-2xl">⏳</span>
            </div>
            <p className="text-4xl font-bold text-orange-500">{pendingCount}</p>
            <p className="text-orange-400 text-xs mt-2">Need attention</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">Average Rating</p>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-4xl font-bold text-blue-900">{avgRating}<span className="text-lg text-gray-400">/5</span></p>
            <p className="text-green-500 text-xs mt-2">Based on {reviews.length} reviews</p>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="text-blue-900 font-semibold mb-4">Add a new review</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Author name"
                value={newReview.author}
                onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-900"
              />
              <textarea
                placeholder="Review text"
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm h-24 focus:outline-none focus:border-blue-900"
              />
              <div className="flex gap-3">
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                >
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
                </select>
                <select
                  value={newReview.platform}
                  onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                >
                  <option>Google</option>
                  <option>TripAdvisor</option>
                  <option>Facebook</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addReview}
                  className="bg-orange-500 text-white text-sm px-5 py-2 rounded-xl hover:bg-orange-600"
                >
                  Save review
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 text-sm px-5 py-2 rounded-xl hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-blue-900">Recent Reviews</h2>
            <span className="text-gray-400 text-sm">{pendingCount} pending</span>
          </div>
          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading reviews...</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-5 hover:border-blue-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-blue-900">{review.author}</p>
                        <div className="flex items-center gap-2">
                          <div className="text-sm">{stars(review.rating)}</div>
                          <span className="text-gray-400 text-xs">· {review.platform}</span>
                        </div>
                      </div>
                    </div>
                    {review.replied ? (
                      <span className="text-green-500 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">✓ Replied</span>
                    ) : (
                      <span className="text-orange-500 text-xs font-semibold bg-orange-50 px-3 py-1 rounded-full">Pending</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{review.text}</p>
                  {review.aiReply && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                      <p className="text-xs text-blue-900 font-semibold mb-2">✨ AI suggested reply</p>
                      <p className="text-gray-600 text-sm">{review.aiReply}</p>
                      <button
                        onClick={() => markAsReplied(review.id)}
                        className="mt-3 bg-green-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        ✓ Mark as replied
                      </button>
                    </div>
                  )}
                  {!review.replied && !review.aiReply && (
                    <button
                      onClick={() => generateReply(review)}
                      disabled={review.loading}
                      className="bg-blue-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800 disabled:opacity-50"
                    >
                      {review.loading ? '⏳ Generating...' : '✨ Reply with AI'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
