import React, { useState } from 'react';
import { detecteerKlank } from '../utils/lettergreepSplitter';

interface LetterClickModeProps {
  woord: string;
  isActive: boolean;
  onSpreekKlank: (klank: string) => void;
}

const LetterClickMode: React.FC<LetterClickModeProps> = ({
  woord,
  isActive,
  onSpreekKlank,
}) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const handleLetterClick = (index: number) => {
    if (!isActive) return;
    
    const { klank, lengte } = detecteerKlank(woord, index);
    setClickedIndex(index);
    onSpreekKlank(klank);
    
    // Reset highlight na korte tijd
    setTimeout(() => setClickedIndex(null), 500);
  };

  // Bouw letters met klank-detectie
  const letters: { char: string; index: number; isPartOfCluster: boolean }[] = [];
  let i = 0;
  while (i < woord.length) {
    const { lengte } = detecteerKlank(woord, i);
    
    // Voeg alle karakters van deze klank toe
    for (let j = 0; j < lengte; j++) {
      letters.push({
        char: woord[i + j],
        index: i,
        isPartOfCluster: lengte > 1,
      });
    }
    i += lengte;
  }

  return (
    <div 
      className={`
        flex justify-center gap-1 text-5xl md:text-6xl font-display font-bold
        ${isActive ? 'cursor-pointer' : ''}
      `}
    >
      {letters.map((letter, idx) => {
        const isClicked = clickedIndex === letter.index;
        
        return (
          <span
            key={idx}
            onClick={() => handleLetterClick(letter.index)}
            className={`
              transition-all duration-200
              ${isActive 
                ? 'hover:text-[oklch(0.75_0.15_85)] hover:scale-110' 
                : ''
              }
              ${isClicked 
                ? 'text-[oklch(0.75_0.15_85)] scale-125 drop-shadow-lg' 
                : 'text-[oklch(0.25_0.03_50)]'
              }
              ${letter.isPartOfCluster && isActive
                ? 'underline decoration-[oklch(0.75_0.15_85_/_0.3)] decoration-2 underline-offset-4'
                : ''
              }
            `}
          >
            {letter.char}
          </span>
        );
      })}
    </div>
  );
};

export default LetterClickMode;
