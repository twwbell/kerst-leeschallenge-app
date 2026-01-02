import { useCallback, useState, useEffect } from 'react';

interface UseAudioReturn {
  spreekWoord: (woord: string) => void;
  spreekLettergreep: (lettergreep: string) => void;
  spreekKlank: (klank: string) => void;
  playChime: () => void;
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

  // Play a chime sound using Web Audio API
  const playChime = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();

      // Create a pleasant chime using multiple frequencies
      const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (C major chord)

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = 'sine';

        const startTime = audioContext.currentTime + index * 0.1;
        const duration = 0.8;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      });
    } catch (e) {
      console.warn('Could not play chime sound:', e);
    }
  }, []);

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
    playChime,
    isSpeaking,
    isSupported,
    stopSpeaking,
  };
}
