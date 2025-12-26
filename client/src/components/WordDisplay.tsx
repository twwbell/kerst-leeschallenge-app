import React from 'react';
import { Blok } from '../types/types';

interface WordDisplayProps {
  blok: Blok;
  huidigRijtje: number;
  huidigWoord: number;
  gelezenWoorden: Set<string>;
  dagIndex: number;
  blokIndex: number;
}

const WordDisplay: React.FC<WordDisplayProps> = ({
  blok,
  huidigRijtje,
  huidigWoord,
  gelezenWoorden,
  dagIndex,
  blokIndex,
}) => {
  const isWoordGelezen = (rijtjeIdx: number, woordIdx: number): boolean => {
    const key = `${dagIndex}-${blokIndex}-${rijtjeIdx}-${woordIdx}`;
    return gelezenWoorden.has(key);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {blok.rijtjes.map((rijtje, rijtjeIdx) => {
        const isHuidigRijtje = rijtjeIdx === huidigRijtje;
        
        return (
          <div
            key={rijtje.rijtje}
            className={`
              flex flex-wrap justify-center gap-3 md:gap-6 py-3 px-4 rounded-xl
              transition-all duration-300
              ${isHuidigRijtje 
                ? 'bg-[oklch(1_0_0_/_0.8)] shadow-lg' 
                : 'opacity-30'
              }
            `}
          >
            {rijtje.woorden.map((woord, woordIdx) => {
              const isHuidigWoord = isHuidigRijtje && woordIdx === huidigWoord;
              const isGelezen = isWoordGelezen(rijtjeIdx, woordIdx);
              
              return (
                <div
                  key={`${rijtje.rijtje}-${woordIdx}`}
                  className={`
                    relative flex items-center gap-1
                    transition-all duration-300
                    ${isHuidigWoord ? 'word-highlight scale-110' : ''}
                  `}
                >
                  <span
                    className={`
                      font-display text-2xl md:text-3xl lg:text-4xl
                      transition-all duration-300
                      ${isHuidigWoord 
                        ? 'font-bold text-[oklch(0.25_0.03_50)]' 
                        : isGelezen
                          ? 'text-[oklch(0.40_0.08_160)]'
                          : 'text-[oklch(0.35_0.03_50)]'
                      }
                    `}
                  >
                    {woord}
                  </span>
                  
                  {/* Ster voor gelezen woorden */}
                  {isGelezen && !isHuidigWoord && (
                    <span className="text-lg star-twinkle">⭐</span>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default WordDisplay;
