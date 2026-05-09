import { useState } from 'react'
import { supabase } from './supabase'
import { useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleReset = async () => {
    if (password !== confirm) { setMessage('Passwords do not match'); return }
    if (password.length < 6) { setMessage('Password must be at least 6 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setMessage(error.message)
    else navigate('/dashboard', { replace: true })
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8fafc' }}>
      <div className="w-full max-w-sm px-6">
        <img src="/replio-logo-wordmark.svg" alt="Replio" style={{ height: '28px', marginBottom: '32px' }} />

        <h1 className="text-2xl font-bold mb-1" style={{ color: '#111827', letterSpacing: '-0.5px' }}>
          New password
        </h1>
        <p className="text-sm mb-8" style={{ color: '#94a3b8' }}>Choose a strong password for your account</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>New password</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
              style={{ border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white' }}
              onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
              onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: '#374151' }}>Confirm password</label>
            <input type="password" placeholder="••••••••" value={confirm}
              onChange={e => setConfirm(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReset()}
              className="w-full px-4 py-2.5 text-sm rounded-xl transition-all focus:outline-none"
              style={{ border: '1px solid #e5e7eb', color: '#111827', backgroundColor: 'white' }}
              onFocus={e => e.currentTarget.style.border = '1px solid #6366f1'}
              onBlur={e => e.currentTarget.style.border = '1px solid #e5e7eb'}
            />
          </div>
        </div>

        {message && (
          <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{
            backgroundColor: 'rgba(99,102,241,0.08)',
            color: '#6366f1',
            border: '1px solid rgba(99,102,241,0.2)'
          }}>
            {message}
          </div>
        )}

        <button onClick={handleReset} disabled={loading}
          className="w-full text-white font-medium py-2.5 rounded-xl mt-5 text-sm disabled:opacity-50 transition-all"
          style={{ backgroundColor: '#6366f1' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
        >
          {loading ? 'Updating...' : 'Update password →'}
        </button>
      </div>
    </div>
  )
}

export default ResetPassword