import React, { useMemo } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  fontSize: number;
  delay: number;
  opacity: number;
}

interface SnowfallEffectProps {
  count?: number;
  intensity?: 'light' | 'normal' | 'heavy';
}

const SnowfallEffect: React.FC<SnowfallEffectProps> = ({ 
  count = 40, 
  intensity = 'normal' 
}) => {
  const snowflakes = useMemo(() => {
    const intensityMultiplier = intensity === 'light' ? 0.5 : intensity === 'heavy' ? 1.5 : 1;
    const actualCount = Math.floor(count * intensityMultiplier);
    
    return Array.from({ length: actualCount }, (_, i): Snowflake => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 8 + Math.random() * 12, // 8-20 seconden
      fontSize: 0.6 + Math.random() * 0.8, // 0.6-1.4rem
      delay: Math.random() * 8, // 0-8 seconden vertraging
      opacity: 0.3 + Math.random() * 0.5, // 0.3-0.8 opacity
    }));
  }, [count, intensity]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map(flake => (
        <div
          key={flake.id}
          className="snowflake absolute select-none"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.fontSize}rem`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.delay}s`,
            opacity: flake.opacity,
          }}
        >
          ❄️
        </div>
      ))}
    </div>
  );
};

export default SnowfallEffect;
