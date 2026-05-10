import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from './supabase'

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

const avatarColors = ['#e0e7ff', '#fce7f3', '#d1fae5', '#fef3c7', '#e0f2fe']
const avatarTextColors = ['#4338ca', '#9d174d', '#065f46', '#92400e', '#0369a1']
const getAvatarColor = (name) => {
  const i = (name || 'A').charCodeAt(0) % avatarColors.length
  return { bg: avatarColors[i], text: avatarTextColors[i] }
}

const platformStyles = {
  'Google': { bg: '#e0e7ff', color: '#4338ca' },
  'TripAdvisor': { bg: '#d1fae5', color: '#065f46' },
  'Facebook': { bg: '#dbeafe', color: '#1d4ed8' },
}

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : '#e5e7eb'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, generateReply, setReviews }) {
  const [expanded, setExpanded] = useState(!review.replied)
  const [saving, setSaving] = useState(false)

  const av = getAvatarColor(review.author)
  const plat = platformStyles[review.platform] || { bg: '#f3f4f6', color: '#374151' }

  const handleMarkReplied = async (replyText) => {
    setSaving(true)
    // Save reply_text to DB
    await supabase.from('reviews').update({ replied: true, reply_text: replyText }).eq('id', review.id)
    setReviews(prev => prev.map(r => r.id === review.id
      ? { ...r, replied: true, reply_text: replyText, aiReply: null, showManual: false, manualReply: undefined }
      : r
    ))
    setSaving(false)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #f1f5f9',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
    >
      {/* Card header — toujours visible, cliquable */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '12px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Avatar */}
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700,
          backgroundColor: av.bg, color: av.text,
        }}>
          {review.author.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{review.author}</span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeAgo(review.created_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stars rating={review.rating} />
            <span style={{
              fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
              backgroundColor: plat.bg, color: plat.color,
            }}>{review.platform}</span>
          </div>
        </div>

        {/* Status + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {review.replied ? (
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', backgroundColor: '#f0fdf4', color: '#16a34a' }}>
              ✓ Replied
            </span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '8px', backgroundColor: '#fefce8', color: '#ca8a04' }}>
              Pending
            </span>
          )}
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', flexShrink: 0 }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Contenu déroulable */}
      <div style={{
        maxHeight: expanded ? '1200px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <div style={{ padding: '0 20px 20px' }}>

          {/* Texte de la review */}
          <div style={{
            padding: '14px 16px', borderRadius: '12px', marginBottom: '14px',
            backgroundColor: '#f8fafc', border: '1px solid #f1f5f9',
          }}>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
              {review.text}
            </p>
          </div>

          {/* Réponse existante */}
          {review.replied && review.reply_text && (
            <div style={{
              padding: '14px 16px', borderRadius: '12px', marginBottom: '14px',
              backgroundColor: '#eef2ff', border: '1px solid #e0e7ff',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4338ca' }}>Your reply</span>
              </div>
              <p style={{ fontSize: '13px', color: '#3730a3', lineHeight: '1.7', margin: 0 }}>
                {review.reply_text}
              </p>
            </div>
          )}

          {/* Réponse AI en cours */}
          {review.aiReply && (
            <div style={{
              padding: '14px 16px', borderRadius: '12px', marginBottom: '14px',
              backgroundColor: '#eef2ff', border: '1px solid #e0e7ff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4338ca' }}>✨ AI suggested reply</span>
              </div>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: '0 0 12px' }}>
                {review.aiReply}
              </p>
              <button
                onClick={() => handleMarkReplied(review.aiReply)}
                disabled={saving}
                style={{
                  fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                  backgroundColor: '#16a34a', color: 'white', border: 'none', cursor: 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : '✓ Use this reply'}
              </button>
            </div>
          )}

          {/* Réponse manuelle en cours */}
          {review.showManual && (
            <div style={{ marginBottom: '14px' }}>
              <textarea
                value={review.manualReply || ''}
                onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, manualReply: e.target.value } : r))}
                placeholder="Write your reply..."
                rows={3}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '13px',
                  border: '1px solid #e5e7eb', color: '#111827', resize: 'none',
                  fontFamily: 'inherit', lineHeight: '1.6', boxSizing: 'border-box', outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.border = '1px solid #6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
                onBlur={e => { e.currentTarget.style.border = '1px solid #e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => handleMarkReplied(review.manualReply || '')}
                  disabled={saving || !review.manualReply?.trim()}
                  style={{
                    fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                    backgroundColor: '#16a34a', color: 'white', border: 'none', cursor: 'pointer',
                    opacity: saving || !review.manualReply?.trim() ? 0.5 : 1,
                  }}
                >
                  {saving ? 'Saving...' : '✓ Save reply'}
                </button>
                <button
                  onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: false, manualReply: undefined } : r))}
                  style={{ fontSize: '12px', padding: '7px 14px', borderRadius: '8px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Boutons action */}
          {!review.replied && !review.aiReply && !review.showManual && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => generateReply(review)}
                disabled={review.loading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid #e0e7ff', color: '#6366f1', backgroundColor: '#f5f3ff',
                  cursor: 'pointer', transition: 'all 0.15s', opacity: review.loading ? 0.6 : 1,
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eef2ff'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f5f3ff'}
              >
                {review.loading ? (
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                )}
                {review.loading ? 'Generating...' : 'Reply with AI'}
              </button>
              <button
                onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: '' } : r))}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '12px', fontWeight: 500, padding: '8px 14px', borderRadius: '8px',
                  border: '1px solid #e5e7eb', color: '#64748b', backgroundColor: '#fafafa',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
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

          {/* Bouton modifier réponse */}
          {review.replied && review.reply_text && !review.showManual && (
            <button
              onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: r.reply_text } : r))}
              style={{
                fontSize: '11px', color: '#94a3b8', background: 'none', border: 'none',
                cursor: 'pointer', padding: '0', transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#64748b'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >
              Edit reply
            </button>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  )
}

function FilterBtn({ value, current, onChange }) {
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        fontSize: '11px', fontWeight: 500, padding: '5px 12px', borderRadius: '8px',
        backgroundColor: current === value ? '#6366f1' : '#f8fafc',
        color: current === value ? 'white' : '#64748b',
        border: current === value ? '1px solid #6366f1' : '1px solid #f1f5f9',
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {value}
    </button>
  )
}

function Reviews() {
  const { reviews, setReviews, generateReply, addReview, loading } = useOutletContext()
  const [filterPlatform, setFilterPlatform] = useState('All')
  const [filterRating, setFilterRating] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [newReview, setNewReview] = useState({ author: '', rating: 5, text: '', platform: 'Google' })

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
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, padding: '8px 16px', borderRadius: '10px',
            backgroundColor: '#6366f1', color: 'white', border: 'none', cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add review
        </button>
      </div>

      {/* Formulaire ajout */}
      {showForm && (
        <div className="bg-white rounded-2xl border p-5 mb-5" style={{ borderColor: '#f1f5f9', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Add a new review</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Author name" value={newReview.author}
              onChange={e => setNewReview({ ...newReview, author: e.target.value })}
              className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
              style={{ borderColor: '#e5e7eb' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <textarea placeholder="Review text" value={newReview.text}
              onChange={e => setNewReview({ ...newReview, text: e.target.value })}
              className="w-full border rounded-xl px-3 py-2.5 text-sm h-20 resize-none focus:outline-none"
              style={{ borderColor: '#e5e7eb', fontFamily: 'inherit' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }}
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
              <button onClick={handleAddReview}
                style={{ fontSize: '13px', fontWeight: 600, padding: '8px 16px', borderRadius: '10px', backgroundColor: '#6366f1', color: 'white', border: 'none', cursor: 'pointer' }}>
                Save review
              </button>
              <button onClick={() => setShowForm(false)}
                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '10px', backgroundColor: '#f8fafc', color: '#64748b', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="bg-white rounded-2xl border p-4 mb-5" style={{ borderColor: '#f1f5f9' }}>
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

      {/* Header liste */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-semibold text-gray-700">All reviews</h2>
        <span className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Liste cartes */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border p-16 text-center" style={{ borderColor: '#f1f5f9' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(review => (
            <ReviewCard
              key={review.id}
              review={review}
              generateReply={generateReply}
              setReviews={setReviews}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Reviews
