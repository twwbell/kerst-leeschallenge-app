import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WoordenData, Modus, BlokSamenvatting, DagCelebration } from '../types/types';
import { useTimer, useWoordTimer, formatTijd } from '../hooks/useTimer';
import { useAudio } from '../hooks/useAudio';
import ModeToggle from './ModeToggle';
import ProgressBar from './ProgressBar';
import Timer from './Timer';
import WordDisplay from './WordDisplay';
import SyllableView from './SyllableView';
import LetterClickMode from './LetterClickMode';
import BlockSummary from './BlockSummary';
import DayCelebrationComponent from './DayCelebration';

interface ReadingScreenProps {
  data: WoordenData;
  dagIndex: number;
  blokIndex: number;
  rijtjeIndex: number;
  woordIndex: number;
  modus: Modus;
  gelezenWoorden: Set<string>;
  onModeChange: (modus: Modus) => void;
  onPositieChange: (dag: number, blok: number, rijtje: number, woord: number) => void;
  onWoordGelezen: (dag: number, blok: number, rijtje: number, woord: number) => void;
  onBlokVoltooid: (blokStat: { blok: number; tijd: number; voorgelezen: number; moeilijkGemarkeerd: string[]; woordTijden: Record<string, number> }) => void;
  onDagVoltooid: (dag: number) => void;
  onTerug: () => void;
  getBlokVoortgang: (dag: number, blok: number) => number;
  getDagVoortgang: (dag: number) => number;
}

const ReadingScreen: React.FC<ReadingScreenProps> = ({
  data,
  dagIndex,
  blokIndex,
  rijtjeIndex,
  woordIndex,
  modus,
  gelezenWoorden,
  onModeChange,
  onPositieChange,
  onWoordGelezen,
  onBlokVoltooid,
  onDagVoltooid,
  onTerug,
  getBlokVoortgang,
  getDagVoortgang,
}) => {
  const dag = data.dagen[dagIndex];
  const blok = dag?.blokken[blokIndex];
  const rijtje = blok?.rijtjes[rijtjeIndex];
  const huidigWoord = rijtje?.woorden[woordIndex] || '';

  // State
  const [showSyllables, setShowSyllables] = useState(false);
  const [letterClickActive, setLetterClickActive] = useState(false);
  const [showBlockSummary, setShowBlockSummary] = useState(false);
  const [showDayCelebration, setShowDayCelebration] = useState(false);
  const [blockSummaryData, setBlockSummaryData] = useState<BlokSamenvatting | null>(null);
  const [dayCelebrationData, setDayCelebrationData] = useState<DagCelebration | null>(null);

  // Statistieken tracking
  const voorgelezen = useRef(0);
  const moeilijkGemarkeerd = useRef<string[]>([]);

  // Hooks
  const timer = useTimer(modus);
  const woordTimer = useWoordTimer();
  const audio = useAudio();

  // Track if chime has been played for current expiration
  const chimePlayedRef = useRef(false);

  // Start timer en woord timer bij mount (only auto-start for training mode)
  useEffect(() => {
    if (modus === 'training') {
      timer.start();
    }
    woordTimer.startWoord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Play chime when timer expires
  useEffect(() => {
    if (timer.isExpired && !chimePlayedRef.current) {
      audio.playChime();
      chimePlayedRef.current = true;
    }
    // Reset chime tracking when timer is reset (time goes positive)
    if (timer.tijd > 0) {
      chimePlayedRef.current = false;
    }
  }, [timer.isExpired, timer.tijd, audio]);

  // Reset woord timer bij nieuw woord
  useEffect(() => {
    woordTimer.startWoord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [woordIndex, rijtjeIndex, blokIndex]);

  const getTotaalWoordenInBlok = useCallback(() => {
    if (!blok) return 0;
    return blok.rijtjes.reduce((sum, r) => sum + r.woorden.length, 0);
  }, [blok]);

  const getHuidigeWoordNummer = useCallback(() => {
    if (!blok) return 0;
    let nummer = 0;
    for (let r = 0; r < rijtjeIndex; r++) {
      nummer += blok.rijtjes[r].woorden.length;
    }
    return nummer + woordIndex + 1;
  }, [blok, rijtjeIndex, woordIndex]);

  const handleVolgende = useCallback(() => {
    // Auto-start timer on first "Volgende" click (for both modes)
    if (!timer.isRunning) {
      timer.start();
    }

    // Registreer woord tijd
    const tijd = woordTimer.eindWoord(huidigWoord);

    // Markeer als gelezen
    onWoordGelezen(dagIndex, blokIndex, rijtjeIndex, woordIndex);

    // Bepaal volgende positie
    const volgendWoordIndex = woordIndex + 1;
    
    if (volgendWoordIndex < rijtje.woorden.length) {
      // Volgende woord in zelfde rijtje
      onPositieChange(dagIndex, blokIndex, rijtjeIndex, volgendWoordIndex);
    } else {
      // Volgende rijtje
      const volgendRijtjeIndex = rijtjeIndex + 1;
      
      if (volgendRijtjeIndex < blok.rijtjes.length) {
        // Volgende rijtje in zelfde blok
        onPositieChange(dagIndex, blokIndex, volgendRijtjeIndex, 0);
      } else {
        // Blok voltooid!
        timer.pause();
        
        const woordTijden = woordTimer.getTijden();
        const tijdenArray = Object.entries(woordTijden);
        const snelste = tijdenArray.reduce((min, curr) => curr[1] < min[1] ? curr : min, tijdenArray[0] || ['', Infinity]);
        const langzaamste = tijdenArray.reduce((max, curr) => curr[1] > max[1] ? curr : max, tijdenArray[0] || ['', 0]);

        const samenvatting: BlokSamenvatting = {
          blokNummer: blokIndex + 1,
          leestijd: timer.tijd,
          gemiddeldePerWoord: timer.tijd / getTotaalWoordenInBlok(),
          snelsteWoord: { woord: snelste[0], tijd: snelste[1] },
          langzaamsteWoord: { woord: langzaamste[0], tijd: langzaamste[1] },
          keerVoorgelezen: voorgelezen.current,
          dagVoortgang: {
            woordenGelezen: getDagVoortgang(dagIndex) + getTotaalWoordenInBlok(),
            totaalWoorden: 200,
            blokkenVoltooid: blokIndex + 1,
            totaalBlokken: 10,
          },
        };

        // Sla blok statistieken op
        onBlokVoltooid({
          blok: blokIndex + 1,
          tijd: timer.tijd,
          voorgelezen: voorgelezen.current,
          moeilijkGemarkeerd: moeilijkGemarkeerd.current,
          woordTijden,
        });

        setBlockSummaryData(samenvatting);
        setShowBlockSummary(true);
      }
    }
  }, [
    dagIndex, blokIndex, rijtjeIndex, woordIndex, rijtje, blok, huidigWoord,
    modus, timer, woordTimer, onWoordGelezen, onPositieChange, onBlokVoltooid,
    getTotaalWoordenInBlok, getDagVoortgang
  ]);

  const handleVorige = useCallback(() => {
    if (woordIndex > 0) {
      onPositieChange(dagIndex, blokIndex, rijtjeIndex, woordIndex - 1);
    } else if (rijtjeIndex > 0) {
      const vorigRijtje = blok.rijtjes[rijtjeIndex - 1];
      onPositieChange(dagIndex, blokIndex, rijtjeIndex - 1, vorigRijtje.woorden.length - 1);
    }
    // Kan niet terug naar vorig blok
  }, [dagIndex, blokIndex, rijtjeIndex, woordIndex, blok, onPositieChange]);

  const handleMoeilijk = useCallback(() => {
    moeilijkGemarkeerd.current.push(huidigWoord);
    setShowSyllables(true);
  }, [huidigWoord]);

  const handleSpreekWoord = useCallback(() => {
    audio.spreekWoord(huidigWoord);
    voorgelezen.current++;
  }, [audio, huidigWoord]);

  const handleVolgendeBlok = useCallback(() => {
    setShowBlockSummary(false);
    
    const volgendBlokIndex = blokIndex + 1;
    
    if (volgendBlokIndex < dag.blokken.length) {
      // Volgende blok
      onPositieChange(dagIndex, volgendBlokIndex, 0, 0);
      timer.reset();
      woordTimer.reset();
      voorgelezen.current = 0;
      moeilijkGemarkeerd.current = [];
      timer.start();
    } else {
      // Dag voltooid!
      onDagVoltooid(dagIndex);
      
      const totaalGelezen = (dagIndex + 1) * 200;
      const celebration: DagCelebration = {
        dagNummer: dagIndex + 1,
        woordenGelezen: 200,
        totaalChallengeVoortgang: {
          woordenGelezen: totaalGelezen,
          totaalWoorden: 1000,
          dagenVoltooid: dagIndex + 1,
          totaalDagen: 5,
        },
        isLaatsteDag: dagIndex === 4,
      };
      
      setDayCelebrationData(celebration);
      setShowDayCelebration(true);
    }
  }, [dagIndex, blokIndex, dag, onPositieChange, onDagVoltooid, timer, woordTimer]);

  const handleVolgendeDag = useCallback(() => {
    setShowDayCelebration(false);
    const volgendeDagIndex = dagIndex + 1;
    if (volgendeDagIndex < data.dagen.length) {
      onPositieChange(volgendeDagIndex, 0, 0, 0);
      timer.reset();
      woordTimer.reset();
      voorgelezen.current = 0;
      moeilijkGemarkeerd.current = [];
      timer.start();
    }
  }, [dagIndex, data.dagen.length, onPositieChange, timer, woordTimer]);

  if (!blok || !rijtje) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-[oklch(0.45_0.03_50)]">Laden...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-[oklch(0.90_0.02_80)]">
        <button
          onClick={onTerug}
          className="text-2xl p-2 hover:bg-[oklch(0.95_0.01_80)] rounded-full transition-colors"
        >
          ←
        </button>
        
        <div className="text-center">
          <div className="text-sm text-[oklch(0.45_0.03_50)]">
            Dag {dagIndex + 1} • Blok {blokIndex + 1}
          </div>
          <ModeToggle
            modus={modus}
            onToggle={onModeChange}
            initialTime={timer.initialTime}
            isRunning={timer.isRunning}
            onTimeChange={timer.setInitialTime}
            onPlayPause={timer.toggle}
          />
        </div>
        
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Main content */}
      <main className="flex-1 flex">
        {/* Left: Progress bar */}
        <div className="w-16 md:w-20 border-r border-[oklch(0.90_0.02_80)] bg-white/50">
          <ProgressBar 
            current={getHuidigeWoordNummer()} 
            total={getTotaalWoordenInBlok()} 
          />
        </div>

        {/* Center: Word display */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
          {letterClickActive ? (
            <div className="text-center">
              <p className="text-sm text-[oklch(0.45_0.03_50)] mb-4">
                Klik op een letter om de klank te horen 👆
              </p>
              <LetterClickMode
                woord={huidigWoord}
                isActive={letterClickActive}
                onSpreekKlank={audio.spreekKlank}
              />
            </div>
          ) : (
            <WordDisplay
              blok={blok}
              huidigRijtje={rijtjeIndex}
              huidigWoord={woordIndex}
              gelezenWoorden={gelezenWoorden}
              dagIndex={dagIndex}
              blokIndex={blokIndex}
            />
          )}
        </div>

        {/* Right: Timer */}
        <div className="w-16 md:w-20 border-l border-[oklch(0.90_0.02_80)] bg-white/50">
          <Timer
            tijd={timer.tijd}
            modus={modus}
            isWarning={timer.isWarning}
            isExpired={timer.isExpired}
            initialTime={timer.initialTime}
          />
        </div>
      </main>

      {/* Controls */}
      <footer className="p-4 bg-white/80 backdrop-blur-sm border-t border-[oklch(0.90_0.02_80)]">
        {/* Audio controls */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleSpreekWoord}
            disabled={audio.isSpeaking}
            className={`
              w-14 h-14 rounded-full text-2xl transition-all duration-300
              ${audio.isSpeaking 
                ? 'bg-[oklch(0.90_0.01_80)] text-[oklch(0.60_0.03_50)]' 
                : 'btn-christmas-gold'
              }
            `}
            title="Lees woord voor 📣"
            aria-label="Lees woord voor"
          >
            📣
          </button>
          
          <button
            onClick={() => setLetterClickActive(!letterClickActive)}
            className={`
              w-14 h-14 rounded-full text-2xl transition-all duration-300
              ${letterClickActive 
                ? 'btn-christmas-gold ring-4 ring-[oklch(0.75_0.15_85)]' 
                : 'bg-[oklch(0.95_0.01_80)] hover:bg-[oklch(0.90_0.01_80)]'
              }
            `}
            title="Klik op letters"
          >
            👆
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={handleVorige}
            disabled={woordIndex === 0 && rijtjeIndex === 0}
            className={`
              px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300
              ${woordIndex === 0 && rijtjeIndex === 0
                ? 'bg-[oklch(0.90_0.01_80)] text-[oklch(0.60_0.03_50)] cursor-not-allowed'
                : 'btn-christmas-secondary'
              }
            `}
          >
            ◀ Vorige
          </button>

          <button
            onClick={handleMoeilijk}
            className="px-6 py-3 rounded-xl text-lg font-semibold btn-christmas-gold"
            title="Lettergrepen (🪓)"
            aria-label="Lettergrepen"
          >
            🪓 Lettergrepen
          </button>

          <button
            onClick={handleVolgende}
            className="px-6 py-3 rounded-xl text-lg font-semibold btn-christmas-primary"
          >
            Volgende ▶
          </button>
        </div>
      </footer>

      {/* Syllable view modal */}
      {showSyllables && (
        <SyllableView
          woord={huidigWoord}
          onSpreekLettergreep={audio.spreekLettergreep}
          onClose={() => setShowSyllables(false)}
        />
      )}

      {/* Block summary modal */}
      {showBlockSummary && blockSummaryData && (
        <BlockSummary
          samenvatting={blockSummaryData}
          onVolgendeBlok={handleVolgendeBlok}
        />
      )}

      {/* Day celebration modal */}
      {showDayCelebration && dayCelebrationData && (
        <DayCelebrationComponent
          celebration={dayCelebrationData}
          onVolgendeDag={handleVolgendeDag}
          onKlaar={onTerug}
        />
      )}
    </div>
  );
};

export default ReadingScreen;
