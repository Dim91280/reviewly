function Hero({ onStartFree }) {
  return (
    <section className="flex flex-col items-center text-center px-6 py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #eef2ff 0%, transparent 70%)' }} />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 text-xs font-medium" style={{ borderColor: '#e0e7ff', color: '#6366f1', backgroundColor: '#fafafa' }}>
          AI replies in 12 European languages
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-3xl mb-6 tracking-tight">
          All your reviews.<br />
          One place.{" "}
          <span style={{ color: '#6366f1' }}>2 minutes a day.</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
          Monitor Google, Facebook and TripAdvisor from one dashboard. Reply in one click with AI.
        </p>
        <div className="flex flex-col items-center gap-3">
          <button onClick={onStartFree} className="text-white font-semibold px-8 py-3.5 rounded-xl text-base" style={{ backgroundColor: '#6366f1' }}>
            Try free 14 days
          </button>
          <p className="text-gray-400 text-xs">No credit card required · Cancel anytime</p>
        </div>
      </div>
    </section>
  )
}

export default Hero
