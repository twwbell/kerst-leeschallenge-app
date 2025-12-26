import { useState, useEffect } from 'react';
import { WoordenData } from '../types/types';

export function useWoordenData() {
  const [data, setData] = useState<WoordenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/woordenlijst.json')
      .then(res => {
        if (!res.ok) {
          throw new Error('Kon woordenlijst niet laden');
        }
        return res.json();
      })
      .then((jsonData: WoordenData) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

/**
 * Helper functie om een specifiek woord te krijgen
 */
export function getWoord(
  data: WoordenData,
  dagIndex: number,
  blokIndex: number,
  rijtjeIndex: number,
  woordIndex: number
): string | null {
  try {
    return data.dagen[dagIndex]?.blokken[blokIndex]?.rijtjes[rijtjeIndex]?.woorden[woordIndex] || null;
  } catch {
    return null;
  }
}

/**
 * Helper functie om alle woorden in een blok te krijgen
 */
export function getBlokWoorden(
  data: WoordenData,
  dagIndex: number,
  blokIndex: number
): string[] {
  try {
    const blok = data.dagen[dagIndex]?.blokken[blokIndex];
    if (!blok) return [];
    
    return blok.rijtjes.flatMap(rijtje => rijtje.woorden);
  } catch {
    return [];
  }
}

/**
 * Helper functie om het totaal aantal woorden in een dag te krijgen
 */
export function getDagTotaalWoorden(data: WoordenData, dagIndex: number): number {
  try {
    const dag = data.dagen[dagIndex];
    if (!dag) return 0;
    
    return dag.blokken.reduce((totaal, blok) => {
      return totaal + blok.rijtjes.reduce((blokTotaal, rijtje) => {
        return blokTotaal + rijtje.woorden.length;
      }, 0);
    }, 0);
  } catch {
    return 0;
  }
}

/**
 * Helper functie om het totaal aantal woorden in de hele challenge te krijgen
 */
export function getChallengeTotaalWoorden(data: WoordenData): number {
  try {
    return data.dagen.reduce((totaal, dag) => {
      return totaal + dag.blokken.reduce((dagTotaal, blok) => {
        return dagTotaal + blok.rijtjes.reduce((blokTotaal, rijtje) => {
          return blokTotaal + rijtje.woorden.length;
        }, 0);
      }, 0);
    }, 0);
  } catch {
    return 0;
  }
}
