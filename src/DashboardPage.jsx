import { useMemo, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const D = {
  bg: '#05080F',
  surface: '#0D1220',
  surface2: '#111827',
  border: 'rgba(255,255,255,0.07)',
  border2: 'rgba(255,255,255,0.12)',
  indigo: '#6366F1',
  indigoLight: '#818CF8',
  indigoDim: 'rgba(99,102,241,0.12)',
  cyan: '#22D3EE',
  text: '#F1F5F9',
  text2: '#64748B',
  text3: '#334155',
  green: '#10B981',
  yellow: '#F59E0B',
  red: '#EF4444',
}

const starColors = { 5: '#10B981', 4: '#22D3EE', 3: '#F59E0B', 2: '#F97316', 1: '#EF4444' }

function StatCard({ label, value, suffix, sub, subColor, icon }) {
  return (
    <div style={{
      background: D.surface, borderRadius: '14px',
      border: `1px solid ${D.border}`,
      padding: '20px', position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = D.border}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${D.indigo}, ${D.cyan})`, opacity: 0.6 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <p style={{ fontSize: '11px', color: D.text2, textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: '600' }}>{label}</p>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: D.indigoDim, border: `1px solid rgba(99,102,241,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <p style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1.5px', color: D.text, marginBottom: '4px', lineHeight: 1 }}>
        {value}
        {suffix && <span style={{ fontSize: '14px', fontWeight: '400', color: D.text2, marginLeft: '2px' }}>{suffix}</span>}
      </p>
      <p style={{ fontSize: '12px', color: subColor, fontWeight: '500' }}>{sub}</p>
    </div>
  )
}

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
      background: D.surface, borderRadius: '14px',
      border: `1px solid rgba(99,102,241,0.2)`,
      padding: '16px 20px', marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: D.text, margin: 0 }}>Getting started</p>
          <p style={{ fontSize: '11px', color: D.text2, margin: 0 }}>{completedCount}/{items.length} steps completed</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '80px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${D.indigo}, ${D.cyan})`, borderRadius: '2px', transition: 'width 0.5s ease' }}/>
          </div>
          <span style={{ fontSize: '11px', color: D.indigoLight, fontWeight: 600 }}>{pct}%</span>
          <button onClick={() => setDismissed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: D.text3, padding: '2px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 10px', borderRadius: '7px',
            background: item.done ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${item.done ? 'rgba(16,185,129,0.2)' : D.border}`,
          }}>
            <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: item.done ? D.green : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.done && <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
            </div>
            <span style={{ fontSize: '11px', color: item.done ? D.green : D.text2, whiteSpace: 'nowrap' }}>{item.text}</span>
            {item.soon && <span style={{ fontSize: '9px', color: D.text3, background: 'rgba(255,255,255,0.05)', padding: '1px 5px', borderRadius: '4px' }}>Soon</span>}
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

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    const d = payload[0].payload
    return (
      <div style={{ background: D.surface2, border: `1px solid ${D.border2}`, borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
        <p style={{ fontWeight: 600, color: D.text }}>★ {d.avg?.toFixed(1)}</p>
        <p style={{ color: D.text2 }}>{d.count} review{d.count !== 1 ? 's' : ''}</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: D.text, letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ fontSize: '12px', color: D.text2, marginTop: '2px' }}>Your reputation at a glance</p>
        </div>
        <OnboardingChecklist />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: D.indigoDim, border: `1px solid rgba(99,102,241,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="1.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: D.text, marginBottom: '8px', letterSpacing: '-0.5px' }}>No reviews yet</h2>
          <p style={{ fontSize: '14px', color: D.text2, maxWidth: '280px', marginBottom: '24px', lineHeight: '1.6' }}>Add your first review to start tracking your reputation score and trends.</p>
          <Link to="/reviews" style={{
            color: '#fff', fontSize: '14px', fontWeight: '600',
            padding: '10px 20px', borderRadius: '10px',
            background: D.indigo, textDecoration: 'none',
            transition: 'all 0.2s',
          }}>Go to Reviews →</Link>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '18px', fontWeight: '700', color: D.text, letterSpacing: '-0.5px' }}>Dashboard</h1>
          <p style={{ fontSize: '12px', color: D.text2, marginTop: '2px' }}>Your reputation at a glance</p>
        </div>
        {negativeUnanswered.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px' }}>
            <span style={{ fontSize: '13px' }}>⚡</span>
            <span style={{ fontSize: '12px', color: '#F87171', fontWeight: '600' }}>{negativeUnanswered.length} urgent</span>
          </div>
        )}
      </div>

      <OnboardingChecklist />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        <StatCard
          label="Reputation score"
          value={reputationScore !== null ? `${reputationScore}` : '—'}
          suffix={reputationScore !== null ? '/100' : ''}
          sub={reputationScore === null ? 'No reviews yet' : reputationScore >= 80 ? '↑ Excellent' : reputationScore >= 60 ? 'Good' : 'Needs improvement'}
          subColor={reputationScore === null ? D.text2 : reputationScore >= 80 ? D.green : reputationScore >= 60 ? D.yellow : D.red}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
        />
        <StatCard
          label="Average rating"
          value={avgRating !== null ? avgRating.toFixed(1) : '—'}
          suffix={avgRating !== null ? ' ★' : ''}
          sub={`Based on ${reviews.length} review${reviews.length !== 1 ? 's' : ''}`}
          subColor={D.text2}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M12 20.94l1.5 2.06 2-3 3 1-1-3 3-1.5-3-1.5 1-3-3 1-2-3-2 3-3-1 1 3-3 1.5 3 1.5-1 3 3-1z"/></svg>}
        />
        <StatCard
          label="Response rate"
          value={responseRate !== null ? `${responseRate}%` : '—'}
          suffix=""
          sub={responseRate === null ? 'No reviews yet' : responseRate >= 80 ? '↑ Great job' : 'Reply to more reviews'}
          subColor={responseRate === null ? D.text2 : responseRate >= 80 ? D.green : D.yellow}
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
        />
      </div>

      {/* Chart + Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '16px' }} className="dash-chart-grid">
        {/* Line chart */}
        <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: D.text }}>Rating trend</p>
              <p style={{ fontSize: '11px', color: D.text2, marginTop: '2px' }}>Weekly average</p>
            </div>
            {trendDelta !== null && (
              <span style={{
                fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '7px',
                background: trendDelta >= 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                color: trendDelta >= 0 ? D.green : D.red,
                border: `1px solid ${trendDelta >= 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}>
                {trendDelta >= 0 ? '+' : ''}{trendDelta} vs last week
              </span>
            )}
          </div>
          {weeklyData.length < 2 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '120px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
              <p style={{ fontSize: '12px', color: D.text3 }}>Not enough data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: D.text3 }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: D.text3 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99,102,241,0.2)', strokeWidth: 1 }} />
                <Line type="monotone" dataKey="avg" stroke={D.indigo} strokeWidth={2} dot={{ r: 3, fill: D.indigo, strokeWidth: 0 }} activeDot={{ r: 5, fill: D.indigoLight }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Rating breakdown */}
        <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: D.text, marginBottom: '4px' }}>Rating breakdown</p>
          <p style={{ fontSize: '11px', color: D.text2, marginBottom: '16px' }}>Distribution of all reviews</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ratingDistribution.map(({ star, count, pct }) => (
              <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', color: D.text2, width: '16px', flexShrink: 0 }}>{star}★</span>
                <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: starColors[star], borderRadius: '3px', transition: 'width 0.5s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: D.text3, width: '20px', textAlign: 'right', flexShrink: 0 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform stats */}
      {platformStats.length > 0 && (
        <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '20px', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: D.text, marginBottom: '4px' }}>By platform</p>
          <p style={{ fontSize: '11px', color: D.text2, marginBottom: '16px' }}>Performance per review source</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {platformStats.map(({ platform, count, avg }) => (
              <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${D.border}` }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: `${platformColors[platform]}18` }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: platformColors[platform] }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: '600', color: D.text }}>{platform}</p>
                  <p style={{ fontSize: '11px', color: D.text2 }}>{count} review{count !== 1 ? 's' : ''} · {avg ? `★ ${avg.toFixed(1)}` : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert */}
      {negativeUnanswered.length > 0 ? (
        <div style={{ background: 'rgba(239,68,68,0.06)', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.2)', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.red} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: '600', color: D.text }}>
                  {negativeUnanswered.length} negative review{negativeUnanswered.length > 1 ? 's' : ''} without a reply
                </p>
                <p style={{ fontSize: '11px', color: D.text2, marginTop: '2px' }}>Reviews rated 1–2 stars need your attention</p>
              </div>
            </div>
            <Link to="/reviews" style={{
              fontSize: '12px', fontWeight: '600', padding: '8px 14px', borderRadius: '8px',
              color: '#fff', background: D.red, textDecoration: 'none', flexShrink: 0,
              transition: 'all 0.2s',
            }}>View →</Link>
          </div>
        </div>
      ) : (
        <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.2)', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.green} strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: '600', color: D.text }}>All negative reviews have been addressed</p>
              <p style={{ fontSize: '11px', color: D.text2, marginTop: '2px' }}>Keep up the great work!</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media(min-width: 768px) {
          .dash-chart-grid { grid-template-columns: 2fr 1fr !important; }
        }
      `}</style>
    </>
  )
}

export default DashboardPage
