import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const PLATFORMS = [
  { id: 'Google', label: 'Google', color: '#4285F4', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  )},
  { id: 'TripAdvisor', label: 'TripAdvisor', color: '#00aa6c', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#00aa6c"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="12" r="2" fill="white"/><path d="M3 8c2-3 4-4 9-4s7 1 9 4" fill="none" stroke="#00aa6c" strokeWidth="1.5"/></svg>
  )},
  { id: 'Facebook', label: 'Facebook', color: '#1877f2', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { id: 'Booking.com', label: 'Booking.com', color: '#003580', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#003580"><rect x="2" y="4" width="20" height="16" rx="3"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">B.</text></svg>
  )},
]

const STEPS = ['Welcome', 'Your business', 'First reply', 'Ready']

function StepIndicator({ current }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
      {STEPS.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: i < current ? '20px' : i === current ? '28px' : '20px',
            height: '6px', borderRadius: '3px',
            backgroundColor: i < current ? '#6366f1' : i === current ? '#6366f1' : 'rgba(99,102,241,0.15)',
            transition: 'all 0.4s ease',
            opacity: i < current ? 0.5 : 1,
          }}/>
        </div>
      ))}
    </div>
  )
}

function Step1({ onNext }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease', textAlign: 'center' }}>
      {/* Icône animée */}
      <div style={{
        width: '72px', height: '72px', borderRadius: '20px', margin: '0 auto 24px',
        backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'popIn 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both'
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>

      <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px', marginBottom: '10px' }}>
        Welcome to Replio 🎉
      </h1>
      <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '360px', margin: '0 auto 32px' }}>
        In the next 2 minutes, you'll set up your account and generate your first AI-powered reply.
      </p>

      {/* 3 promesses */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '320px', margin: '0 auto 36px', textAlign: 'left' }}>
        {[
          { icon: '⚡', text: 'Reply to any review in under 30 seconds' },
          { icon: '📈', text: 'Boost your Google rating automatically' },
          { icon: '🤖', text: 'AI trained on your business tone' },
        ].map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 16px', borderRadius: '12px',
            backgroundColor: '#f8fafc', border: '1px solid #f1f5f9',
            animation: `slideIn 0.5s ease ${0.3 + i * 0.1}s both`
          }}>
            <span style={{ fontSize: '18px' }}>{p.icon}</span>
            <span style={{ fontSize: '13px', color: '#374151' }}>{p.text}</span>
          </div>
        ))}
      </div>

      <button onClick={onNext}
        style={{
          backgroundColor: '#6366f1', color: 'white', border: 'none',
          padding: '13px 32px', borderRadius: '12px', fontSize: '15px',
          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          width: '100%', maxWidth: '320px'
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        Let's get started →
      </button>
    </div>
  )
}

function Step2({ onNext, businessName, setBusinessName, platform, setPlatform }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const canContinue = businessName.trim().length > 0 && platform

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', letterSpacing: '-0.4px', marginBottom: '6px' }}>
        Tell us about your business
      </h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '28px' }}>
        This helps Replio personalize your AI replies.
      </p>

      {/* Business name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
          Business name
        </label>
        <input
          type="text"
          placeholder="e.g. Le Petit Bistro"
          value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canContinue && onNext()}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
            border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white',
            boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s'
          }}
          onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
          onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
          autoFocus
        />
      </div>

      {/* Platform */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '10px' }}>
          Primary review platform
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '11px 14px', borderRadius: '10px', cursor: 'pointer',
                border: platform === p.id ? `2px solid ${p.color}` : '1px solid #e5e7eb',
                backgroundColor: platform === p.id ? `${p.color}08` : 'white',
                transition: 'all 0.15s', outline: 'none', fontSize: '13px',
                fontWeight: platform === p.id ? 600 : 400,
                color: platform === p.id ? p.color : '#374151',
              }}
            >
              {p.icon}
              {p.label}
              {platform === p.id && (
                <svg style={{ marginLeft: 'auto' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={p.color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onNext} disabled={!canContinue}
        style={{
          backgroundColor: canContinue ? '#6366f1' : '#e5e7eb',
          color: canContinue ? 'white' : '#94a3b8', border: 'none',
          padding: '13px 32px', borderRadius: '12px', fontSize: '15px',
          fontWeight: 600, cursor: canContinue ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s', width: '100%'
        }}
        onMouseEnter={e => { if (canContinue) e.currentTarget.style.backgroundColor = '#4f46e5' }}
        onMouseLeave={e => { if (canContinue) e.currentTarget.style.backgroundColor = '#6366f1' }}
      >
        Continue →
      </button>
    </div>
  )
}

function Step3({ onNext, businessName, platform }) {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | generating | done
  const [reply, setReply] = useState('')
  const [typedReply, setTypedReply] = useState('')
  const [visible, setVisible] = useState(false)
  const typingRef = useRef(null)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  const canGenerate = reviewText.trim().length > 10 && rating > 0

  const generate = async () => {
    setPhase('generating')
    try {
      const { data, error } = await supabase.functions.invoke('generate-reply', {
        body: { reviewText, rating, authorName: 'a customer', businessName }
      })
      if (error) throw error
      const fullReply = data.reply
      setReply(fullReply)
      setPhase('typing')
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTypedReply(fullReply.slice(0, i))
        if (i >= fullReply.length) {
          clearInterval(typingRef.current)
          setPhase('done')
        }
      }, 18)
    } catch {
      setPhase('idle')
    }
  }

  useEffect(() => () => clearInterval(typingRef.current), [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', letterSpacing: '-0.4px', marginBottom: '6px' }}>
        Try your first AI reply
      </h2>
      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
        Paste a real review from your {platform} page and watch the magic.
      </p>

      {phase === 'idle' || phase === 'generating' ? (
        <>
          {/* Stars */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Rating</label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[1,2,3,4,5].map(i => (
                <button key={i}
                  onClick={() => setRating(i)}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.1s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={(hoverRating || rating) >= i ? '#f59e0b' : '#e5e7eb'} style={{ transition: 'fill 0.1s' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Review text */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
              Review text
            </label>
            <textarea
              placeholder="Paste or type a customer review here..."
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '13px',
                border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white',
                boxSizing: 'border-box', outline: 'none', resize: 'none', lineHeight: '1.6',
                fontFamily: 'inherit', transition: 'border 0.2s'
              }}
              onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
              onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
            />
          </div>

          <button onClick={generate} disabled={!canGenerate || phase === 'generating'}
            style={{
              backgroundColor: canGenerate ? '#6366f1' : '#e5e7eb',
              color: canGenerate ? 'white' : '#94a3b8', border: 'none',
              padding: '13px 32px', borderRadius: '12px', fontSize: '15px',
              fontWeight: 600, cursor: canGenerate ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s', width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {phase === 'generating' ? (
              <>
                <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                Replio AI is writing...
              </>
            ) : '✨ Generate AI reply'}
          </button>
        </>
      ) : (
        <div>
          {/* Review recap */}
          <div style={{ padding: '14px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= rating ? '#f59e0b' : '#e5e7eb'}>
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>{reviewText}</p>
          </div>

          {/* AI Reply */}
          <div style={{
            padding: '16px', borderRadius: '12px', marginBottom: '20px',
            backgroundColor: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '5px', backgroundColor: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/></svg>
              </div>
              <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 600 }}>AI Reply for {businessName}</span>
              {phase === 'typing' && <div style={{ width: '1.5px', height: '12px', backgroundColor: '#6366f1', animation: 'blink 0.8s step-end infinite' }}/>}
              {phase === 'done' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#22c55e' }}>✓ Ready to use</span>}
            </div>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: '1.7', margin: 0 }}>{typedReply}</p>
          </div>

          {phase === 'done' && (
            <button onClick={onNext}
              style={{
                backgroundColor: '#6366f1', color: 'white', border: 'none',
                padding: '13px 32px', borderRadius: '12px', fontSize: '15px',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                animation: 'popIn 0.5s cubic-bezier(0.16,1,0.3,1)'
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Go to my dashboard →
            </button>
          )}
        </div>
      )}

      {(phase === 'idle' || phase === 'generating') && (
        <button onClick={onNext}
          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', marginTop: '12px', width: '100%' }}
        >
          Skip for now
        </button>
      )}
    </div>
  )
}

function Step4() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease', textAlign: 'center' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 24px',
        background: 'linear-gradient(135deg, #6366f1, #818cf8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        animation: 'popIn 0.6s cubic-bezier(0.16,1,0.3,1)'
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      <h2 style={{ fontSize: '26px', fontWeight: 700, color: '#111827', letterSpacing: '-0.5px', marginBottom: '10px' }}>
        You're all set! 🚀
      </h2>
      <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', maxWidth: '340px', margin: '0 auto 32px' }}>
        Replio is ready to help you manage your reputation and reply to every review in seconds.
      </p>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto 32px', textAlign: 'left' }}>
        {[
          { text: 'Account created', done: true },
          { text: 'Business configured', done: true },
          { text: 'First AI reply generated', done: true },
          { text: 'Connect Google Business', done: false, soon: true },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', backgroundColor: item.done ? '#f0fdf4' : '#f8fafc', border: `1px solid ${item.done ? '#bbf7d0' : '#f1f5f9'}`, animation: `slideIn 0.4s ease ${i * 0.08}s both` }}>
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: item.done ? '#22c55e' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.done
                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="12" cy="12" r="8"/></svg>
              }
            </div>
            <span style={{ fontSize: '13px', color: item.done ? '#166534' : '#94a3b8' }}>{item.text}</span>
            {item.soon && <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#94a3b8', backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>Soon</span>}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/dashboard', { replace: true })}
        style={{
          backgroundColor: '#6366f1', color: 'white', border: 'none',
          padding: '14px 32px', borderRadius: '12px', fontSize: '15px',
          fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          width: '100%', maxWidth: '300px'
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        Open my dashboard →
      </button>
    </div>
  )
}

function Onboarding() {
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [platform, setPlatform] = useState('')
  const [leaving, setLeaving] = useState(false)
  const navigate = useNavigate()

  const goNext = () => {
    setLeaving(true)
    setTimeout(() => {
      setLeaving(false)
      setStep(s => s + 1)
    }, 250)
  }

  // Sauvegarde dans localStorage pour la checklist dashboard
  useEffect(() => {
    if (step === 3) {
      localStorage.setItem('replio_onboarded', '1')
      if (businessName) localStorage.setItem('replio_business_name', businessName)
      if (platform) localStorage.setItem('replio_platform', platform)
    }
  }, [step])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Déco background */}
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', bottom: '-150px', left: '-150px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)', pointerEvents: 'none' }}/>

      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: step === 0 ? 'center' : 'flex-start' }}>
          <img src="/replio-logo-wordmark.svg" alt="Replio" style={{ height: '28px' }} />
        </div>

        {/* Step indicator */}
        {step > 0 && <StepIndicator current={step} />}

        {/* Steps */}
        <div style={{ opacity: leaving ? 0 : 1, transform: leaving ? 'translateY(-8px)' : 'translateY(0)', transition: 'all 0.25s ease' }}>
          {step === 0 && <Step1 onNext={goNext} />}
          {step === 1 && <Step2 onNext={goNext} businessName={businessName} setBusinessName={setBusinessName} platform={platform} setPlatform={setPlatform} />}
          {step === 2 && <Step3 onNext={goNext} businessName={businessName} platform={platform} />}
          {step === 3 && <Step4 />}
        </div>
      </div>

      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  )
}

export default Onboarding
