function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center">
          <span className="text-orange-400 text-lg">★</span>
        </div>
        <span className="text-blue-900 font-bold text-xl">Reviewly</span>
      </div>

      {/* Liens */}
      <div className="hidden md:flex items-center gap-8 text-gray-500 text-sm">
        <a href="#" className="hover:text-blue-900">Features</a>
        <a href="#" className="hover:text-blue-900">Pricing</a>
        <a href="#" className="hover:text-blue-900">FAQ</a>
      </div>

      {/* Bouton CTA */}
      <button className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-lg">
        Start free
      </button>

    </nav>
  )
}

export default Navbar