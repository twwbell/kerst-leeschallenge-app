import { Lettergreep } from '../types/types';

/**
 * Nederlandse lettergreep splitter
 * Splitst woorden in lettergrepen op basis van Nederlandse taalregels
 */

// Klinkers en medeklinkers
const KLINKERS = ['a', 'e', 'i', 'o', 'u'];
const TWEEKLANKEN = ['aa', 'ee', 'oo', 'uu', 'ie', 'oe', 'eu', 'ui', 'ei', 'ij', 'au', 'ou', 'ai', 'oi', 'oi', 'aai', 'ooi', 'oei', 'eeu', 'ieu', 'ouw', 'auw', 'euw', 'ieuw'];
const MEDEKLINKER_CLUSTERS = ['bl', 'br', 'ch', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr', 'kl', 'kn', 'kr', 'pl', 'pr', 'qu', 'sch', 'schr', 'sl', 'sm', 'sn', 'sp', 'spl', 'spr', 'st', 'str', 'sw', 'tr', 'tw', 'vl', 'vr', 'wr', 'zw'];

function isKlinker(char: string): boolean {
  return KLINKERS.includes(char.toLowerCase());
}

function isMedeklinker(char: string): boolean {
  return /[bcdfghjklmnpqrstvwxz]/i.test(char);
}

/**
 * Splitst een Nederlands woord in lettergrepen
 * Vereenvoudigde versie die werkt voor de meeste basiswoorden
 */
export function splitLettergrepen(woord: string): string[] {
  if (!woord || woord.length <= 2) {
    return [woord];
  }

  const lowerWoord = woord.toLowerCase();
  const lettergrepen: string[] = [];
  let huidige = '';
  let i = 0;

  while (i < woord.length) {
    const char = woord[i];
    const lowerChar = lowerWoord[i];
    
    // Check voor tweeklanken
    let foundTweeklank = false;
    for (const tk of TWEEKLANKEN.sort((a, b) => b.length - a.length)) {
      if (lowerWoord.substring(i, i + tk.length) === tk) {
        huidige += woord.substring(i, i + tk.length);
        i += tk.length;
        foundTweeklank = true;
        break;
      }
    }
    
    if (foundTweeklank) continue;

    huidige += char;
    i++;

    // Bepaal of we moeten splitsen
    if (i < woord.length) {
      const volgende = lowerWoord[i];
      const huidigeEindigt = lowerChar;
      
      // Splits na een klinker gevolgd door een medeklinker + klinker
      if (isKlinker(huidigeEindigt) && isMedeklinker(volgende) && i + 1 < woord.length) {
        const daarnaKlinker = isKlinker(lowerWoord[i + 1]);
        
        // Check voor medeklinker clusters
        let isCluster = false;
        for (const cluster of MEDEKLINKER_CLUSTERS) {
          if (lowerWoord.substring(i, i + cluster.length) === cluster) {
            isCluster = true;
            break;
          }
        }
        
        if (daarnaKlinker && !isCluster && huidige.length > 0) {
          lettergrepen.push(huidige);
          huidige = '';
        }
      }
      
      // Splits tussen twee medeklinkers (behalve clusters)
      if (isMedeklinker(huidigeEindigt) && isMedeklinker(volgende) && huidige.length > 1) {
        let isCluster = false;
        for (const cluster of MEDEKLINKER_CLUSTERS) {
          if (lowerWoord.substring(i, i + cluster.length) === cluster) {
            isCluster = true;
            break;
          }
        }
        
        if (!isCluster && huidige.length > 0) {
          // Check of er een klinker in huidige zit
          const heeftKlinker = huidige.split('').some(c => isKlinker(c.toLowerCase()));
          if (heeftKlinker) {
            lettergrepen.push(huidige);
            huidige = '';
          }
        }
      }
    }
  }

  if (huidige) {
    lettergrepen.push(huidige);
  }

  // Als we maar 1 lettergreep hebben en het woord is lang, probeer anders te splitsen
  if (lettergrepen.length === 1 && woord.length > 4) {
    // Simpele fallback: splits in het midden bij een medeklinker
    const midden = Math.floor(woord.length / 2);
    for (let j = midden; j < woord.length - 1; j++) {
      if (isMedeklinker(lowerWoord[j]) && isKlinker(lowerWoord[j + 1])) {
        return [woord.substring(0, j), woord.substring(j)];
      }
    }
    for (let j = midden; j > 0; j--) {
      if (isMedeklinker(lowerWoord[j]) && isKlinker(lowerWoord[j + 1])) {
        return [woord.substring(0, j), woord.substring(j)];
      }
    }
  }

  return lettergrepen.length > 0 ? lettergrepen : [woord];
}

/**
 * Splitst een woord en voegt kleuren toe
 */
export function splitMetKleuren(woord: string): Lettergreep[] {
  const lettergrepen = splitLettergrepen(woord);
  const kleuren: ('green' | 'red' | 'gold')[] = ['green', 'red', 'gold'];
  
  return lettergrepen.map((tekst, index) => ({
    tekst,
    kleur: kleuren[index % kleuren.length]
  }));
}

/**
 * Nederlandse klankletters herkenning
 * Retourneert de klank voor een letter of lettercombinatie
 */
export const KLANKEN: Record<string, string> = {
  // Enkele letters
  'a': 'a',
  'b': 'b',
  'c': 'k',
  'd': 'd',
  'e': 'e',
  'f': 'f',
  'g': 'g',
  'h': 'h',
  'i': 'i',
  'j': 'j',
  'k': 'k',
  'l': 'l',
  'm': 'm',
  'n': 'n',
  'o': 'o',
  'p': 'p',
  'q': 'k',
  'r': 'r',
  's': 's',
  't': 't',
  'u': 'u',
  'v': 'v',
  'w': 'w',
  'x': 'ks',
  'y': 'i',
  'z': 'z',
  // Dubbelklanken (lange klanken)
  'aa': 'aa',
  'ee': 'ee',
  'oo': 'oo',
  'uu': 'uu',
  // Tweeklanken
  'au': 'au',
  'ei': 'ei',
  'eu': 'eu',
  'ij': 'ij',
  'ie': 'ie',
  'oe': 'oe',
  'ou': 'ou',
  'ui': 'ui',
  // Medeklinker combinaties
  'ch': 'ch',
  'ng': 'ng',
  'nk': 'nk',
  'sch': 'sch',
};

/**
 * Detecteert de klank op een bepaalde positie in het woord
 */
export function detecteerKlank(woord: string, positie: number): { klank: string; lengte: number } {
  const lowerWoord = woord.toLowerCase();
  
  // Check voor langere combinaties eerst
  const combinaties = Object.keys(KLANKEN).sort((a, b) => b.length - a.length);
  
  for (const combinatie of combinaties) {
    if (lowerWoord.substring(positie, positie + combinatie.length) === combinatie) {
      return { klank: KLANKEN[combinatie], lengte: combinatie.length };
    }
  }
  
  // Fallback naar enkele letter
  const letter = lowerWoord[positie];
  return { klank: KLANKEN[letter] || letter, lengte: 1 };
}
