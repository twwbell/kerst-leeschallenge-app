import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { BlokSamenvatting } from '../types/types';
import { formatTijd } from '../hooks/useTimer';

interface BlockSummaryProps {
  samenvatting: BlokSamenvatting;
  onVolgendeBlok: () => void;
}

const BlockSummary: React.FC<BlockSummaryProps> = ({ 
  samenvatting, 
  onVolgendeBlok 
}) => {
  // Kerst confetti bij openen
  useEffect(() => {
    const colors = ['#2D5A4A', '#C94C4C', '#D4AF37']; // Groen, rood, goud
    
    const fireConfetti = () => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.2,
      });
    };

    fireConfetti();
    const timer = setTimeout(fireConfetti, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0_0_0_/_0.5)] backdrop-blur-sm p-4">
      <div className="bg-[oklch(0.98_0.01_80)] rounded-3xl shadow-2xl border-4 border-[oklch(0.75_0.15_85)] max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[oklch(0.40_0.08_160)] to-[oklch(0.45_0.10_160)] p-6 text-center">
          <div className="text-3xl mb-2">🎄🎁</div>
          <h2 className="text-2xl font-bold text-white font-display">
            Blok {samenvatting.blokNummer} Voltooid!
          </h2>
          <div className="text-3xl mt-2">🎁🎄</div>
        </div>

        {/* Statistieken */}
        <div className="p-6 space-y-4">
          {/* Leestijd */}
          <div className="flex justify-between items-center py-2 border-b border-[oklch(0.90_0.02_80)]">
            <span className="text-[oklch(0.45_0.03_50)]">Leestijd:</span>
            <span className="font-bold text-[oklch(0.40_0.08_160)] font-display text-lg">
              {formatTijd(samenvatting.leestijd)}
            </span>
          </div>

          {/* Gemiddelde per woord */}
          <div className="flex justify-between items-center py-2 border-b border-[oklch(0.90_0.02_80)]">
            <span className="text-[oklch(0.45_0.03_50)]">Gem. per woord:</span>
            <span className="font-bold text-[oklch(0.40_0.08_160)] font-display text-lg">
              {samenvatting.gemiddeldePerWoord.toFixed(1)} sec
            </span>
          </div>

          {/* Snelste woord */}
          <div className="flex justify-between items-center py-2 border-b border-[oklch(0.90_0.02_80)]">
            <span className="text-[oklch(0.45_0.03_50)]">Snelste woord:</span>
            <span className="font-bold text-[oklch(0.40_0.08_160)] font-display">
              "{samenvatting.snelsteWoord.woord}" ⚡ ({(samenvatting.snelsteWoord.tijd / 1000).toFixed(1)}s)
            </span>
          </div>

          {/* Langzaamste woord */}
          <div className="flex justify-between items-center py-2 border-b border-[oklch(0.90_0.02_80)]">
            <span className="text-[oklch(0.45_0.03_50)]">Langzaamste:</span>
            <span className="font-bold text-[oklch(0.55_0.18_25)] font-display">
              "{samenvatting.langzaamsteWoord.woord}" 🐌 ({(samenvatting.langzaamsteWoord.tijd / 1000).toFixed(1)}s)
            </span>
          </div>

          {/* Keer voorgelezen */}
          <div className="flex justify-between items-center py-2 border-b border-[oklch(0.90_0.02_80)]">
            <span className="text-[oklch(0.45_0.03_50)]">Keer voorgelezen:</span>
            <span className="font-bold text-[oklch(0.75_0.15_85)] font-display text-lg">
              {samenvatting.keerVoorgelezen}× 🔔
            </span>
          </div>

          {/* Dag voortgang */}
          <div className="bg-[oklch(0.95_0.01_80)] rounded-xl p-4 mt-4">
            <h3 className="text-center font-bold text-[oklch(0.40_0.08_160)] mb-3">
              📊 Dag Voortgang
            </h3>
            <div className="flex justify-between text-sm">
              <span>Woorden gelezen:</span>
              <span className="font-bold">
                {samenvatting.dagVoortgang.woordenGelezen}/{samenvatting.dagVoortgang.totaalWoorden} ⭐
              </span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Blokken voltooid:</span>
              <span className="font-bold">
                {samenvatting.dagVoortgang.blokkenVoltooid}/{samenvatting.dagVoortgang.totaalBlokken} 🎁
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 h-3 bg-[oklch(0.88_0.02_80)] rounded-full overflow-hidden">
              <div 
                className="h-full christmas-gradient rounded-full transition-all duration-500"
                style={{ 
                  width: `${(samenvatting.dagVoortgang.blokkenVoltooid / samenvatting.dagVoortgang.totaalBlokken) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>

        {/* Volgende blok knop */}
        <div className="p-6 pt-0">
          <button
            onClick={onVolgendeBlok}
            className="w-full py-4 rounded-xl text-lg font-bold btn-christmas-primary flex items-center justify-center gap-2"
          >
            <span>Volgende Blok</span>
            <span>→</span>
            <span>🎄</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockSummary;
