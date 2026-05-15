import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from './supabase'

const D = {
  bg: '#05080F',
  surface: '#0D1220',
  surface2: '#111827',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  indigoDim: 'rgba(99,102,241,0.12)',
  text: '#F1F5F9',
  text2: '#64748B',
  text3: '#334155',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
}

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

const avatarGradients = [
  'linear-gradient(135deg,#6366F1,#818CF8)',
  'linear-gradient(135deg,#22D3EE,#0EA5E9)',
  'linear-gradient(135deg,#F97316,#F59E0B)',
  'linear-gradient(135deg,#10B981,#34D399)',
  'linear-gradient(135deg,#EF4444,#F97316)',
]
const getAvatarGradient = (name) => avatarGradients[(name || 'A').charCodeAt(0) % avatarGradients.length]

const platformStyles = {
  'Google': { bg: 'rgba(66,133,244,0.1)', color: '#60A5FA', border: 'rgba(66,133,244,0.2)' },
  'TripAdvisor': { bg: 'rgba(0,170,108,0.1)', color: '#34D399', border: 'rgba(0,170,108,0.2)' },
  'Facebook': { bg: 'rgba(24,119,242,0.1)', color: '#818CF8', border: 'rgba(24,119,242,0.2)' },
}

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '1px' }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'rgba(255,255,255,0.1)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review, generateReply, setReviews }) {
  const [expanded, setExpanded] = useState(!review.replied)
  const [saving, setSaving] = useState(false)

  const plat = platformStyles[review.platform] || { bg: 'rgba(255,255,255,0.05)', color: D.text2, border: D.border }

  const handleMarkReplied = async (replyText) => {
    setSaving(true)
    await supabase.from('reviews').update({ replied: true, reply_text: replyText }).eq('id', review.id)
    setReviews(prev => prev.map(r => r.id === review.id
      ? { ...r, replied: true, reply_text: replyText, aiReply: null, showManual: false, manualReply: undefined }
      : r
    ))
    setSaving(false)
  }

  return (
    <div style={{
      background: D.surface, borderRadius: '14px',
      border: `1px solid ${review.replied ? D.border : 'rgba(99,102,241,0.15)'}`,
      overflow: 'hidden', transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = review.replied ? D.border2 : 'rgba(99,102,241,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = review.replied ? D.border : 'rgba(99,102,241,0.15)'}
    >
      {/* Header */}
      <button onClick={() => setExpanded(e => !e)} style={{
        width: '100%', padding: '14px 18px',
        display: 'flex', alignItems: 'center', gap: '12px',
        background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '13px', fontWeight: 700, color: '#fff',
          background: getAvatarGradient(review.author),
        }}>
          {review.author.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: D.text }}>{review.author}</span>
            <span style={{ fontSize: '11px', color: D.text3 }}>{timeAgo(review.created_at)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Stars rating={review.rating} />
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '5px', background: plat.bg, color: plat.color, border: `1px solid ${plat.border}` }}>
              {review.platform}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {review.replied ? (
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '7px', background: 'rgba(16,185,129,0.1)', color: D.green, border: '1px solid rgba(16,185,129,0.2)' }}>✓ Replied</span>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '7px', background: 'rgba(245,158,11,0.08)', color: D.yellow, border: '1px solid rgba(245,158,11,0.2)' }}>Pending</span>
          )}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.text3} strokeWidth="2"
            style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </button>

      {/* Body */}
      <div style={{ maxHeight: expanded ? '1200px' : '0', overflow: 'hidden', transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '0 18px 18px' }}>

          {/* Review text */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${D.border}` }}>
            <p style={{ fontSize: '13px', color: D.text2, lineHeight: '1.7', margin: 0 }}>{review.text}</p>
          </div>

          {/* Existing reply */}
          {review.replied && review.reply_text && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: D.indigoLight }}>✨ Your reply</span>
              </div>
              <p style={{ fontSize: '13px', color: '#A5B4FC', lineHeight: '1.7', margin: 0 }}>{review.reply_text}</p>
            </div>
          )}

          {/* AI reply */}
          {review.aiReply && (
            <div style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '12px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: D.indigoLight }}>✨ AI suggested reply</span>
              </div>
              <p style={{ fontSize: '13px', color: '#A5B4FC', lineHeight: '1.7', margin: '0 0 12px' }}>{review.aiReply}</p>
              <button onClick={() => handleMarkReplied(review.aiReply)} disabled={saving} style={{
                fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                background: D.green, color: 'white', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1,
              }}>
                {saving ? 'Saving...' : '✓ Use this reply'}
              </button>
            </div>
          )}

          {/* Manual reply */}
          {review.showManual && (
            <div style={{ marginBottom: '12px' }}>
              <textarea
                value={review.manualReply || ''}
                onChange={e => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, manualReply: e.target.value } : r))}
                placeholder="Write your reply..."
                rows={3}
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '13px',
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border2}`,
                  color: D.text, resize: 'none', fontFamily: 'inherit', lineHeight: '1.6',
                  boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = D.border2}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={() => handleMarkReplied(review.manualReply || '')} disabled={saving || !review.manualReply?.trim()} style={{
                  fontSize: '12px', fontWeight: 600, padding: '7px 14px', borderRadius: '8px',
                  background: D.green, color: 'white', border: 'none', cursor: 'pointer',
                  opacity: saving || !review.manualReply?.trim() ? 0.5 : 1,
                }}>
                  {saving ? 'Saving...' : '✓ Save reply'}
                </button>
                <button onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: false, manualReply: undefined } : r))} style={{
                  fontSize: '12px', padding: '7px 14px', borderRadius: '8px',
                  background: 'transparent', color: D.text2, border: `1px solid ${D.border2}`, cursor: 'pointer',
                }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!review.replied && !review.aiReply && !review.showManual && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => generateReply(review)} disabled={review.loading} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 600, padding: '8px 14px', borderRadius: '8px',
                border: '1px solid rgba(99,102,241,0.3)', color: D.indigoLight, background: D.indigoDim,
                cursor: 'pointer', transition: 'all 0.15s', opacity: review.loading ? 0.7 : 1,
              }}
                onMouseEnter={e => { if (!review.loading) e.currentTarget.style.background = 'rgba(99,102,241,0.2)' }}
                onMouseLeave={e => e.currentTarget.style.background = D.indigoDim}
              >
                {review.loading
                  ? <svg style={{ animation: 'rvSpin 1s linear infinite' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  : <span style={{ fontSize: '13px' }}>✨</span>
                }
                {review.loading ? 'Generating...' : 'Reply with AI'}
              </button>
              <button onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: '' } : r))} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '12px', fontWeight: 500, padding: '8px 14px', borderRadius: '8px',
                border: `1px solid ${D.border2}`, color: D.text2, background: 'transparent',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = D.text }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = D.text2 }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Reply manually
              </button>
            </div>
          )}

          {/* Edit reply */}
          {review.replied && review.reply_text && !review.showManual && (
            <button onClick={() => setReviews(prev => prev.map(r => r.id === review.id ? { ...r, showManual: true, manualReply: r.reply_text } : r))} style={{
              fontSize: '11px', color: D.text3, background: 'none', border: 'none', cursor: 'pointer', padding: 0, transition: 'color 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = D.text2}
              onMouseLeave={e => e.currentTarget.style.color = D.text3}
            >Edit reply</button>
          )}
        </div>
      </div>
      <style>{`@keyframes rvSpin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

function FilterBtn({ value, current, onChange }) {
  const isActive = current === value
  return (
    <button onClick={() => onChange(value)} style={{
      fontSize: '11px', fontWeight: 500, padding: '5px 11px', borderRadius: '7px',
      background: isActive ? D.indigo : 'rgba(255,255,255,0.04)',
      color: isActive ? '#fff' : D.text2,
      border: `1px solid ${isActive ? D.indigo : D.border}`,
      cursor: 'pointer', transition: 'all 0.15s',
    }}>
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
    if (ok) { setNewReview({ author: '', rating: 5, text: '', platform: 'Google' }); setShowForm(false) }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px', fontSize: '13px',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${D.border2}`,
    color: D.text, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: D.text, letterSpacing: '-0.5px' }}>Reviews</h1>
          <p style={{ fontSize: '12px', color: D.text2, marginTop: '2px' }}>
            {reviews.filter(r => !r.replied).length} pending · {reviews.length} total
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '13px', fontWeight: 600, padding: '9px 16px', borderRadius: '10px',
          background: D.indigo, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add review
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '20px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600', color: D.text, marginBottom: '16px' }}>Add a new review</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Author name" value={newReview.author}
              onChange={e => setNewReview({ ...newReview, author: e.target.value })}
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = D.border2}
            />
            <textarea placeholder="Review text" value={newReview.text}
              onChange={e => setNewReview({ ...newReview, text: e.target.value })}
              style={{ ...inputStyle, height: '80px', resize: 'none' }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = D.border2}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={newReview.rating} onChange={e => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                style={{ ...inputStyle, width: 'auto' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
              </select>
              <select value={newReview.platform} onChange={e => setNewReview({ ...newReview, platform: e.target.value })}
                style={{ ...inputStyle, width: 'auto' }}>
                <option>Google</option><option>TripAdvisor</option><option>Facebook</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleAddReview} style={{ fontSize: '13px', fontWeight: 600, padding: '9px 16px', borderRadius: '10px', background: D.indigo, color: '#fff', border: 'none', cursor: 'pointer' }}>
                Save review
              </button>
              <button onClick={() => setShowForm(false)} style={{ fontSize: '13px', padding: '9px 16px', borderRadius: '10px', background: 'transparent', color: D.text2, border: `1px solid ${D.border2}`, cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '14px 16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {[
            { label: 'Platform', values: ['All', 'Google', 'TripAdvisor', 'Facebook'], state: filterPlatform, setter: setFilterPlatform },
            { label: 'Rating', values: ['All', '1', '2', '3', '4', '5'], state: filterRating, setter: setFilterRating },
            { label: 'Status', values: ['All', 'Pending', 'Replied'], state: filterStatus, setter: setFilterStatus },
          ].map(({ label, values, state, setter }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: D.text3, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {values.map(v => <FilterBtn key={v} value={v} current={state} onChange={setter} />)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* List header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '0 4px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: '600', color: D.text2 }}>All reviews</h2>
        <span style={{ fontSize: '11px', color: D.text3 }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: '24px', height: '24px', border: `2px solid rgba(99,102,241,0.2)`, borderTopColor: D.indigo, borderRadius: '50%', animation: 'rvSpin 0.8s linear infinite' }}/>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '64px 24px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: D.indigoDim, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <p style={{ fontSize: '14px', fontWeight: '600', color: D.text, marginBottom: '6px' }}>
            {reviews.length === 0 ? 'No reviews yet' : 'No reviews match your filters'}
          </p>
          <p style={{ fontSize: '13px', color: D.text2 }}>
            {reviews.length === 0 ? 'Add your first review to get started' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map(review => (
            <ReviewCard key={review.id} review={review} generateReply={generateReply} setReviews={setReviews} />
          ))}
        </div>
      )}
    </>
  )
}

export default Reviews
