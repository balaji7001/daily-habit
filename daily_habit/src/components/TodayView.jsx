import { useState } from 'react';
import { Plus, Droplet, Apple, Dumbbell, Book, Moon, Coffee, Clock, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const timeSlots = [
  { id: 'all', label: 'All' },
  { id: 'morning', label: 'Morning', icon: Coffee },
  { id: 'afternoon', label: 'Afternoon', icon: Book },
  { id: 'evening', label: 'Evening', icon: Moon },
  { id: 'allday', label: 'All Day' },
  { id: 'schedule', label: 'Schedule', icon: Clock },
];

const habitIcons = {
  water: Droplet,
  fruits: Apple,
  exercise: Dumbbell,
  reading: Book,
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDuration(min) {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const TodayView = ({ habits, onToggleHabit, onAddHabit }) => {
  const { userData, updateUserData } = useAuth();
  const [activeSlot, setActiveSlot] = useState('all');

  const todayDayName = DAYS[new Date().getDay()]; // e.g. 'Mon'
  // Map full day name to short (Sun->Sun, Mon->Mon etc — already matches DAYS short)
  const todayShort = todayDayName.slice(0, 3);

  // Timetable tasks for today
  const timetable = userData?.timetable || [];
  const todaySchedule = timetable
    .filter(e => !e.days || e.days.includes(todayShort))
    .sort((a, b) => a.time.localeCompare(b.time));

  // Completed timetable task ids stored per day
  const todayStr = new Date().toISOString().split('T')[0];
  const completedSchedule = userData?.completedSchedule?.[todayStr] || [];

  const toggleScheduleTask = (id) => {
    updateUserData(prev => {
      const dayMap = prev.completedSchedule || {};
      const existing = dayMap[todayStr] || [];
      const updated = existing.includes(id)
        ? existing.filter(x => x !== id)
        : [...existing, id];
      return { ...prev, completedSchedule: { ...dayMap, [todayStr]: updated } };
    });
  };

  const filteredHabits = activeSlot === 'all' || activeSlot === 'schedule'
    ? habits
    : habits.filter(h => h.timeSlot === activeSlot);

  const showSchedule = activeSlot === 'all' || activeSlot === 'schedule';
  const showHabits = activeSlot !== 'schedule';

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Time Slot Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {timeSlots.map((slot, idx) => {
          const Icon = slot.icon;
          return (
            <button
              key={slot.id}
              onClick={() => setActiveSlot(slot.id)}
              style={{ animationDelay: `${idx * 50}ms` }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 animate-fade-left ${
                activeSlot === slot.id
                  ? 'bg-white/10 text-white shadow-lg scale-105'
                  : 'bg-white/5 text-slate-400 hover:bg-white/8'
              }`}
            >
              {Icon && <Icon size={14} />}
              <span className="text-sm font-semibold">{slot.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timetable tasks for today */}
      {showSchedule && todaySchedule.length > 0 && (
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Today's Schedule</p>
          {todaySchedule.map((entry, idx) => {
            const done = completedSchedule.includes(entry.id);
            return (
              <div
                key={entry.id}
                onClick={() => toggleScheduleTask(entry.id)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className={`glass-card rounded-3xl p-4 flex items-center gap-4 cursor-pointer transition-all duration-300 animate-scale-in ${
                  done ? 'opacity-50' : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-1.5 h-10 rounded-full bg-gradient-to-b ${entry.color} flex-shrink-0`} />
                <div className="w-12 flex-shrink-0 text-center">
                  <p className={`font-black text-sm ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{entry.time}</p>
                  <p className="text-slate-600 text-[10px]">{formatDuration(entry.duration)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${done ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {entry.title}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {done
                    ? <CheckCircle2 size={20} className="text-green-400" />
                    : <Circle size={20} className="text-slate-600" />
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habits */}
      {showHabits && (
        <div className="space-y-3">
          {filteredHabits.length > 0 && (
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest px-1">Habits</p>
          )}
          {filteredHabits.map((habit, idx) => {
            const Icon = habitIcons[habit.icon] || Droplet;
            const progress = habit.current / habit.goal;
            const done = habit.current >= habit.goal;

            return (
              <div
                key={habit.id}
                style={{ animationDelay: `${idx * 80}ms` }}
                className={`glass-card rounded-3xl p-4 habit-row transition-all duration-300 cursor-pointer animate-scale-in ${
                  done ? 'opacity-60' : ''
                }`}
                onClick={() => onToggleHabit(habit.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon with done overlay */}
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${habit.gradient} flex items-center justify-center shadow-lg relative`}>
                    {done
                      ? <CheckCircle2 size={22} className="text-white" />
                      : <Icon size={22} className="text-white" />
                    }
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold text-base ${done ? 'text-slate-400 line-through' : 'text-white'}`}>
                        {habit.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 font-medium">
                          {habit.current}/{habit.goal} {habit.unit}
                        </span>
                        {done && <CheckCircle2 size={14} className="text-green-400" />}
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${habit.gradient} progress-bar shadow-lg`}
                        style={{ width: `${Math.min(progress * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={onAddHabit}
            className="w-full glass-card rounded-3xl p-4 flex items-center justify-center gap-2 text-blue-400 hover:bg-white/8 transition-all group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold">Add New Habit</span>
          </button>
        </div>
      )}
    </div>
  );
};
