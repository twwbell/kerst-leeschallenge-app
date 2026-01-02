import React, { useState, useCallback } from 'react';
import { useWoordenData } from '../hooks/useWoordenData';
import { useStorage } from '../hooks/useStorage';
import { Modus, BlokStatistiek } from '../types/types';
import SnowfallEffect from '../components/SnowfallEffect';
import DaySelector from '../components/DaySelector';
import ReadingScreen from '../components/ReadingScreen';
import { MigrationPopup } from '../components/MigrationPopup';

/**
 * DESIGN: Magisch Winterwonderland
 * Zachte, dromerige esthetiek met Scandinavisch minimalisme en magisch realisme
 * Kleuren: Bosgroen, Warm Goud, Zacht Kerstrood, Crème-wit
 * Font: Fredoka (display) + Nunito (body)
 */

type AppView = 'selector' | 'reading';

export default function Home() {
  const { data, loading, error } = useWoordenData();
  const storage = useStorage();
  
  const [view, setView] = useState<AppView>('selector');

  // Handlers
  const handleSelectDag = useCallback((dagIndex: number) => {
    // Vind het eerste ongelezen woord in deze dag
    let startBlok = 0;
    let startRijtje = 0;
    let startWoord = 0;

    // Check of er al voortgang is
    for (let b = 0; b < 10; b++) {
      const blokVoortgang = storage.getBlokVoortgang(dagIndex, b);
      if (blokVoortgang < 20) {
        startBlok = b;
        // Vind eerste ongelezen woord in dit blok
        for (let r = 0; r < 4; r++) {
          for (let w = 0; w < 5; w++) {
            if (!storage.isWoordGelezen(dagIndex, b, r, w)) {
              startRijtje = r;
              startWoord = w;
              break;
            }
          }
          if (startWoord > 0 || !storage.isWoordGelezen(dagIndex, b, startRijtje, 0)) break;
        }
        break;
      }
    }

    storage.setPositie(dagIndex, startBlok, startRijtje, startWoord);
    setView('reading');
  }, [storage]);

  const handleModeChange = useCallback((modus: Modus) => {
    storage.setModus(modus);
  }, [storage]);

  const handlePositieChange = useCallback((dag: number, blok: number, rijtje: number, woord: number) => {
    storage.setPositie(dag, blok, rijtje, woord);
  }, [storage]);

  const handleWoordGelezen = useCallback((dag: number, blok: number, rijtje: number, woord: number) => {
    storage.markeerWoordGelezen(dag, blok, rijtje, woord);
  }, [storage]);

  const handleBlokVoltooid = useCallback((blokStat: BlokStatistiek) => {
    storage.updateBlokStatistiek(storage.state.huidigeDag, blokStat);
  }, [storage]);

  const handleDagVoltooid = useCallback((dag: number) => {
    storage.markeerDagVoltooid(dag);
  }, [storage]);

  const handleTerug = useCallback(() => {
    setView('selector');
  }, []);

  const handleReset = useCallback(() => {
    storage.resetProgress();
  }, [storage]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[oklch(0.98_0.01_80)]">
        <SnowfallEffect intensity="light" />
        <div className="text-center z-10">
          <div className="text-6xl mb-6 animate-bounce">🎄</div>
          <h1 className="text-2xl font-bold text-[oklch(0.40_0.08_160)] font-display">
            Laden...
          </h1>
          <p className="text-[oklch(0.45_0.03_50)] mt-2">
            Even geduld, de woordenlijst wordt geladen
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[oklch(0.98_0.01_80)] p-6">
        <SnowfallEffect intensity="light" />
        <div className="text-center z-10 bg-white rounded-2xl p-8 shadow-lg max-w-md">
          <div className="text-6xl mb-6">😢</div>
          <h1 className="text-2xl font-bold text-[oklch(0.55_0.18_25)] font-display">
            Oeps!
          </h1>
          <p className="text-[oklch(0.45_0.03_50)] mt-2">
            Er ging iets mis bij het laden van de woordenlijst.
          </p>
          <p className="text-sm text-[oklch(0.55_0.03_50)] mt-4">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-3 rounded-xl btn-christmas-primary"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.98_0.01_80)] relative">
      {/* Migratie popup - alleen op Manus URL */}
      <MigrationPopup />
      
      {/* Sneeuwval achtergrond */}
      <SnowfallEffect intensity={view === 'selector' ? 'normal' : 'light'} />

      {/* Content */}
      <div className="relative z-10">
        {view === 'selector' ? (
          <DaySelector
            data={data}
            huidigeDag={storage.state.huidigeDag}
            dagenVoltooid={storage.state.totaalStatistieken.dagenVoltooid}
            onSelectDag={handleSelectDag}
            getDagVoortgang={storage.getDagVoortgang}
            onReset={handleReset}
          />
        ) : (
          <ReadingScreen
            data={data}
            dagIndex={storage.state.huidigeDag}
            blokIndex={storage.state.huidigBlok}
            rijtjeIndex={storage.state.huidigRijtje}
            woordIndex={storage.state.huidigWoord}
            modus={storage.state.modus}
            gelezenWoorden={storage.state.gelezenWoorden}
            onModeChange={handleModeChange}
            onPositieChange={handlePositieChange}
            onWoordGelezen={handleWoordGelezen}
            onBlokVoltooid={handleBlokVoltooid}
            onDagVoltooid={handleDagVoltooid}
            onTerug={handleTerug}
            getBlokVoortgang={storage.getBlokVoortgang}
            getDagVoortgang={storage.getDagVoortgang}
          />
        )}
      </div>
    </div>
  );
}
