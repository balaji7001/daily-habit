import { useState, useEffect } from 'react';

export const useTimer = (initialSeconds) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(totalSeconds);
  };

  const updateDuration = (newSeconds) => {
    setIsActive(false);
    setTotalSeconds(newSeconds);
    setTimeLeft(newSeconds);
  };

  return { timeLeft, isActive, setIsActive, formatTime, resetTimer, totalSeconds, updateDuration };
};
