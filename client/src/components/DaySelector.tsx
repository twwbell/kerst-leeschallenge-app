import React from 'react';
import { WoordenData } from '../types/types';

/**
 * DESIGN: Magisch Winterwonderland
 * Dag selectie scherm met kerst thema
 * Zachte kleuren, ronde vormen, magische sfeer
 */

interface DaySelectorProps {
  data: WoordenData;
  huidigeDag: number;
  dagenVoltooid: number[];
  onSelectDag: (dagIndex: number) => void;
  getDagVoortgang: (dagIndex: number) => number;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  data,
  huidigeDag,
  dagenVoltooid,
  onSelectDag,
  getDagVoortgang,
}) => {
  const totaleDagen = data.dagen.length;
  const totaleWoorden = totaleDagen * 200;
  const gelezenWoorden = data.dagen.reduce((sum, _, idx) => sum + getDagVoortgang(idx), 0);

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 relative overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/winter-forest.png)' }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Header met mascotte */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white bg-white">
            <img 
              src="/images/reading-owl.png" 
              alt="Lees Uil" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-[oklch(0.40_0.08_160)] mb-2">
            Kerstvakantie Leeschallenge
          </h1>
          <p className="text-lg text-[oklch(0.45_0.03_50)]">
            Kies een dag om te beginnen
          </p>
        </div>

        {/* Dag kaarten grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {data.dagen.map((dag, index) => {
            const voortgang = getDagVoortgang(index);
            const isVoltooid = Array.isArray(dagenVoltooid) ? dagenVoltooid.includes(index) : voortgang >= 200;
            const isActief = index === huidigeDag;
            const percentage = (voortgang / 200) * 100;

            return (
              <button
                key={dag.dag}
                onClick={() => onSelectDag(index)}
                className={`
                  relative p-6 rounded-2xl transition-all duration-300
                  bg-white shadow-md hover:shadow-xl
                  ${isActief ? 'ring-4 ring-[oklch(0.75_0.15_85)]' : ''}
                  ${isVoltooid ? 'bg-gradient-to-br from-[oklch(0.95_0.03_160)] to-white' : ''}
                  hover:scale-105 active:scale-95
                `}
              >
                {/* Badge */}
                {isActief && !isVoltooid && (
                  <span className="absolute -top-2 -right-2 bg-[oklch(0.55_0.18_25)] text-white text-xs font-bold px-2 py-1 rounded-full">
                    Bezig
                  </span>
                )}
                {isVoltooid && (
                  <span className="absolute -top-2 -right-2 bg-[oklch(0.40_0.08_160)] text-white text-xs font-bold px-2 py-1 rounded-full">
                    ✓ Klaar
                  </span>
                )}

                {/* Dag icoon */}
                <div className="text-4xl mb-2">
                  {isVoltooid ? '🏆' : '📚'}
                </div>

                {/* Dag nummer */}
                <h2 className="text-xl font-display font-bold text-[oklch(0.40_0.08_160)]">
                  Dag {dag.dag}
                </h2>

                {/* Voortgang tekst */}
                <p className="text-sm text-[oklch(0.55_0.03_50)] mt-1">
                  {voortgang}/200 woorden
                </p>

                {/* Voortgang balk */}
                <div className="mt-3 h-2 bg-[oklch(0.92_0.01_80)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isVoltooid 
                        ? 'bg-[oklch(0.40_0.08_160)]' 
                        : 'bg-[oklch(0.75_0.15_85)]'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Totale voortgang */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-display font-bold text-[oklch(0.40_0.08_160)] text-center mb-4">
            Totale Challenge Voortgang
          </h3>
          
          {/* Dag indicators */}
          <div className="flex justify-center gap-2 mb-4">
            {data.dagen.map((_, index) => {
              const voltooid = Array.isArray(dagenVoltooid) ? dagenVoltooid.includes(index) : getDagVoortgang(index) >= 200;
              return (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold transition-all ${
                    voltooid
                      ? 'bg-[oklch(0.40_0.08_160)] text-white'
                      : index === huidigeDag
                      ? 'bg-[oklch(0.75_0.15_85)] text-white'
                      : 'bg-[oklch(0.92_0.01_80)] text-[oklch(0.55_0.03_50)]'
                  }`}
                >
                  {voltooid ? '✓' : index + 1}
                </div>
              );
            })}
          </div>

          {/* Totaal */}
          <p className="text-center text-[oklch(0.45_0.03_50)]">
            <span className="text-2xl font-bold text-[oklch(0.40_0.08_160)]">
              {gelezenWoorden}
            </span>
            /{totaleWoorden} woorden ⭐
          </p>
        </div>

        {/* Motivatie tekst */}
        <div className="text-center mt-6">
          <p className="text-[oklch(0.55_0.03_50)] italic">
            {gelezenWoorden === 0 
              ? "Klaar om te beginnen? Kies een dag!" 
              : gelezenWoorden < 500 
              ? "Goed bezig! Blijf zo doorgaan!" 
              : gelezenWoorden < 800 
              ? "Wow, je bent al halverwege!" 
              : gelezenWoorden < 1000 
              ? "Bijna klaar! Nog even volhouden!" 
              : "🎉 Gefeliciteerd! Je hebt de challenge voltooid! 🎉"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DaySelector;
