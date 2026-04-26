function Hero({ onStartFree }) {
  return (
    <section className="flex flex-col items-center text-center px-6 py-20 bg-white">
      
      {/* Badge */}
      <div className="bg-orange-50 text-blue-900 text-sm font-medium px-4 py-2 rounded-full mb-8">
        🌍 AI replies in 12 European languages
      </div>

      {/* Titre */}
      <h1 className="text-5xl font-bold text-blue-900 leading-tight max-w-2xl mb-6">
        All your reviews.<br />
        One place.{" "}
        <span className="text-orange-500">2 minutes a day.</span>
      </h1>

      {/* Sous-titre */}
      <p className="text-gray-500 text-lg max-w-xl mb-10">
        Monitor Google, Facebook and TripAdvisor from one dashboard. Reply in one click.
      </p>

      {/* Boutons */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onStartFree}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-lg"
        >
          Try free 14 days →
        </button>
        <button className="border-2 border-blue-900 text-blue-900 font-semibold px-8 py-3 rounded-xl text-lg hover:bg-blue-50">
          Watch demo →
        </button>
        <p className="text-gray-400 text-sm">No credit card required · Cancel anytime</p>
      </div>

    </section>
  )
}

export default Hero