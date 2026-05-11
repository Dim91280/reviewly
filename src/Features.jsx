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

function Features() {
  const [sectionRef, inView] = useInView()

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      tag: 'Monitoring',
      title: "Real-time alerts",
      description: "Get notified instantly the moment a new review is posted on your Google Business Profile — never miss one again.",
      stat: '< 1min',
      statLabel: 'response time'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      tag: 'AI',
      title: "AI-powered replies",
      description: "Respond to any review in one click with smart, personalized suggestions — tailored to your business tone and sector.",
      stat: '1 click',
      statLabel: 'to reply'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      ),
      tag: 'Reputation',
      title: "Track your reputation",
      description: "Monitor your average rating, response rate, and reputation score from one clean dashboard. Know exactly where you stand.",
      stat: '100%',
      statLabel: 'visibility'
    }
  ]

  return (
    <section id="features" ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-14" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease'
        }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Your reputation, under control</h2>
          <p className="text-gray-400 mt-3 text-sm">Everything you need. Nothing you don't.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-2xl p-6 border flex flex-col"
              style={{
                borderColor: '#f1f5f9',
                backgroundColor: '#fafafe',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transition: `all 0.6s ease ${0.1 + index * 0.15}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e0e7ff'
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 16px 40px rgba(99,102,241,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#f1f5f9'
                e.currentTarget.style.backgroundColor = '#fafafe'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Tag */}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg mb-4 self-start" style={{ backgroundColor: '#eef2ff', color: '#6366f1' }}>
                {feature.tag}
              </span>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#eef2ff' }}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">{feature.description}</p>

              {/* Stat */}
              <div className="mt-5 pt-4 border-t flex items-baseline gap-2" style={{ borderColor: '#f1f5f9' }}>
                <span className="text-2xl font-bold" style={{ color: '#6366f1' }}>{feature.stat}</span>
                <span className="text-xs text-gray-400">{feature.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
