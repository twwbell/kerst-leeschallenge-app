import React from 'react';
import { Modus } from '../types/types';
import { formatTijd } from '../hooks/useTimer';

interface TimerProps {
  tijd: number;
  modus: Modus;
  isWarning: boolean;
  isExpired: boolean;
  initialTime?: number;
}

const Timer: React.FC<TimerProps> = ({ tijd, modus, isWarning, isExpired, initialTime = 60 }) => {
  // Calculate progress percentage for countdown bar (0-100)
  // When time goes negative, progress stays at 0
  const progress = modus === 'timer'
    ? Math.max(0, Math.min(100, (tijd / initialTime) * 100))
    : 0;

  // For training mode, show elapsed time as a growing bar (cap at some reasonable max like 5 min)
  const trainingProgress = modus === 'training'
    ? Math.min(100, (tijd / 300) * 100) // 5 minutes = 100%
    : 0;

  return (
    <div className="flex flex-col items-center h-full py-4 relative">
      {/* Countdown/Stopwatch bar */}
      <div className="relative flex-1 w-8 bg-[oklch(0.92_0.01_80)] rounded-full overflow-hidden shadow-inner border-2 border-[oklch(0.85_0.02_80)]">
        {/* Fill */}
        <div
          className={`
            absolute left-0 right-0 rounded-full transition-all duration-1000 ease-linear
            ${modus === 'timer'
              ? isExpired
                ? 'bg-[oklch(0.55_0.18_25)]'
                : isWarning
                  ? 'bg-gradient-to-t from-[oklch(0.55_0.18_25)] to-[oklch(0.65_0.15_45)]'
                  : 'bg-gradient-to-t from-[oklch(0.45_0.12_160)] to-[oklch(0.55_0.10_160)]'
              : 'christmas-gradient'
            }
            ${modus === 'timer' ? 'bottom-0' : 'bottom-0'}
          `}
          style={{ height: `${modus === 'timer' ? progress : trainingProgress}%` }}
        >
          {/* Sparkle effect at top of fill */}
          {((modus === 'timer' && progress > 5) || (modus === 'training' && trainingProgress > 5)) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className={`text-xs ${isWarning ? 'animate-pulse' : 'sparkle'}`}>
                {isWarning || isExpired ? '🔔' : '✨'}
              </span>
            </div>
          )}
        </div>

        {/* Decorative stripes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-[2px] bg-white"
              style={{ top: `${i * 10}%` }}
            />
          ))}
        </div>
      </div>

      {/* Label - below the bar */}
      <div className="mt-3 text-center">
        <div
          className={`
            text-lg font-bold font-display
            ${isExpired
              ? 'text-[oklch(0.55_0.18_25)] animate-pulse'
              : isWarning
                ? 'timer-warning'
                : 'text-[oklch(0.40_0.08_160)]'
            }
          `}
        >
          {formatTijd(tijd)}
        </div>
        <div className="text-xl">
          {modus === 'training' ? '🎄' : '⏱️'}
        </div>
      </div>

      {/* Expired message */}
      {isExpired && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[oklch(0.55_0.18_25)] text-white px-2 py-1 rounded-full text-xs font-semibold shadow-lg animate-bounce">
          Tijd op! 🎅
        </div>
      )}
    </div>
  );
};

export default Timer;
