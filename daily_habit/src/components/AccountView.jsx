import { useState } from 'react';
import { User, Flame, Calendar, RotateCcw, LogOut, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AccountView = () => {
  const { currentUser, userData, logout, resetAccount } = useAuth();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const joinedDate = userData?.createdAt
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  const totalDaysTracked = Object.keys(userData?.dailyLog || {}).length;
  const daysWithActivity = Object.values(userData?.dailyLog || {}).filter(d => d.pct >= 50).length;

  const handleReset = () => {
    resetAccount();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-up max-w-lg">
      {/* Profile Card */}
      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl font-black">{currentUser}</h2>
            <p className="text-slate-500 text-sm">Member since {joinedDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <p className="text-white text-2xl font-black">{userData?.streak || 0}</p>
            <p className="text-slate-500 text-xs mt-0.5">Current Streak</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <p className="text-white text-2xl font-black">{userData?.bestStreak || 0}</p>
            <p className="text-slate-500 text-xs mt-0.5">Best Streak</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 text-center">
            <p className="text-white text-2xl font-black">{daysWithActivity}</p>
            <p className="text-slate-500 text-xs mt-0.5">Active Days</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card rounded-[2rem] p-6 space-y-4">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Account Stats</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm flex items-center gap-2"><Calendar size={14} /> Days Tracked</span>
            <span className="text-white font-bold">{totalDaysTracked}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm flex items-center gap-2"><Flame size={14} className="text-orange-400" /> Consistency Rate</span>
            <span className="text-white font-bold">
              {totalDaysTracked > 0 ? Math.round((daysWithActivity / totalDaysTracked) * 100) : 0}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm flex items-center gap-2"><Shield size={14} className="text-blue-400" /> Active Habits</span>
            <span className="text-white font-bold">{userData?.habits?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-[2rem] p-6 border border-red-500/10">
        <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
          <AlertTriangle size={14} /> Danger Zone
        </h3>

        {resetDone && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-3 mb-4 text-green-400 text-sm font-semibold text-center">
            Account reset successfully. Fresh start!
          </div>
        )}

        {!showResetConfirm ? (
          <div className="space-y-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 rounded-2xl transition-all group"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-red-400" />
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">Full Account Reset</p>
                  <p className="text-slate-500 text-xs">Clears all habits, logs, and streaks</p>
                </div>
              </div>
              <span className="text-red-400 text-xs font-bold">Reset</span>
            </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/8 rounded-2xl transition-all"
            >
              <LogOut size={18} className="text-slate-400" />
              <span className="text-slate-300 text-sm font-semibold">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 space-y-3">
            <p className="text-white text-sm font-semibold">Are you sure?</p>
            <p className="text-slate-400 text-xs">This will delete all your habit data, streaks, and logs. This cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-white/8 hover:bg-white/12 text-slate-300 text-sm font-bold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
