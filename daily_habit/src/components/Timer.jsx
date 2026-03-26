import { useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Settings, Check } from 'lucide-react';

export const Timer = ({ timeLeft, isActive, setIsActive, formatTime, resetTimer, totalSeconds, onUpdateTimer }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [inputMin, setInputMin] = useState(Math.floor(totalSeconds / 60));
  const [inputLabel, setInputLabel] = useState('Focus Session');

  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (progress / 100) * circumference;

  const applySettings = () => {
    const secs = Math.max(60, inputMin * 60);
    onUpdateTimer(secs, inputLabel);
    setShowSettings(false);
  };

  return (
    <div className="glass-card rounded-[2.5rem] p-7 relative overflow-hidden group">
      {/* Ambient glow */}
      <div className={`absolute top-0 right-0 w-72 h-72 rounded-full -mr-20 -mt-20 transition-all duration-1000 ${
        isActive ? 'bg-blue-600/15 blur-[80px]' : 'bg-blue-600/8 blur-[100px]'
      }`} />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
        {/* Left: Info */}
        <div className="text-center sm:text-left flex-1">
          <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
            <Zap size={14} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Focus Session</span>
            <button
              onClick={() => { setShowSettings(!showSettings); setInputMin(Math.floor(totalSeconds / 60)); }}
              className="ml-auto p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              title="Adjust timer"
            >
              <Settings size={12} className="text-slate-500" />
            </button>
          </div>

          {showSettings ? (
            <div className="space-y-3 animate-scale-in">
              <input
                type="text"
                value={inputLabel}
                onChange={e => setInputLabel(e.target.value)}
                placeholder="Session label"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500/50"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={inputMin}
                  onChange={e => setInputMin(parseInt(e.target.value) || 1)}
                  className="w-20 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500/50"
                />
                <span className="text-slate-500 text-sm">minutes</span>
                <button
                  onClick={applySettings}
                  className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white text-xs font-bold transition-all"
                >
                  <Check size={12} /> Apply
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-white text-2xl font-black mb-1 tracking-tight">{inputLabel}</h3>
              <p className="text-slate-500 text-sm">Deep work — stay locked in</p>
              <div className="flex items-center gap-2 mt-4 justify-center sm:justify-start">
                <span className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-green-400 animate-ping' : 'bg-slate-600'}`} />
                <span className={`text-xs font-semibold ${isActive ? 'text-green-400' : 'text-slate-500'}`}>
                  {isActive ? 'Running' : 'Paused'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Timer Circle */}
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54" fill="none"
                stroke="#3b82f6" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000"
                style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-3xl font-mono font-black tracking-tighter">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-7 py-3 rounded-2xl text-white font-bold transition-all duration-200 active:scale-95 flex items-center gap-2 ${
                isActive
                  ? 'bg-white/10 hover:bg-white/15 border border-white/10'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30'
              }`}
            >
              {isActive
                ? <><Pause size={18} fill="currentColor" /> Pause</>
                : <><Play size={18} fill="currentColor" /> Start</>
              }
            </button>
            <button onClick={resetTimer} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
