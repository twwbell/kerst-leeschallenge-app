import { useState, useEffect, useCallback } from 'react';
import { AppState, Modus, BlokStatistiek, DagStatistiek } from '../types/types';

const STORAGE_KEY = 'kerstLeeschallenge';

interface StoredState {
  huidigeDag: number;
  huidigBlok: number;
  huidigRijtje: number;
  huidigWoord: number;
  modus: Modus;
  dagStatistieken: Record<number, DagStatistiek>;
  totaalStatistieken: {
    totaalWoorden: number;
    dagenVoltooid: number[]; // Array van voltooide dag indices
    gemiddeldeSnelheid: number;
  };
  gelezenWoorden: string[]; // Array voor JSON serialisatie
}

const defaultState: AppState = {
  huidigeDag: 0,
  huidigBlok: 0,
  huidigRijtje: 0,
  huidigWoord: 0,
  modus: 'training',
  dagStatistieken: {},
  totaalStatistieken: {
    totaalWoorden: 0,
    dagenVoltooid: [], // Lege array
    gemiddeldeSnelheid: 0,
  },
  gelezenWoorden: new Set<string>(),
};

function serializeState(state: AppState): StoredState {
  return {
    ...state,
    gelezenWoorden: Array.from(state.gelezenWoorden),
  };
}

function deserializeState(stored: StoredState): AppState {
  // Handle backwards compatibility - convert number to array if needed
  const rawDagenVoltooid = stored.totaalStatistieken?.dagenVoltooid;
  let dagenVoltooid: number[] = [];
  
  if (typeof rawDagenVoltooid === 'number') {
    // Convert old format (count) to new format (array)
    for (let i = 0; i < rawDagenVoltooid; i++) {
      dagenVoltooid.push(i);
    }
  } else if (Array.isArray(rawDagenVoltooid)) {
    dagenVoltooid = rawDagenVoltooid;
  }
  
  return {
    ...stored,
    totaalStatistieken: {
      ...stored.totaalStatistieken,
      dagenVoltooid,
    },
    gelezenWoorden: new Set(stored.gelezenWoorden || []),
  };
}

export function useStorage() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredState;
        return deserializeState(parsed);
      }
    } catch (e) {
      console.error('Fout bij laden van opgeslagen staat:', e);
    }
    return defaultState;
  });

  // Sla op naar localStorage wanneer state verandert
  useEffect(() => {
    try {
      const serialized = serializeState(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (e) {
      console.error('Fout bij opslaan van staat:', e);
    }
  }, [state]);

  // Update functies
  const setModus = useCallback((modus: Modus) => {
    setState(prev => ({ ...prev, modus }));
  }, []);

  const setPositie = useCallback((dag: number, blok: number, rijtje: number, woord: number) => {
    setState(prev => ({
      ...prev,
      huidigeDag: dag,
      huidigBlok: blok,
      huidigRijtje: rijtje,
      huidigWoord: woord,
    }));
  }, []);

  const markeerWoordGelezen = useCallback((dag: number, blok: number, rijtje: number, woord: number) => {
    const key = `${dag}-${blok}-${rijtje}-${woord}`;
    setState(prev => {
      const nieuweSet = new Set(prev.gelezenWoorden);
      nieuweSet.add(key);
      return { ...prev, gelezenWoorden: nieuweSet };
    });
  }, []);

  const isWoordGelezen = useCallback((dag: number, blok: number, rijtje: number, woord: number): boolean => {
    const key = `${dag}-${blok}-${rijtje}-${woord}`;
    return state.gelezenWoorden.has(key);
  }, [state.gelezenWoorden]);

  const updateBlokStatistiek = useCallback((dag: number, blokStat: BlokStatistiek) => {
    setState(prev => {
      const dagStats = prev.dagStatistieken[dag] || {
        totaalWoorden: 0,
        totaalTijd: 0,
        blokken: [],
      };

      // Vervang of voeg blok statistiek toe
      const bestaandeIndex = dagStats.blokken.findIndex(b => b.blok === blokStat.blok);
      if (bestaandeIndex >= 0) {
        dagStats.blokken[bestaandeIndex] = blokStat;
      } else {
        dagStats.blokken.push(blokStat);
      }

      // Herbereken totalen
      dagStats.totaalTijd = dagStats.blokken.reduce((t, b) => t + b.tijd, 0);
      dagStats.totaalWoorden = dagStats.blokken.length * 20; // 20 woorden per blok

      return {
        ...prev,
        dagStatistieken: {
          ...prev.dagStatistieken,
          [dag]: dagStats,
        },
      };
    });
  }, []);

  const markeerDagVoltooid = useCallback((dag: number) => {
    setState(prev => {
      // Voeg dag toe aan array als die er nog niet in zit
      const nieuweVoltooid = prev.totaalStatistieken.dagenVoltooid.includes(dag)
        ? prev.totaalStatistieken.dagenVoltooid
        : [...prev.totaalStatistieken.dagenVoltooid, dag];
      
      const nieuwTotaalWoorden = nieuweVoltooid.length * 200;
      
      return {
        ...prev,
        totaalStatistieken: {
          ...prev.totaalStatistieken,
          dagenVoltooid: nieuweVoltooid,
          totaalWoorden: nieuwTotaalWoorden,
        },
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getBlokVoortgang = useCallback((dag: number, blok: number): number => {
    let count = 0;
    for (let r = 0; r < 4; r++) {
      for (let w = 0; w < 5; w++) {
        if (state.gelezenWoorden.has(`${dag}-${blok}-${r}-${w}`)) {
          count++;
        }
      }
    }
    return count;
  }, [state.gelezenWoorden]);

  const getDagVoortgang = useCallback((dag: number): number => {
    let count = 0;
    for (let b = 0; b < 10; b++) {
      for (let r = 0; r < 4; r++) {
        for (let w = 0; w < 5; w++) {
          if (state.gelezenWoorden.has(`${dag}-${b}-${r}-${w}`)) {
            count++;
          }
        }
      }
    }
    return count;
  }, [state.gelezenWoorden]);

  return {
    state,
    setModus,
    setPositie,
    markeerWoordGelezen,
    isWoordGelezen,
    updateBlokStatistiek,
    markeerDagVoltooid,
    resetProgress,
    getBlokVoortgang,
    getDagVoortgang,
  };
}
