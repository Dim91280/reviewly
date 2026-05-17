import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const REVIEWS = [
  {
    id: 1, author: 'Thomas M.', platform: 'Google', rating: 3, initials: 'TM',
    avatarBg: 'linear-gradient(135deg,#6366F1,#818CF8)',
    text: "Decent place but the wait was too long and staff seemed overwhelmed during peak hours.",
    reply: "Hi Thomas, thank you for your honest feedback. We're actively working on our staffing during peak hours. We'd love to welcome you back for a better experience!",
  },
  {
    id: 2, author: 'Sophie L.', platform: 'Google', rating: 5, initials: 'SL',
    avatarBg: 'linear-gradient(135deg,#22D3EE,#0EA5E9)',
    text: "Absolutely amazing experience! The food was outstanding and service was impeccable.",
    reply: "Sophie, thank you so much for these kind words! It means the world to our team. We look forward to seeing you again very soon!",
  },
  {
    id: 3, author: 'Marc D.', platform: 'Google', rating: 2, initials: 'MD',
    avatarBg: 'linear-gradient(135deg,#F97316,#F59E0B)',
    text: "Disappointed with our visit. The reservation was lost and we waited 40 minutes.",
    reply: "Marc, we sincerely apologize for this experience. This is not our standard. Please contact us directly so we can make it right for you.",
  },
]

const FEED_EVENTS = [
  { icon: '⭐', text: 'New 5★ review replied in 23s', color: '#F59E0B', delay: 0 },
  { icon: '📈', text: 'Rating updated · +0.1 pts', color: '#10B981', delay: 2200 },
  { icon: '⭐', text: 'New 4★ review replied in 41s', color: '#F59E0B', delay: 4400 },
  { icon: '🏆', text: 'Top rated this week in Lyon', color: '#818CF8', delay: 6600 },
  { icon: '📈', text: 'Rating updated · +0.2 pts', color: '#10B981', delay: 8800 },
]

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i <= rating ? '#F59E0B' : 'rgba(255,255,255,0.1)'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  )
}

function RatingMeter({ mounted }) {
  const [rating, setRating] = useState(3.8)
  const [feedItems, setFeedItems] = useState([])
  const [pulse, setPulse] = useState(false)
  const targetRating = 4.7
  const ratingRef = useRef(3.8)

  useEffect(() => {
    if (!mounted) return
    const interval = setInterval(() => {
      if (ratingRef.current < targetRating) {
        ratingRef.current = Math.min(targetRating, +(ratingRef.current + 0.01).toFixed(2))
        setRating(ratingRef.current)
        if (Math.abs(ratingRef.current % 0.1) < 0.015) { setPulse(true); setTimeout(() => setPulse(false), 600) }
      }
    }, 120)
    return () => clearInterval(interval)
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    FEED_EVENTS.forEach(ev => {
      setTimeout(() => {
        setFeedItems(prev => [{ ...ev, id: Date.now() + ev.delay }, ...prev].slice(0, 3))
      }, ev.delay)
    })
  }, [mounted])

  const pct = Math.min(1, (rating - 3.8) / (targetRating - 3.8))
  const radius = 52, circumference = Math.PI * radius
  const strokeDash = circumference * pct
  const cx = 70, cy = 70

  return (
    <div style={{ borderRadius: '14px', padding: '16px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Google rating · Le Petit Bistro</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <span style={{ fontSize: '10px', color: '#334155' }}>Before</span>
            <span style={{ fontSize: '10px', color: '#475569' }}>3.8★</span>
            <span style={{ fontSize: '10px', color: '#475569' }}>→</span>
            <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600 }}>Now {rating.toFixed(1)}★</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', animation: 'authPulse 2s infinite' }}/>
          <span style={{ fontSize: '9px', color: '#10B981' }}>Live</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
        <div style={{ position: 'relative', width: '140px', height: '80px', flexShrink: 0 }}>
          <svg width="140" height="85" viewBox="0 0 140 90" style={{ overflow: 'visible' }}>
            <path d={`M ${cx-radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx+radius} ${cy}`} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round"/>
            <path d={`M ${cx-radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx+radius} ${cy}`} fill="none" stroke="url(#rg)" strokeWidth="10" strokeLinecap="round" strokeDasharray={`${strokeDash} ${circumference}`} style={{ transition: 'stroke-dasharray 0.3s ease' }}/>
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F59E0B"/><stop offset="100%" stopColor="#6366F1"/>
              </linearGradient>
            </defs>
            {[0,0.25,0.5,0.75,1].map((t, i) => {
              const angle = Math.PI * (1-t)
              return <line key={i} x1={cx+(radius-14)*Math.cos(angle)} y1={cy-(radius-14)*Math.sin(angle)} x2={cx+(radius-8)*Math.cos(angle)} y2={cy-(radius-8)*Math.sin(angle)} stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
            })}
            <text x={cx-radius-4} y={cy+14} fontSize="9" fill="#334155" textAnchor="middle">3.8</text>
            <text x={cx+radius+4} y={cy+14} fontSize="9" fill="#334155" textAnchor="middle">5.0</text>
            <text x={cx} y={cy-6} fontSize="22" fontWeight="700" fill={pulse ? '#818CF8' : '#F1F5F9'} textAnchor="middle" style={{ transition: 'fill 0.3s ease' }}>{rating.toFixed(1)}</text>
            <text x={cx} y={cy+8} fontSize="9" fill="#475569" textAnchor="middle">/ 5.0</text>
          </svg>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px', minHeight: '72px', justifyContent: 'center' }}>
          {feedItems.length === 0 && <p style={{ fontSize: '10px', color: '#1E293B', margin: 0 }}>Starting up...</p>}
          {feedItems.map((ev, i) => (
            <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: i === 0 ? 1 : i === 1 ? 0.5 : 0.25, animation: i === 0 ? 'authSlideIn 0.4s ease' : 'none' }}>
              <span style={{ fontSize: '11px' }}>{ev.icon}</span>
              <span style={{ fontSize: '10px', color: i === 0 ? ev.color : '#334155' }}>{ev.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function LiveDemo({ mounted }) {
  const [phase, setPhase] = useState('idle')
  const [reviewIndex, setReviewIndex] = useState(0)
  const [typedReply, setTypedReply] = useState('')
  const [repliedCount, setRepliedCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const typingRef = useRef(null)
  const cycleRef = useRef(null)
  const review = REVIEWS[reviewIndex % REVIEWS.length]

  const runCycle = (idx) => {
    const r = REVIEWS[idx % REVIEWS.length]
    setVisible(false); setTypedReply(''); setPhase('idle')
    setTimeout(() => { setVisible(true); setPhase('incoming') }, 300)
    setTimeout(() => setPhase('thinking'), 2400)
    setTimeout(() => {
      setPhase('typing'); let i = 0
      typingRef.current = setInterval(() => {
        i++; setTypedReply(r.reply.slice(0, i))
        if (i >= r.reply.length) { clearInterval(typingRef.current); setTimeout(() => { setPhase('done'); setRepliedCount(c => c+1) }, 400) }
      }, 20)
    }, 4200)
  }

  useEffect(() => { if (!mounted) return; const t = setTimeout(() => runCycle(0), 800); return () => clearTimeout(t) }, [mounted])
  useEffect(() => {
    if (phase === 'done') { cycleRef.current = setTimeout(() => { const next = (reviewIndex+1)%REVIEWS.length; setReviewIndex(next); runCycle(next) }, 1800) }
    return () => clearTimeout(cycleRef.current)
  }, [phase])
  useEffect(() => () => { clearInterval(typingRef.current); clearTimeout(cycleRef.current) }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <RatingMeter mounted={mounted} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', color: '#475569', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live preview</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', animation: 'authPulse 2s infinite' }}/>
          <span style={{ fontSize: '10px', color: '#10B981' }}>AI active</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[
          { label: 'Pending', value: Math.max(0, 3-repliedCount), color: '#F59E0B' },
          { label: 'Replied', value: repliedCount, color: '#10B981' },
          { label: 'Avg rating', value: '4.6★', color: '#818CF8' },
        ].map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '8px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '1px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.99)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
        <div style={{ padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: review.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>{review.initials}</div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: '#E2E8F0' }}>{review.author}</div>
                <div style={{ fontSize: '10px', color: '#475569' }}>{review.platform}</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Stars rating={review.rating} />
              {phase === 'incoming' && <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>New</span>}
              {phase === 'done' && <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>Replied ✓</span>}
            </div>
          </div>
          <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>{review.text}</p>
        </div>
        <div style={{ padding: '10px 14px', minHeight: '56px' }}>
          {phase === 'idle' && <span style={{ fontSize: '10px', color: '#334155' }}>Waiting for new reviews...</span>}
          {phase === 'thinking' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#818CF8' }}>Replios AI is analyzing...</span>
              <div style={{ display: 'flex', gap: '3px', marginLeft: 'auto' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#6366F1', animation: `authBounce 1s ease-in-out ${i*0.15}s infinite` }}/>)}
              </div>
            </div>
          )}
          {(phase === 'typing' || phase === 'done') && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: '#818CF8', fontWeight: 500 }}>✨ AI Reply</span>
                {phase === 'typing' && <div style={{ width: '1.5px', height: '11px', background: '#6366F1', animation: 'authBlink 0.8s step-end infinite' }}/>}
                {phase === 'done' && <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#10B981' }}>✓ Ready to send</span>}
              </div>
              <p style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>{typedReply}</p>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
        {REVIEWS.map((_, i) => (
          <div key={i} style={{ width: i === reviewIndex%REVIEWS.length ? '14px' : '5px', height: '5px', borderRadius: '3px', background: i === reviewIndex%REVIEWS.length ? '#6366F1' : 'rgba(99,102,241,0.2)', transition: 'all 0.4s ease' }}/>
        ))}
      </div>
    </div>
  )
}

function LeftPanel({ mounted }) {
  return (
    <div style={{ display: 'none', flexDirection: 'column', width: '50%', padding: '40px', position: 'relative', overflow: 'hidden', background: '#080C14', borderRight: '1px solid rgba(255,255,255,0.06)' }} className="auth-left-panel">
      <div style={{ position: 'absolute', top: '-150px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-12px)', transition: 'all 0.6s ease', marginBottom: '32px', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900', color: '#fff' }}>R</div>
        <span style={{ fontSize: '17px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>Replios</span>
      </div>
      <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.7s ease 0.1s', position: 'relative', zIndex: 1, marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-1px', lineHeight: '1.2', color: '#F1F5F9', marginBottom: '8px' }}>
          Watch Replios work<br />
          <span style={{ background: 'linear-gradient(135deg, #818CF8, #22D3EE)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>in real time.</span>
        </h2>
        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6' }}>Every review, answered instantly. Your rating, climbing automatically.</p>
      </div>
      <div style={{ flex: 1, opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.7s ease 0.2s', position: 'relative', zIndex: 1, overflowY: 'auto' }}>
        <LiveDemo mounted={mounted} />
      </div>
      <p style={{ fontSize: '11px', color: '#1E293B', position: 'relative', zIndex: 1, marginTop: '12px' }}>© 2026 Replios</p>
    </div>
  )
}

function FormPanel({ children }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#05080F', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <div style={{ position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 65%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '380px' }}>{children}</div>
    </div>
  )
}

function InputField({ label, type, placeholder, value, onChange, onKeyDown }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '6px' }}>{label}</label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={onChange} onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px', fontSize: '14px', borderRadius: '10px', outline: 'none',
          background: focused ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.1)'}`,
          color: '#F1F5F9', transition: 'all 0.2s', boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function Auth({ onBack }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [phase, setPhase] = useState('form')
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendSuccess, setResendSuccess] = useState(false)
  const otpInputRef = useRef(null)

  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])
  useEffect(() => { if (phase === 'otp') setTimeout(() => otpInputRef.current?.focus(), 100) }, [phase])

  const handleForgotPassword = async () => {
    if (!email) { setMessage('Enter your email above first'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://replios.com/reset-password' })
    if (error) setMessage(error.message)
    else { setForgotSent(true); setMessage('Reset link sent — check your inbox!') }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: 'https://replios.com' } })
    if (error) setMessage(error.message)
  }

  const handleSubmit = async () => {
    setLoading(true); setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      // Ignorer l'erreur JSON/text-plain du SMTP custom — l'email OTP est envoyé quand même
      if (error && !error.message?.includes('Invalid JSON') && !error.message?.includes('text/plain')) {
        setMessage(error.message)
      } else {
        setPhase('otp')
      }
    }
    setLoading(false)
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) { setOtpError('Enter the 6-digit code'); return }
    setLoading(true); setOtpError('')
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' })
    if (error) setOtpError('Invalid or expired code. Please try again.')
    else navigate('/onboarding')
    setLoading(false)
  }

  const handleResendOtp = async () => {
    setLoading(true); setOtpError(''); setResendSuccess(false)
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) setOtpError(error.message)
    else setResendSuccess(true)
    setLoading(false)
  }

  const switchMode = () => { setIsLogin(!isLogin); setMessage(''); setPhase('form') }

  const btnStyle = {
    width: '100%', padding: '12px', fontSize: '14px', fontWeight: '700',
    color: '#fff', background: '#6366F1', border: 'none', borderRadius: '10px',
    cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  }

  const fadeIn = { opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease 0.1s' }

  // ── OTP screen ──────────────────────────────────────────────
  if (phase === 'otp') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', background: '#05080F' }}>
        <LeftPanel mounted={mounted} />
        <FormPanel>
          <div style={fadeIn}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px' }} className="auth-mobile-logo">
              <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: '#fff' }}>R</div>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>Replios</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/></svg>
              </div>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: '8px' }}>Check your email</h1>
            <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', marginBottom: '4px' }}>We sent a 6-digit code to</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: '#94A3B8', textAlign: 'center', marginBottom: '32px' }}>{email}</p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#64748B', marginBottom: '8px' }}>Verification code</label>
              <input
                ref={otpInputRef}
                type="text" inputMode="numeric" maxLength={6}
                placeholder="000000" value={otp}
                onChange={e => { const v = e.target.value.replace(/\D/g,'').slice(0,6); setOtp(v); setOtpError('') }}
                onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                style={{
                  width: '100%', padding: '14px', textAlign: 'center', fontSize: '28px', fontWeight: '800', letterSpacing: '0.3em',
                  borderRadius: '12px', outline: 'none', boxSizing: 'border-box',
                  background: 'rgba(99,102,241,0.06)', border: `1px solid ${otpError ? '#EF4444' : 'rgba(99,102,241,0.3)'}`,
                  color: '#F1F5F9', transition: 'all 0.2s',
                }}
              />
              {otpError && <p style={{ fontSize: '12px', color: '#F87171', marginTop: '6px' }}>{otpError}</p>}
              {resendSuccess && !otpError && <p style={{ fontSize: '12px', color: '#10B981', marginTop: '6px' }}>✓ New code sent!</p>}
            </div>
            <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} style={{ ...btnStyle, opacity: (loading || otp.length !== 6) ? 0.5 : 1 }}
              onMouseEnter={e => { if (!loading && otp.length === 6) { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.35)' }}}
              onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.boxShadow = 'none' }}
            >{loading ? 'Verifying...' : 'Verify →'}</button>
            <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginTop: '20px' }}>
              Didn't receive it?{' '}
              <button onClick={handleResendOtp} disabled={loading} style={{ color: '#818CF8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Resend code</button>
            </p>
            <p style={{ textAlign: 'center', marginTop: '16px' }}>
              <button onClick={() => { setPhase('form'); setOtp(''); setOtpError(''); setResendSuccess(false) }}
                style={{ fontSize: '12px', color: '#334155', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
                onMouseLeave={e => e.currentTarget.style.color = '#334155'}
              >← Back</button>
            </p>
          </div>
        </FormPanel>
        <style>{`
          @keyframes authPulse{0%,100%{opacity:1}50%{opacity:0.3}}
          @keyframes authBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
          @keyframes authBlink{0%,100%{opacity:1}50%{opacity:0}}
          @keyframes authSlideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
          @media(min-width:768px){.auth-left-panel{display:flex!important}.auth-mobile-logo{display:none!important}}
        `}</style>
      </div>
    )
  }

  // ── Form screen ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#05080F' }}>
      <LeftPanel mounted={mounted} />
      <FormPanel>
        <div style={fadeIn}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' }} className="auth-mobile-logo">
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '900', color: '#fff' }}>R</div>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#F1F5F9', letterSpacing: '-0.5px' }}>Replios</span>
          </div>

          {!isLogin && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px 4px 6px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', fontSize: '11px', color: '#818CF8', fontWeight: '500', marginBottom: '20px' }}>
              <span style={{ background: '#6366F1', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '100px' }}>Free</span>
              14-day trial — no credit card
            </div>
          )}

          <h1 style={{ fontSize: '26px', fontWeight: '900', color: '#F1F5F9', letterSpacing: '-1px', marginBottom: '6px' }}>
            {isLogin ? 'Welcome back' : 'Start for free'}
          </h1>
          <p style={{ fontSize: '14px', color: '#475569', marginBottom: '28px' }}>
            {isLogin ? 'Sign in to continue to your dashboard' : 'Create your account in seconds'}
          </p>

          <InputField label="Email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <InputField label="Password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />

          {isLogin && (
            <div style={{ textAlign: 'right', marginTop: '-8px', marginBottom: '16px' }}>
              <button onClick={handleForgotPassword} style={{ fontSize: '12px', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#818CF8'}
                onMouseLeave={e => e.currentTarget.style.color = '#475569'}
              >Forgot password?</button>
            </div>
          )}

          {message && (
            <div style={{ padding: '11px 14px', borderRadius: '10px', fontSize: '13px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', background: forgotSent ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.08)', color: forgotSent ? '#10B981' : '#818CF8', border: `1px solid ${forgotSent ? 'rgba(16,185,129,0.2)' : 'rgba(99,102,241,0.2)'}` }}>
              {forgotSent ? '✓' : 'ℹ'} {message}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading} style={{ ...btnStyle, marginBottom: '12px', opacity: loading ? 0.7 : 1 }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' }}}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
          >{loading ? 'Loading...' : isLogin ? 'Sign in →' : 'Create account →'}</button>

          <button onClick={handleGoogleLogin} style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: '500', color: '#94A3B8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s', marginBottom: '20px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#F1F5F9' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#94A3B8' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
            <span style={{ fontSize: '12px', color: '#334155' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' }}/>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={switchMode} style={{ color: '#818CF8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}
              onMouseEnter={e => e.currentTarget.style.color = '#6366F1'}
              onMouseLeave={e => e.currentTarget.style.color = '#818CF8'}
            >{isLogin ? 'Sign up free' : 'Sign in'}</button>
          </p>

          <p style={{ textAlign: 'center', marginBottom: '28px' }}>
            <button onClick={onBack} style={{ fontSize: '12px', color: '#334155', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#64748B'}
              onMouseLeave={e => e.currentTarget.style.color = '#334155'}
            >← Back to home</button>
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
            {['SSL secured', 'GDPR compliant', 'No card needed'].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#334155' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </div>
            ))}
          </div>
        </div>
      </FormPanel>

      <style>{`
        @keyframes authPulse{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes authBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        @keyframes authBlink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes authSlideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @media(min-width:768px){.auth-left-panel{display:flex!important}.auth-mobile-logo{display:none!important}}
      `}</style>
    </div>
  )
}

export default Auth
