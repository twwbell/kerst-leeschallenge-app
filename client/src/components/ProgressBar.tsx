import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center h-full py-4">
      {/* Progress container */}
      <div className="relative flex-1 w-8 bg-[oklch(0.92_0.01_80)] rounded-full overflow-hidden shadow-inner border-2 border-[oklch(0.85_0.02_80)]">
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 christmas-gradient rounded-full transition-all duration-500 ease-out"
          style={{ height: `${percentage}%` }}
        >
          {/* Sparkle effect at top of fill */}
          {percentage > 5 && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="text-xs sparkle">✨</span>
            </div>
          )}
        </div>
        
        {/* Decorative candy cane stripes */}
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
      
      {/* Label */}
      <div className="mt-3 text-center">
        <div className="text-lg font-bold text-[oklch(0.40_0.08_160)] font-display">
          {current}/{total}
        </div>
        <div className="text-xl">⭐</div>
      </div>
    </div>
  );
};

export default ProgressBar;
