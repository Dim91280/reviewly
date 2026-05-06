import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.2) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

function Testimonials() {
  const [sectionRef, inView] = useInView()
  const [active, setActive] = useState(0)

  const testimonials = [
    {
      name: "Marie Dubois",
      business: "Restaurant owner, Lyon",
      avatar: "MD",
      flag: "🇫🇷",
      text: "Since I started using Reviewly, I reply to every review in under a minute. My rating went from 4.1 to 4.6 in 3 months.",
      metric: "+0.5★",
      metricLabel: "in 3 months"
    },
    {
      name: "Carlos Méndez",
      business: "Hairdresser, Madrid",
      avatar: "CM",
      flag: "🇪🇸",
      text: "I used to miss negative reviews for days. Now I get an alert instantly and can respond before it damages my reputation.",
      metric: "< 1min",
      metricLabel: "response time"
    },
    {
      name: "Thomas Becker",
      business: "Plumber, Berlin",
      avatar: "TB",
      flag: "🇩🇪",
      text: "The SMS review request feature doubled my number of Google reviews in 6 weeks. My phone keeps ringing.",
      metric: "2x",
      metricLabel: "more reviews"
    }
  ]

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#0f172a' }}>

      {/* Dégradé décoratif */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(99,102,241,0.15) 0%, transparent 70%)'
      }} />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease'
        }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Testimonials</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Trusted by local businesses<br />across Europe
          </h2>
        </div>

        {/* Carousel */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(32px)',
          transition: 'all 0.7s ease 0.2s'
        }}>
          {/* Card active */}
          <div className="rounded-2xl p-8 md:p-10 mb-6 relative" style={{
            backgroundColor: '#1e293b',
            border: '1px solid rgba(99,102,241,0.2)',
            transition: 'all 0.4s ease'
          }}>
            {/* Quote décorative */}
            <div className="absolute top-6 right-8 text-6xl font-serif leading-none" style={{ color: 'rgba(99,102,241,0.15)' }}>"</div>

            <div className="flex items-start gap-6 mb-6">
              {/* Métrique */}
              <div className="hidden md:flex flex-col items-center justify-center rounded-2xl px-6 py-4 flex-shrink-0" style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <span className="text-3xl font-bold" style={{ color: '#6366f1' }}>{testimonials[active].metric}</span>
                <span className="text-xs mt-1" style={{ color: '#64748b' }}>{testimonials[active].metricLabel}</span>
              </div>

              {/* Texte */}
              <div>
                <div className="mb-4" style={{ color: '#fbbf24', fontSize: '18px', letterSpacing: '2px' }}>★★★★★</div>
                <p className="text-lg leading-relaxed" style={{ color: '#cbd5e1' }}>
                  "{testimonials[active].text}"
                </p>
              </div>
            </div>

            {/* Auteur */}
            <div className="flex items-center gap-3 pt-6" style={{ borderTop: '1px solid rgba(99,102,241,0.1)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#6366f1', color: 'white' }}>
                {testimonials[active].avatar}
              </div>
              <div>
                <p className="font-semibold text-sm text-white">{testimonials[active].name} {testimonials[active].flag}</p>
                <p className="text-xs" style={{ color: '#475569' }}>{testimonials[active].business}</p>
              </div>
            </div>
          </div>

          {/* Dots navigation */}
          <div className="flex items-center justify-center gap-3">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  width: i === active ? '28px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  backgroundColor: i === active ? '#6366f1' : '#1e293b',
                  border: '1px solid',
                  borderColor: i === active ? '#6366f1' : '#334155',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  padding: 0
                }}
              />
            ))}
          </div>

          {/* Mini cards des autres */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {testimonials.map((t, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="rounded-xl p-4 text-left transition-all"
                style={{
                  backgroundColor: i === active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: i === active ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.1)',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === active ? '#6366f1' : '#1e293b', color: 'white' }}>
                    {t.avatar}
                  </div>
                  <span className="text-xs font-medium" style={{ color: i === active ? '#f1f5f9' : '#475569' }}>{t.name}</span>
                  <span>{t.flag}</span>
                </div>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: '#334155' }}>{t.text}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials