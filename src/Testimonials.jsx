function Testimonials() {
  const testimonials = [
    {
      name: "Marie Dubois",
      business: "Restaurant owner, Lyon",
      avatar: "MD",
      text: "Since I started using Reviewly, I reply to every review in under a minute. My rating went from 4.1 to 4.6 in 3 months."
    },
    {
      name: "Carlos Méndez",
      business: "Hairdresser, Madrid",
      avatar: "CM",
      text: "I used to miss negative reviews for days. Now I get an alert instantly and can respond before it damages my reputation."
    },
    {
      name: "Thomas Becker",
      business: "Plumber, Berlin",
      avatar: "TB",
      text: "The SMS review request feature doubled my number of Google reviews in 6 weeks. My phone keeps ringing."
    }
  ]

  return (
    <section className="py-20 px-6 bg-white">

      {/* Titre */}
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
        Trusted by local businesses across Europe
      </h2>

      {/* Cartes */}
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, index) => (
          <div key={index} className="flex-1 bg-gray-50 rounded-2xl p-8">
            
            {/* Étoiles */}
            <div className="text-orange-400 text-lg mb-4">★★★★★</div>
            
            {/* Texte */}
            <p className="text-gray-600 mb-6 italic">"{t.text}"</p>
            
            {/* Avatar + Nom */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {t.avatar}
              </div>
              <div>
                <p className="text-blue-900 font-semibold text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.business}</p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  )
}

export default Testimonials