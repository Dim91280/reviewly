import { useState, useEffect } from 'react'
import { supabase } from './supabase'

const PRICE_SOLO = 'price_1TR8rmB4ROasWczJeilL2YEd'
const PRICE_PRO = 'price_1TR8rAB4ROasWczJj2Al5ZI5'

function Pricing({ onStartFree }) {
    const [loading, setLoading] = useState(null)
    const [session, setSession] = useState(null)

  useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
  }, [])

  const handleCheckout = async (priceId, planName) => {
        setLoading(planName)
        try {
                const currentSession = session || (await supabase.auth.getSession()).data.session
                if (!currentSession) { onStartFree(); return }

          const response = await fetch(
                    'https://wfjsynilylbjymwjusvi.supabase.co/functions/v1/create-checkout',
            {
                        method: 'POST',
                        headers: {
                                      'Content-Type': 'application/json',
                                      'Authorization': `Bearer ${currentSession.access_token}`,
                        },
                        body: JSON.stringify({ priceId, userId: currentSession.user.id, userEmail: currentSession.user.email }),
            }
                  )
                const data = await response.json()
                if (data.error) throw new Error(data.error)
                window.location.href = data.url
        } catch (err) {
                alert('Erreur : ' + err.message)
        } finally {
                setLoading(null)
        }
  }

  return (
        <section id="pricing" className="py-20 px-6 bg-white">
              <div className="max-w-3xl mx-auto">
                      <div className="text-center mb-12">
                                <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Simple, honest pricing</h2>h2>
                                <p className="text-gray-400 text-sm">No contract. Cancel anytime.</p>p>
                      </div>div>
              
                      <div className="flex flex-col md:flex-row gap-5">
                      
                        {/* Plan Solo */}
                                <div className="flex-1 rounded-2xl p-7 border" style={{ borderColor: '#e5e7eb' }}>
                                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Solo</p>p>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                          <span className="text-4xl font-bold text-gray-900">19</span>span>
                                                          <span className="text-gray-400 text-sm">/mois</span>span>
                                            </div>div>
                                            <p className="text-gray-400 text-xs mb-7">Perfect to get started</p>p>
                                            <ul className="space-y-2.5 mb-8">
                                              {["Google monitoring", "Real-time alerts", "AI-powered replies", "1 location"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-gray-500 text-sm">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>svg>
                            {item}
                          </li>li>
                        ))}
                                            </ul>ul>
                                            <button
                                                            onClick={() => handleCheckout(PRICE_SOLO, 'solo')}
                                                            disabled={loading === 'solo'}
                                                            className="w-full border font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                                                            style={{ borderColor: '#e0e7ff', color: '#6366f1', backgroundColor: '#fafafe' }}
                                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#eef2ff'}
                                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fafafe'}
                                                          >
                                              {loading === 'solo' ? 'Chargement...' : 'Start free trial'}
                                            </button>button>
                                </div>div>
                      
                        {/* Plan Pro */}
                                <div className="flex-1 rounded-2xl p-7 relative" style={{ backgroundColor: '#0f172a' }}>
                                            <span className="absolute top-5 right-5 text-xs font-semibold px-2.5 py-1 rounded-lg"
                                                            style={{ backgroundColor: '#6366f1', color: 'white' }}>
                                                          POPULAR
                                            </span>span>
                                            <p className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: '#64748b' }}>Pro</p>p>
                                            <div className="flex items-baseline gap-1 mb-1">
                                                          <span className="text-4xl font-bold text-white">29</span>span>
                                                          <span className="text-sm" style={{ color: '#64748b' }}>/mois</span>span>
                                            </div>div>
                                            <p className="text-xs mb-7" style={{ color: '#64748b' }}>For growing businesses</p>p>
                                            <ul className="space-y-2.5 mb-8">
                                              {["Everything in Solo", "SMS review requests", "Facebook + TripAdvisor", "Analytics dashboard", "3 locations"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm" style={{ color: '#94a3b8' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>svg>
                            {item}
                          </li>li>
                        ))}
                                            </ul>ul>
                                            <button
                                                            onClick={() => handleCheckout(PRICE_PRO, 'pro')}
                                                            disabled={loading === 'pro'}
                                                            className="w-full text-white font-medium py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50"
                                                            style={{ backgroundColor: '#6366f1' }}
                                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                                                          >
                                              {loading === 'pro' ? 'Chargement...' : 'Start free trial'}
                                            </button>button>
                                </div>div>
                      
                      </div>div>
              </div>div>
        </section>section>
      )
}

export default Pricing</section>
