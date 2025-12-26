import React from 'react';
import { Modus } from '../types/types';

interface ModeToggleProps {
  modus: Modus;
  onToggle: (modus: Modus) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ modus, onToggle }) => {
  const isTraining = modus === 'training';

  return (
    <div className="flex items-center justify-center gap-3">
      {/* Training label */}
      <span 
        className={`text-lg font-semibold transition-all duration-300 ${
          isTraining 
            ? 'text-[oklch(0.40_0.08_160)] scale-110' 
            : 'text-[oklch(0.45_0.03_50)] opacity-60'
        }`}
      >
        🎄
      </span>
      
      {/* Toggle switch */}
      <button
        onClick={() => onToggle(isTraining ? 'tempo' : 'training')}
        className={`
          relative w-20 h-10 rounded-full transition-all duration-300
          border-2 shadow-lg
          ${isTraining 
            ? 'bg-gradient-to-r from-[oklch(0.45_0.08_160)] to-[oklch(0.40_0.08_160)] border-[oklch(0.75_0.15_85)]' 
            : 'bg-gradient-to-r from-[oklch(0.55_0.18_25)] to-[oklch(0.50_0.18_25)] border-[oklch(0.75_0.15_85)]'
          }
        `}
        aria-label={`Schakel naar ${isTraining ? 'tempo' : 'training'} modus`}
      >
        {/* Sliding indicator */}
        <div
          className={`
            absolute top-1 w-7 h-7 rounded-full
            bg-white shadow-md
            transition-all duration-300 ease-out
            flex items-center justify-center text-sm
            ${isTraining ? 'left-1' : 'left-11'}
          `}
        >
          {isTraining ? '🎄' : '⏱️'}
        </div>
        
        {/* Decorative sparkles */}
        <div className={`
          absolute top-0 right-2 text-xs transition-opacity duration-300
          ${isTraining ? 'opacity-100' : 'opacity-0'}
        `}>
          ✨
        </div>
      </button>
      
      {/* Tempo label */}
      <span 
        className={`text-lg font-semibold transition-all duration-300 ${
          !isTraining 
            ? 'text-[oklch(0.55_0.18_25)] scale-110' 
            : 'text-[oklch(0.45_0.03_50)] opacity-60'
        }`}
      >
        ⏱️
      </span>
    </div>
  );
};

export default ModeToggle;
