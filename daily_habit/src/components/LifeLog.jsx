import { useState } from 'react';
import { TrendingUp, Dumbbell, Meh } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const moodEmoji = ['', '😞', '😕', '😐', '😊', '🔥'];
const moodColor = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];

function getLast7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

function formatDateLabel(dateStr) {
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  const yestStr = yest.toISOString().split('T')[0];
  if (dateStr === today) return 'Today';
  if (dateStr === yestStr) return 'Yesterday';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export const LifeLog = () => {
  const { userData, updateUserData } = useAuth();
  const [activeLog, setActiveLog] = useState(null);
  const [moodInput, setMoodInput] = useState({});
  const [noteInput, setNoteInput] = useState({});

  const dailyLog = userData?.dailyLog || {};
  const last7 = getLast7Days();

  const barData = last7.map(d => ({
    date: d,
    pct: dailyLog[d]?.pct ?? 0,
    label: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][new Date(d).getDay() === 0 ? 6 : new Date(d).getDay() - 1],
  }));

  const logEntries = last7
    .filter(d => dailyLog[d] !== undefined)
    .reverse()
    .map(d => ({
      date: d,
      label: formatDateLabel(d),
      pct: dailyLog[d]?.pct ?? 0,
      completed: dailyLog[d]?.completedHabits ?? 0,
      total: dailyLog[d]?.total ?? 0,
      mood: dailyLog[d]?.mood ?? 0,
      note: dailyLog[d]?.note ?? '',
    }));

  const saveMood = (date, mood) => {
    updateUserData(prev => ({
      ...prev,
      dailyLog: { ...prev.dailyLog, [date]: { ...(prev.dailyLog[date] || {}), mood } },
    }));
  };

  const saveNote = (date) => {
    const note = noteInput[date] ?? '';
    updateUserData(prev => ({
      ...prev,
      dailyLog: { ...prev.dailyLog, [date]: { ...(prev.dailyLog[date] || {}), note } },
    }));
  };

  const avgPct = last7.reduce((s, d) => s + (dailyLog[d]?.pct ?? 0), 0) / 7;
  const activeDays = last7.filter(d => dailyLog[d] !== undefined).length;
  const bestDay = last7.reduce((best, d) => (dailyLog[d]?.pct ?? 0) > (dailyLog[best]?.pct ?? 0) ? d : best, last7[0]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: TrendingUp, label: 'Avg Completion', value: `${Math.round(avgPct)}%`, color: 'text-blue-400' },
          { icon: TrendingUp, label: 'Active Days', value: `${activeDays}/7`, color: 'text-green-400' },
          { icon: Dumbbell, label: 'Best Day', value: bestDay ? new Date(bestDay).toLocaleDateString('en-US', { weekday: 'short' }) : '—', color: 'text-orange-400' },
          { icon: TrendingUp, label: 'Streak', value: `🔥 ${userData?.streak || 0}`, color: 'text-emerald-400' },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="glass-card rounded-[1.75rem] p-4 animate-scale-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <Icon size={18} className={`${s.color} mb-2`} />
              <p className="text-white text-xl font-black">{s.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Bar chart */}
      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" />
            Weekly Completion
          </h3>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {barData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${d.pct > 0 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-white/5'}`}
                style={{ height: `${Math.max(d.pct, 4)}%` }}
              />
              <span className="text-[9px] text-slate-600 font-bold">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily entries */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 px-1">Daily Entries</h3>
        {logEntries.length === 0 && (
          <div className="glass-card rounded-3xl p-8 text-center text-slate-500">
            <Meh size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No entries yet. Complete habits to start logging.</p>
          </div>
        )}
        <div className="space-y-3">
          {logEntries.map((log, idx) => {
            const isOpen = activeLog === log.date;
            const currentMood = moodInput[log.date] ?? log.mood;
            return (
              <div key={log.date}
                className="glass-card rounded-[1.75rem] p-4 animate-scale-in hover:border-white/10 transition-all"
                style={{ animationDelay: `${idx * 60}ms` }}>
                <div className="flex items-center justify-between cursor-pointer"
                  onClick={() => setActiveLog(isOpen ? null : log.date)}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{log.mood ? moodEmoji[log.mood] : '😐'}</span>
                    <div>
                      <p className="text-white font-semibold text-sm">{log.label}</p>
                      <p className="text-slate-500 text-xs">{log.completed}/{log.total} habits · {log.pct}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {log.pct >= 80 && <span className="text-xs text-emerald-400 font-bold">🔥 Great</span>}
                    {log.pct >= 50 && log.pct < 80 && <span className="text-xs text-blue-400 font-bold">Good</span>}
                    {log.pct > 0 && log.pct < 50 && <span className="text-xs text-amber-400 font-bold">Started</span>}
                    <span className={`text-xs font-bold ${moodColor[log.mood] || 'text-slate-500'}`}>
                      {log.mood ? `Mood ${log.mood}/5` : 'No mood'}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-fade-up">
                    <div>
                      <p className="text-slate-500 text-xs mb-2">How did you feel?</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(m => (
                          <button key={m}
                            onClick={() => { setMoodInput(p => ({ ...p, [log.date]: m })); saveMood(log.date, m); }}
                            className={`text-xl transition-all ${currentMood === m ? 'scale-125' : 'opacity-50 hover:opacity-80'}`}>
                            {moodEmoji[m]}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Note</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a note…"
                          defaultValue={log.note}
                          onChange={e => setNoteInput(p => ({ ...p, [log.date]: e.target.value }))}
                          className="flex-1 bg-white/5 border border-white/8 rounded-xl py-2 px-3 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                        <button onClick={() => saveNote(log.date)}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold transition-all">
                          Save
                        </button>
                      </div>
                      {log.note && <p className="text-slate-400 text-xs mt-1 italic">"{log.note}"</p>}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
