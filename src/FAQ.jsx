import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.15) {
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

const faqs = [
  {
    q: 'Which platforms do you support?',
    a: 'Replios currently supports Google Business Profile. Connect your account via Google OAuth and your reviews sync automatically.',
  },
  {
    q: 'How does the AI reply feature work?',
    a: 'Our AI analyzes the review content, your business sector, and your preferred tone to generate a personalized, professional reply in seconds. You can edit it before publishing.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, absolutely. No commitment, no cancellation fees. You can cancel from your account settings at any time.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We are GDPR compliant and your data is stored securely in Europe. We never sell your data to third parties.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'Yes! Every new account gets a 14-day free trial, no credit card required.',
  },
  {
    q: 'What languages does the AI support?',
    a: 'The AI replies in the language of the review — French, English, Spanish, German, Italian and more are supported automatically.',
  },
]

function FAQ() {
  const [sectionRef, inView] = useInView()
  const [openIndex, setOpenIndex] = useState(null)

  const fade = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  })

  return (
    <section id="faq" ref={sectionRef} style={{
      padding: '100px 48px',
      background: '#05080F',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px', ...fade(0) }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontSize: '11px', fontWeight: '700', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#818CF8', marginBottom: '20px',
          }}>
            <span style={{ width: '24px', height: '1px', background: '#6366F1', display: 'inline-block' }} />
            FAQ
            <span style={{ width: '24px', height: '1px', background: '#6366F1', display: 'inline-block' }} />
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: '900',
            letterSpacing: '-1.5px', lineHeight: '1.05', color: '#F1F5F9',
            marginBottom: '12px',
          }}>
            Frequently asked questions
          </h2>
          <p style={{ fontSize: '15px', color: '#475569' }}>
            Everything you need to know about Replios.
          </p>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: openIndex === i ? 'rgba(99,102,241,0.06)' : '#0D1220',
                border: `1px solid ${openIndex === i ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: '12px',
                overflow: 'hidden',
                transition: 'border-color 0.2s, background 0.2s',
                ...fade(0.05 * i),
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', padding: '20px 24px',
                  textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{
                  fontSize: '14px', fontWeight: '600',
                  color: openIndex === i ? '#F1F5F9' : '#CBD5E1',
                  paddingRight: '16px', lineHeight: '1.4',
                }}>
                  {faq.q}
                </span>
                <div style={{
                  flexShrink: 0, width: '24px', height: '24px', borderRadius: '6px',
                  background: openIndex === i ? '#6366F1' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${openIndex === i ? '#6366F1' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={openIndex === i ? 'white' : '#475569'}
                    strokeWidth="2.5"
                    style={{
                      transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>

              <div style={{
                maxHeight: openIndex === i ? '200px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease',
              }}>
                <p style={{
                  padding: '0 24px 20px',
                  fontSize: '13px', color: '#64748B', lineHeight: '1.7',
                }}>
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
