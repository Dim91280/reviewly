function Hero({ onStartFree }) {
    return (
          <section className="flex flex-col items-center text-center px-6 py-24 bg-white relative overflow-hidden">
          
                <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% -10%, #eef2ff 0%, transparent 70%)'
          }} />
          
                <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 text-xs font-medium"
                                    style={{ borderColor: '#e0e7ff', color: '#6366f1', backgroundColor: '#fafafa' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#6366f1"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>svg>
                                  AI replies in 12 European languages
                        </div>div>
                
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-3xl mb-6 tracking-tight">
                                  All your reviews.<br />
                                  One place.{" "}
                                  <span style={{ color: '#6366f1' }}>2 minutes a day.</span>span>
                        </h1>h1>
                
                        <p className="text-gray-400 text-lg max-w-lg mb-10 leading-relaxed">
                                  Monitor Google, Facebook and TripAdvisor from one dashboard. Reply in one click with AI.
                        </p>p>
                
                        <div className="flex flex-col items-center gap-3">
                                  <button
                                                onClick={onStartFree}
                                                className="text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all"
                                                style={{ backgroundColor: '#6366f1', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                                              >
                                              Try free 14 days
                                  </button>button>
                                  <p className="text-gray-400 text-xs">No credit card required · Cancel anytime</p>p>
                        </div>div>
                
                        <div className="flex items-center gap-6 mt-12 pt-12 border-t w-full max-w-sm" style={{ borderColor: '#f1f5f9' }}>
                                  <div className="text-center flex-1">
                                              <p className="text-2xl font-bold text-gray-900">4.8★</p>p>
                                              <p className="text-xs text-gray-400 mt-0.5">Average rating</p>p>
                                  </div>div>
                                  <div className="w-px h-8 bg-gray-100" />
                                  <div className="text-center flex-1">
                                              <p className="text-2xl font-bold text-gray-900">2 min</p>p>
                                              <p className="text-xs text-gray-400 mt-0.5">Daily average</p>p>
                                  </div>div>
                                  <div className="w-px h-8 bg-gray-100" />
                                  <div className="text-center flex-1">
                                              <p className="text-2xl font-bold text-gray-900">500+</p>p>
                                              <p className="text-xs text-gray-400 mt-0.5">Businesses</p>p>
                                  </div>div>
                        </div>div>
                </div>div>
          </section>section>
        )
}

export default Hero</section>
