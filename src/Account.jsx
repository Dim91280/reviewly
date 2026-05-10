import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'

const TONES = [
  { id: 'professional', label: 'Professional', description: 'Formal, polished and business-oriented', icon: '👔' },
  { id: 'friendly', label: 'Friendly', description: 'Warm, approachable and conversational', icon: '😊' },
  { id: 'enthusiastic', label: 'Enthusiastic', description: 'Energetic, positive and expressive', icon: '🚀' },
  { id: 'empathetic', label: 'Empathetic', description: 'Caring, understanding and human', icon: '🤝' },
  { id: 'concise', label: 'Concise', description: 'Short, direct and to the point', icon: '⚡' },
  { id: 'luxury', label: 'Luxury', description: 'Elegant, refined and premium', icon: '✨' },
]

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
    } else {
      checkGoogleConnection()
    }
    loadBusinessProfile()
  }, [])

  const loadBusinessProfile = async () => {
    const { data } = await supabase.from('business_profiles').select('*').eq('user_id', session.user.id).maybeSingle()
    if (data) { setBusinessName(data.business_name || ''); setTone(data.tone || 'professional') }
  }

  const saveBusinessProfile = async () => {
    setSavingTone(true)
    setToneSaved(false)
    const { error } = await supabase.from('business_profiles').upsert({
      user_id: session.user.id, business_name: businessName, tone, updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setSavingTone(false)
    if (!error) { setToneSaved(true); setTimeout(() => setToneSaved(false), 2500) }
  }

  const checkGoogleConnection = async () => {
    const { data } = await supabase.from('google_connections').select('id').eq('user_id', session.user.id).maybeSingle()
    setGoogleConnected(!!data)
  }

  const connectGoogle = async () => {
    const { data: { session: s } } = await supabase.auth.getSession()
    const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/google-oauth-callback`,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/business.manage',
      access_type: 'offline', prompt: 'consent', state: s.access_token,
    })
    window.location.href = oauthUrl
  }

  const syncReviews = async () => {
    setSyncing(true); setSyncError(''); setSyncResult(null)
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-reviews')
      if (error) throw error
      setSyncResult(data)
    } catch { setSyncError('Sync failed. Make sure your Google account is properly connected.') }
    finally { setSyncing(false) }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    setCancelling(true); setError('')
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', { body: { userId: session.user.id } })
      if (error) throw error
      setCancelled(true)
    } catch { setError('Failed to cancel. Please contact support.') }
    finally { setCancelling(false) }
  }

  const planColor = subscription?.plan === 'pro' ? { bg: '#eef2ff', text: '#6366f1' } : { bg: '#f0fdf4', text: '#16a34a' }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-gray-900">My account</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your subscription and account settings</p>
      </div>

      <div className="max-w-xl space-y-4">

        {/* AI Tone of Voice */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eef2ff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">AI Tone of Voice</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5 ml-9">Customize how your AI replies sound to customers.</p>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Business name</label>
            <input type="text" placeholder="e.g. Le Petit Bistro" value={businessName} onChange={e => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border focus:outline-none transition-all"
              style={{ borderColor: '#e5e7eb', color: '#111827' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none' }} />
            <p className="text-xs text-gray-400 mt-1.5">Used to personalize AI replies for your business.</p>
          </div>
          <div className="mb-5">
            <label className="block text-xs font-medium text-gray-500 mb-3">Reply tone</label>
            <div className="grid grid-cols-2 gap-2.5">
              {TONES.map(t => (
                <button key={t.id} onClick={() => setTone(t.id)} className="text-left p-3.5 rounded-xl border transition-all"
                  style={{ borderColor: tone === t.id ? '#6366f1' : '#f1f5f9', backgroundColor: tone === t.id ? '#eef2ff' : '#f8fafc', boxShadow: tone === t.id ? '0 0 0 1px #6366f1' : 'none' }}
                  onMouseEnter={e => { if (tone !== t.id) e.currentTarget.style.backgroundColor = '#f1f5f9' }}
                  onMouseLeave={e => { if (tone !== t.id) e.currentTarget.style.backgroundColor = '#f8fafc' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontSize: '16px' }}>{t.icon}</span>
                    <span className="text-xs font-semibold" style={{ color: tone === t.id ? '#6366f1' : '#374151' }}>{t.label}</span>
                    {tone === t.id && <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}><svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>}
                  </div>
                  <p className="text-xs" style={{ color: tone === t.id ? '#4338ca' : '#9ca3af' }}>{t.description}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl p-3.5 mb-5" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Preview style</p>
            <p className="text-xs text-gray-600 italic">
              {tone === 'professional' && '"Thank you for your feedback. We appreciate your visit and will work to address your concerns."'}
              {tone === 'friendly' && '"Hey, thanks so much for stopping by! We\'re really sorry to hear about your experience and would love to make it right!"'}
              {tone === 'enthusiastic' && '"Wow, thank you for your review! We absolutely love hearing from our customers and are thrilled you took the time to share!"'}
              {tone === 'empathetic' && '"We truly understand how frustrating this must have been, and we sincerely apologize. Your experience matters deeply to us."'}
              {tone === 'concise' && '"Thank you for your review. We\'ll look into this right away."'}
              {tone === 'luxury' && '"We are most grateful for your valued feedback. Excellence is our standard, and your experience is our highest priority."'}
            </p>
          </div>
          <button onClick={saveBusinessProfile} disabled={savingTone}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: '#6366f1' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.boxShadow = 'none' }}>
            {savingTone ? (<><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Saving...</>) : toneSaved ? (<><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>) : 'Save preferences'}
          </button>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Subscription</h2>

          {cancelled ? (
            <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              Your subscription has been cancelled. You'll keep access until the end of your billing period.
            </div>

          ) : subscription ? (
            /* Abonnement actif */
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Current plan</p>
                  <span className="text-sm font-semibold px-3 py-1 rounded-lg" style={{ backgroundColor: planColor.bg, color: planColor.text }}>
                    {subscription.plan?.toUpperCase()} — {subscription.plan === 'pro' ? '€29/month' : '€19/month'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Active</span>
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: '#f8fafc' }}>
                <p className="text-xs text-gray-400 mb-3">
                  To upgrade or change your plan, contact us at <span style={{ color: '#6366f1' }}>support@replio.io</span>
                </p>
                {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                <button onClick={handleCancel} disabled={cancelling}
                  className="text-xs px-4 py-2 rounded-xl border transition-colors disabled:opacity-50"
                  style={{ borderColor: '#fecaca', color: '#dc2626', backgroundColor: '#fff5f5' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff5f5'}>
                  {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                </button>
              </div>
            </>

          ) : isInTrial ? (
            /* Trial en cours */
            <div>
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eef2ff' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free trial</p>
                  <p className="text-xs text-gray-400">{daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining — no credit card required</p>
                </div>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
                  Trial
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-3">Choose a plan to continue after your trial ends.</p>
              <button
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                className="text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all"
                style={{ backgroundColor: '#6366f1' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1'; e.currentTarget.style.boxShadow = 'none' }}>
                View plans →
              </button>
            </div>

          ) : (
            /* Trial expiré sans subscription */
            <div>
              <div className="flex items-center gap-3 p-4 rounded-xl mb-4" style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fef2f2' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Trial expired</p>
                  <p className="text-xs text-gray-400">Subscribe to keep using Replio.</p>
                </div>
              </div>
              <button
                onClick={() => { navigate('/'); setTimeout(() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' }), 300) }}
                className="text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all"
                style={{ backgroundColor: '#6366f1' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#4f46e5' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#6366f1' }}>
                Choose a plan →
              </button>
            </div>
          )}
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email address</p>
              <p className="text-sm text-gray-700 font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Member since</p>
              <p className="text-sm text-gray-700">{new Date(session.user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Google Business Profile */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eef2ff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Google Business Profile</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5 ml-9">Sync your Google reviews automatically into Replio.</p>
          {googleConnected ? (
            <div className="space-y-4">
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Connected</span>
              {syncResult && <div className="rounded-xl px-4 py-3 text-xs" style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}>{syncResult.synced} review{syncResult.synced !== 1 ? 's' : ''} synced successfully.</div>}
              {syncError && <p className="text-xs text-red-500">{syncError}</p>}
              <button onClick={syncReviews} disabled={syncing} className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl text-white disabled:opacity-50 transition-opacity" style={{ backgroundColor: '#6366f1' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                {syncing ? 'Syncing...' : 'Sync reviews'}
              </button>
            </div>
          ) : (
            <button onClick={connectGoogle} className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90" style={{ backgroundColor: '#6366f1' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7"/></svg>
              Connect Google Business
            </button>
          )}
        </div>

        {/* Session */}
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Session</h2>
          <button onClick={() => supabase.auth.signOut()} className="text-xs px-4 py-2 rounded-xl border transition-colors" style={{ borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#f8fafc' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
            Sign out of Replio
          </button>
        </div>

      </div>
    </>
  )
}

export default Account
