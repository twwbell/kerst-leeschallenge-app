import React, { useState, useEffect } from 'react';
import { splitMetKleuren } from '../utils/lettergreepSplitter';
import { Lettergreep } from '../types/types';

interface SyllableViewProps {
  woord: string;
  onSpreekLettergreep: (lettergreep: string) => void;
  onClose: () => void;
}

const SyllableView: React.FC<SyllableViewProps> = ({ 
  woord, 
  onSpreekLettergreep,
  onClose 
}) => {
  const [lettergrepen, setLettergrepen] = useState<Lettergreep[]>([]);
  const [huidigeLettergreep, setHuidigeLettergreep] = useState(0);

  useEffect(() => {
    const gesplitst = splitMetKleuren(woord);
    setLettergrepen(gesplitst);
    setHuidigeLettergreep(0);
  }, [woord]);

  const handleVorige = () => {
    if (huidigeLettergreep > 0) {
      setHuidigeLettergreep(prev => prev - 1);
    }
  };

  const handleVolgende = () => {
    if (huidigeLettergreep < lettergrepen.length - 1) {
      setHuidigeLettergreep(prev => prev + 1);
    } else {
      // Klaar met alle lettergrepen
      onClose();
    }
  };

  const handleSpreek = () => {
    if (lettergrepen[huidigeLettergreep]) {
      onSpreekLettergreep(lettergrepen[huidigeLettergreep].tekst);
    }
  };

  const getKleurClass = (kleur: 'green' | 'red' | 'gold'): string => {
    switch (kleur) {
      case 'green':
        return 'text-[oklch(0.40_0.08_160)]';
      case 'red':
        return 'text-[oklch(0.55_0.18_25)]';
      case 'gold':
        return 'text-[oklch(0.65_0.15_85)]';
      default:
        return 'text-[oklch(0.25_0.03_50)]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0_0_0_/_0.5)] backdrop-blur-sm">
      <div className="bg-[oklch(0.98_0.01_80)] rounded-3xl p-8 shadow-2xl border-4 border-[oklch(0.75_0.15_85)] max-w-lg w-full mx-4">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-2xl">🎁</span>
          <h3 className="text-xl font-bold text-[oklch(0.40_0.08_160)] font-display mt-2">
            Lettergrepen
          </h3>
          <p className="text-sm text-[oklch(0.45_0.03_50)] mt-1">
            Woord: <span className="font-semibold">{woord}</span>
          </p>
        </div>

        {/* Alle lettergrepen weergave */}
        <div className="flex justify-center gap-2 mb-6">
          {lettergrepen.map((lg, idx) => (
            <span
              key={idx}
              className={`
                text-2xl font-display px-3 py-1 rounded-lg
                transition-all duration-300
                ${idx === huidigeLettergreep 
                  ? `${getKleurClass(lg.kleur)} bg-[oklch(0.75_0.15_85_/_0.2)] scale-110 font-bold` 
                  : 'text-[oklch(0.45_0.03_50)] opacity-50'
                }
              `}
            >
              {lg.tekst}
            </span>
          ))}
        </div>

        {/* Huidige lettergreep groot */}
        <div className="text-center mb-8">
          <div 
            className={`
              text-6xl md:text-7xl font-display font-bold
              ${getKleurClass(lettergrepen[huidigeLettergreep]?.kleur || 'green')}
              animate-pulse
            `}
            style={{
              textShadow: '0 4px 20px oklch(0.75 0.15 85 / 0.3)',
            }}
          >
            {lettergrepen[huidigeLettergreep]?.tekst || ''}
          </div>
          
          {/* Sparkle decoratie */}
          <div className="flex justify-center gap-4 mt-4">
            <span className="text-xl sparkle" style={{ animationDelay: '0s' }}>✨</span>
            <span className="text-xl sparkle" style={{ animationDelay: '0.5s' }}>✨</span>
            <span className="text-xl sparkle" style={{ animationDelay: '1s' }}>✨</span>
          </div>
        </div>

        {/* Navigatie knoppen */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleVorige}
            disabled={huidigeLettergreep === 0}
            className={`
              w-14 h-14 rounded-full text-2xl
              transition-all duration-300
              ${huidigeLettergreep === 0
                ? 'bg-[oklch(0.90_0.01_80)] text-[oklch(0.60_0.03_50)] cursor-not-allowed'
                : 'btn-christmas-primary'
              }
            `}
          >
            ◀
          </button>

          <button
            onClick={handleSpreek}
            className="w-16 h-16 rounded-full text-3xl btn-christmas-gold"
          >
            🔔
          </button>

          <button
            onClick={handleVolgende}
            className="w-14 h-14 rounded-full text-2xl btn-christmas-primary"
          >
            {huidigeLettergreep === lettergrepen.length - 1 ? '✓' : '▶'}
          </button>
        </div>

        {/* Voortgang indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {lettergrepen.map((_, idx) => (
            <div
              key={idx}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${idx === huidigeLettergreep 
                  ? 'bg-[oklch(0.75_0.15_85)] scale-125' 
                  : idx < huidigeLettergreep
                    ? 'bg-[oklch(0.40_0.08_160)]'
                    : 'bg-[oklch(0.85_0.02_80)]'
                }
              `}
            />
          ))}
        </div>

        {/* Sluiten knop */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl text-[oklch(0.45_0.03_50)] hover:bg-[oklch(0.92_0.01_80)] transition-colors"
        >
          Terug naar woord
        </button>
      </div>
    </div>
  );
};

export default SyllableView;
