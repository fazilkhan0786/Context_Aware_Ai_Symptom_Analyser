/**
 * AI Symptom Checker - Voice Input Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Component for collecting symptom data via voice/speech recognition
 */

'use client';
import { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const { language } = useLanguage();
  const isRTL = language === 'ar';

  useEffect(() => {
    if (
      !('webkitSpeechRecognition' in window) &&
      !('SpeechRecognition' in window)
    ) {
      setIsSupported(false);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) {
      alert(
        language === 'ar'
          ? 'عذراً، متصفحك لا يدعم التعرف على الصوت. يرجى استخدام Chrome أو Edge.'
          : 'Sorry, your browser does not support speech recognition. Please use Chrome or Edge.'
      );
      return;
    }

    const SpeechRecognition =
      (window as Window).SpeechRecognition ||
      (window as Window).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Set language based on current app language
    recognition.lang = language === 'ar' ? 'ar-SA' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      console.log('Transcript:', transcript);
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      let errorMessage = 'An error occurred';
      if (event.error === 'no-speech') {
        errorMessage =
          language === 'ar'
            ? 'لم يتم اكتشاف صوت. حاول مرة أخرى.'
            : 'No speech detected. Please try again.';
      } else if (event.error === 'not-allowed') {
        errorMessage =
          language === 'ar'
            ? 'يجب السماح بالوصول إلى الميكروفون.'
            : 'Microphone access is required.';
      }

      alert(errorMessage);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Voice recognition ended');
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    // The recognition will automatically stop
  };

  if (!isSupported) {
    return null; // Don't show the button if not supported
  }

  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={!isSupported}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed ${
          isListening
            ? 'bg-red-600 hover:bg-red-700 animate-pulse'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
        } text-white`}
        title={
          isListening
            ? language === 'ar'
              ? 'إيقاف التسجيل'
              : 'Stop Recording'
            : language === 'ar'
            ? 'التسجيل الصوتي'
            : 'Voice Input'
        }
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {isListening && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-full animate-pulse">
          <Volume2 className="w-4 h-4 text-red-600 dark:text-red-400 animate-bounce" />
          <span className="text-sm font-medium text-red-600 dark:text-red-400">
            {language === 'ar' ? 'جاري الاستماع...' : 'Listening...'}
          </span>
        </div>
      )}
    </div>
  );
};
