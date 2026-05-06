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

function Problems() {
  const [sectionRef, inView] = useInView()

  const problems = [
    {
      emoji: "😓",
      title: "Manual monitoring",
      text: "You check Google reviews manually every morning — wasting 30 minutes you don't have."
    },
    {
      emoji: "😤",
      title: "Slow responses",
      text: "A negative review stays unanswered for days, damaging your reputation while you sleep."
    },
    {
      emoji: "😕",
      title: "No visibility",
      text: "You have no idea what your overall reputation score is or how you compare to competitors."
    }
  ]

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#ffffff' }}>

      {/* Transition depuis le Hero sombre */}
      <div className="absolute top-0 left-0 right-0 h-16 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, #0f172a, #ffffff)'
      }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease'
        }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>The problem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Sound familiar?</h2>
          <p className="text-gray-400 mt-3 text-sm">Managing reviews manually is a losing battle.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex-1 rounded-2xl p-6 border group cursor-default"
              style={{
                borderColor: '#f1f5f9',
                backgroundColor: '#fafafa',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(32px)',
                transition: `all 0.6s ease ${0.1 + index * 0.15}s`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#e0e7ff'
                e.currentTarget.style.backgroundColor = '#fafafe'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(99,102,241,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#f1f5f9'
                e.currentTarget.style.backgroundColor = '#fafafa'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span className="text-3xl mb-4 block">{problem.emoji}</span>
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{problem.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{problem.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Problems