import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { supabase } from './supabase'

function Account() {
  const { session, subscription } = useOutletContext()
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState('')
  const [googleConnected, setGoogleConnected] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState(null)
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('google_connected') === 'true') {
      setGoogleConnected(true)
      window.history.replaceState({}, '', window.location.pathname)
    } else {
      checkGoogleConnection()
    }
  }, [])

  const checkGoogleConnection = async () => {
    const { data } = await supabase.from('google_connections').select('id').eq('user_id', session.user.id).maybeSingle()
    setGoogleConnected(!!data)
  }

  const connectGoogle = async () => {
    const { data: { session: s } } = await supabase.auth.getSession()
    const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' + new URLSearchParams({
      client_id: '384919697301-pihlkma2tc9edj94btdg05g62hd544jl.apps.googleusercontent.com',
      redirect_uri: 'https://wfjsynilylbjymwjusvi.supabase.co/functions/v1/google-oauth-callback',
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/business.manage',
      access_type: 'offline',
      prompt: 'consent',
      state: s.access_token,
    })
    window.location.href = oauthUrl
  }

  const syncReviews = async () => {
    setSyncing(true)
    setSyncError('')
    setSyncResult(null)
    try {
      const { data, error } = await supabase.functions.invoke('sync-google-reviews')
      if (error) throw error
      setSyncResult(data)
    } catch {
      setSyncError('Sync failed. Make sure your Google account is properly connected.')
    } finally {
      setSyncing(false)
    }
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    setCancelling(true)
    setError('')
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', { body: { userId: session.user.id } })
      if (error) throw error
      setCancelled(true)
    } catch {
      setError('Failed to cancel. Please contact support.')
    } finally {
      setCancelling(false)
    }
  }

  const planColor = subscription?.plan === 'pro'
    ? { bg: '#eef2ff', text: '#6366f1' }
    : { bg: '#f0fdf4', text: '#16a34a' }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-gray-900">My account</h1>
        <p className="text-xs text-gray-400 mt-0.5">Manage your subscription and account settings</p>
      </div>

      <div className="max-w-xl space-y-4">

        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Subscription</h2>
          {cancelled ? (
            <div className="rounded-xl p-4 text-sm" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
              Your subscription has been cancelled. You'll keep access until the end of your billing period.
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Current plan</p>
                  <span className="text-sm font-semibold px-3 py-1 rounded-lg" style={{ backgroundColor: planColor.bg, color: planColor.text }}>
                    {subscription?.plan?.toUpperCase()} — {subscription?.plan === 'pro' ? '€29/month' : '€19/month'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Active</span>
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: '#f8fafc' }}>
                <p className="text-xs text-gray-400 mb-3">
                  To upgrade or change your plan, contact us at <span style={{ color: '#6366f1' }}>support@reviewly.io</span>
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
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Account</h2>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">Email address</p>
              <p className="text-sm text-gray-700 font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Member since</p>
              <p className="text-sm text-gray-700">
                {new Date(session.user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#eef2ff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            </div>
            <h2 className="text-sm font-semibold text-gray-900">Google Business Profile</h2>
          </div>
          <p className="text-xs text-gray-400 mb-5 ml-9">Sync your Google reviews automatically into Reviewly.</p>
          {googleConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>✓ Connected</span>
              </div>
              {syncResult && (
                <div className="rounded-xl px-4 py-3 text-xs" style={{ backgroundColor: '#eef2ff', color: '#4338ca' }}>
                  {syncResult.synced} review{syncResult.synced !== 1 ? 's' : ''} synced successfully.
                </div>
              )}
              {syncError && <p className="text-xs text-red-500">{syncError}</p>}
              <button onClick={syncReviews} disabled={syncing}
                className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl text-white disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: '#6366f1' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                {syncing ? 'Syncing...' : 'Sync reviews'}
              </button>
            </div>
          ) : (
            <button onClick={connectGoogle}
              className="flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#6366f1' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 2H3v16h5v4l4-4h5l4-4V2zM11 11V7M16 11V7"/></svg>
              Connect Google Business
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Session</h2>
          <button onClick={() => supabase.auth.signOut()}
            className="text-xs px-4 py-2 rounded-xl border transition-colors"
            style={{ borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#f8fafc' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
            Sign out of Reviewly
          </button>
        </div>

      </div>
    </>
  )
}

export default Account
