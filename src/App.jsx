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
import Dashboard from './Dashboard'

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
    return <Dashboard session={session} />
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