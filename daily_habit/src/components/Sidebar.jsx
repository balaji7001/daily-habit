import { Flame, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ menu, activeTab, setActiveTab }) => {
  const { currentUser, userData, logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-20 xl:w-64 bg-[#0c0e14] border-r border-white/5 p-4 xl:p-6 h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 px-1 xl:px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
          <Flame className="text-white" size={20} />
        </div>
        <span className="hidden xl:block text-white font-black text-lg tracking-tight">HabitFlow</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={item.id}
            className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20'
                : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
            }`}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="hidden xl:block text-sm font-semibold">{item.id}</span>
          </button>
        ))}
      </nav>

      {/* User + streak */}
      <div className="space-y-2 mt-4">
        <div className="hidden xl:flex items-center gap-3 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <Flame size={16} className="text-orange-400" />
          </div>
          <div>
            <p className="text-white text-sm font-bold">{userData?.streak || 0} day streak</p>
            <p className="text-orange-400 text-xs">Keep it up!</p>
          </div>
        </div>

        <div className="hidden xl:flex items-center justify-between p-3 rounded-2xl bg-white/5">
          <span className="text-slate-400 text-sm font-semibold truncate">{currentUser}</span>
          <button onClick={logout} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Sign out">
            <LogOut size={14} className="text-slate-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};
