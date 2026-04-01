/**
 * AI Symptom Checker - Symptom Input Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Component for collecting symptom information from users
 */

'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Heart, Loader2 } from 'lucide-react';
import { useLanguage } from '../../app/contexts/LanguageContext';
import { VoiceInput } from './VoiceInput';

interface SymptomInputProps {
  onSubmit: (data: {
    userInput: string;
    age?: string;
    gender?: string;
    allergies?: string;
    chronicConditions?: string;
    symptomStartDate?: string;
    symptomStartTime?: string;
    currentMedications?: string;
  }) => void;
  loading?: boolean;
}

export const SymptomInput: React.FC<SymptomInputProps> = ({
  onSubmit,
  loading = false,
}: {
  onSubmit: (data: {
    userInput: string;
    age?: string;
    gender?: string;
    allergies?: string;
    chronicConditions?: string;
    symptomStartDate?: string;
    symptomStartTime?: string;
    currentMedications?: string;
  }) => void;
  loading?: boolean;
}) => {
  const [input, setInput] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [symptomStartDate, setSymptomStartDate] = useState('');
  const [symptomStartTime, setSymptomStartTime] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit({
        userInput: input,
        age: age || undefined,
        gender: gender || undefined,
        allergies: allergies || undefined,
        chronicConditions: chronicConditions || undefined,
        symptomStartDate: symptomStartDate || undefined,
        symptomStartTime: symptomStartTime || undefined,
        currentMedications: currentMedications || undefined,
      });
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInput((prevInput) => {
      if (prevInput) {
        return prevInput + ' ' + transcript;
      }
      return transcript;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl opacity-0 animate-fade-in animation-delay-200 border dark:border-gray-700">
      <div
        className={`flex items-center gap-3 mb-6 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {t('inputTitle')}
        </h2>
      </div>

      {/* Patient Information Section */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {language === 'ar' ? 'معلومات المريض (اختياري)' : 'Patient Information (Optional)'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'العمر' : 'Age'}
            </Label>
            <Input
              type="number"
              placeholder={language === 'ar' ? 'مثال: 35' : 'e.g., 35'}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              min="1"
              max="150"
            />
          </div>

          {/* Gender */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'الجنس' : 'Gender'}
            </Label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all"
            >
              <option value="">
                {language === 'ar' ? 'اختر...' : 'Select...'}
              </option>
              <option value="male">
                {language === 'ar' ? 'ذكر' : 'Male'}
              </option>
              <option value="female">
                {language === 'ar' ? 'أنثى' : 'Female'}
              </option>
              <option value="other">
                {language === 'ar' ? 'أخرى' : 'Other'}
              </option>
            </select>
          </div>

          {/* Allergies */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'الحساسية' : 'Allergies'}
            </Label>
            <Input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'مثال: البنسلين، الفول السوداني'
                  : 'e.g., Penicillin, Peanuts'
              }
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>

          {/* Chronic Conditions */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'الأمراض المزمنة' : 'Chronic Conditions'}
            </Label>
            <Input
              type="text"
              placeholder={
                language === 'ar'
                  ? 'مثال: السكري، ارتفاع ضغط الدم'
                  : 'e.g., Diabetes, Hypertension'
              }
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {language === 'ar' ? 'جدول الأعراض (اختياري)' : 'Symptom Timeline (Optional)'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Symptom Start Date */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'متى بدأت الأعراض' : 'When symptoms started'}
            </Label>
            <Input
              type="date"
              value={symptomStartDate}
              onChange={(e) => setSymptomStartDate(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>

          {/* Symptom Start Time */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm mb-2 block">
              {language === 'ar' ? 'الوقت (بالتقريب)' : 'Time (approximately)'}
            </Label>
            <Input
              type="time"
              value={symptomStartTime}
              onChange={(e) => setSymptomStartTime(e.target.value)}
              disabled={loading}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          </div>
        </div>
      </div>

      {/* Medication Section */}
      <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {language === 'ar' ? 'الأدوية الحالية (اختياري)' : 'Current Medications (Optional)'}
        </h3>
        <Input
          type="text"
          placeholder={
            language === 'ar'
              ? 'مثال: الأسبرين، الإيبوبروفين'
              : 'e.g., Aspirin, Ibuprofen (comma-separated)'
          }
          value={currentMedications}
          onChange={(e) => setCurrentMedications(e.target.value)}
          disabled={loading}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 w-full"
        />
      </div>

      <div className="mb-4">
        <VoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      <div className="relative">
        <Textarea
          placeholder={t('inputPlaceholder')}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-2xl focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all duration-300 resize-none text-gray-700"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
          disabled={loading}
        />

        {input && (
          <div
            className={`absolute bottom-2 text-xs text-gray-400 ${
              isRTL ? 'left-2' : 'right-2'
            }`}
          >
            {input.length} {language === 'ar' ? 'حرف' : 'characters'}
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!input.trim() || loading}
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {t('analyzing')}
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            {t('analyzeButton')}
          </>
        )}
      </Button>
    </div>
  );
};
