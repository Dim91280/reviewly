import { useState } from 'react'
import { supabase } from './supabase'

function Dashboard({ session }) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Marie Dupont",
      rating: 5,
      text: "Excellent service, I highly recommend!",
      platform: "Google",
      date: "2 hours ago",
      replied: false,
      aiReply: null,
      loading: false
    },
    {
      id: 2,
      author: "Jean Martin",
      rating: 2,
      text: "Disappointed with the wait time, expected better.",
      platform: "Google",
      date: "5 hours ago",
      replied: false,
      aiReply: null,
      loading: false
    },
    {
      id: 3,
      author: "Sophie Bernard",
      rating: 4,
      text: "Very good experience overall, will come back.",
      platform: "TripAdvisor",
      date: "1 day ago",
      replied: true,
      aiReply: null,
      loading: false
    }
  ])

  const generateReply = (review) => {
    setReviews(prev => prev.map(r =>
      r.id === review.id ? { ...r, loading: true } : r
    ))

    setTimeout(() => {
      let reply = ''
      if (review.rating >= 4) {
        reply = `Thank you so much ${review.author.split(' ')[0]} for your wonderful feedback! We're thrilled you had a great experience and look forward to welcoming you again soon. 😊`
      } else {
        reply = `Dear ${review.author.split(' ')[0]}, thank you for taking the time to share your feedback. We sincerely apologize for not meeting your expectations. We'd love the opportunity to make it right — please don't hesitate to contact us directly.`
      }

      setReviews(prev => prev.map(r =>
        r.id === review.id ? { ...r, loading: false, aiReply: reply } : r
      ))
    }, 1000)
  }

  const markAsReplied = (id) => {
    setReviews(prev => prev.map(r =>
      r.id === id ? { ...r, replied: true, aiReply: null } : r
    ))
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
            <p className="text-4xl font-bold text-blue-900">124</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">Average Rating</p>
            <p className="text-4xl font-bold text-blue-900">4.3<span className="text-lg text-gray-400">/5</span></p>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-6">Recent Reviews</h2>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-blue-900">{review.author}</p>
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{stars(review.rating)}</div>
                      <span className="text-gray-400 text-xs">{review.platform} · {review.date}</span>
                    </div>
                  </div>
                  {review.replied ? (
                    <span className="text-green-500 text-xs font-semibold bg-green-50 px-3 py-1 rounded-full">Replied</span>
                  ) : (
                    <span className="text-orange-500 text-xs font-semibold bg-orange-50 px-3 py-1 rounded-full">Pending</span>
                  )}
                </div>

                <p className="text-gray-600 text-sm mb-3">{review.text}</p>

                {/* Réponse IA générée */}
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
        </div>

      </div>
    </div>
  )
}

export default Dashboard