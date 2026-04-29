import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const PRICE_SOLO = 'price_1TR8rmB4ROasWczJeilL2YEd'
const PRICE_PRO = 'price_1TR8rAB4ROasWczJj2Al5ZI5'

function Pricing() {
  const [loading, setLoading] = useState(null)
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
  }, [])

  const handleCheckout = async (priceId, planName) => {
    setLoading(planName)
    try {
      const currentSession = session || (await supabase.auth.getSession()).data.session

      if (!currentSession) {
        window.location.href = '/auth'
        return
      }

      console.log('Calling create-checkout with:', { priceId, userId: currentSession.user.id })

      const response = await fetch(
        'https://wfjsynilylbjymwjusvi.supabase.co/functions/v1/create-checkout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.access_token}`,
          },
          body: JSON.stringify({
            priceId,
            userId: currentSession.user.id,
            userEmail: currentSession.user.email,
          }),
        }
      )

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (data.error) throw new Error(data.error)
      window.location.href = data.url
    } catch (err) {
      alert('Erreur : ' + err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <section id="pricing" className="bg-gray-50 py-20 px-6">
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">
        Simple, honest pricing
      </h2>
      <p className="text-gray-500 text-center mb-12">
        No contract. Cancel anytime.
      </p>

      <div className="flex flex-col md:flex-row gap-6 max-w-3xl mx-auto">

        {/* Plan Solo */}
        <div className="flex-1 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-blue-900 font-bold text-xl mb-2">Solo</h3>
          <div className="text-4xl font-bold text-blue-900 mb-1">€19<span className="text-lg font-normal text-gray-400">/month</span></div>
          <p className="text-gray-400 text-sm mb-8">Perfect to get started</p>
          <ul className="space-y-3 mb-8">
            {["Google monitoring", "Real-time alerts", "AI-powered replies", "1 location"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-600">
                <span className="text-green-500">✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout(PRICE_SOLO, 'solo')}
            disabled={loading === 'solo'}
            className="w-full border-2 border-blue-900 text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50 disabled:opacity-50"
          >
            {loading === 'solo' ? 'Chargement...' : 'Start free trial'}
          </button>
        </div>

        {/* Plan Pro */}
        <div className="flex-1 bg-blue-900 rounded-2xl p-8 shadow-lg">
          <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            MOST POPULAR
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Pro</h3>
          <div className="text-4xl font-bold text-white mb-1">€29<span className="text-lg font-normal text-blue-300">/month</span></div>
          <p className="text-blue-300 text-sm mb-8">For growing businesses</p>
          <ul className="space-y-3 mb-8">
            {["Everything in Solo", "SMS review requests", "Facebook + TripAdvisor", "Analytics dashboard", "3 locations"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-blue-100">
                <span className="text-orange-400">✓</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleCheckout(PRICE_PRO, 'pro')}
            disabled={loading === 'pro'}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {loading === 'pro' ? 'Chargement...' : 'Start free trial'}
          </button>
        </div>

      </div>
    </section>
  )
}

export default Pricing
