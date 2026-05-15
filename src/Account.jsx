import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const D = {
  surface: '#0D1220',
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

const TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal, polished and business-oriented', icon: '👔' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable and conversational', icon: '😊' },
  { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic, positive and expressive', icon: '🚀' },
  { id: 'empathetic', label: 'Empathetic', description: 'Caring, understanding and human', icon: '🤝' },
  { id: 'concise', label: 'Concise', description: 'Short, direct and to the point', icon: '⚡' },
  { id: 'luxury', label: 'Luxury', description: 'Elegant, refined and premium', icon: '✨' },
]

const SECTORS = [
  { id: 'restaurant', label: 'Restaurant & Bar', icon: '🍽️' },
  { id: 'hotel', label: 'Hotel & Stay', icon: '🏨' },
  { id: 'retail', label: 'Retail & Shop', icon: '🛍️' },
  { id: 'beauty', label: 'Beauty & Wellness', icon: '💆' },
  { id: 'health', label: 'Health & Medical', icon: '🏥' },
  { id: 'other', label: 'Other', icon: '🏢' },
]

const TONE_PREVIEWS = {
  professional: '"Thank you for your feedback. We appreciate your visit and will work to address your concerns."',
  friendly: '"Hey, thanks so much for stopping by! We\'re really sorry to hear about your experience and would love to make it right!"',
  enthusiastic: '"Wow, thank you for your review! We absolutely love hearing from our customers and are thrilled you took the time to share!"',
  empathetic: '"We truly understand how frustrating this must have been, and we sincerely apologize. Your experience matters deeply to us."',
  concise: '"Thank you for your review. We\'ll look into this right away."',
  luxury: '"We are most grateful for your valued feedback. Excellence is our standard, and your experience is our highest priority."',
}

function Section({ title, icon, subtitle, children }) {
  return (
    <div style={{ background: D.surface, borderRadius: '14px', border: `1px solid ${D.border}`, padding: '24px', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: subtitle ? '4px' : '20px' }}>
        {icon && (
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: D.indigoDim, border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
        )}
        <h2 style={{ fontSize: '14px', fontWeight: '700', color: D.text, letterSpacing: '-0.3px' }}>{title}</h2>
      </div>
      {subtitle && <p style={{ fontSize: '12px', color: D.text2, marginBottom: '20px', marginLeft: icon ? '40px' : '0' }}>{subtitle}</p>}
      {children}
    </div>
  )
}

function InputField({ label, hint, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: D.text2, marginBottom: '6px' }}>{label}</label>
      <input
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e) }}
        onBlur={e => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%', padding: '10px 14px', fontSize: '13px', borderRadius: '10px',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'rgba(99,102,241,0.5)' : D.border2}`,
          color: D.text, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
          fontFamily: 'inherit',
          ...props.style,
        }}
      />
      {hint && <p style={{ fontSize: '11px', color: D.text3, marginTop: '6px' }}>{hint}</p>}
    </div>
  )
}

function Account() {
  const { session, subscription } = useOutletContext()
  const navigate = useNavigate()
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState('')
  const [googleConnected, setGoogleConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState('')

  const [businessName, setBusinessName] = useState('')
  const [tone, setTone] = useState('professional')
  const [sector, setSector] = useState('')
  const [avoidWords, setAvoidWords] = useState('')
  const [savingTone, setSavingTone] = useState(false)
  const [toneSaved, setToneSaved] = useState(false)

  const accountAge = Math.floor((Date.now() - new Date(session.user.created_at)) / (1000 * 60 * 60 * 24))
  const isInTrial = accountAge < 14
  const daysLeft = 13 - accountAge

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('google_connected') === 'true') {
      setGoogleConnected(true)
      window.history.replaceState({}, '', window.location.pathname)
    } else { checkGoogleConnection() }
    loadBusinessProfile()
  }, [])

  const loadBusinessProfile = async () => {
    const { data } = await supabase.from('business_profiles').select('*').eq('user_id', session.user.id).maybeSingle()
    if (data) { setBusinessName(data.business_name || ''); setTone(data.tone || 'professional'); setSector(data.sector || ''); setAvoidWords(data.avoid_words || '') }
  }

  const saveBusinessProfile = async () => {
    setSavingTone(true); setToneSaved(false)
    const { error } = await supabase.from('business_profiles').upsert({ user_id: session.user.id, business_name: businessName, tone, sector: sector || null, avoid_words: avoidWords || null, updated_at: new Date().toISOString() }, { onConflict: 'user_id' })
    setSavingTone(false)
    if (!error) { setToneSaved(true); setTimeout(() => setToneSaved(false), 2500) }
  }

  const checkGoogleConnection = async () => {
    const { data } = await supabase.from('google_connections').select('id').eq('user_id', session.user.id).maybeSingle()
    setGoogleConnected(!!data)
  }

  const connectGoogle = async () => {
    const { data: { session: s } } = await supabase.auth.getSession()
    const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({ client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, redirect_uri: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth-callback`, response_type: 'code', scope: 'https://www.googleapis.com/auth/business.manage', access_type: 'offline', prompt: 'consent', state: s.access_token })
    window.location.href = oauthUrl
  }

  const syncReviews = async () => {
    setSyncing(true); setSyncError(''); setSyncResult(null)
    try { const { data, error } = await supabase.functions.invoke('sync-google-reviews'); if (error) throw error; setSyncResult(data) }
    catch { setSyncError('Sync failed. Make sure your Google account is properly connected.') }
    finally { setSyncing(false) }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    setCancelling(true); setError('')
    try { const { error } = await supabase.functions.invoke('cancel-subscription', { body: { userId: session.user.id } }); if (error) throw error; setCancelled(true) }
    catch { setError('Failed to cancel. Please contact support.') }
    finally { setCancelling(false) }
  }

  const btnPrimary = {
    fontSize: '13px', fontWeight: '600', padding: '10px 18px', borderRadius: '10px',
    background: D.indigo, color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    display: 'inline-flex', alignItems: 'center', gap: '6px',
  }

  return (
    <>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: '700', color: D.text, letterSpacing: '-0.5px' }}>My account</h1>
        <p style={{ fontSize: '12px', color: D.text2, marginTop: '2px' }}>Manage your subscription and account settings</p>
      </div>

      <div style={{ maxWidth: '560px' }}>

        {/* AI Settings */}
        <Section
          title="AI Settings"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>}
          subtitle="Customize how your AI replies sound to customers."
        >
          <InputField label="Business name" placeholder="e.g. Le Petit Bistro" value={businessName} onChange={e => setBusinessName(e.target.value)} hint="Used to personalize AI replies for your business." />

          {/* Sector */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: D.text2, marginBottom: '10px' }}>Business sector</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {SECTORS.map(s => (
                <button key={s.id} onClick={() => setSector(s.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px',
                  border: `1px solid ${sector === s.id ? 'rgba(99,102,241,0.4)' : D.border}`,
                  background: sector === s.id ? D.indigoDim : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (sector !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (sector !== s.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <span style={{ fontSize: '15px' }}>{s.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: '500', color: sector === s.id ? D.indigoLight : D.text2, flex: 1 }}>{s.label}</span>
                  {sector === s.id && <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: D.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: D.text2, marginBottom: '10px' }}>Reply tone</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t.id)} style={{
                  textAlign: 'left', padding: '12px', borderRadius: '10px',
                  border: `1px solid ${tone === t.id ? 'rgba(99,102,241,0.4)' : D.border}`,
                  background: tone === t.id ? D.indigoDim : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (tone !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { if (tone !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px' }}>{t.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: tone === t.id ? D.indigoLight : D.text, flex: 1 }}>{t.label}</span>
                    {tone === t.id && <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: D.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>}
                  </div>
                  <p style={{ fontSize: '11px', color: tone === t.id ? D.indigoLight : D.text3, opacity: tone === t.id ? 0.8 : 1 }}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '20px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: D.indigoLight, marginBottom: '6px' }}>Preview style</p>
            <p style={{ fontSize: '12px', color: D.text2, fontStyle: 'italic', lineHeight: '1.6' }}>{TONE_PREVIEWS[tone]}</p>
          </div>

          <InputField
            label="Words to avoid (optional)"
            placeholder="e.g. competitor, discount, promo"
            value={avoidWords}
            onChange={e => setAvoidWords(e.target.value)}
            hint="Separate with commas. The AI will never use them in replies."
          />

          <button onClick={saveBusinessProfile} disabled={savingTone} style={{ ...btnPrimary, opacity: savingTone ? 0.7 : 1 }}
            onMouseEnter={e => { if (!savingTone) { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.3)' }}}
            onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.boxShadow = 'none' }}
          >
            {savingTone ? 'Saving...' : toneSaved ? '✓ Saved!' : 'Save preferences'}
          </button>
        </Section>

        {/* Subscription */}
        <Section title="Subscription" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>}>
          {cancelled ? (
            <div style={{ padding: '12px 14px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: D.red }}>
              Your subscription has been cancelled. You'll keep access until the end of your billing period.
            </div>
          ) : subscription ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: D.text2, marginBottom: '6px' }}>Current plan</p>
                  <span style={{ fontSize: '13px', fontWeight: '700', padding: '5px 12px', borderRadius: '8px', background: D.indigoDim, color: D.indigoLight, border: '1px solid rgba(99,102,241,0.2)' }}>
                    {subscription.plan?.toUpperCase()} — {subscription.plan === 'pro' ? '€29/month' : '€19/month'}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: D.text2, marginBottom: '6px' }}>Status</p>
                  <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '7px', background: 'rgba(16,185,129,0.1)', color: D.green, border: '1px solid rgba(16,185,129,0.2)' }}>✓ Active</span>
                </div>
              </div>
              <div style={{ borderTop: `1px solid ${D.border}`, paddingTop: '16px' }}>
                <p style={{ fontSize: '12px', color: D.text2, marginBottom: '12px' }}>
                  To upgrade or change your plan, contact us at <span style={{ color: D.indigoLight }}>support@replios.com</span>
                </p>
                {error && <p style={{ fontSize: '12px', color: D.red, marginBottom: '10px' }}>{error}</p>}
                <button onClick={handleCancel} disabled={cancelling} style={{
                  fontSize: '12px', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                  border: '1px solid rgba(239,68,68,0.2)', color: D.red, background: 'rgba(239,68,68,0.06)',
                  transition: 'all 0.15s', opacity: cancelling ? 0.6 : 1,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                >
                  {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                </button>
              </div>
            </>
          ) : isInTrial ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', marginBottom: '16px', background: D.indigoDim, border: '1px solid rgba(99,102,241,0.2)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: D.text }}>Free trial</p>
                  <p style={{ fontSize: '11px', color: D.text2 }}>{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining — no credit card required</p>
                </div>
                <span style={{ fontSize: '10px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px', background: 'rgba(99,102,241,0.2)', color: D.indigoLight }}>Trial</span>
              </div>
              <p style={{ fontSize: '12px', color: D.text2, marginBottom: '12px' }}>Choose a plan to continue after your trial ends.</p>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300) }} style={btnPrimary}
                onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.boxShadow = 'none' }}
              >View plans →</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', marginBottom: '16px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={D.red} strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: '600', color: D.text }}>Trial expired</p>
                  <p style={{ fontSize: '11px', color: D.text2 }}>Subscribe to keep using Replios.</p>
                </div>
              </div>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300) }} style={btnPrimary}
                onMouseEnter={e => e.currentTarget.style.background = '#4F46E5'}
                onMouseLeave={e => e.currentTarget.style.background = D.indigo}
              >Choose a plan →</button>
            </div>
          )}
        </Section>

        {/* Account info */}
        <Section title="Account" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <p style={{ fontSize: '11px', color: D.text2, marginBottom: '4px' }}>Email address</p>
              <p style={{ fontSize: '13px', fontWeight: '500', color: D.text }}>{session.user.email}</p>
            </div>
            <div>
              <p style={{ fontSize: '11px', color: D.text2, marginBottom: '4px' }}>Member since</p>
              <p style={{ fontSize: '13px', color: D.text }}>{new Date(session.user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </Section>

        {/* Google Business */}
        <Section
          title="Google Business Profile"
          icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>}
          subtitle="Sync your Google reviews automatically into Replios."
        >
          {googleConnected ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', padding: '4px 10px', borderRadius: '7px', background: 'rgba(16,185,129,0.1)', color: D.green, border: '1px solid rgba(16,185,129,0.2)', display: 'inline-block' }}>✓ Connected</span>
              {syncResult && <div style={{ padding: '10px 14px', borderRadius: '10px', background: D.indigoDim, border: '1px solid rgba(99,102,241,0.2)', fontSize: '12px', color: D.indigoLight }}>{syncResult.synced} review{syncResult.synced !== 1 ? 's' : ''} synced successfully.</div>}
              {syncError && <p style={{ fontSize: '12px', color: D.red }}>{syncError}</p>}
              <button onClick={syncReviews} disabled={syncing} style={{ ...btnPrimary, opacity: syncing ? 0.6 : 1 }}
                onMouseEnter={e => { if (!syncing) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={e => e.currentTarget.style.background = D.indigo}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                {syncing ? 'Syncing...' : 'Sync reviews'}
              </button>
            </div>
          ) : (
            <button onClick={connectGoogle} style={btnPrimary}
              onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = D.indigo; e.currentTarget.style.boxShadow = 'none' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 2H3v16h5v4l4-4h5l4-4V2z"/></svg>
              Connect Google Business
            </button>
          )}
        </Section>

        {/* Session */}
        <Section title="Session" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={D.indigoLight} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}>
          <button onClick={() => supabase.auth.signOut()} style={{
            fontSize: '13px', padding: '9px 16px', borderRadius: '10px', cursor: 'pointer',
            border: `1px solid ${D.border2}`, color: D.text2, background: 'transparent', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = D.text }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = D.text2 }}
          >Sign out of Replios</button>
        </Section>

      </div>
    </>
  )
}

export default Account
