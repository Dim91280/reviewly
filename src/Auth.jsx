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
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f8fafc' }}>
                <div className="bg-white rounded-2xl border p-8 w-full max-w-md" style={{ borderColor: '#f1f5f9' }}>

                          <div className="flex items-center gap-2 mb-8">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>svg>
                                    </div>div>
                                    <span className="font-semibold text-gray-900 text-sm">Reviewly</span>span>
                          </div>div>
                
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">
                          {isLogin ? 'Welcome back' : 'Create your account'}
                        </h1>h1>
                        <p className="text-gray-400 text-sm mb-7">
                          {isLogin ? 'Sign in to your account' : 'Start your 14-day free trial'}
                        </p>p>
                
                        <div className="space-y-3">
                                  <input
                                                type="email"
                                                placeholder="Email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                style={{ borderColor: '#e5e7eb' }}
                                              />
                                  <input
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full border rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                style={{ borderColor: '#e5e7eb' }}
                                              />
                        </div>div>
                
                  {message && <p className="text-sm mt-4" style={{ color: '#6366f1' }}>{message}</p>p>}
                
                        <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="w-full text-white font-medium py-2.5 rounded-xl mt-5 text-sm transition-colors disabled:opacity-50"
                                    style={{ backgroundColor: '#6366f1' }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                                  >
                          {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
                        </button>button>
                
                        <p className="text-center text-gray-400 text-xs mt-5">
                          {isLogin ? "Don't have an account? " : "Already have an account? "}
                                  <button onClick={() => setIsLogin(!isLogin)} className="font-medium" style={{ color: '#6366f1' }}>
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                  </button>button>
                        </p>p>
                
                        <p className="text-center mt-3">
                                  <button onClick={onBack} className="text-gray-400 text-xs hover:text-gray-600">
                                              Back to home
                                  </button>button>
                        </p>p>
                </div>div>
        </div>div>
      )
}

export default Auth</div>
