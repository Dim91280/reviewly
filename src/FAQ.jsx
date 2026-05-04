function FAQ() {
  const faqs = [
    {
      q: "Which platforms do you support?",
      a: "Currently Google Business Profile, TripAdvisor and Facebook. More platforms coming soon."
    },
    {
      q: "How does the AI reply feature work?",
      a: "Our AI analyzes the review content and generates a personalized, professional reply in seconds. You can edit it before sending."
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
      a: "The AI can generate replies in 12 European languages including English, French, Spanish, German, Italian, Portuguese and more."
    }
  ]

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Frequently asked questions</h2>
          <p className="text-gray-400 text-sm">Everything you need to know about Reviewly.</p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group border rounded-2xl px-6 py-5 cursor-pointer" style={{ borderColor: '#f1f5f9' }}>
              <summary className="flex items-center justify-between text-sm font-medium text-gray-900 list-none">
                {faq.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </summary>
              <p className="mt-3 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ