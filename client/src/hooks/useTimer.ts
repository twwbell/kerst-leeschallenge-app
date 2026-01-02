import { useState, useEffect, useCallback, useRef } from 'react';
import { Modus } from '../types/types';

const DEFAULT_TIMER_TIJD = 60; // 60 seconden default

interface UseTimerReturn {
  tijd: number; // huidige tijd in seconden (kan negatief zijn in timer modus)
  initialTime: number; // initiele countdown tijd voor timer modus
  isRunning: boolean;
  isWarning: boolean; // laatste 10 seconden in timer modus
  isExpired: boolean; // tijd is op in timer modus (tijd <= 0)
  hasStarted: boolean; // timer is ooit gestart in deze sessie
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggle: () => void; // play/pause toggle
  setInitialTime: (seconds: number) => void; // stel countdown tijd in
  getElapsedMs: () => number; // voor woord timing
}

export function useTimer(modus: Modus): UseTimerReturn {
  const [initialTime, setInitialTimeState] = useState(DEFAULT_TIMER_TIJD);
  const [tijd, setTijd] = useState(modus === 'timer' ? DEFAULT_TIMER_TIJD : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  // Reset timer wanneer modus verandert
  useEffect(() => {
    setTijd(modus === 'timer' ? initialTime : 0);
    setIsRunning(false);
    setHasStarted(false);
    startTimeRef.current = null;
    elapsedRef.current = 0;
  }, [modus, initialTime]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (modus === 'training') {
          // Training: tel op
          setTijd(prev => prev + 1);
        } else {
          // Timer: tel af, doorgaan in negatief
          setTijd(prev => prev - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, modus]);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - elapsedRef.current;
      setIsRunning(true);
      setHasStarted(true);
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      elapsedRef.current = Date.now() - startTimeRef.current;
    }
    setIsRunning(false);
  }, [isRunning]);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  const reset = useCallback(() => {
    setTijd(modus === 'timer' ? initialTime : 0);
    setIsRunning(false);
    setHasStarted(false);
    startTimeRef.current = null;
    elapsedRef.current = 0;
  }, [modus, initialTime]);

  const setInitialTime = useCallback((seconds: number) => {
    setInitialTimeState(seconds);
    // Reset timer to new initial time and pause
    setTijd(seconds);
    setIsRunning(false);
    setHasStarted(false);
    startTimeRef.current = null;
    elapsedRef.current = 0;
  }, []);

  const getElapsedMs = useCallback((): number => {
    if (startTimeRef.current) {
      return Date.now() - startTimeRef.current;
    }
    return elapsedRef.current;
  }, []);

  const isWarning = modus === 'timer' && tijd <= 10 && tijd > 0;
  const isExpired = modus === 'timer' && tijd <= 0;

  return {
    tijd,
    initialTime,
    isRunning,
    isWarning,
    isExpired,
    hasStarted,
    start,
    pause,
    reset,
    toggle,
    setInitialTime,
    getElapsedMs,
  };
}

/**
 * Hook voor het bijhouden van individuele woord tijden
 */
export function useWoordTimer() {
  const startTimeRef = useRef<number | null>(null);
  const woordTijdenRef = useRef<Record<string, number>>({});

  const startWoord = useCallback(() => {
    startTimeRef.current = Date.now();
  }, []);

  const eindWoord = useCallback((woord: string): number => {
    if (startTimeRef.current) {
      const tijd = Date.now() - startTimeRef.current;
      woordTijdenRef.current[woord] = tijd;
      startTimeRef.current = null;
      return tijd;
    }
    return 0;
  }, []);

  const getTijden = useCallback((): Record<string, number> => {
    return { ...woordTijdenRef.current };
  }, []);

  const reset = useCallback(() => {
    startTimeRef.current = null;
    woordTijdenRef.current = {};
  }, []);

  return {
    startWoord,
    eindWoord,
    getTijden,
    reset,
  };
}

/**
 * Formatteer tijd naar MM:SS (ondersteunt negatieve tijd)
 */
export function formatTijd(seconden: number): string {
  const isNegative = seconden < 0;
  const absSeconds = Math.abs(seconden);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  return isNegative ? `-${formatted}` : formatted;
}
