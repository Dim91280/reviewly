function Footer({ onStartFree }) {
  return (
    <footer className="py-20 px-6" style={{ backgroundColor: '#0f172a' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
            Ready to take control of your reputation?
          </h2>
          <p className="text-slate-400 text-sm mb-6">Join 500+ local businesses across Europe.</p>
          <button onClick={onStartFree}
            className="text-white font-semibold px-7 py-3 rounded-xl text-sm"
            style={{ backgroundColor: '#6366f1' }}>
            Start your free trial
          </button>
        </div>
        <div className="border-t mb-8" style={{ borderColor: '#1e293b' }} />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#6366f1' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <span className="text-white font-medium text-sm">Reviewly</span>
          </div>
          <div className="flex gap-6 text-slate-500 text-xs">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
          <p className="text-slate-500 text-xs">GDPR compliant</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer