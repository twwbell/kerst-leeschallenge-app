import { useState, useEffect, useCallback, useRef } from 'react';
import { Modus } from '../types/types';

const TEMPO_TIJD = 60; // 60 seconden per blok

interface UseTimerReturn {
  tijd: number; // huidige tijd in seconden
  isRunning: boolean;
  isWarning: boolean; // laatste 10 seconden in tempo modus
  isExpired: boolean; // tijd is op in tempo modus
  start: () => void;
  pause: () => void;
  reset: () => void;
  getElapsedMs: () => number; // voor woord timing
}

export function useTimer(modus: Modus): UseTimerReturn {
  const [tijd, setTijd] = useState(modus === 'tempo' ? TEMPO_TIJD : 0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);

  // Reset timer wanneer modus verandert
  useEffect(() => {
    setTijd(modus === 'tempo' ? TEMPO_TIJD : 0);
    setIsRunning(false);
    startTimeRef.current = null;
    elapsedRef.current = 0;
  }, [modus]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        if (modus === 'training') {
          // Training: tel op
          setTijd(prev => prev + 1);
        } else {
          // Tempo: tel af
          setTijd(prev => {
            if (prev <= 0) {
              return 0;
            }
            return prev - 1;
          });
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
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning && startTimeRef.current) {
      elapsedRef.current = Date.now() - startTimeRef.current;
    }
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    setTijd(modus === 'tempo' ? TEMPO_TIJD : 0);
    setIsRunning(false);
    startTimeRef.current = null;
    elapsedRef.current = 0;
  }, [modus]);

  const getElapsedMs = useCallback((): number => {
    if (startTimeRef.current) {
      return Date.now() - startTimeRef.current;
    }
    return elapsedRef.current;
  }, []);

  const isWarning = modus === 'tempo' && tijd <= 10 && tijd > 0;
  const isExpired = modus === 'tempo' && tijd === 0;

  return {
    tijd,
    isRunning,
    isWarning,
    isExpired,
    start,
    pause,
    reset,
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
 * Formatteer tijd naar MM:SS
 */
export function formatTijd(seconden: number): string {
  const mins = Math.floor(seconden / 60);
  const secs = seconden % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
