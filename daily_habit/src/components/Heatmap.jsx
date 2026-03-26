import { useState } from 'react';
import { Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getLast119Days() {
  const days = [];
  const today = new Date();
  for (let i = 118; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// Level based on tasks completed (not percentage)
// 0 = no activity, 1 = logged in only, 2 = 1-49% tasks, 3 = 50-79%, 4 = 80-100%
function getLevel(entry) {
  if (!entry) return 0;
  if (entry.pct === undefined || entry.pct === null) return 1; // logged in, no tasks
  if (entry.pct === 0) return 1;   // logged in, no tasks done
  if (entry.pct < 50) return 2;    // some tasks
  if (entry.pct < 80) return 3;    // most tasks
  return 4;                         // all/almost all tasks
}

export const Heatmap = () => {
  const { userData } = useAuth();
  const [hovered, setHovered] = useState(null);
  const dailyLog = userData?.dailyLog || {};

  const days = getLast119Days();
  const boxes = days.map(date => ({ date, level: getLevel(dailyLog[date]), entry: dailyLog[date] }));

  const monthLabels = [];
  let lastMonth = -1;
  boxes.forEach((box, i) => {
    const m = new Date(box.date).getMonth();
    if (m !== lastMonth) { monthLabels.push({ idx: i, label: MONTHS_SHORT[m] }); lastMonth = m; }
  });

  // Stronger, more vivid color scale
  const colorMap = {
    0: { bg: 'bg-white/[0.04]', hover: 'hover:bg-white/10', shadow: '' },
    1: { bg: 'bg-emerald-900/40', hover: 'hover:bg-emerald-800/50', shadow: '' },
    2: { bg: 'bg-emerald-600/60', hover: 'hover:bg-emerald-500/70', shadow: 'shadow-[0_0_6px_rgba(16,185,129,0.3)]' },
    3: { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-400', shadow: 'shadow-[0_0_10px_rgba(16,185,129,0.5)]' },
    4: { bg: 'bg-emerald-400', hover: 'hover:bg-emerald-300', shadow: 'shadow-[0_0_14px_rgba(52,211,153,0.7)]' },
  };

  const hoveredBox = hovered !== null ? boxes[hovered] : null;

  const labelForLevel = (l) => ['No activity', 'Logged in', 'Some tasks', 'Most tasks', 'All tasks!'][l];

  return (
    <div className="glass-card rounded-[2.5rem] p-6">
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="text-white font-bold text-sm flex items-center gap-2">
          <Flame size={16} className="text-orange-500" />
          Consistency Grid
        </h3>
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          🔥 {userData?.streak || 0} day streak
        </span>
      </div>

      <div className="relative">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5">
          {boxes.map((box, i) => {
            const c = colorMap[box.level];
            return (
              <div
                key={box.date}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`rounded-[3px] transition-all duration-200 cursor-crosshair animate-dot-pop ${c.bg} ${c.hover} ${c.shadow} ${
                  hovered === i ? 'scale-150 z-10' : 'scale-100'
                }`}
                style={{ height: '14px', animationDelay: `${i * 5}ms` }}
              />
            );
          })}
        </div>

        {/* Tooltip */}
        {hoveredBox && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a1f2e] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap z-20 pointer-events-none">
            <span className="text-slate-400">{hoveredBox.date}</span>
            {' — '}
            <span className="font-bold text-emerald-400">{labelForLevel(hoveredBox.level)}</span>
            {hoveredBox.entry?.pct > 0 && <span className="text-slate-400"> ({hoveredBox.entry.pct}%)</span>}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-4 px-0.5 text-[9px] font-black text-slate-600 uppercase tracking-tighter">
        {monthLabels.slice(0, 5).map(m => <span key={m.label + m.idx}>{m.label}</span>)}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3 justify-end">
        <span className="text-[10px] text-slate-600">Less</span>
        {[0,1,2,3,4].map(v => (
          <div key={v} className={`w-3 h-3 rounded-[2px] ${colorMap[v].bg} ${colorMap[v].shadow}`} />
        ))}
        <span className="text-[10px] text-slate-600">More</span>
      </div>
    </div>
  );
};
