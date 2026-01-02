import React, { useState, useEffect } from 'react';
import { Modus } from '../types/types';

interface ModeToggleProps {
  modus: Modus;
  onToggle: (modus: Modus) => void;
  initialTime?: number;
  isRunning?: boolean;
  onTimeChange?: (seconds: number) => void;
  onPlayPause?: () => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({
  modus,
  onToggle,
  initialTime = 60,
  isRunning = false,
  onTimeChange,
  onPlayPause,
}) => {
  const isTraining = modus === 'training';
  const [minutes, setMinutes] = useState(Math.floor(initialTime / 60));
  const [seconds, setSeconds] = useState(initialTime % 60);

  // Sync local state when initialTime changes from outside
  useEffect(() => {
    setMinutes(Math.floor(initialTime / 60));
    setSeconds(initialTime % 60);
  }, [initialTime]);

  const handleTimeChange = (newMinutes: number, newSeconds: number) => {
    const totalSeconds = Math.max(0, newMinutes * 60 + newSeconds);
    if (onTimeChange) {
      onTimeChange(totalSeconds);
    }
  };

  const handleMinutesChange = (value: string) => {
    const newMinutes = Math.max(0, Math.min(59, parseInt(value) || 0));
    setMinutes(newMinutes);
    handleTimeChange(newMinutes, seconds);
  };

  const handleSecondsChange = (value: string) => {
    const newSeconds = Math.max(0, Math.min(59, parseInt(value) || 0));
    setSeconds(newSeconds);
    handleTimeChange(minutes, newSeconds);
  };

  return (
    <div className="relative">
      {/* Centered toggle - always in center */}
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
          onClick={() => onToggle(isTraining ? 'timer' : 'training')}
          className={`
            relative w-20 h-10 rounded-full transition-all duration-300
            border-2 shadow-lg
            ${isTraining
              ? 'bg-gradient-to-r from-[oklch(0.45_0.08_160)] to-[oklch(0.40_0.08_160)] border-[oklch(0.75_0.15_85)]'
              : 'bg-gradient-to-r from-[oklch(0.55_0.18_25)] to-[oklch(0.50_0.18_25)] border-[oklch(0.75_0.15_85)]'
            }
          `}
          aria-label={`Schakel naar ${isTraining ? 'timer' : 'training'} modus`}
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

        {/* Timer label */}
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

      {/* Timer controls - positioned to the right of the centered toggle */}
      {!isTraining && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 flex items-center gap-2 animate-fadeIn">
          {/* Time input */}
          <div className="flex items-center bg-white/80 rounded-lg border border-[oklch(0.85_0.02_80)] shadow-sm px-3 py-1">
            <input
              type="number"
              min="0"
              max="59"
              value={minutes}
              onChange={(e) => handleMinutesChange(e.target.value)}
              className="w-10 text-center bg-transparent text-lg font-mono font-semibold text-[oklch(0.35_0.05_160)] focus:outline-none"
              aria-label="Minuten"
            />
            <span className="text-lg font-mono font-semibold text-[oklch(0.45_0.03_50)]">:</span>
            <input
              type="number"
              min="0"
              max="59"
              value={seconds.toString().padStart(2, '0')}
              onChange={(e) => handleSecondsChange(e.target.value)}
              className="w-10 text-center bg-transparent text-lg font-mono font-semibold text-[oklch(0.35_0.05_160)] focus:outline-none"
              aria-label="Seconden"
            />
          </div>

          {/* Play/Pause button */}
          <button
            onClick={onPlayPause}
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xl
              transition-all duration-300 shadow-md
              ${isRunning
                ? 'bg-[oklch(0.55_0.18_25)] text-white hover:bg-[oklch(0.50_0.18_25)]'
                : 'bg-[oklch(0.45_0.12_160)] text-white hover:bg-[oklch(0.40_0.12_160)]'
              }
            `}
            aria-label={isRunning ? 'Pauzeer timer' : 'Start timer'}
          >
            {isRunning ? '⏸️' : '▶️'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ModeToggle;
