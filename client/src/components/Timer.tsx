import React from 'react';
import { Modus } from '../types/types';
import { formatTijd } from '../hooks/useTimer';

interface TimerProps {
  tijd: number;
  modus: Modus;
  isWarning: boolean;
  isExpired: boolean;
}

const Timer: React.FC<TimerProps> = ({ tijd, modus, isWarning, isExpired }) => {
  return (
    <div className="flex flex-col items-center h-full py-4">
      {/* Timer icon */}
      <div className={`text-2xl mb-2 ${isWarning ? 'animate-pulse' : ''}`}>
        {modus === 'training' ? '🎄' : isWarning ? '🔔' : '🕐'}
      </div>
      
      {/* Timer display */}
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Decorative background */}
        <div className={`
          absolute inset-0 rounded-2xl transition-all duration-300
          ${isWarning 
            ? 'bg-[oklch(0.55_0.18_25_/_0.1)]' 
            : 'bg-[oklch(0.40_0.08_160_/_0.05)]'
          }
        `} />
        
        {/* Time display */}
        <div
          className={`
            relative text-3xl font-bold font-display
            transition-all duration-300
            ${isExpired 
              ? 'text-[oklch(0.55_0.18_25)]' 
              : isWarning 
                ? 'timer-warning' 
                : modus === 'training'
                  ? 'text-[oklch(0.40_0.08_160)]'
                  : 'text-[oklch(0.35_0.05_160)]'
            }
          `}
        >
          {formatTijd(tijd)}
        </div>
        
        {/* Mode indicator */}
        <div className="relative mt-2 text-sm text-[oklch(0.45_0.03_50)]">
          {modus === 'training' ? 'Training' : 'Tempo'}
        </div>
      </div>
      
      {/* Bottom icon */}
      <div className="text-xl mt-2">
        {modus === 'training' ? '🎄' : '⏱️'}
      </div>
      
      {/* Expired message */}
      {isExpired && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[oklch(0.55_0.18_25)] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-bounce">
          Ho ho ho! Probeer sneller! 🎅
        </div>
      )}
    </div>
  );
};

export default Timer;
