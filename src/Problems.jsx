function Problems() {
  const problems = [
    {
      emoji: "😓",
      text: "You check Google reviews manually every morning"
    },
    {
      emoji: "😤",
      text: "A negative review stays unanswered for days"
    },
    {
      emoji: "😕",
      text: "You have no idea what your overall reputation score is"
    }
  ]

  return (
    <section className="bg-gray-50 py-20 px-6">
      
      {/* Titre */}
      <h2 className="text-3xl font-bold text-blue-900 text-center mb-12">
        Sound familiar?
      </h2>

      {/* Cartes */}
      <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
        {problems.map((problem, index) => (
          <div key={index} className="bg-white rounded-2xl p-8 flex-1 shadow-sm text-center">
            <div className="text-4xl mb-4">{problem.emoji}</div>
            <p className="text-gray-600 text-lg">{problem.text}</p>
          </div>
        ))}
      </div>

    </section>
  )
}

export default Problems