import { useState, useEffect } from 'react'
import { supabase } from './supabase'

function Dashboard({ session }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({
  author: '',
  rating: 5,
  text: '',
  platform: 'Google'
})

  useEffect(() => {
    fetchReviews()
  }, [])

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
    await supabase
      .from('reviews')
      .update({ replied: true })
      .eq('id', id)

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

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center">
            <span className="text-orange-400 text-lg">★</span>
          </div>
          <span className="text-blue-900 font-bold text-xl">Reviewly</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">{session.user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-sm text-gray-400 hover:text-blue-900"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">Reputation Score</p>
            <p className="text-4xl font-bold text-blue-900">87<span className="text-lg text-gray-400">/100</span></p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
            <p className="text-4xl font-bold text-blue-900">{reviews.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">Pending replies</p>
            <p className="text-4xl font-bold text-orange-500">
              {reviews.filter(r => !r.replied).length}
            </p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-6">Recent Reviews</h2>
          {/* Bouton + Formulaire */}
<div className="mb-6">
  {!showForm ? (
    <button
      onClick={() => setShowForm(true)}
      className="bg-blue-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
    >
      + Add review
    </button>
  ) : (
    <div className="border border-blue-100 rounded-xl p-5 bg-blue-50 space-y-3">
      <h3 className="text-blue-900 font-semibold">Add a new review</h3>
      <input
        type="text"
        placeholder="Author name"
        value={newReview.author}
        onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
      />
      <textarea
        placeholder="Review text"
        value={newReview.text}
        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20"
      />
      <div className="flex gap-3">
        <select
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} stars</option>)}
        </select>
        <select
          value={newReview.platform}
          onChange={(e) => setNewReview({ ...newReview, platform: e.target.value })}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option>Google</option>
          <option>TripAdvisor</option>
          <option>Facebook</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={addReview}
          className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Save review
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 text-sm px-4 py-2 rounded-lg hover:text-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )}
</div>

      

          {loading ? (
            <p className="text-gray-400 text-center py-8">Loading reviews...</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-blue-900">{review.author}</p>
                      <div className="flex items-center gap-2">
                        <div className="text-lg">{stars(review.rating)}</div>
                        <span className="text-gray-400 text-xs">{review.platform}</span>
                      </div>
                    </div>
                    {review.replied ? (
                      <span className="text-green-500 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">Replied</span>
                    ) : (
                      <span className="text-orange-500 text-xs font-semibold bg-orange-50 px-3 py-1 rounded-full">Pending</span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{review.text}</p>

                  {review.aiReply && (
                    <div className="bg-blue-50 rounded-xl p-4 mb-3">
                      <p className="text-xs text-blue-900 font-semibold mb-1">✨ AI suggested reply</p>
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
                      className="bg-blue-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-800"
                    >
                      {review.loading ? 'Generating...' : 'Reply with AI ✨'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard