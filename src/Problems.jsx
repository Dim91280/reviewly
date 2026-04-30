function Problems() {
    const problems = [
      { emoji: "😓", text: "You check Google reviews manually every morning" },
      { emoji: "😤", text: "A negative review stays unanswered for days" },
      { emoji: "😕", text: "You have no idea what your overall reputation score is" }
        ]

  return (
        <section className="py-20 px-6" style={{ backgroundColor: '#f8fafc' }}>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-10 tracking-tight">
                        Sound familiar?
                </h2>h2>
              <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                {problems.map((problem, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 flex-1 border flex items-start gap-4" style={{ borderColor: '#f1f5f9' }}>
                                <span className="text-2xl flex-shrink-0">{problem.emoji}</span>span>
                                <p className="text-gray-500 text-sm leading-relaxed">{problem.text}</p>p>
                    </div>div>
                  ))}
              </div>div>
        </section>section>
      )
}

export default Problems</h2>
