function Footer() {
  return (
    <footer className="bg-blue-900 py-16 px-6">

      {/* CTA final */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Ready to take control of your reputation?
        </h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl text-lg">
          Start your free trial
        </button>
      </div>

      {/* Séparateur */}
      <div className="border-t border-blue-800 max-w-4xl mx-auto mb-8"></div>

      {/* Liens */}
      <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">★</span>
          </div>
          <span className="text-white font-bold">Reviewly</span>
        </div>

        {/* Liens */}
        <div className="flex gap-6 text-blue-300 text-sm">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Contact</a>
        </div>

        {/* Badge RGPD */}
        <div className="text-blue-300 text-sm">
          🔒 GDPR compliant
        </div>

      </div>

    </footer>
  )
}

export default Footer