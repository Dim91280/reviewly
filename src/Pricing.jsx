function Pricing() {
  return (
    <section className="bg-gray-50 py-20 px-6">

      {/* Titre */}
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-4">
        Simple, honest pricing
      </h2>
      <p className="text-gray-500 text-center mb-12">
        No contract. Cancel anytime.
      </p>

      {/* Cartes */}
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
          <button className="w-full border-2 border-blue-900 text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50">
            Start free trial
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
          <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl">
            Start free trial
          </button>
        </div>

      </div>
    </section>
  )
}

export default Pricing