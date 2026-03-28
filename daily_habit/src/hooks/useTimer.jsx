import { useState, useEffect, useRef } from 'react';

// Plays a repeating beep chime for 5 seconds using Web Audio API
function playCompletionSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // 3-note pattern: C5 → E5 → G5, repeated every 0.6s for ~5 seconds
    const pattern = [523.25, 659.25, 783.99]; // C5, E5, G5
    const noteSpacing = 0.18;   // gap between notes in a group
    const groupSpacing = 0.6;   // gap between each group repeat
    const totalDuration = 5.0;

    let t = 0;
    while (t < totalDuration) {
      pattern.forEach((freq, i) => {
        const start = t + i * noteSpacing;
        if (start >= totalDuration) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.3);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + 0.35);
      });
      t += groupSpacing;
    }

    setTimeout(() => ctx.close(), 6000);
  } catch {
    // Silently fail if audio not supported
  }
}

export const useTimer = (initialSeconds) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);
  const justFinished = useRef(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      justFinished.current = false;
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isActive && timeLeft === 0 && !justFinished.current) {
      justFinished.current = true;
      setIsActive(false);
      playCompletionSound();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
    justFinished.current = false;
  };

  const updateDuration = (newSeconds) => {
    setIsActive(false);
    setTotalSeconds(newSeconds);
    setTimeLeft(newSeconds);
    justFinished.current = false;
  };

  return { timeLeft, isActive, setIsActive, formatTime, resetTimer, totalSeconds, updateDuration };
};
