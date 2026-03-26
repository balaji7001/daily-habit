import React, { useState } from 'react';
import { TrendingUp, Calendar, Droplet, Dumbbell, Book, Moon } from 'lucide-react';

const logs = [
  { date: 'Today', mood: 4, note: 'Great focus session, hit all morning habits', habits: 6 },
  { date: 'Yesterday', mood: 3, note: 'Skipped exercise but kept up with water intake', habits: 5 },
  { date: 'Mar 24', mood: 5, note: 'Perfect day, all habits completed', habits: 7 },
  { date: 'Mar 23', mood: 2, note: 'Rough day, only managed the basics', habits: 3 },
  { date: 'Mar 22', mood: 4, note: 'Good momentum building up', habits: 6 },
];

const moodEmoji = ['', '😞', '😕', '😐', '😊', '🔥'];
const moodColor = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400', 'text-emerald-400'];

const weekStats = [
  { icon: Droplet, label: 'Water', value: '6.2', unit: 'avg glasses', color: 'text-blue-400' },
  { icon: Dumbbell, label: 'Exercise', value: '4', unit: 'days this week', color: 'text-orange-400' },
  { icon: Book, label: 'Reading', value: '22', unit: 'avg minutes', color: 'text-purple-400' },
  { icon: Moon, label: 'Sleep', value: '7.1', unit: 'avg hours', color: 'text-indigo-400' },
];

export const LifeLog = () => {
  const [activeLog, setActiveLog] = useState(null);
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {weekStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-[1.75rem] p-4 animate-scale-in" style={{ animationDelay: `${idx * 60}ms` }}>
              <Icon size={18} className={`${stat.color} mb-2`} />
              <p className="text-white text-xl font-black">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-0.5">{stat.unit}</p>
            </div>
          );
        })}
      </div>
      <div className="glass-card rounded-[2rem] p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-sm flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-400" />
            Weekly Completion
          </h3>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Last 7 days</span>
        </div>
        <div className="flex items-end gap-2 h-24">
          {[5, 7, 4, 6, 7, 3, 6].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg progress-bar" style={{ height: `${(val / 7) * 100}%` }} />
              <span className="text-[9px] text-slate-600 font-bold">{['M','T','W','T','F','S','S'][i]}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 px-1">Daily Entries</h3>
        <div className="space-y-3">
          {logs.map((log, idx) => (
            <div key={idx} className="glass-card rounded-[1.75rem] p-4 cursor-pointer animate-scale-in hover:border-white/10 transition-all" style={{ animationDelay: `${idx * 60}ms` }} onClick={() => setActiveLog(activeLog === idx ? null : idx)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmoji[log.mood]}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{log.date}</p>
                    <p className="text-slate-500 text-xs">{log.habits}/7 habits</p>
                  </div>
                </div>
                <span className={`text-xs font-bold ${moodColor[log.mood]}`}>Mood {log.mood}/5</span>
              </div>
              {activeLog === idx && (
                <p className="text-slate-400 text-sm mt-3 pt-3 border-t border-white/5">{log.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
