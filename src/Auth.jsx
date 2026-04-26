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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center">
            <span className="text-orange-400 text-lg">★</span>
          </div>
          <span className="text-blue-900 font-bold text-xl">Reviewly</span>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-blue-900 mb-2">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {isLogin ? 'Sign in to your account' : 'Start your 14-day free trial'}
        </p>

        {/* Formulaire */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-900"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-blue-900"
          />
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm text-orange-500 mt-4">{message}</p>
        )}

        {/* Bouton */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl mt-6"
        >
          {loading ? 'Loading...' : isLogin ? 'Sign in' : 'Create account'}
        </button>

        {/* Toggle */}
        <p className="text-center text-gray-400 text-sm mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-900 font-semibold"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {/* Retour */}
        <p className="text-center mt-4">
          <button onClick={onBack} className="text-gray-400 text-sm hover:text-blue-900">
            ← Back to home
          </button>
        </p>

      </div>
    </div>
  )
}

export default Auth