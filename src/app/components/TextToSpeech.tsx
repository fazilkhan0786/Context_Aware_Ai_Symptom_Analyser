/**
 * AI Symptom Checker - Text-to-Speech Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Component for converting text results to speech using browser API
 */

'use client';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useTextToSpeech } from '../hooks/text-to-speech-results';
import { useLanguage } from '../contexts/LanguageContext'; 

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({ text, autoPlay = false }) => {

    const { language } = useLanguage();
    const isRTL = language === 'ar';
    const { isPaused, resume, isSpeaking, pause, stop, speak } = useTextToSpeech({
      text,
      autoPlay,
      language,
    });
  return (
    <div
      className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      {/* NOT SPEAKING - Show "Listen" button */}
      {!isSpeaking ? (
        <button
          onClick={speak}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all shadow-lg hover:scale-105 hover:shadow-xl"
          title={language === 'ar' ? 'استمع للنتائج' : 'Listen to Results'}
        >
          <Volume2 className="w-5 h-5" />
          <span className="text-sm font-semibold">
            {language === 'ar' ? 'استمع' : 'Listen'}
          </span>
        </button>
      ) : (
        // IS SPEAKING - Show pause/resume and stop buttons
        <div className="flex items-center gap-2">
          {/* Pause/Resume Button */}
          {!isPaused ? (
            <button
              onClick={pause}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl transition-all shadow-lg"
              title={language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}
            >
              <Pause className="w-5 h-5" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}
              </span>
            </button>
          ) : (
            <button
              onClick={resume}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-lg"
              title={language === 'ar' ? 'متابعة' : 'Resume'}
            >
              <Play className="w-5 h-5" />
              <span className="text-sm font-semibold">
                {language === 'ar' ? 'متابعة' : 'Resume'}
              </span>
            </button>
          )}

          {/* Stop Button */}
          <button
            onClick={stop}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg"
            title={language === 'ar' ? 'إيقاف' : 'Stop'}
          >
            <VolumeX className="w-5 h-5" />
            <span className="text-sm font-semibold">
              {language === 'ar' ? 'إيقاف' : 'Stop'}
            </span>
          </button>
        </div>
      )}

      {/* Visual Indicator - Animated sound waves when speaking */}
      {isSpeaking && !isPaused && (
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
          <div
            className="w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-1 h-5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.2s' }}
          ></div>
          <div
            className="w-1 h-4 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"
            style={{ animationDelay: '0.3s' }}
          ></div>
        </div>
      )}
    </div>
  );
}
