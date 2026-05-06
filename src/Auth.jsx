import { useState } from 'react'
import { supabase } from './supabase'

function Auth({ onBack }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#f8fafc' }}>

      {/* Panel gauche */}
      <div className="hidden md:flex flex-col justify-between w-1/2 p-12 text-white" style={{ backgroundColor: '#0f172a' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
            <svg width="14" height="14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8V40C0 44.42 3.58 48 8 48H22L32 56L42 48H56C60.42 48 64 44.42 64 40V8C64 3.58 60.42 0 56 0H8Z" fill="white" opacity="0.95"/><path d="M42 18L28 24L42 30V26C48 26 52 28 52 34C52 32 50 26 42 24V18Z" fill="#6366f1"/><path d="M20 20L21.5 24L25.5 24.5L22.5 27L23.5 31L20 28.5L16.5 31L17.5 27L14.5 24.5L18.5 24L20 20Z" fill="#6366f1"/></svg>
          </div>
          <span className="font-semibold text-sm">Replio</span>
        </div>

        <div>
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ))}
          </div>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            "Since using Replio, I reply to every review in under a minute. My rating went from 4.1 to 4.6 in 3 months."
          </p>
          <p className="text-white font-medium text-sm">Marie Dubois</p>
          <p className="text-slate-500 text-xs">Restaurant owner, Lyon</p>
        </div>

        <p className="text-slate-600 text-xs">© 2025 Replio. All rights reserved.</p>
      </div>

      {/* Panel droit */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          <div className="flex items-center gap-2 mb-10 md:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
              <svg width="14" height="14" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C3.58 0 0 3.58 0 8V40C0 44.42 3.58 48 8 48H22L32 56L42 48H56C60.42 48 64 44.42 64 40V8C64 3.58 60.42 0 56 0H8Z" fill="white" opacity="0.95"/><path d="M42 18L28 24L42 30V26C48 26 52 28 52 34C52 32 50 26 42 24V18Z" fill="#6366f1"/><path d="M20 20L21.5 24L25.5 24.5L22.5 27L23.5 31L20 28.5L16.5 31L17.5 27L14.5 24.5L18.5 24L20 20Z" fill="#6366f1"/></svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Replio</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {isLogin ? 'Sign in to continue to your dashboard' : 'Start your 14-day free trial — no card needed'}
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                style={{ borderColor: '#e5e7eb' }}
              />
            </div>
          </div>

          {message && (
            <div className="mt-4 px-4 py-3 rounded-xl text-sm" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full text-white font-medium py-2.5 rounded-xl mt-5 text-sm disabled:opacity-50 transition-colors"
            style={{ backgroundColor: '#6366f1' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
          >
            {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
          </button>

          <p className="text-center text-gray-400 text-xs mt-5">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setIsLogin(!isLogin); setMessage('') }} className="font-medium" style={{ color: '#6366f1' }}>
              {isLogin ? 'Sign up free' : 'Sign in'}
            </button>
          </p>

          <p className="text-center mt-4">
            <button onClick={onBack} className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
              ← Back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth