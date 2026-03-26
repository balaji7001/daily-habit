import { Star, Clock, Zap, Sun, Moon, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CHALLENGES = [
  { id: 1, title: 'Happy Morning Challenge', days: 7, description: 'Start every day with intention and energy', icon: Sun, gradient: 'from-amber-500/20 to-orange-600/20', accent: '#f97316', featured: true, illustration: 'morning' },
  { id: 2, title: 'Bedtime Routine Challenge', days: 7, description: 'Wind down for better sleep quality', icon: Moon, gradient: 'from-indigo-500/20 to-purple-600/20', accent: '#818cf8', illustration: 'night' },
  { id: 3, title: 'Sugar-Free Challenge', days: 7, description: 'Cut sugar and feel the difference', icon: Leaf, gradient: 'from-green-500/20 to-emerald-600/20', accent: '#22c55e', illustration: 'health' },
  { id: 4, title: '30-Day Focus Sprint', days: 30, description: 'Deep work sessions every single day', icon: Zap, gradient: 'from-yellow-500/20 to-amber-600/20', accent: '#fbbf24', illustration: 'focus' },
];

const IllustrationMorning = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full">
    <circle cx="60" cy="70" r="35" fill="rgba(249,115,22,0.15)" />
    <path d="M25 70 Q60 20 95 70" fill="rgba(249,115,22,0.25)" />
    <circle cx="60" cy="45" r="18" fill="rgba(251,191,36,0.4)" />
    <circle cx="60" cy="45" r="12" fill="rgba(251,191,36,0.6)" />
    {[0,45,90,135,180,225,270,315].map((angle, i) => (
      <line key={i} x1={60+16*Math.cos(angle*Math.PI/180)} y1={45+16*Math.sin(angle*Math.PI/180)}
        x2={60+24*Math.cos(angle*Math.PI/180)} y2={45+24*Math.sin(angle*Math.PI/180)}
        stroke="rgba(251,191,36,0.5)" strokeWidth="2" strokeLinecap="round" />
    ))}
  </svg>
);
const IllustrationNight = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full">
    <circle cx="75" cy="40" r="22" fill="rgba(129,140,248,0.2)" />
    <circle cx="65" cy="35" r="18" fill="rgba(15,20,40,0.9)" />
    {[0,1,2,3,4].map(i => <circle key={i} cx={20+i*20} cy={75+(i%2)*8} r="2" fill="rgba(129,140,248,0.5)" />)}
  </svg>
);
const IllustrationHealth = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full">
    <circle cx="60" cy="55" r="30" fill="rgba(34,197,94,0.1)" />
    <path d="M45 40 Q60 20 75 40 Q90 55 60 75 Q30 55 45 40Z" fill="rgba(34,197,94,0.4)" />
  </svg>
);
const IllustrationFocus = () => (
  <svg viewBox="0 0 120 100" className="w-full h-full">
    <circle cx="60" cy="50" r="28" fill="none" stroke="rgba(251,191,36,0.2)" strokeWidth="2" />
    <circle cx="60" cy="50" r="20" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="2" />
    <circle cx="60" cy="50" r="10" fill="rgba(251,191,36,0.4)" />
    <circle cx="60" cy="50" r="5" fill="rgba(251,191,36,0.7)" />
  </svg>
);
const illustrations = { morning: IllustrationMorning, night: IllustrationNight, health: IllustrationHealth, focus: IllustrationFocus };

export const ChallengesView = () => {
  const { userData, updateUserData } = useAuth();
  // joined: { [id]: { joinedAt, progress } }
  const joined = userData?.challenges || {};

  const toggleJoin = (id) => {
    updateUserData(prev => {
      const current = prev.challenges || {};
      if (current[id]) {
        const { [id]: _, ...rest } = current;
        return { ...prev, challenges: rest };
      }
      return { ...prev, challenges: { ...current, [id]: { joinedAt: new Date().toISOString(), progress: 0 } } };
    });
  };

  const incrementProgress = (e, id) => {
    e.stopPropagation();
    updateUserData(prev => {
      const current = prev.challenges || {};
      if (!current[id]) return prev;
      const challenge = CHALLENGES.find(c => c.id === id);
      const newProgress = Math.min((current[id].progress || 0) + 1, challenge?.days || 30);
      return { ...prev, challenges: { ...current, [id]: { ...current[id], progress: newProgress } } };
    });
  };

  const featured = CHALLENGES[0];
  const rest = CHALLENGES.slice(1);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Featured */}
      <div className="relative rounded-[2rem] overflow-hidden p-6"
        style={{ background: 'linear-gradient(135deg, #1c1f2e 0%, #0f1218 100%)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent" />
        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Featured</span>
            </div>
            <h3 className="text-white text-2xl font-black mb-2 leading-tight">{featured.title}</h3>
            <p className="text-slate-400 text-sm mb-4">{featured.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                <Clock size={14} /><span>{featured.days} days</span>
              </div>
              {joined[featured.id] && (
                <button onClick={(e) => incrementProgress(e, featured.id)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-full transition-all">
                  +1 Day ({joined[featured.id].progress}/{featured.days})
                </button>
              )}
              <button onClick={() => toggleJoin(featured.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  joined[featured.id]
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-400 active:scale-95'
                }`}>
                {joined[featured.id] ? 'Joined ✓' : 'Join Challenge'}
              </button>
            </div>
            {joined[featured.id] && (
              <div className="mt-3">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 progress-bar rounded-full"
                    style={{ width: `${((joined[featured.id].progress || 0) / featured.days) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
          <div className="w-28 h-24 opacity-80 animate-float ml-4 flex-shrink-0">
            <IllustrationMorning />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 px-1">All Challenges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {rest.map((challenge, idx) => {
            const Illustration = illustrations[challenge.illustration];
            const isJoined = !!joined[challenge.id];
            const progress = joined[challenge.id]?.progress || 0;
            return (
              <div key={challenge.id}
                style={{ animationDelay: `${idx * 100}ms`, border: `1px solid ${challenge.accent}22` }}
                className="relative rounded-[1.75rem] overflow-hidden p-5 cursor-pointer animate-scale-in transition-all duration-300 hover:scale-[1.02]"
                onClick={() => toggleJoin(challenge.id)}>
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.gradient}`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-black text-base leading-tight">{challenge.title}</h4>
                      <div className="flex items-center gap-1 mt-1 text-slate-400 text-xs">
                        <Clock size={12} /><span>{challenge.days} days</span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">{challenge.description}</p>
                    </div>
                    {isJoined && (
                      <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 flex-shrink-0">
                        <Star size={12} className="text-white fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4 w-20 h-16 opacity-60">
                    <Illustration />
                  </div>
                  {isJoined && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span>{progress}/{challenge.days} days</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full progress-bar rounded-full"
                          style={{ width: `${(progress / challenge.days) * 100}%`, background: challenge.accent }} />
                      </div>
                      <button
                        onClick={(e) => incrementProgress(e, challenge.id)}
                        className="mt-2 px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-all">
                        +1 Day
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
