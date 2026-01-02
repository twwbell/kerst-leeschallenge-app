import React, { useState } from 'react';
import { WoordenData } from '../types/types';

interface DaySelectorProps {
  data: WoordenData;
  huidigeDag: number;
  dagenVoltooid: number[];
  onSelectDag: (dagIndex: number) => void;
  getDagVoortgang: (dagIndex: number) => number;
  onReset: () => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  data,
  huidigeDag,
  dagenVoltooid,
  onSelectDag,
  getDagVoortgang,
  onReset,
}) => {
  const [showUitleg, setShowUitleg] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const totaleDagen = data.dagen.length;
  const totaleWoorden = totaleDagen * 200;
  const gelezenWoorden = data.dagen.reduce((sum, _, idx) => sum + getDagVoortgang(idx), 0);

  const handleReset = () => {
    onReset();
    setShowResetConfirm(false);
  };

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

          {/* Motivatie tekst */}
          <p className="text-center text-[oklch(0.55_0.03_50)] italic mt-3 text-sm">
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

        {/* Uitleg en Begin opnieuw buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => setShowUitleg(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-white shadow-md hover:shadow-lg transition-all duration-300 text-[oklch(0.40_0.08_160)] hover:bg-[oklch(0.97_0.01_80)]"
          >
            📖 Uitleg
          </button>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[oklch(0.55_0.18_25)] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[oklch(0.50_0.20_25)]"
          >
            🔄 Begin opnieuw
          </button>
        </div>
      </div>

      {/* Uitleg popup */}
      {showUitleg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fadeIn">
            <h2 className="text-xl font-display font-bold text-[oklch(0.40_0.08_160)] mb-4 text-center">
              📖 Hoe werkt de Leeschallenge?
            </h2>
            <div className="text-[oklch(0.35_0.03_50)] space-y-3 text-sm leading-relaxed">
              <p>
                Welkom bij de Kerstvakantie Leeschallenge! Elke dag lees je 200 woorden,
                verdeeld over 10 blokken van 20 woorden.
              </p>
              <p>
                <strong>Zo werkt het:</strong> Lees het gemarkeerde woord hardop voor en
                druk op <strong>Volgende</strong>. De app luistert niet mee, maar helpt
                bij het oefenen van lezen en tempo.
              </p>
              <p>
                <strong>Training modus:</strong> Lees op je eigen tempo. De stopwatch
                houdt bij hoe lang je doet over elk blok.
              </p>
              <p>
                <strong>Timer modus:</strong> Daag jezelf uit! Stel een tijd in en probeer
                het blok binnen de tijd uit te lezen.
              </p>
              <p>
                Klik op <strong>🪓 Lettergrepen</strong> om een moeilijk woord op te splitsen.
                Gebruik <strong>📣</strong> om het woord te laten voorlezen of <strong>👆</strong>
                om letters aan te tikken. Veel leesplezier! 🎄
              </p>
              <p className="text-xs text-[oklch(0.55_0.03_50)] pt-2 border-t border-[oklch(0.90_0.02_80)]">
                Vragen of opmerkingen? Mail naar{' '}
                <a href="mailto:leeschallenge@thomasbell.nl" className="text-[oklch(0.40_0.08_160)] underline">
                  leeschallenge@thomasbell.nl
                </a>
              </p>
            </div>
            <button
              onClick={() => setShowUitleg(false)}
              className="mt-6 w-full py-3 rounded-xl font-semibold btn-christmas-primary"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}

      {/* Reset bevestiging popup */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-fadeIn">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-display font-bold text-[oklch(0.55_0.18_25)] mb-3">
                Weet je het zeker?
              </h2>
              <p className="text-[oklch(0.45_0.03_50)] mb-6">
                Al je voortgang wordt gewist. Dit kan niet ongedaan worden gemaakt!
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[oklch(0.92_0.01_80)] text-[oklch(0.45_0.03_50)] hover:bg-[oklch(0.88_0.01_80)] transition-colors"
                >
                  Annuleren
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[oklch(0.55_0.18_25)] text-white hover:bg-[oklch(0.50_0.20_25)] transition-colors"
                >
                  Ja, reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelector;
