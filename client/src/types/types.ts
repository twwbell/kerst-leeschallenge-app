// Woordenlijst data structuur
export interface Rijtje {
  rijtje: number;
  woorden: string[];
}

export interface Blok {
  blok: number;
  rijtjes: Rijtje[];
}

export interface Dag {
  dag: number;
  blokken: Blok[];
}

export interface WoordenData {
  dagen: Dag[];
}

// App state
export type Modus = 'training' | 'timer';

export interface BlokStatistiek {
  blok: number;
  tijd: number; // seconden
  voorgelezen: number;
  moeilijkGemarkeerd: string[];
  woordTijden: Record<string, number>; // woord -> tijd in ms
}

export interface DagStatistiek {
  totaalWoorden: number;
  totaalTijd: number; // seconden
  blokken: BlokStatistiek[];
}

export interface TotaalStatistieken {
  totaalWoorden: number;
  dagenVoltooid: number[]; // array van voltooide dag indices
  gemiddeldeSnelheid: number; // seconden per woord
}

export interface AppState {
  huidigeDag: number;
  huidigBlok: number;
  huidigRijtje: number;
  huidigWoord: number;
  modus: Modus;
  dagStatistieken: Record<number, DagStatistiek>;
  totaalStatistieken: TotaalStatistieken;
  gelezenWoorden: Set<string>; // "dag-blok-rijtje-woord" format
}

// Lettergreep
export interface Lettergreep {
  tekst: string;
  kleur: 'green' | 'red' | 'gold';
}

// Blok samenvatting
export interface BlokSamenvatting {
  blokNummer: number;
  leestijd: number; // seconden
  gemiddeldePerWoord: number; // seconden
  snelsteWoord: { woord: string; tijd: number };
  langzaamsteWoord: { woord: string; tijd: number };
  keerVoorgelezen: number;
  dagVoortgang: {
    woordenGelezen: number;
    totaalWoorden: number;
    blokkenVoltooid: number;
    totaalBlokken: number;
  };
}

// Dag celebration
export interface DagCelebration {
  dagNummer: number;
  woordenGelezen: number;
  totaalChallengeVoortgang: {
    woordenGelezen: number;
    totaalWoorden: number;
    dagenVoltooid: number;
    totaalDagen: number;
  };
  isLaatsteDag: boolean;
}
