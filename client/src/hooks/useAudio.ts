import { useCallback, useState, useEffect } from 'react';

interface UseAudioReturn {
  spreekWoord: (woord: string) => void;
  spreekLettergreep: (lettergreep: string) => void;
  spreekKlank: (klank: string) => void;
  isSpeaking: boolean;
  isSupported: boolean;
  stopSpeaking: () => void;
}

export function useAudio(): UseAudioReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check of Web Speech API ondersteund wordt
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((tekst: string, rate: number = 0.8) => {
    if (!isSupported) {
      console.warn('Web Speech API wordt niet ondersteund in deze browser');
      return;
    }

    // Stop huidige spraak
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(tekst);
    utterance.lang = 'nl-NL';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Probeer een Nederlandse stem te vinden
    const voices = window.speechSynthesis.getVoices();
    const dutchVoice = voices.find(voice => 
      voice.lang.startsWith('nl') || voice.lang === 'nl-NL'
    );
    if (dutchVoice) {
      utterance.voice = dutchVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported]);

  const spreekWoord = useCallback((woord: string) => {
    speak(woord, 0.7); // Langzamer voor woorden
  }, [speak]);

  const spreekLettergreep = useCallback((lettergreep: string) => {
    speak(lettergreep, 0.6); // Nog langzamer voor lettergrepen
  }, [speak]);

  const spreekKlank = useCallback((klank: string) => {
    // Voor klanken gebruiken we een kortere, snellere uitspraak
    speak(klank, 0.5);
  }, [speak]);

  const stopSpeaking = useCallback(() => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [isSupported]);

  // Laad stemmen wanneer beschikbaar
  useEffect(() => {
    if (isSupported) {
      // Sommige browsers laden stemmen asynchroon
      const loadVoices = () => {
        window.speechSynthesis.getVoices();
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [isSupported]);

  return {
    spreekWoord,
    spreekLettergreep,
    spreekKlank,
    isSpeaking,
    isSupported,
    stopSpeaking,
  };
}
