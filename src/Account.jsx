import { useState } from 'react'
import { supabase } from './supabase'

function Account({ session, subscription, onBack }) {
  const [cancelling, setCancelling] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return
    setCancelling(true)
    setError('')
    try {
      const { error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId: session.user.id }
      })
      if (error) throw error
      setCancelled(true)
    } catch (err) {
      setError('Failed to cancel. Please contact support.')
    } finally {
      setCancelling(false)
    }
  }

  const planColor = subscription?.plan === 'pro'
    ? { bg: '#eef2ff', text: '#6366f1' }
    : { bg: '#f0fdf4', text: '#16a34a' }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>

      {/* Sidebar */}
      <aside className="hidden md:flex w-56 min-h-screen flex-col px-4 py-6 fixed top-0 left-0" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>

        <div className="px-2 mb-6">
          <span className="text-xs font-medium px-2.5 py-1 rounded-md" style={{ backgroundColor: '#1e3a5f', color: '#60a5fa' }}>
            Plan {subscription?.plan?.toUpperCase()}
          </span>
        </div>

        <nav className="space-y-0.5 flex-1">
          {[
            { label: 'Dashboard', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>, onClick: onBack },
            { label: 'Account', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, active: true },
          ].map(item => (
            <div key={item.label}
              onClick={item.onClick}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-xs transition-colors"
              style={{ backgroundColor: item.active ? '#1e293b' : 'transparent', color: item.active ? '#f1f5f9' : '#64748b' }}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="border-t px-2 pt-4" style={{ borderColor: '#1e293b' }}>
          <p className="text-xs truncate mb-2" style={{ color: '#475569' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} className="text-xs transition-colors" style={{ color: '#475569' }}>
            Sign out →
          </button>
        </div>
      </aside>

      {/* Navbar mobile */}
      <nav className="md:hidden fixed top-0 left-0 right-0 px-4 py-3 flex items-center justify-between z-10" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <span className="text-white font-medium text-sm">Reviewly</span>
        </div>
        <button onClick={onBack} className="text-xs" style={{ color: '#64748b' }}>← Back</button>
      </nav>

      {/* Main */}
      <main className="md:ml-56 flex-1 px-4 md:px-8 py-5 md:py-8 mt-12 md:mt-0">

        <div className="mb-8">
          <h1 className="text-lg font-semibold text-gray-900">My account</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage your subscription and account settings</p>
        </div>

        <div className="max-w-xl space-y-4">

          {/* Subscription card */}
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
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                      ✓ Active
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4" style={{ borderColor: '#f8fafc' }}>
                  <p className="text-xs text-gray-400 mb-3">
                    To upgrade or change your plan, contact us at <span style={{ color: '#6366f1' }}>support@reviewly.io</span>
                  </p>
                  {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="text-xs px-4 py-2 rounded-xl border transition-colors disabled:opacity-50"
                    style={{ borderColor: '#fecaca', color: '#dc2626', backgroundColor: '#fff5f5' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff5f5'}
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel subscription'}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Account info card */}
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

          {/* Danger zone */}
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#f1f5f9' }}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Session</h2>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-xs px-4 py-2 rounded-xl border transition-colors"
              style={{ borderColor: '#e5e7eb', color: '#64748b', backgroundColor: '#f8fafc' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
            >
              Sign out of Reviewly
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Account