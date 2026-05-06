import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(days / 30)
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (weeks < 4) return `${weeks}w ago`
  return `${months}mo ago`
}

function Reviews() {
  const { reviews, setReviews, generateReply, markAsReplied, addReview, loading } = useOutletContext()
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [filterRating, setFilterRating] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '', platform: 'Google' })

  const stars = (rating) => Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < rating ? '#6366f1' : '#e5e7eb' }}>★</span>
  ))

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

  const filtered = reviews.filter(r => {
    if (filterPlatform !== 'All' && r.platform !== filterPlatform) return false
    if (filterRating !== 'All' && r.rating !== parseInt(filterRating)) return false
    if (filterStatus === 'Replied' && !r.replied) return false
    if (filterStatus === 'Pending' && r.replied) return false
    return true
  })

  const handleAddReview = async () => {
    const ok = await addReview(newReview)
    if (ok) {
      setNewReview({ author: '', rating: 5, text: '', platform: 'Google' })
      setShowForm(false)
    }
  }

  const FilterBtn = ({ value, current, onChange }) => (
    <button
      onClick={() => onChange(value)}
      className="text-xs px-3 py-1.5 rounded-lg transition-all"
      style={{
        backgroundColor: current === value ? '#6366f1' : '#f8fafc',
        color: current === value ? 'white' : '#64748b',
        border: current === value ? '1px solid #6366f1' : '1px solid #f1f5f9',
      }}
    >
      {value}
    </button>
  )

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Reviews</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {reviews.filter(r => !r.replied).length} pending · {reviews.length} total
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-white text-xs font-medium px-3.5 py-2 rounded-xl transition-all"
          style={{ backgroundColor: '#6366f1' }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = '#4f46e5'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = '#6366f1'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add review
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="bg-white rounded-2xl border p-5 mb-5" style={{ borderColor: '#f1f5f9' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add a new review</h3>
          <div className="space-y-3">
            <input
              type="text" placeholder="Author name" value={newReview.author}
              onChange={e => setNewReview({ ...newReview, author: e.target.value })}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ borderColor: '#e5e7eb' }}
            />
            <textarea
              placeholder="Review text" value={newReview.text}
              onChange={e => setNewReview({ ...newReview, text: e.target.value })}
              className="w-full border rounded-xl px-3 py-2.5 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              style={{ borderColor: '#e5e7eb' }}
            />
            <div className="flex gap-3">
              <select value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#e5e7eb' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
              </select>
              <select value={newReview.platform} onChange={e => setNewReview({ ...newReview, platform: e.target.value })}
                className="border rounded-xl px-3 py-2 text-sm focus:outline-none" style={{ borderColor: '#e5e7eb' }}>
                <option>Google</option><option>TripAdvisor</option><option>Facebook</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddReview} className="text-white text-sm px-4 py-2 rounded-xl" style={{ backgroundColor: '#6366f1' }}>
                Save review
              </button>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-sm px-4 py-2 rounded-xl hover:text-gray-600">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: '#f1f5f9' }}>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Platform</span>
            <div className="flex gap-1">
              {['All', 'Google', 'TripAdvisor', 'Facebook'].map(v => (
                <FilterBtn key={v} value={v} current={filterPlatform} onChange={setFilterPlatform} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Rating</span>
            <div className="flex gap-1">
              {['All', '1', '2', '3', '4', '5'].map(v => (
                <FilterBtn key={v} value={v} current={filterRating} onChange={setFilterRating} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-400">Status</span>
            <div className="flex gap-1">
              {['All', 'Pending', 'Replied'].map(v => (
                <FilterBtn key={v} value={v} current={filterStatus} onChange={setFilterStatus} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des avis */}
      <div className="bg-white rounded-2xl border" style={{ borderColor: '#f1f5f9' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f8fafc' }}>
          <h2 className="text-sm font-semibold text-gray-900">All reviews</h2>
          <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f1f5f9' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
            </p>
            <p className="text-xs text-gray-300">
              {reviews.length === 0 ? 'Add your first review to get started' : 'Try adjusting your filters'}
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#f8fafc' }}>
            {filtered.map((review) => {
              const av = getAvatarColor(review.author)
              const plat = platformStyles[review.platform] || { bg: '#f3f4f6', color: '#374151' }
              return (
                <div key={review.id} className="px-5 py-4 transition-colors hover:bg-gray-50">

                  {/* Header avis */}
                  <div className="flex items-start justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ backgroundColor: av.bg, color: av.text }}>
                        {review.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-900">{review.author}</p>
                          <span className="text-xs" style={{ color: '#94a3b8' }}>{timeAgo(review.created_at)}</span>
                        </div>
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

                  {/* Texte */}
                  <p className="text-sm text-gray-500 mb-3 leading-relaxed pl-10">{review.text}</p>

                  {/* Réponse IA */}
                  {review.aiReply && (
                    <div className="ml-10 rounded-xl p-3.5 mb-3" style={{ backgroundColor: '#eef2ff' }}>
                      <p className="text-xs font-semibold mb-2" style={{ color: '#4338ca' }}>
                        <span className="mr-1">✨</span> AI suggested reply
                      </p>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.aiReply}</p>
                      <button onClick={() => markAsReplied(review.id)}
                        className="mt-3 text-white text-xs px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: '#16a34a' }}>
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
                        style={{ borderColor: '#e5e7eb' }} rows={3}
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => markAsReplied(review.id)}
                          className="text-white text-xs px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor: '#16a34a' }}>
                          ✓ Mark as replied
                        </button>
                        <button
                          onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: false, manualReply: undefined } : r))}
                          className="text-gray-400 text-xs px-3 py-1.5 rounded-lg hover:text-gray-600">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Boutons action */}
                  {!review.replied && !review.aiReply && !review.showManual && (
                    <div className="ml-10 flex items-center gap-2">
                      <button
                        onClick={() => generateReply(review)} disabled={review.loading}
                        className="text-xs px-3 py-1.5 rounded-lg border transition-all disabled:opacity-50 flex items-center gap-1.5"
                        style={{ borderColor: '#e0e7ff', color: '#6366f1', backgroundColor: '#fafafe' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eef2ff'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafe'}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        {review.loading ? 'Generating...' : 'Reply with AI'}
                      </button>
                      <button
                        onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: '' } : r))}
                        className="text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5"
                        style={{ borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#fafafa' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafa'}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
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
    </>
  )
}

export default Reviews