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

function FAQ() {
  const [sectionRef, inView] = useInView()
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      q: "Which platforms do you support?",
      a: "Replio currently supports Google Business Profile. Connect your account via Google OAuth and your reviews sync automatically."
    },
    {
      q: "How does the AI reply feature work?",
      a: "Our AI analyzes the review content, your business sector, and your preferred tone to generate a personalized, professional reply in seconds. You can edit it before publishing."
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, absolutely. No commitment, no cancellation fees. You can cancel from your account settings at any time."
    },
    {
      q: "Is my data safe?",
      a: "Yes. We are GDPR compliant and your data is stored securely in Europe. We never sell your data to third parties."
    },
    {
      q: "Do you offer a free trial?",
      a: "Yes! Every new account gets a 14-day free trial, no credit card required."
    },
    {
      q: "What languages does the AI support?",
      a: "The AI can generate replies in the language of the review — French, English, Spanish, German, Italian and more are supported automatically."
    }
  ]

  return (
    <section id="faq" ref={sectionRef} className="py-24 px-6" style={{ backgroundColor: '#ffffff' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14" style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.6s ease'
        }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Frequently asked questions</h2>
          <p className="text-gray-400 mt-3 text-sm">Everything you need to know about Replio.</p>
        </div>

        {/* Questions */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                border: '1px solid',
                borderColor: openIndex === i ? '#e0e7ff' : '#f1f5f9',
                backgroundColor: openIndex === i ? '#fafafe' : '#ffffff',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.5s ease ${0.05 * i}s, transform 0.5s ease ${0.05 * i}s, border-color 0.2s, background-color 0.2s`,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="text-sm font-medium text-gray-900 pr-4">{faq.q}</span>
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: openIndex === i ? '#6366f1' : '#f1f5f9',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={openIndex === i ? 'white' : '#94a3b8'}
                    strokeWidth="2.5"
                    style={{
                      transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {/* Réponse animée */}
              <div style={{
                maxHeight: openIndex === i ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease'
              }}>
                <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
