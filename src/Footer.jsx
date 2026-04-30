function Footer({ onStartFree }) {
    return (
          <footer className="py-20 px-6" style={{ backgroundColor: '#0f172a' }}>
                  <div className="max-w-4xl mx-auto">
                  
                          <div className="text-center mb-14">
                                    <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                                                Ready to take control of your reputation?
                                    </h2>h2>
                                    <p className="text-slate-400 text-sm mb-6">Join 500+ local businesses across Europe.</p>p>
                                    <button
                                                  onClick={onStartFree}
                                                  className="text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all"
                                                  style={{ backgroundColor: '#6366f1', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
                                                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f46e5'}
                                                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366f1'}
                                                >
                                                Start your free trial
                                    </button>button>
                          </div>div>
                  
                          <div className="border-t mb-8" style={{ borderColor: '#1e293b' }} />
                  
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
                                                              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>svg>
                                                </div>div>
                                                <span className="text-white font-medium text-sm">Reviewly</span>span>
                                    </div>div>
                          
                                    <div className="flex gap-6 text-slate-500 text-xs">
                                                <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>a>
                                                <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>a>
                                                <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>a>
                                    </div>div>
                          
                                    <div className="text-slate-500 text-xs flex items-center gap-1.5">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>svg>
                                                GDPR compliant
                                    </div>div>
                          </div>div>
                  
                  </div>div>
          </footer>footer>
        )
}

export default Footer</div>
