import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DagCelebration } from '../types/types';

interface DayCelebrationProps {
  celebration: DagCelebration;
  onVolgendeDag: () => void;
  onKlaar: () => void;
}

const DayCelebration: React.FC<DayCelebrationProps> = ({
  celebration,
  onVolgendeDag,
  onKlaar,
}) => {
  // Grote celebration confetti of vuurwerk
  useEffect(() => {
    if (celebration.isLaatsteDag) {
      // Vuurwerk voor laatste dag (Oud & Nieuw thema)
      fireNewYearFireworks();
    } else {
      // Kerst confetti voor normale dagen
      fireChristmasConfetti();
    }
  }, [celebration.isLaatsteDag]);

  const fireChristmasConfetti = () => {
    const duration = 4000;
    const end = Date.now() + duration;
    const colors = ['#2D5A4A', '#C94C4C', '#D4AF37']; // Groen, rood, goud

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.5,
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        shapes: ['circle', 'square'],
        scalar: 1.5,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const fireNewYearFireworks = () => {
    const duration = 6000;
    const end = Date.now() + duration;
    const colors = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF1493', '#00CED1'];

    const frame = () => {
      confetti({
        particleCount: 30,
        startVelocity: 40,
        spread: 360,
        origin: {
          x: Math.random(),
          y: Math.random() * 0.5,
        },
        colors: colors,
        shapes: ['circle'],
        scalar: 1.2,
        gravity: 0.8,
        drift: 0,
        ticks: 100,
      });

      if (Date.now() < end) {
        setTimeout(() => requestAnimationFrame(frame), 200);
      }
    };

    frame();
  };

  const { totaalChallengeVoortgang } = celebration;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0_0_0_/_0.6)] backdrop-blur-md p-4">
      <div className="celebration-overlay rounded-3xl shadow-2xl border-4 border-[oklch(0.75_0.15_85)] max-w-lg w-full overflow-hidden">
        {/* Header met decoratie */}
        <div className="text-center py-8 px-6">
          <div className="text-4xl mb-4">
            {celebration.isLaatsteDag ? '🎆 ⭐ 🎇' : '❄️ ⭐ 🎄 ⭐ ❄️'}
          </div>
          
          <h1 className={`
            text-3xl md:text-4xl font-bold font-display mb-4
            ${celebration.isLaatsteDag 
              ? 'text-[oklch(0.75_0.15_85)]' 
              : 'text-[oklch(0.40_0.08_160)]'
            }
          `}>
            {celebration.isLaatsteDag ? '🎅 FANTASTISCH! 🎅' : '🎅 GEWELDIG! 🎅'}
          </h1>

          <p className="text-xl text-[oklch(0.35_0.03_50)]">
            {celebration.isLaatsteDag 
              ? 'Je hebt de HELE CHALLENGE voltooid!'
              : `Je hebt Dag ${celebration.dagNummer} voltooid!`
            }
          </p>

          <div className="text-2xl font-bold text-[oklch(0.40_0.08_160)] mt-4 font-display">
            {celebration.woordenGelezen} woorden gelezen! 📚⭐
          </div>

          {celebration.isLaatsteDag && (
            <div className="mt-6 text-2xl font-bold text-[oklch(0.75_0.15_85)] animate-pulse">
              🎆 GELUKKIG NIEUWJAAR! 🎆
            </div>
          )}
        </div>

        {/* Challenge voortgang */}
        <div className="bg-[oklch(0.95_0.01_80)] p-6 mx-6 rounded-xl mb-6">
          <h3 className="text-center font-bold text-[oklch(0.40_0.08_160)] mb-4">
            TOTALE CHALLENGE VOORTGANG
          </h3>

          {/* Dagen visualisatie */}
          <div className="flex justify-center gap-2 mb-4">
            {Array.from({ length: totaalChallengeVoortgang.totaalDagen }).map((_, idx) => (
              <span key={idx} className="text-2xl">
                {idx < totaalChallengeVoortgang.dagenVoltooid ? '🎄' : '⬜️'}
              </span>
            ))}
          </div>

          {/* Woorden teller */}
          <div className="text-center text-lg font-bold text-[oklch(0.40_0.08_160)]">
            {totaalChallengeVoortgang.woordenGelezen}/{totaalChallengeVoortgang.totaalWoorden} woorden ⭐
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-4 bg-[oklch(0.88_0.02_80)] rounded-full overflow-hidden">
            <div
              className="h-full christmas-gradient rounded-full transition-all duration-1000"
              style={{
                width: `${(totaalChallengeVoortgang.woordenGelezen / totaalChallengeVoortgang.totaalWoorden) * 100}%`,
              }}
            />
          </div>

          <div className="text-center mt-3 text-[oklch(0.45_0.03_50)]">
            Dagen voltooid: {totaalChallengeVoortgang.dagenVoltooid}/{totaalChallengeVoortgang.totaalDagen} 🎁
          </div>
        </div>

        {/* Knoppen */}
        <div className="flex gap-4 p-6 pt-0">
          {!celebration.isLaatsteDag && (
            <button
              onClick={onVolgendeDag}
              className="flex-1 py-4 rounded-xl text-lg font-bold btn-christmas-primary flex items-center justify-center gap-2"
            >
              <span>🎄</span>
              <span>Start Dag {celebration.dagNummer + 1}</span>
            </button>
          )}
          
          <button
            onClick={onKlaar}
            className={`
              py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2
              ${celebration.isLaatsteDag 
                ? 'flex-1 btn-christmas-gold' 
                : 'px-6 btn-christmas-secondary'
              }
            `}
          >
            <span>🏠</span>
            <span>Klaar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayCelebration;
