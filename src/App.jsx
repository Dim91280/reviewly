import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import Navbar from './Navbar'
import Hero from './Hero'
import Problems from './Problems'
import Features from './Features'
import Pricing from './Pricing'
import Testimonials from './Testimonials'
import Footer from './Footer'
import Auth from './Auth'

function App() {
  const [session, setSession] = useState(null)
  const [page, setPage] = useState('home')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) setPage('dashboard')
    })
  }, [])

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Welcome to Reviewly 🎉</h1>
          <p className="text-gray-500 mb-6">You are logged in as {session.user.email}</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (page === 'auth') {
    return <Auth onBack={() => setPage('home')} />
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartFree={() => setPage('auth')} />
      <Hero onStartFree={() => setPage('auth')} />
      <Problems />
      <Features />
      <Pricing onStartFree={() => setPage('auth')} />
      <Testimonials />
      <Footer onStartFree={() => setPage('auth')} />
    </div>
  )
}

export default App