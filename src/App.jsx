import { useState, useEffect, lazy, Suspense } from 'react'
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

const AppLayout = lazy(() => import('./AppLayout'))
const DashboardPage = lazy(() => import('./DashboardPage'))
const Reviews = lazy(() => import('./Reviews'))
const Account = lazy(() => import('./Account'))
const Onboarding = lazy(() => import('./Onboarding'))
const ResetPassword = lazy(() => import('./ResetPassword'))
const Privacy = lazy(() => import('./Privacy'))
const Terms = lazy(() => import('./Terms'))

function Spinner() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
      <svg style={{ animation: 'spin 1s linear infinite' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10"/>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </svg>
    </div>
  )
}

function ProtectedRoute({ session }) {
  if (!session) return <Navigate to="/auth" replace />
  return <Outlet />
}

function Landing({ onStartFree, session }) {
  useEffect(() => {
    if (window.location.hash === '#pricing') {
      setTimeout(() => {
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar onStartFree={onStartFree} onSignIn={onStartFree} session={session} />
      <Hero onStartFree={onStartFree} />
      <Problems />
      <Features />
      <div id="pricing">
        <Pricing onStartFree={onStartFree} />
      </div>
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
    let initializing = true

    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)

      if (session) {
        const path = window.location.pathname
        if ((path === '/' || path === '/auth' || path === '') && !window.location.hash) {
          const onboarded = await checkOnboarded(session.user.id)
          navigate(onboarded ? '/dashboard' : '/onboarding', { replace: true })
        }
      }

      initializing = false
      setLoading(false)
    }

    initialize()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)

      if (initializing) return

      if (event === 'PASSWORD_RECOVERY') {
        navigate('/reset-password', { replace: true })
        return
      }

      if (event === 'SIGNED_IN') {
        const currentPath = window.location.pathname
        if (currentPath === '/onboarding') return
        if ((currentPath === '/auth' || currentPath === '/' || currentPath === '') && !window.location.hash) {
          const onboarded = await checkOnboarded(session.user.id)
          navigate(onboarded ? '/dashboard' : '/onboarding', { replace: true })
        }
      }

      if (event === 'SIGNED_OUT') {
        navigate('/', { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) return <Spinner />

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Landing onStartFree={() => navigate('/auth')} session={session} />} />

        <Route path="/auth" element={
          session
            ? <Navigate to="/dashboard" replace />
            : <Auth onBack={() => navigate('/')} />
        } />

        {/* /onboarding non protégé pour permettre la vérification email par token */}
        <Route path="/onboarding" element={<Onboarding />} />

        <Route element={<ProtectedRoute session={session} />}>
          <Route element={<AppLayout session={session} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Route>

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App