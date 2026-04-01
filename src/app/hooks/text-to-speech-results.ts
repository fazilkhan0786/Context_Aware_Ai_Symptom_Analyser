import { useState, useEffect, useCallback } from 'react';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  language: string;
}

export function useTextToSpeech({
  text,
  autoPlay = false,
  language,
}: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const speak = useCallback(() => {
    if (!isSupported || !text) {
      console.warn('Cannot speak: not supported or no text');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language === 'ar' ? 'ar-SA' : 'en-US'; // Set language
    utterance.rate = 0.9; // Speed (0.1 to 10, 1 is normal)
    utterance.pitch = 1; // Voice pitch (0 to 2, 1 is normal)
    utterance.volume = 1; // Volume (0 to 1)

    utterance.onstart = () => {
      console.log('Speech started');
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      setIsPaused(false);

      if (event.error === 'not-allowed') {
        alert(
          language === 'ar'
            ? 'يرجى السماح بتشغيل الصوت في المتصفح'
            : 'Please allow audio playback in your browser'
        );
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [text, language, isSupported]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      console.error('Speech synthesis not supported in this browser');
    }

    if (autoPlay && isSupported && text) {
      const timer = setTimeout(() => speak(), 1000);
      return () => clearTimeout(timer);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [autoPlay, isSupported, text, speak]);



  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  const pause = () => {
    if ('speechSynthesis' in window && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if ('speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  if (!isSupported) {
    return {
      isPaused: false,
      isSpeaking: false,
      pause: () => {},
      resume: () => {},
      stop: () => {},
      speak: () => {},
    };
  }

  return { isPaused, resume, isSpeaking, pause, stop, speak };
}
