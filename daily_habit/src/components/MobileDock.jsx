export const MobileDock = ({ menu, activeTab, setActiveTab }) => (
  <nav className="lg:hidden fixed bottom-5 left-5 right-5 bg-[#161922]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] flex justify-around items-center py-3 px-2 shadow-2xl z-[100]">
    {menu.map(item => (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${
          activeTab === item.id
            ? 'text-blue-400 bg-blue-500/10 scale-110'
            : 'text-slate-600 hover:text-slate-400'
        }`}
      >
        {item.icon}
        <span className="text-[9px] font-bold uppercase tracking-wider">{item.id}</span>
      </button>
    ))}
  </nav>
);
