/**
 * AI Symptom Checker - Home Page
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Main entry point for the AI Symptom Analyzer application
 */

'use client';
import { useSymptomCheck } from './hooks/use-analyze-symptoms';
import { SymptomInput } from './components/SymptomInput';
import { SymptomResultCard } from './components/SymptomResultCard';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle'; 
import { useLanguage } from '../app/contexts/LanguageContext';
import { Stethoscope, Sparkles, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { loading, error, result, checkSymptoms, patientInfo, symptomDescription } = useSymptomCheck();
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Language Selector & Theme Toggle - Top Right */}
        <div
          className={`flex justify-end gap-3 mb-6 opacity-0 animate-fade-in ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <ThemeToggle />
          <LanguageSelector />
        </div>

        {/* Header */}
        <div className="text-center mb-12 opacity-0 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Stethoscope className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
            {t('appTitle')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            {t('appSubtitle')}
          </p>
        </div>

        {/* Input Section */}
        <SymptomInput onSubmit={checkSymptoms} loading={loading} />

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 text-center mt-8 opacity-0 animate-fade-in border dark:border-gray-700">
            <Loader2 className="w-16 h-16 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {t('analyzingSymptoms')}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              {t('takeMoments')}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-3xl p-6 mt-8 opacity-0 animate-fade-in">
            <p className="text-red-600 dark:text-red-400 font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <SymptomResultCard 
            data={result} 
            patientInfo={patientInfo || undefined}
            symptomDescription={symptomDescription || undefined}
          />
        )}
      </main>
    </div>
  );
}
