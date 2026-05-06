import { useMemo, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(false)
  const businessName = localStorage.getItem('replio_business_name')
  const platform = localStorage.getItem('replio_platform')

  const items = [
    { text: 'Account created', done: true },
    { text: businessName ? `${businessName} configured` : 'Business configured', done: !!businessName },
    { text: 'First AI reply generated', done: !!platform },
    { text: 'Connect Google Business', done: false, soon: true },
  ]

  const completedCount = items.filter(i => i.done).length
  const pct = Math.round((completedCount / items.length) * 100)
  const allDone = completedCount === items.filter(i => !i.soon).length

  if (dismissed || allDone) return null

  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '16px', border: '1px solid #f1f5f9',
      padding: '16px 20px', marginBottom: '20px',
      background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, white 60%)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0 }}>Getting started</p>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{completedCount}/{items.length} steps completed</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Progress bar */}
          <div style={{ width: '80px', height: '5px', borderRadius: '3px', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, backgroundColor: '#6366f1', borderRadius: '3px', transition: 'width 0.5s ease' }}/>
          </div>
          <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600 }}>{pct}%</span>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '5px 10px', borderRadius: '8px',
            backgroundColor: item.done ? '#f0fdf4' : '#f8fafc',
            border: `1px solid ${item.done ? '#bbf7d0' : '#f1f5f9'}`,
          }}>
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: item.done ? '#22c55e' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.done
                ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : null
              }
            </div>
            <span style={{ fontSize: '11px', color: item.done ? '#15803d' : '#94a3b8', whiteSpace: 'nowrap' }}>{item.text}</span>
            {item.soon && <span style={{ fontSize: '9px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '1px 5px', borderRadius: '4px' }}>Soon</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function DashboardPage() {
  const { reviews, pendingCount, subscription } = useOutletContext()

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

  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
      pct: reviews.length > 0 ? Math.round((reviews.filter(r => r.rating === star).length / reviews.length) * 100) : 0
    }))
  }, [reviews])

  const platformStats = useMemo(() => {
    return ['Google', 'TripAdvisor', 'Facebook'].map(p => {
      const pReviews = reviews.filter(r => r.platform === p)
      const avg = pReviews.length > 0 ? pReviews.reduce((sum, r) => sum + r.rating, 0) / pReviews.length : null
      return { platform: p, count: pReviews.length, avg }
    }).filter(p => p.count > 0)
  }, [reviews])

  const platformColors = { Google: '#4285F4', TripAdvisor: '#00aa6c', Facebook: '#1877f2' }
  const starColors = { 5: '#22c55e', 4: '#84cc16', 3: '#f59e0b', 2: '#f97316', 1: '#ef4444' }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div className="bg-white border rounded-lg px-3 py-2 shadow-sm text-xs" style={{ borderColor: '#e5e7eb' }}>
        <p className="font-medium text-gray-900">★ {d.avg?.toFixed(1)}</p>
        <p className="text-gray-400">{d.count} review{d.count !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <>
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Your reputation at a glance</p>
        </div>
        <OnboardingChecklist />
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: '#eef2ff' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h2>
          <p className="text-sm text-gray-400 max-w-xs mb-6">Add your first review to start tracking your reputation score and trends.</p>
          <Link to="/reviews" className="text-white text-sm font-medium px-5 py-2.5 rounded-xl" style={{ backgroundColor: '#6366f1', textDecoration: 'none' }}>
            Go to Reviews →
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">Your reputation at a glance</p>
      </div>

      <OnboardingChecklist />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {[
          {
            label: 'Reputation score',
            value: reputationScore !== null ? `${reputationScore}` : '—',
            suffix: reputationScore !== null ? '/100' : '',
            sub: reputationScore === null ? 'No reviews yet' : reputationScore >= 80 ? 'Excellent' : reputationScore >= 60 ? 'Good' : 'Needs improvement',
            subColor: reputationScore === null ? '#94a3b8' : reputationScore >= 80 ? '#22c55e' : reputationScore >= 60 ? '#f59e0b' : '#ef4444',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          },
          {
            label: 'Average rating',
            value: avgRating !== null ? avgRating.toFixed(1) : '—',
            suffix: avgRating !== null ? '/5' : '',
            sub: `Based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`,
            subColor: '#94a3b8',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 20.94l1.5 2.06 2-3 3 1-1-3 3-1.5-3-1.5 1-3-3 1-2-3-2 3-3-1 1 3-3 1.5 3 1.5-1 3 3-1z"/></svg>
          },
          {
            label: 'Response rate',
            value: responseRate !== null ? `${responseRate}%` : '—',
            suffix: '',
            sub: responseRate === null ? 'No reviews yet' : responseRate >= 80 ? 'Great job' : 'Reply to more reviews',
            subColor: responseRate === null ? '#94a3b8' : responseRate >= 80 ? '#22c55e' : '#f59e0b',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border" style={{ borderColor: '#f1f5f9' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-400">{stat.label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eef2ff' }}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
              {stat.suffix && <span className="text-sm font-normal text-gray-400">{stat.suffix}</span>}
            </p>
            <p className="text-xs" style={{ color: stat.subColor }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Graphique + répartition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
        <div className="md:col-span-2 bg-white rounded-2xl border p-5" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Rating trend</p>
              <p className="text-xs text-gray-400 mt-0.5">Weekly average</p>
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
              <p className="text-xs text-gray-400">Not enough data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
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

        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#f1f5f9' }}>
          <p className="text-sm font-semibold text-gray-900 mb-1">Rating breakdown</p>
          <p className="text-xs text-gray-400 mb-4">Distribution of all reviews</p>
          <div className="space-y-2.5">
            {ratingDistribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{star}★</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: starColors[star] }} />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats par plateforme */}
      {platformStats.length > 0 && (
        <div className="bg-white rounded-2xl border p-5 mb-5" style={{ borderColor: '#f1f5f9' }}>
          <p className="text-sm font-semibold text-gray-900 mb-1">By platform</p>
          <p className="text-xs text-gray-400 mb-4">Performance per review source</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {platformStats.map(({ platform, count, avg }) => (
              <div key={platform} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${platformColors[platform]}20` }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: platformColors[platform] }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{platform}</p>
                  <p className="text-xs text-gray-400">{count} review{count !== 1 ? 's' : ''} · {avg ? `★ ${avg.toFixed(1)}` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerte avis négatifs */}
      {negativeUnanswered.length > 0 ? (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#fee2e2' }}>
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
            <Link to="/reviews" className="text-xs font-medium px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#ef4444', textDecoration: 'none' }}>
              View reviews →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#f1f5f9' }}>
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
      )}
    </>
  )
}

export default DashboardPage
