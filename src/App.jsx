import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import Navbar from './Navbar'
import Hero from './Hero'
import Problems from './Problems'
import Features from './Features'
import Pricing from './Pricing'
import FAQ from './FAQ'
import Testimonials from './Testimonials'
import Footer from './Footer'
import Auth from './Auth'
import AppLayout from './AppLayout'
import DashboardPage from './DashboardPage'
import Reviews from './Reviews'
import Account from './Account'
import Onboarding from './Onboarding'

function ProtectedRoute({ session }) {
  if (!session) return <Navigate to="/auth" replace />
  return <Outlet />
}

function Landing({ onStartFree, session }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartFree={onStartFree} onSignIn={onStartFree} session={session} />
      <Hero onStartFree={onStartFree} />
      <Problems />
      <Features />
      <Pricing onStartFree={onStartFree} />
      <Testimonials />
      <FAQ />
      <Footer onStartFree={onStartFree} />
    </div>
  )
}

async function checkOnboarded(userId) {
  const { data } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      if (!session) {
        navigate('/', { replace: true })
      } else if (event === 'SIGNED_IN') {
        const onboarded = await checkOnboarded(session.user.id)
        if (!onboarded) {
          navigate('/onboarding', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null

  return (
    <Routes>
      <Route path="/" element={<Landing onStartFree={() => navigate('/auth')} session={session} />} />

      <Route path="/auth" element={
        session
          ? <Navigate to="/dashboard" replace />
          : <Auth onBack={() => navigate('/')} />
      } />

      {/* Onboarding — protégé, hors AppLayout */}
      <Route element={<ProtectedRoute session={session} />}>
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      <Route element={<ProtectedRoute session={session} />}>
        <Route element={<AppLayout session={session} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
