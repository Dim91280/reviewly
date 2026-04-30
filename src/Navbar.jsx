function Navbar({ onStartFree }) {
    return (
          <nav className="w-full flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>svg>
                        </div>div>
                        <span className="font-semibold text-gray-900 text-sm tracking-tight">Reviewly</span>span>
                </div>div>
          
                <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
                        <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>a>
                        <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>a>
                        <a href="#testimonials" className="hover:text-gray-900 transition-colors">Testimonials</a>a>
                </div>div>
          
                <button
                          onClick={onStartFree}
                          className="text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          style={{ backgroundColor: '#6366f1' }}
                          onMouseEnter={e => e.target.style.backgroundColor = '#4f46e5'}
                          onMouseLeave={e => e.target.style.backgroundColor = '#6366f1'}
                        >
                        Start free
                </button>button>
          </nav>nav>
        )
}

export default Navbar</nav>
