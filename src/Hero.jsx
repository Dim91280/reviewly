import { useEffect, useRef, useState } from 'react'

function Hero({ onStartFree }) {
  const [visible, setVisible] = useState(false)
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [count3, setCount3] = useState(0)

  useEffect(() => {
    setTimeout(() => setVisible(true), 100)

    // Compteurs animés
    const duration = 1500
    const steps = 40
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      setCount1(Math.min(Math.round((step / steps) * 500), 500))
      setCount2(Math.min(Math.round((step / steps) * 48) / 10, 4.8))
      setCount3(Math.min(Math.round((step / steps) * 12), 12))
      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative overflow-hidden flex flex-col items-center text-center px-6 py-28 md:py-36" style={{ backgroundColor: '#0f172a' }}>

      {/* Dégradé lumineux */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(99,102,241,0.35) 0%, transparent 70%)'
      }} />

      {/* Grille décorative */}
      <div className="absolute inset-0 pointer-events-none opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 flex flex-col items-center">

        {/* Badge */}
        <div
          className="flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 text-xs font-medium"
          style={{
            borderColor: 'rgba(99,102,241,0.4)',
            color: '#a5b4fc',
            backgroundColor: 'rgba(99,102,241,0.1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.6s ease'
          }}
        >
          <span style={{ color: '#6366f1' }}>●</span>
          AI replies in 12 European languages
        </div>

        {/* Titre */}
        <h1
          className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mb-6 tracking-tight text-white"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.1s'
          }}
        >
          All your reviews.<br />
          One place.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            2 minutes a day.
          </span>
        </h1>

        {/* Sous-titre */}
        <p
          className="text-lg max-w-lg mb-10 leading-relaxed"
          style={{
            color: '#94a3b8',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.2s'
          }}
        >
          Monitor Google, Facebook and TripAdvisor from one dashboard. Reply in one click with AI.
        </p>

        {/* CTA */}
        <div
          className="flex flex-col items-center gap-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.7s ease 0.3s'
          }}
        >
          <button
            onClick={onStartFree}
            className="text-white font-semibold px-8 py-3.5 rounded-xl text-base"
            style={{ backgroundColor: '#6366f1', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#4f46e5'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(99,102,241,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = '#6366f1'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Try free 14 days →
          </button>
          <p className="text-xs" style={{ color: '#475569' }}>No credit card required · Cancel anytime</p>
        </div>

        {/* Compteurs */}
        <div
          className="flex items-center gap-8 mt-14"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'all 0.7s ease 0.5s'
          }}
        >
          {[
            { value: `${count1}+`, label: 'businesses' },
            { value: `${count2.toFixed(1)}★`, label: 'average rating' },
            { value: `${count3}`, label: 'languages' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className="text-xs mt-1" style={{ color: '#475569' }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Mockup dashboard */}
        <div
          className="mt-16 w-full max-w-3xl rounded-2xl overflow-hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) perspective(1000px) rotateX(2deg)' : 'translateY(30px) perspective(1000px) rotateX(5deg)',
            transition: 'all 0.9s ease 0.6s',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.2)',
          }}
        >
          {/* Barre de fenêtre */}
          <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: '#1e293b' }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
            <div className="flex-1 mx-4 h-5 rounded-md" style={{ backgroundColor: '#0f172a', maxWidth: '200px' }} />
          </div>

          {/* Contenu mockup */}
          <div className="p-6" style={{ backgroundColor: '#f8fafc' }}>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: 'Reputation score', value: '95', sub: 'Excellent', color: '#22c55e' },
                { label: 'Average rating', value: '4.8', sub: 'Based on 124 reviews', color: '#6366f1' },
                { label: 'Response rate', value: '100%', sub: 'Great job', color: '#22c55e' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 border" style={{ borderColor: '#f1f5f9' }}>
                  <p style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{s.label}</p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>{s.value}</p>
                  <p style={{ fontSize: '10px', color: s.color }}>{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border" style={{ borderColor: '#f1f5f9' }}>
              {[
                { name: 'Marie D.', stars: 5, text: 'Service exceptionnel, je recommande vivement !', platform: 'Google', replied: true },
                { name: 'Thomas B.', stars: 4, text: 'Très bon rapport qualité-prix.', platform: 'TripAdvisor', replied: false },
              ].map((r, i) => (
                <div key={i} className="flex items-start justify-between px-4 py-3 border-b last:border-0" style={{ borderColor: '#f8fafc' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
                      {r.name[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: '600', color: '#111827' }}>{r.name}</p>
                      <p style={{ fontSize: '10px', color: '#94a3b8' }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</p>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: '500', padding: '2px 8px', borderRadius: '6px',
                    backgroundColor: r.replied ? '#f0fdf4' : '#fefce8',
                    color: r.replied ? '#16a34a' : '#ca8a04'
                  }}>
                    {r.replied ? '✓ Replied' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default Hero