import { useMemo } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

  return (
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
            <Link to="/reviews" className="text-xs font-medium px-3 py-1.5 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: '#ef4444', textDecoration: 'none' }}>
              View reviews →
            </Link>
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
  )
}

export default DashboardPage
