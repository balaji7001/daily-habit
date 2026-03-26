import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_HABITS = [
  { id: 1, name: 'Drink Water', icon: 'water', timeSlot: 'morning', current: 0, goal: 8, unit: 'glasses', gradient: 'from-blue-500 to-cyan-400' },
  { id: 2, name: 'Eat Fruits & Veggies', icon: 'fruits', timeSlot: 'morning', current: 0, goal: 5, unit: 'servings', gradient: 'from-green-500 to-emerald-400' },
  { id: 3, name: 'Exercise', icon: 'exercise', timeSlot: 'morning', current: 0, goal: 60, unit: 'min', gradient: 'from-orange-500 to-red-400' },
  { id: 4, name: 'Read', icon: 'reading', timeSlot: 'afternoon', current: 0, goal: 30, unit: 'min', gradient: 'from-purple-500 to-pink-400' },
  { id: 5, name: 'Meditate', icon: 'water', timeSlot: 'evening', current: 0, goal: 15, unit: 'min', gradient: 'from-indigo-500 to-blue-400' },
  { id: 6, name: 'Sleep 8hrs', icon: 'reading', timeSlot: 'evening', current: 0, goal: 8, unit: 'hrs', gradient: 'from-violet-500 to-purple-400' },
  { id: 7, name: 'Morning Coffee', icon: 'water', timeSlot: 'allday', current: 0, goal: 2, unit: 'cups', gradient: 'from-amber-500 to-yellow-400' },
];

const DEFAULT_TIMETABLE = [
  { id: 1, time: '06:00', title: 'Morning Workout', duration: 60, color: 'from-orange-500 to-red-400' },
  { id: 2, time: '08:00', title: 'Breakfast & Water', duration: 30, color: 'from-blue-500 to-cyan-400' },
  { id: 3, time: '09:00', title: 'Deep Work / Study', duration: 120, color: 'from-purple-500 to-pink-400' },
  { id: 4, time: '12:00', title: 'Lunch Break', duration: 60, color: 'from-green-500 to-emerald-400' },
  { id: 5, time: '20:00', title: 'Read & Meditate', duration: 45, color: 'from-indigo-500 to-blue-400' },
  { id: 6, time: '22:00', title: 'Sleep', duration: 480, color: 'from-violet-500 to-purple-400' },
];

function createFreshUserData(username) {
  return {
    username,
    createdAt: new Date().toISOString(),
    habits: DEFAULT_HABITS.map(h => ({ ...h })),
    timetable: DEFAULT_TIMETABLE.map(t => ({ ...t })),
    // dailyLog: { 'YYYY-MM-DD': { completedHabits: [ids], pct: 0 } }
    dailyLog: {},
    streak: 0,
    bestStreak: 0,
    timerDuration: 3212, // seconds
    timerLabel: 'Focus Session',
    lastActiveDate: null,
  };
}

function getStorageKey(username) {
  return `habitflow_user_${username}`;
}

function loadUserData(username) {
  try {
    const raw = localStorage.getItem(getStorageKey(username));
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveUserData(username, data) {
  localStorage.setItem(getStorageKey(username), JSON.stringify(data));
}

function getAccounts() {
  try {
    return JSON.parse(localStorage.getItem('habitflow_accounts') || '{}');
  } catch { return {}; }
}

function saveAccounts(accounts) {
  localStorage.setItem('habitflow_accounts', JSON.stringify(accounts));
}

// A day counts toward streak if the user logged in OR completed at least 1 task (pct > 0)
function computeStreak(dailyLog) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yest = new Date(today); yest.setDate(yest.getDate() - 1);
  const yestStr = yest.toISOString().split('T')[0];

  // Walk backwards from today to count current streak
  let streak = 0;
  let best = 0;
  let current = 0;

  const dates = Object.keys(dailyLog).sort();
  for (let i = 0; i < dates.length; i++) {
    // Active day = logged in (entry exists) OR completed at least 1 task
    const active = dailyLog[dates[i]] !== undefined;
    if (active) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }

  // Current streak: count consecutive days ending today or yesterday
  streak = 0;
  const d = new Date(today);
  while (true) {
    const key = d.toISOString().split('T')[0];
    if (dailyLog[key] !== undefined) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, bestStreak: Math.max(best, streak) };
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = localStorage.getItem('habitflow_session');
    if (session) {
      const data = loadUserData(session);
      if (data) {
        // Record today as active day on session restore
        const todayStr = new Date().toISOString().split('T')[0];
        const newLog = { ...data.dailyLog };
        if (!newLog[todayStr]) newLog[todayStr] = { pct: 0, completedHabits: 0, total: data.habits?.length || 0 };
        const { streak, bestStreak } = computeStreak(newLog);
        const updated = { ...data, dailyLog: newLog, streak, bestStreak };
        setCurrentUser(session);
        setUserData(updated);
      }
    }
    setLoading(false);
  }, []);

  // Persist userData whenever it changes
  useEffect(() => {
    if (currentUser && userData) {
      saveUserData(currentUser, userData);
    }
  }, [currentUser, userData]);

  // Check and update daily log on each load
  useEffect(() => {
    if (!userData) return;
    const todayStr = new Date().toISOString().split('T')[0];
    if (userData.lastActiveDate !== todayStr) {
      // New day - reset habit progress but keep log
      setUserData(prev => {
        const updated = {
          ...prev,
          habits: prev.habits.map(h => ({ ...h, current: 0 })),
          lastActiveDate: todayStr,
        };
        return updated;
      });
    }
  }, [userData?.lastActiveDate]);

  const login = (username, password) => {
    const accounts = getAccounts();
    if (!accounts[username]) return { error: 'Account not found' };
    if (accounts[username].password !== password) return { error: 'Wrong password' };
    const data = loadUserData(username);
    if (!data) return { error: 'User data missing' };
    // Record login as active day
    const todayStr = new Date().toISOString().split('T')[0];
    const newLog = { ...data.dailyLog };
    if (!newLog[todayStr]) newLog[todayStr] = { pct: 0, completedHabits: 0, total: data.habits?.length || 0 };
    const { streak, bestStreak } = computeStreak(newLog);
    const updated = { ...data, dailyLog: newLog, streak, bestStreak };
    setCurrentUser(username);
    setUserData(updated);
    localStorage.setItem('habitflow_session', username);
    return { success: true };
  };

  const register = (username, password) => {
    if (!username.trim() || !password.trim()) return { error: 'Fill all fields' };
    if (username.length < 3) return { error: 'Username must be 3+ chars' };
    if (password.length < 6) return { error: 'Password must be 6+ chars' };
    const accounts = getAccounts();
    if (accounts[username]) return { error: 'Username already taken' };
    accounts[username] = { password, createdAt: new Date().toISOString() };
    saveAccounts(accounts);
    const fresh = createFreshUserData(username);
    saveUserData(username, fresh);
    setCurrentUser(username);
    setUserData(fresh);
    localStorage.setItem('habitflow_session', username);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('habitflow_session');
    setCurrentUser(null);
    setUserData(null);
  };

  const updateUserData = (updater) => {
    setUserData(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      return next;
    });
  };

  // Mark today's completion in daily log
  const recordDailyProgress = (habits) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const completed = habits.filter(h => h.current >= h.goal).length;
    const anyDone = habits.some(h => h.current > 0);
    const pct = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
    setUserData(prev => {
      const existing = prev.dailyLog[todayStr] || {};
      const newLog = {
        ...prev.dailyLog,
        [todayStr]: { ...existing, completedHabits: completed, total: habits.length, pct, active: true },
      };
      const { streak, bestStreak } = computeStreak(newLog);
      return { ...prev, dailyLog: newLog, streak, bestStreak };
    });
  };

  const resetAccount = () => {
    if (!currentUser) return;
    const fresh = createFreshUserData(currentUser);
    setUserData(fresh);
    saveUserData(currentUser, fresh);
  };

  return (
    <AuthContext.Provider value={{
      currentUser, userData, loading,
      login, register, logout,
      updateUserData, recordDailyProgress, resetAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
