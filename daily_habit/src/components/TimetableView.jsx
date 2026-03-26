import { useState } from 'react';
import { Plus, Clock, Trash2, Edit3, Check, X, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const COLORS = [
  'from-blue-500 to-cyan-400',
  'from-orange-500 to-red-400',
  'from-green-500 to-emerald-400',
  'from-purple-500 to-pink-400',
  'from-indigo-500 to-blue-400',
  'from-amber-500 to-yellow-400',
  'from-violet-500 to-purple-400',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const EmptyForm = { time: '08:00', title: '', duration: 30, color: COLORS[0], days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] };

export const TimetableView = () => {
  const { userData, updateUserData } = useAuth();
  const timetable = userData?.timetable || [];
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EmptyForm);
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);

  const todayStr = new Date().toISOString().split('T')[0];
  const completedSchedule = userData?.completedSchedule?.[todayStr] || [];

  const toggleDone = (id) => {
    updateUserData(prev => {
      const dayMap = prev.completedSchedule || {};
      const existing = dayMap[todayStr] || [];
      const updated = existing.includes(id) ? existing.filter(x => x !== id) : [...existing, id];
      return { ...prev, completedSchedule: { ...dayMap, [todayStr]: updated } };
    });
  };

  const sorted = [...timetable].sort((a, b) => a.time.localeCompare(b.time));
  const filtered = sorted.filter(e => !e.days || e.days.includes(activeDay));

  const openAdd = () => { setForm(EmptyForm); setEditId(null); setShowForm(true); };
  const openEdit = (entry) => {
    setForm({ time: entry.time, title: entry.title, duration: entry.duration, color: entry.color, days: entry.days || DAYS });
    setEditId(entry.id);
    setShowForm(true);
  };

  const save = () => {
    if (!form.title.trim()) return;
    updateUserData(prev => {
      const list = prev.timetable || [];
      if (editId) {
        return { ...prev, timetable: list.map(e => e.id === editId ? { ...e, ...form } : e) };
      }
      const newEntry = { ...form, id: Date.now() };
      return { ...prev, timetable: [...list, newEntry] };
    });
    setShowForm(false);
  };

  const remove = (id) => {
    updateUserData(prev => ({ ...prev, timetable: (prev.timetable || []).filter(e => e.id !== id) }));
  };

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      days: f.days.includes(day) ? f.days.filter(d => d !== day) : [...f.days, day],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DAYS.map(day => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              activeDay === day ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/8'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-3xl p-8 text-center text-slate-500">
            <Clock size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No schedule for {activeDay}. Add one below.</p>
          </div>
        )}
        {filtered.map((entry, idx) => {
          const done = completedSchedule.includes(entry.id);
          return (
            <div
              key={entry.id}
              className={`glass-card rounded-3xl p-4 flex items-center gap-4 animate-scale-in transition-all duration-300 ${done ? 'opacity-50' : ''}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Color bar */}
              <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${entry.color} flex-shrink-0`} />

              {/* Time */}
              <div className="text-center w-14 flex-shrink-0">
                <p className={`font-black text-sm ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{entry.time}</p>
                <p className="text-slate-600 text-[10px]">{formatDuration(entry.duration)}</p>
              </div>

              {/* Title */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{entry.title}</p>
                <p className="text-slate-500 text-xs mt-0.5">
                  {entry.days ? entry.days.join(', ') : 'Every day'}
                </p>
              </div>

              {/* Done toggle + Actions */}
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => toggleDone(entry.id)}
                  className="p-2 rounded-xl transition-colors"
                  title={done ? 'Mark incomplete' : 'Mark done'}
                >
                  {done
                    ? <CheckCircle2 size={18} className="text-green-400" />
                    : <Circle size={18} className="text-slate-600 hover:text-slate-400" />
                  }
                </button>
                <button onClick={() => openEdit(entry)} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
                  <Edit3 size={14} className="text-slate-400" />
                </button>
                <button onClick={() => remove(entry.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add button */}
      {!showForm && (
        <button
          onClick={openAdd}
          className="w-full glass-card rounded-3xl p-4 flex items-center justify-center gap-2 text-blue-400 hover:bg-white/8 transition-all group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-semibold">Add Schedule Block</span>
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-[2rem] p-6 space-y-4 animate-scale-in border border-blue-500/20">
          <h3 className="text-white font-bold text-sm">{editId ? 'Edit Block' : 'New Schedule Block'}</h3>

          <input
            type="text"
            placeholder="Title (e.g. Morning Workout)"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Start Time</label>
              <input
                type="time"
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="text-slate-500 text-xs mb-1 block">Duration (min)</label>
              <input
                type="number"
                min="5"
                max="480"
                value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: parseInt(e.target.value) || 30 }))}
                className="w-full bg-white/5 border border-white/8 rounded-2xl py-3 px-4 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Days */}
          <div>
            <label className="text-slate-500 text-xs mb-2 block">Repeat on</label>
            <div className="flex gap-2 flex-wrap">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    form.days.includes(day) ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-500 hover:bg-white/10'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="text-slate-500 text-xs mb-2 block">Color</label>
            <div className="flex gap-2">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${c} transition-all ${form.color === c ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={save}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Check size={16} /> Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
