import { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, CheckCircle2, BarChart3, Trophy, Plus, Clock, User, Trash2, X, Droplet, Apple, Dumbbell, Book, Moon, Coffee } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { MobileDock } from './components/MobileDock';
import { Timer } from './components/Timer';
import { Heatmap } from './components/Heatmap';
import { TodayView } from './components/TodayView';
import { ChallengesView } from './components/ChallengesView';
import { LifeLog } from './components/LifeLog';
import { TimetableView } from './components/TimetableView';
import { AccountView } from './components/AccountView';
import { LoginPage } from './components/LoginPage';
import { useTimer } from './hooks/useTimer';
import { useAuth } from './context/AuthContext';

const GRADIENTS = [
  'from-blue-500 to-cyan-400',
  'from-green-500 to-emerald-400',
  'from-orange-500 to-red-400',
  'from-purple-500 to-pink-400',
  'from-indigo-500 to-blue-400',
  'from-amber-500 to-yellow-400',
  'from-violet-500 to-purple-400',
];

const TIME_SLOTS = ['morning', 'afternoon', 'evening', 'allday'];
const ICONS = ['water', 'fruits', 'exercise', 'reading'];
const ICON_MAP = { water: Droplet, fruits: Apple, exercise: Dumbbell, reading: Book };

// ── Add Habit Modal ──────────────────────────────────────────────────────────
function AddHabitModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('1');
  const [unit, setUnit] = useState('times');
  const [timeSlot, setTimeSlot] = useState('allday');
  const [icon, setIcon] = useState('water');
  const [gradient, setGradient] = useState(GRADIENTS[0]);

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), goal: parseInt(goal) || 1, unit: unit.trim() || 'times', timeSlot, icon, gradient });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-[2rem] p-6 space-y-4 animate-scale-in border border-blue-500/20">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-black text-lg">New Habit</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            autoFocus
            type="text"
            placeholder="Habit name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Daily Goal</label>
              <input
                type="number" min="1" value={goal}
                onChange={e => setGoal(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Unit</label>
              <input
                type="text" placeholder="min, glasses…" value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Time slot */}
          <div>
            <label className="text-slate-500 text-xs mb-2 block">Time Slot</label>
            <div className="flex gap-2 flex-wrap">
              {TIME_SLOTS.map(s => (
                <button key={s} type="button" onClick={() => setTimeSlot(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${timeSlot === s ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="text-slate-500 text-xs mb-2 block">Icon</label>
            <div className="flex gap-2">
              {ICONS.map(ic => {
                const Ic = ICON_MAP[ic];
                return (
                  <button key={ic} type="button" onClick={() => setIcon(ic)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${icon === ic ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}>
                    <Ic size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-slate-500 text-xs mb-2 block">Color</label>
            <div className="flex gap-2 flex-wrap">
              {GRADIENTS.map(g => (
                <button key={g} type="button" onClick={() => setGradient(g)}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${g} transition-all ${gradient === g ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`} />
              ))}
            </div>
          </div>

          <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-xl shadow-blue-600/30">
            Add Habit
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, delay = 0 }) => (
  <div className="glass-card rounded-[1.75rem] p-5 animate-scale-in" style={{ animationDelay: `${delay}ms` }}>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
    <p className="text-white text-3xl font-black mb-1">{value}</p>
    <p className="text-slate-500 text-xs">{sub}</p>
  </div>
);

// ── Arc Progress ─────────────────────────────────────────────────────────────
const ArcProgress = ({ percent, color = '#3b82f6', size = 120 }) => {
  const r = 46, circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        className="arc-animate" style={{ filter: `drop-shadow(0 0 6px ${color}88)` }} />
    </svg>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────────────
function DashboardView({ habits, timerProps, streak, bestStreak, weekDays, onNavigate }) {
  const completed = habits.filter(h => h.current >= h.goal).length;
  const total = habits.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Timer {...timerProps} />
        </div>
        <div className="glass-card rounded-[2.5rem] p-6 flex flex-col items-center justify-center gap-3">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Today's Progress</p>
          <div className="relative">
            <ArcProgress percent={pct} color="#3b82f6" size={130} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-3xl font-black">{pct}%</span>
              <span className="text-slate-500 text-xs">{completed}/{total}</span>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-semibold">{completed} habits done</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Streak" value={`🔥 ${streak}`} sub="days in a row" delay={0} />
        <StatCard label="This Week" value={`${weekDays}/7`} sub="days active" delay={80} />
        <StatCard label="Best Streak" value={bestStreak} sub="days" delay={160} />
        <StatCard label="Total Habits" value={total} sub="active habits" delay={240} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Heatmap />
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-white font-bold text-sm tracking-tight">Today's Habits</h3>
            <button onClick={() => onNavigate('Today')} className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              View all →
            </button>
          </div>
          <div className="space-y-3">
            {habits.slice(0, 4).map((h, idx) => {
              const p = Math.min((h.current / h.goal) * 100, 100);
              const done = h.current >= h.goal;
              return (
                <div key={h.id} className="glass-card rounded-2xl p-4 animate-fade-left" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-sm font-semibold ${done ? 'text-slate-400 line-through' : 'text-white'}`}>{h.name}</span>
                    <span className="text-xs text-slate-400">{h.current}/{h.goal} {h.unit}</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${h.gradient} progress-bar rounded-full`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Habits Page ──────────────────────────────────────────────────────────────
function HabitsView({ habits, onToggle, onDelete, onAdd }) {
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-white font-black text-xl">All Habits</h2>
        <button onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-2xl text-white text-sm font-bold hover:bg-blue-500 transition-colors active:scale-95">
          <Plus size={16} /> Add Habit
        </button>
      </div>

      {habits.length === 0 && (
        <div className="glass-card rounded-3xl p-10 text-center text-slate-500">
          <CheckCircle2 size={36} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm">No habits yet. Add your first one!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {habits.map((h, idx) => {
          const p = Math.min((h.current / h.goal) * 100, 100);
          const done = h.current >= h.goal;
          const isConfirming = confirmDelete === h.id;
          return (
            <div key={h.id}
              className={`glass-card rounded-[1.75rem] p-5 animate-scale-in transition-all ${done ? 'opacity-70' : ''}`}
              style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 cursor-pointer" onClick={() => onToggle(h.id)}>
                  <h4 className={`font-bold text-sm ${done ? 'text-slate-400 line-through' : 'text-white'}`}>{h.name}</h4>
                  <p className="text-slate-500 text-xs mt-0.5 capitalize">{h.timeSlot}</p>
                </div>
                <div className="flex items-center gap-2 ml-2">
                  <span className={`text-xs font-black bg-gradient-to-r ${h.gradient} bg-clip-text text-transparent`}>
                    {Math.round(p)}%
                  </span>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className={`p-1.5 rounded-xl transition-all ${isConfirming ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-slate-600 hover:text-red-400 hover:bg-red-500/10'}`}
                    title={isConfirming ? 'Tap again to confirm delete' : 'Delete habit'}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden cursor-pointer" onClick={() => onToggle(h.id)}>
                <div className={`h-full bg-gradient-to-r ${h.gradient} progress-bar rounded-full`} style={{ width: `${p}%` }} />
              </div>
              <p className="text-slate-500 text-xs mt-2">{h.current} / {h.goal} {h.unit}</p>
              {isConfirming && (
                <p className="text-red-400 text-xs mt-2 font-semibold animate-fade-up">Tap trash again to delete</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const { currentUser, userData, loading, updateUserData, recordDailyProgress } = useAuth();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showAddHabit, setShowAddHabit] = useState(false);

  const timerDuration = userData?.timerDuration || 3212;
  const timerProps = useTimer(timerDuration);

  useEffect(() => {
    if (userData?.timerDuration && userData.timerDuration !== timerProps.totalSeconds) {
      timerProps.updateDuration(userData.timerDuration);
    }
  }, [userData?.timerDuration]);

  const habits = userData?.habits || [];

  const handleToggleHabit = (id) => {
    const updated = habits.map(h => {
      if (h.id !== id) return h;
      const next = h.current < h.goal ? h.current + 1 : 0;
      return { ...h, current: next };
    });
    updateUserData({ habits: updated });
    recordDailyProgress(updated);
  };

  const handleDeleteHabit = (id) => {
    const updated = habits.filter(h => h.id !== id);
    updateUserData({ habits: updated });
  };

  const handleAddHabit = (data) => {
    const newHabit = { id: Date.now(), current: 0, ...data };
    updateUserData({ habits: [...habits, newHabit] });
  };

  const handleUpdateTimer = (secs, label) => {
    timerProps.updateDuration(secs);
    updateUserData({ timerDuration: secs, timerLabel: label });
  };

  const weekDays = (() => {
    const log = userData?.dailyLog || {};
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      if (log[key] !== undefined) count++;
    }
    return count;
  })();

  const menu = [
    { id: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'Today', icon: <Calendar size={20} /> },
    { id: 'Timetable', icon: <Clock size={20} /> },
    { id: 'Challenges', icon: <Trophy size={20} /> },
    { id: 'Life Log', icon: <BarChart3 size={20} /> },
    { id: 'Habits', icon: <CheckCircle2 size={20} /> },
    { id: 'Account', icon: <User size={20} /> },
  ];

  const renderView = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <DashboardView
            habits={habits}
            timerProps={{ ...timerProps, onUpdateTimer: handleUpdateTimer }}
            streak={userData?.streak || 0}
            bestStreak={userData?.bestStreak || 0}
            weekDays={weekDays}
            onNavigate={setActiveTab}
          />
        );
      case 'Today':
        return <TodayView habits={habits} onToggleHabit={handleToggleHabit} onAddHabit={() => setShowAddHabit(true)} />;
      case 'Timetable':
        return <TimetableView />;
      case 'Challenges':
        return <ChallengesView />;
      case 'Life Log':
        return <LifeLog />;
      case 'Account':
        return <AccountView />;
      case 'Habits':
        return (
          <HabitsView
            habits={habits}
            onToggle={handleToggleHabit}
            onDelete={handleDeleteHabit}
            onAdd={() => setShowAddHabit(true)}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1014] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return <LoginPage />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0F1014] text-slate-400">
      <Sidebar menu={menu} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col overflow-y-auto pb-28 lg:pb-0 custom-scrollbar">
        <div className="p-5 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-8 animate-fade-left">
            <p className="text-slate-500 text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-white text-3xl font-black tracking-tight mt-1">{activeTab}</h1>
          </div>
          {renderView()}
        </div>
      </main>

      <MobileDock menu={menu} activeTab={activeTab} setActiveTab={setActiveTab} />

      {showAddHabit && (
        <AddHabitModal onClose={() => setShowAddHabit(false)} onSave={handleAddHabit} />
      )}
    </div>
  );
}
