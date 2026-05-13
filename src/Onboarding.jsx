import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const PLATFORMS = [
  { id: 'Google', label: 'Google', color: '#4285F4', bg: 'rgba(66,133,244,0.1)', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  )},
  { id: 'TripAdvisor', label: 'TripAdvisor', color: '#00aa6c', bg: 'rgba(0,170,108,0.1)', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#00aa6c"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="12" r="2" fill="#0f172a"/><path d="M3 8c2-3 4-4 9-4s7 1 9 4" fill="none" stroke="#00aa6c" strokeWidth="1.5"/></svg>
  )},
  { id: 'Facebook', label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.1)', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { id: 'Booking.com', label: 'Booking.com', color: '#0055aa', bg: 'rgba(0,85,170,0.1)', icon: (
    <svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" fill="#003580"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">B.</text></svg>
  )},
]

const SECTORS = [
  { id: 'restaurant', label: 'Restaurant & Bar', icon: '🍽️' },
  { id: 'hotel', label: 'Hôtel & Hébergement', icon: '🏨' },
  { id: 'retail', label: 'Commerce & Boutique', icon: '🛍️' },
  { id: 'beauty', label: 'Beauté & Bien-être', icon: '💆' },
  { id: 'health', label: 'Santé & Médical', icon: '🏥' },
  { id: 'other', label: 'Autre', icon: '🏢' },
]

const TONES = [
  { id: 'professional', label: 'Professionnel', desc: 'Formel et soigné', icon: '👔' },
  { id: 'friendly', label: 'Chaleureux', desc: 'Humain et proche', icon: '😊' },
  { id: 'enthusiastic', label: 'Dynamique', desc: 'Énergique et positif', icon: '⚡' },
  { id: 'luxury', label: 'Premium', desc: 'Élégant et raffiné', icon: '✨' },
]

const FLOATERS = [
  { icon: '⭐', x: '8%', y: '15%', delay: 0, size: 22 },
  { icon: '💬', x: '88%', y: '12%', delay: 0.8, size: 20 },
  { icon: '⚡', x: '5%', y: '70%', delay: 1.4, size: 18 },
  { icon: '📈', x: '91%', y: '65%', delay: 0.4, size: 20 },
  { icon: '🤖', x: '15%', y: '88%', delay: 1.8, size: 18 },
  { icon: '✨', x: '82%', y: '85%', delay: 1.1, size: 16 },
  { icon: '⭐', x: '50%', y: '6%', delay: 0.6, size: 14 },
]

function FloatingIcons({ visible }) {
  return (
    <>
      {FLOATERS.map((f, i) => (
        <div key={i} style={{
          position: 'fixed', left: f.x, top: f.y,
          fontSize: f.size, pointerEvents: 'none', zIndex: 0,
          opacity: visible ? 0.25 : 0,
          animation: visible ? `float${i % 3} ${3 + i * 0.4}s ease-in-out ${f.delay}s infinite` : 'none',
          transition: 'opacity 1s ease',
          filter: 'blur(0.5px)',
        }}>{f.icon}</div>
      ))}
    </>
  )
}

function StepIndicator({ current }) {
  const labels = ['Welcome', 'Business', 'AI Setup', 'Try AI', 'Done']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
      {labels.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < labels.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: i < current ? '#6366f1' : i === current ? '#6366f1' : 'rgba(99,102,241,0.15)',
              border: i === current ? '2px solid rgba(99,102,241,0.4)' : '2px solid transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: i === current ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
              transition: 'all 0.4s ease', flexShrink: 0,
            }}>
              {i < current
                ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <span style={{ fontSize: '11px', fontWeight: 700, color: i === current ? 'white' : 'rgba(99,102,241,0.5)' }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: '9px', color: i <= current ? '#a5b4fc' : 'rgba(99,102,241,0.3)', fontWeight: 500, whiteSpace: 'nowrap', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</span>
          </div>
          {i < labels.length - 1 && (
            <div style={{ flex: 1, height: '2px', margin: '0 6px', marginBottom: '18px', borderRadius: '1px', backgroundColor: i < current ? '#6366f1' : 'rgba(99,102,241,0.15)', transition: 'background-color 0.5s ease' }}/>
          )}
        </div>
      ))}
    </div>
  )
}

function Step1({ onNext }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  const promises = [
    { icon: '⚡', text: 'Reply to any review in under 30 seconds', color: '#fbbf24' },
    { icon: '📈', text: 'Boost your Google rating automatically', color: '#34d399' },
    { icon: '🤖', text: 'AI trained on your business tone', color: '#818cf8' },
  ]

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '90px', height: '90px', margin: '0 auto 28px' }}>
        <div style={{ position: 'absolute', inset: '-12px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', animation: 'glowPulse 2s ease-in-out infinite' }}/>
        <div style={{ width: '90px', height: '90px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(129,140,248,0.1) 100%)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both', backdropFilter: 'blur(10px)' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
      <h1 style={{ fontSize: '30px', fontWeight: 800, color: 'white', letterSpacing: '-0.8px', marginBottom: '12px', animation: 'fadeUp 0.6s ease 0.2s both' }}>Welcome to Replio 🎉</h1>
      <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.7', maxWidth: '380px', margin: '0 auto 36px', animation: 'fadeUp 0.6s ease 0.3s both' }}>In the next 2 minutes, set up your account and generate your first AI reply.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '380px', margin: '0 auto 36px', textAlign: 'left' }}>
        {promises.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 18px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', animation: `fadeUp 0.5s ease ${0.4 + i * 0.1}s both` }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: `${p.color}15`, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '18px' }}>{p.icon}</span>
            </div>
            <span style={{ fontSize: '14px', color: '#cbd5e1', fontWeight: 400 }}>{p.text}</span>
          </div>
        ))}
      </div>
      <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white', border: 'none', padding: '15px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', maxWidth: '380px', letterSpacing: '-0.2px', boxShadow: '0 8px 32px rgba(99,102,241,0.35)', animation: 'fadeUp 0.5s ease 0.7s both' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.35)' }}>
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
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '6px' }}>Tell us about your business</h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>This helps Replio personalize your AI replies.</p>
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Business name</label>
        <input type="text" placeholder="e.g. Le Petit Bistro" value={businessName}
          onChange={e => setBusinessName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && canContinue && onNext()}
          style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '15px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
          autoFocus />
      </div>
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Primary review platform</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px', borderRadius: '12px', cursor: 'pointer', border: platform === p.id ? `1.5px solid ${p.color}` : '1px solid rgba(255,255,255,0.08)', backgroundColor: platform === p.id ? p.bg : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', outline: 'none', fontSize: '13px', fontWeight: platform === p.id ? 600 : 400, color: platform === p.id ? p.color : '#94a3b8', boxShadow: platform === p.id ? `0 4px 16px ${p.color}20` : 'none' }}
              onMouseEnter={e => { if (platform !== p.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
              onMouseLeave={e => { if (platform !== p.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}>
              {p.icon}{p.label}
              {platform === p.id && (
                <div style={{ marginLeft: 'auto', width: '18px', height: '18px', borderRadius: '50%', backgroundColor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <button onClick={onNext} disabled={!canContinue} style={{ background: canContinue ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : 'rgba(255,255,255,0.06)', color: canContinue ? 'white' : '#475569', border: 'none', padding: '15px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: canContinue ? 'pointer' : 'not-allowed', transition: 'all 0.2s', width: '100%', boxShadow: canContinue ? '0 8px 24px rgba(99,102,241,0.3)' : 'none' }}
        onMouseEnter={e => { if (canContinue) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.45)' } }}
        onMouseLeave={e => { if (canContinue) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' } }}>
        Continue →
      </button>
    </div>
  )
}

function Step2b({ onNext, sector, setSector, tone, setTone, avoidWords, setAvoidWords }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 80) }, [])
  const canContinue = sector && tone

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '6px' }}>Configurez votre IA</h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '28px' }}>Replio adapte chaque réponse à votre secteur et votre style.</p>

      {/* Secteur */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Secteur d'activité</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {SECTORS.map(s => (
            <button key={s.id} onClick={() => setSector(s.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', border: sector === s.id ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)', backgroundColor: sector === s.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', outline: 'none', fontSize: '13px', fontWeight: sector === s.id ? 600 : 400, color: sector === s.id ? '#a5b4fc' : '#94a3b8', boxShadow: sector === s.id ? '0 4px 16px rgba(99,102,241,0.2)' : 'none', textAlign: 'left' }}
              onMouseEnter={e => { if (sector !== s.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
              onMouseLeave={e => { if (sector !== s.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{s.icon}</span>
              <span>{s.label}</span>
              {sector === s.id && (
                <div style={{ marginLeft: 'auto', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ton */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Style de réponse</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {TONES.map(t => (
            <button key={t.id} onClick={() => setTone(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', cursor: 'pointer', border: tone === t.id ? '1.5px solid #6366f1' : '1px solid rgba(255,255,255,0.08)', backgroundColor: tone === t.id ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)', transition: 'all 0.2s', outline: 'none', textAlign: 'left' }}
              onMouseEnter={e => { if (tone !== t.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' } }}
              onMouseLeave={e => { if (tone !== t.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' } }}>
              <span style={{ fontSize: '18px', flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: '13px', fontWeight: tone === t.id ? 600 : 400, color: tone === t.id ? '#a5b4fc' : '#94a3b8' }}>{t.label}</div>
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '1px' }}>{t.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mots à éviter */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Mots à éviter <span style={{ color: '#475569', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optionnel)</span></label>
        <p style={{ fontSize: '12px', color: '#475569', marginBottom: '8px', marginTop: 0 }}>Ex : concurrent, réduction, promo</p>
        <input type="text" placeholder="Séparez les mots par des virgules..." value={avoidWords}
          onChange={e => setAvoidWords(e.target.value)}
          style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }} />
      </div>

      <button onClick={onNext} disabled={!canContinue} style={{ background: canContinue ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : 'rgba(255,255,255,0.06)', color: canContinue ? 'white' : '#475569', border: 'none', padding: '15px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: canContinue ? 'pointer' : 'not-allowed', transition: 'all 0.2s', width: '100%', boxShadow: canContinue ? '0 8px 24px rgba(99,102,241,0.3)' : 'none' }}
        onMouseEnter={e => { if (canContinue) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.45)' } }}
        onMouseLeave={e => { if (canContinue) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.3)' } }}>
        Continuer →
      </button>
    </div>
  )
}

function Step3({ onNext, businessName, platform }) {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [phase, setPhase] = useState('idle')
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
      setPhase('typing')
      let i = 0
      typingRef.current = setInterval(() => {
        i++
        setTypedReply(fullReply.slice(0, i))
        if (i >= fullReply.length) { clearInterval(typingRef.current); setPhase('done') }
      }, 18)
    } catch { setPhase('idle') }
  }

  useEffect(() => () => clearInterval(typingRef.current), [])

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', letterSpacing: '-0.5px', marginBottom: '6px' }}>Try your first AI reply</h2>
      <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>Paste a real review from your {platform} page and watch the magic. ✨</p>
      {phase === 'idle' || phase === 'generating' ? (
        <>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Rating</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1,2,3,4,5].map(i => (
                <button key={i} onClick={() => setRating(i)} onMouseEnter={() => setHoverRating(i)} onMouseLeave={() => setHoverRating(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', transition: 'transform 0.15s' }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1.1)'}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={(hoverRating || rating) >= i ? '#f59e0b' : 'rgba(255,255,255,0.1)'} style={{ transition: 'fill 0.15s', filter: (hoverRating || rating) >= i ? 'drop-shadow(0 0 6px rgba(245,158,11,0.5))' : 'none' }}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Review text</label>
            <textarea placeholder="Paste or type a customer review here..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={4}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.1)', color: 'white', backgroundColor: 'rgba(255,255,255,0.05)', boxSizing: 'border-box', outline: 'none', resize: 'none', lineHeight: '1.6', fontFamily: 'inherit', transition: 'all 0.2s', backdropFilter: 'blur(10px)' }}
              onFocus={e => { e.currentTarget.style.border = '1px solid rgba(99,102,241,0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
              onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none' }} />
          </div>
          <button onClick={generate} disabled={!canGenerate || phase === 'generating'} style={{ background: canGenerate ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' : 'rgba(255,255,255,0.06)', color: canGenerate ? 'white' : '#475569', border: 'none', padding: '15px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: canGenerate ? 'pointer' : 'not-allowed', transition: 'all 0.2s', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: canGenerate ? '0 8px 24px rgba(99,102,241,0.3)' : 'none' }}>
            {phase === 'generating' ? (<><svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Replio AI is writing...</>) : <><span>✨</span> Generate AI reply</>}
          </button>
        </>
      ) : (
        <div>
          <div style={{ padding: '14px 16px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
              {[1,2,3,4,5].map(i => (<svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i <= rating ? '#f59e0b' : 'rgba(255,255,255,0.1)'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>))}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>{reviewText}</p>
          </div>
          <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 8px 32px rgba(99,102,241,0.15)' }}>
            <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.2)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }}/><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}/><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}/>
              <span style={{ fontSize: '11px', color: '#818cf8', marginLeft: '6px', fontWeight: 500 }}>AI Reply — {businessName}</span>
              {phase === 'done' && <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>Ready to use</span>}
            </div>
            <div style={{ padding: '16px', backgroundColor: 'rgba(15,23,42,0.8)', minHeight: '80px' }}>
              <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.8', margin: 0 }}>
                {typedReply}
                {phase === 'typing' && <span style={{ display: 'inline-block', width: '2px', height: '14px', backgroundColor: '#6366f1', marginLeft: '2px', verticalAlign: 'middle', animation: 'blink 0.7s step-end infinite' }}/>}
              </p>
            </div>
          </div>
          {phase === 'done' && (
            <button onClick={onNext} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white', border: 'none', padding: '15px 32px', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', boxShadow: '0 8px 24px rgba(99,102,241,0.35)', animation: 'popIn 0.5s cubic-bezier(0.16,1,0.3,1)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(99,102,241,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.35)' }}>
              Go to my dashboard →
            </button>
          )}
        </div>
      )}
      {(phase === 'idle' || phase === 'generating') && (
        <button onClick={onNext} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '13px', cursor: 'pointer', marginTop: '14px', width: '100%', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#64748b'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
          Skip for now
        </button>
      )}
    </div>
  )
}

function Step4() {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [checkedItems, setCheckedItems] = useState([false, false, false, false])

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    [0, 1, 2, 3].forEach(i => {
      setTimeout(() => {
        setCheckedItems(prev => { const next = [...prev]; next[i] = true; return next })
      }, 600 + i * 300)
    })
  }, [])

  const items = [
    { text: 'Account created', color: '#22c55e' },
    { text: 'Business configured', color: '#22c55e' },
    { text: 'First AI reply generated', color: '#22c55e' },
    { text: 'Connect Google Business', color: '#6366f1', soon: true },
  ]

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 28px' }}>
        <div style={{ position: 'absolute', inset: '-16px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 70%)', animation: 'glowPulse 2s ease-in-out infinite' }}/>
        <div style={{ width: '96px', height: '96px', borderRadius: '28px', background: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'popIn 0.7s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 16px 48px rgba(34,197,94,0.3)' }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      <h2 style={{ fontSize: '30px', fontWeight: 800, color: 'white', letterSpacing: '-0.8px', marginBottom: '10px', animation: 'fadeUp 0.5s ease 0.2s both' }}>You're all set! 🚀</h2>
      <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.7', maxWidth: '360px', margin: '0 auto 32px', animation: 'fadeUp 0.5s ease 0.3s both' }}>Replio is ready. Manage your reputation and reply to every review in seconds.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '340px', margin: '0 auto 32px', textAlign: 'left' }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: checkedItems[i] ? (item.soon ? 'rgba(99,102,241,0.08)' : 'rgba(34,197,94,0.08)') : 'rgba(255,255,255,0.03)', border: `1px solid ${checkedItems[i] ? (item.soon ? 'rgba(99,102,241,0.2)' : 'rgba(34,197,94,0.2)') : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.4s ease', transform: checkedItems[i] ? 'scale(1)' : 'scale(0.98)' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, backgroundColor: checkedItems[i] ? item.color : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', boxShadow: checkedItems[i] ? `0 0 12px ${item.color}40` : 'none' }}>
              {checkedItems[i] ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)' }}/>}
            </div>
            <span style={{ fontSize: '13px', color: checkedItems[i] ? (item.soon ? '#818cf8' : '#4ade80') : '#475569', fontWeight: checkedItems[i] ? 500 : 400, transition: 'color 0.3s ease' }}>{item.text}</span>
            {item.soon && checkedItems[i] && <span style={{ marginLeft: 'auto', fontSize: '9px', color: '#6366f1', backgroundColor: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>Coming soon</span>}
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/dashboard', { replace: true })} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', color: 'white', border: 'none', padding: '16px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', width: '100%', maxWidth: '340px', boxShadow: '0 8px 32px rgba(99,102,241,0.35)', animation: 'fadeUp 0.5s ease 1.8s both' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(99,102,241,0.5)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(99,102,241,0.35)' }}>
        Open my dashboard →
      </button>
    </div>
  )
}

function Onboarding() {
  const [step, setStep] = useState(0)
  const [businessName, setBusinessName] = useState('')
  const [platform, setPlatform] = useState('')
  const [sector, setSector] = useState('')
  const [tone, setTone] = useState('professional')
  const [avoidWords, setAvoidWords] = useState('')
  const [direction, setDirection] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [floatersVisible, setFloatersVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { setTimeout(() => setFloatersVisible(true), 300) }, [])

  const saveToSupabase = async (name, plt, sec, tn, avoid) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      await supabase.from('business_profiles').upsert({
        user_id: user.id,
        business_name: name || null,
        tone: tn || 'professional',
        sector: sec || null,
        avoid_words: avoid || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })
    } catch (e) {
      console.error('Failed to save profile:', e)
    }
  }

  const goNext = () => {
    if (animating) return
    setAnimating(true)
    setDirection(1)
    setTimeout(() => {
      setStep(s => s + 1)
      setAnimating(false)
    }, 300)
  }

  // Sauvegarder quand on arrive à l'étape "Try AI" (step 3)
  useEffect(() => {
    if (step === 4) {
      saveToSupabase(businessName, platform, sector, tone, avoidWords)
    }
  }, [step])

  // step 0 = Welcome, 1 = Business, 2 = AI Setup, 3 = Try AI, 4 = Done
  // StepIndicator reçoit step - 1 pour ignorer Welcome (step 0)
  const indicatorStep = step > 0 ? step - 1 : null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(129,140,248,0.08) 0%, transparent 70%)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', top: '-150px', right: '-150px', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.1)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', top: '-80px', right: '-80px', width: '250px', height: '250px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.07)', pointerEvents: 'none' }}/>
      <div style={{ position: 'fixed', bottom: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(99,102,241,0.08)', pointerEvents: 'none' }}/>
      <FloatingIcons visible={floatersVisible} />
      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '36px', display: 'flex', justifyContent: step === 0 ? 'center' : 'flex-start' }}>
          <img src="/replio-logo-wordmark-white.svg" alt="Replio" style={{ height: '30px' }} />
        </div>
        {step > 0 && <StepIndicator current={step} />}
        <div style={{ opacity: animating ? 0 : 1, transform: animating ? `translateX(${direction * 20}px)` : 'translateX(0)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
          {step === 0 && <Step1 onNext={goNext} />}
          {step === 1 && <Step2 onNext={goNext} businessName={businessName} setBusinessName={setBusinessName} platform={platform} setPlatform={setPlatform} />}
          {step === 2 && <Step2b onNext={goNext} sector={sector} setSector={setSector} tone={tone} setTone={setTone} avoidWords={avoidWords} setAvoidWords={setAvoidWords} />}
          {step === 3 && <Step3 onNext={goNext} businessName={businessName} platform={platform} />}
          {step === 4 && <Step4 />}
        </div>
      </div>
      <style>{`
        @keyframes popIn { from{opacity:0;transform:scale(0.75)} to{opacity:1;transform:scale(1)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes glowPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.05)} }
        @keyframes float0 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(5deg)} }
        @keyframes float1 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-15px) rotate(3deg)} }
        input::placeholder { color: #475569; }
        textarea::placeholder { color: #475569; }
      `}</style>
    </div>
  )
}

export default Onboarding
