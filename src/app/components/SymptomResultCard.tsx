/**
 * AI Symptom Checker - Symptom Result Card Component
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Displays AI analysis results with downloadable PDF reports
 */

'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Heart, Stethoscope, AlertCircle, Download, Loader2, Lightbulb } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SymptomAnalysisResult } from '../types/SymptomAnalysisResult';
import { TextToSpeech } from './TextToSpeech';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generatePDFReport } from '../utils/pdf-generator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

interface SymptomResultCardProps {
  data: SymptomAnalysisResult;
  patientInfo?: {
    age?: string;
    gender?: string;
    allergies?: string;
    chronicConditions?: string;
  };
  symptomDescription?: string;
}

export const SymptomResultCard: React.FC<SymptomResultCardProps> = ({
  data,
  patientInfo,
  symptomDescription,
}) => {
  const { language, t } = useLanguage();
  const isRTL = language === 'ar';
  const [isDownloading, setIsDownloading] = useState(false);

  const getSeverityColor = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const colors: Record<string, string> = {
      mild: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      moderate:
        'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      severe:
        'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };
    return (
      colors[severityLower] ||
      'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    );
  };

  const translateSeverity = (severity: string) => {
    const severityLower = severity.toLowerCase();
    const severityMap: Record<string, string> = {
      mild: t('mild'),
      moderate: t('moderate'),
      severe: t('severe'),
    };
    return severityMap[severityLower] || severity;
  };

  const createSpeechText = () => {
  const severityText = translateSeverity(data.severity);
  
  return `
    ${t('analysisComplete')}.
    ${t('possibleCondition')}: ${data.possibleCondition}.
    ${t('severityLevel')}: ${severityText}.
    
    ${t('summary')}: ${data.feelingSummary}.
    
    ${t('selfCareTips')}: ${data.selfCareTips}.
    
    ${t('recommendedSpecialist')}: ${data.recommendedDoctor}.
    
    ${t('nextSteps')}:
    ${data.nextSteps
      .map((step: string, idx: number) => `${idx + 1}. ${step}`)
      .join('. ')}.
    
    ${t('importantNote')}: ${data.additionalNotes}.
  `.trim();
};

  const downloadReport = async () => {
    setIsDownloading(true);
    try {
      await generatePDFReport({
        analysis: data,
        patientInfo: patientInfo || {},
        symptomDescription: symptomDescription || '',
        language,
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      alert(language === 'ar' ? 'خطأ في تحميل التقرير' : 'Error downloading report');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className="space-y-6 mt-8 opacity-0 animate-fade-in"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Main Result Card */}
      <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border-2 border-blue-100 dark:border-gray-700 overflow-hidden">
        <CardHeader className="pb-4">
          <div
            className={`flex items-center justify-between ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Left side: Title with icon */}
            <div
              className={`flex items-center gap-3 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {t('analysisComplete')}
              </CardTitle>
            </div>

            <TextToSpeech text={createSpeechText()} autoPlay={false} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* EMERGENCY ALERT - Display at top if present */}
          {data.hasEmergencyWarnings && data.emergencyWarnings && data.emergencyWarnings.length > 0 && (
            <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-2xl border-2 border-red-500 dark:border-red-600 animate-pulse">
              <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-lg font-bold text-red-700 dark:text-red-300 mb-3">
                    {language === 'ar' ? '⚠️ تنبيهات طبية طارئة' : '⚠️ EMERGENCY WARNINGS'}
                  </p>
                  <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {data.emergencyWarnings.map((warning: string, idx: number) => (
                      <li key={idx} className="text-red-600 dark:text-red-300 font-semibold flex items-start gap-2">
                        <span className="text-red-600 dark:text-red-400 mt-1">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-red-700 dark:text-red-300 font-semibold">
                    {language === 'ar' ? '⛔️ يجب التماس الرعاية الطبية الفورية أو الاتصال برقم الطوارئ' : '⛔️ Seek immediate medical attention or call emergency services'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Why This Result? - Diagnostic Reasoning */}
          {data.diagnosticReasoning && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="diagnostic-reasoning" className="border-2 border-blue-200 dark:border-blue-800 rounded-2xl overflow-hidden bg-blue-50 dark:bg-blue-900/10">
                <AccordionTrigger className={`px-6 py-4 hover:bg-blue-100 dark:hover:bg-blue-900/20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {language === 'ar' ? 'لماذا هذه النتيجة؟' : 'Why This Result?'}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 py-4 space-y-4 border-t border-blue-200 dark:border-blue-800">
                  {/* Key Factors */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? '🔍 العوامل الرئيسية' : '🔍 Key Factors'}
                    </p>
                    <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {data.diagnosticReasoning.keyFactors.map((factor: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
                          <span>{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Symptoms Analysis */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? '🩺 تحليل الأعراض' : '🩺 Symptoms Analysis'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {data.diagnosticReasoning.symptomsAnalysis}
                    </p>
                  </div>

                  {/* Clinical Logic */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? '🏥 المنطق السريري' : '🏥 Clinical Logic'}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-blue-600 dark:border-blue-400 pl-4">
                      {data.diagnosticReasoning.clinicalLogic}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Possible Condition */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('possibleCondition')}
            </p>
            <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {data.possibleCondition}
            </p>
          </div>

          {/* Severity Badge */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('severityLevel')}
            </p>
            <span
              className={`inline-block px-6 py-3 rounded-full font-semibold text-lg border-2 ${getSeverityColor(
                data.severity
              )}`}
            >
              {translateSeverity(data.severity)}
            </span>
          </div>

          {/* Confidence Score */}
          {data.confidenceScore !== undefined && (
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800">
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                    {language === 'ar' ? '📊 درجة الثقة التشخيصية' : '📊 Diagnostic Confidence'}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        data.confidenceScore >= 80
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : data.confidenceScore >= 60
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                          : 'bg-gradient-to-r from-red-500 to-rose-600'
                      }`}
                      style={{ width: `${data.confidenceScore}%` }}
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {data.confidenceScore}%
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        data.confidenceLevel === 'high'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : data.confidenceLevel === 'medium'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      }`}
                    >
                      {data.confidenceLevel === 'high'
                        ? language === 'ar'
                          ? 'عالية'
                          : 'High'
                        : data.confidenceLevel === 'medium'
                        ? language === 'ar'
                          ? 'متوسطة'
                          : 'Medium'
                        : language === 'ar'
                        ? 'منخفضة'
                        : 'Low'}
                    </span>
                  </div>
                </div>
              </div>
              {data.confidenceLevel === 'low' && (
                <p className="mt-4 text-xs text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                  {language === 'ar'
                    ? '⚠️ درجة الثقة منخفضة. يُنصح بشدة بزيارة الطبيب للحصول على تقييم شامل'
                    : '⚠️ Low confidence. Strongly recommend seeing a doctor for full evaluation'}
                </p>
              )}
            </div>
          )}

          {/* Phase 2: Model Consensus Summary */}
          {data.modelConsensus && data.consensusSummary && (
            <div className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-2xl border-2 border-violet-300 dark:border-violet-800">
              <div className={`flex items-start gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="text-2xl flex-shrink-0">🤖</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-violet-700 dark:text-violet-300 mb-2">
                    {language === 'ar' ? 'توافق نماذج متعددة' : 'Multi-Model Consensus'}
                  </p>
                  <p className="text-sm text-violet-700 dark:text-violet-300 font-semibold mb-4">
                    {data.consensusSummary}
                  </p>
                  
                  {/* Consistency Score */}
                  <div className="mb-4">
                    <p className="text-xs text-violet-600 dark:text-violet-400 mb-2 font-medium">
                      {language === 'ar' ? 'نسبة الاتفاق' : 'Consistency Score'}
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${data.modelConsensus.consistencyScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 font-semibold">
                      {data.modelConsensus.consistencyScore}% {language === 'ar' ? 'اتفاق' : 'agreement'}
                    </p>
                  </div>

                  {/* Model Votes Breakdown */}
                  <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">
                      {language === 'ar' ? 'الأصوات حسب النموذج' : 'Model Votes'}
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {Object.entries(data.modelConsensus.confidenceByModel).map(([model, score], idx) => (
                        <div key={idx} className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-gray-600 dark:text-gray-400">{model.replace('Model ', 'M')}</span>
                          <span className="font-semibold text-violet-600 dark:text-violet-400">{score}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Unanimous or Dissenting Info */}
                  {data.modelConsensus.unanimousAgreement ? (
                    <p className="mt-3 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800 font-semibold">
                      ✅ {language === 'ar' ? 'اتفاق تام من جميع النماذج' : 'Perfect consensus across all models'}
                    </p>
                  ) : data.modelConsensus.dissentingModels && data.modelConsensus.dissentingModels.length > 0 ? (
                    <p className="mt-3 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded border border-yellow-200 dark:border-yellow-800 font-semibold">
                      ⚠️ {language === 'ar' ? `${data.modelConsensus.dissentingModels.length} نموذج لم يتفق` : `${data.modelConsensus.dissentingModels.length} model(s) disagreed`}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          )}


          {/* Feeling Summary */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
              {t('summary')}
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.feelingSummary}
            </p>
          </div>

          {/* Extracted Symptoms */}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">
              {t('identifiedSymptoms')}
            </p>
            <div
              className={`flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}
            >
              {data.symptomsExtracted.map((symptom: string, idx: number) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium transition-all duration-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>

          {/* Symptom Timeline */}
          {data.symptomOnsetInfo && (
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {language === 'ar' ? 'جدول الأعراض' : 'Symptom Timeline'}
                </p>
              </div>
              <div className="space-y-2 text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-semibold">
                    {language === 'ar' ? 'بدء الأعراض:' : 'Onset:'}
                  </span>{' '}
                  {data.symptomOnsetInfo.exactDateTime}
                </p>
                <p>
                  <span className="font-semibold">
                    {language === 'ar' ? 'منذ:' : 'Duration:'}
                  </span>{' '}
                  {data.symptomOnsetInfo.daysAgo === 0
                    ? language === 'ar'
                      ? 'اليوم'
                      : 'Today'
                    : data.symptomOnsetInfo.daysAgo === 1
                    ? language === 'ar'
                      ? 'أمس'
                      : 'Yesterday'
                    : `${data.symptomOnsetInfo.daysAgo} ${language === 'ar' ? 'أيام' : 'days'} ago`}
                </p>
              </div>
            </div>
          )}

          {/* Medication Notes */}
          {data.medicationNotes && (
            <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    {language === 'ar' ? 'ملاحظات الأدوية' : 'Medication Notes'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {data.medicationNotes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          {data.validationWarnings && data.validationWarnings.length > 0 && (
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border-2 border-orange-300 dark:border-orange-800">
              <div className={`flex items-start gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-bold text-orange-700 dark:text-orange-300">
                  {language === 'ar' ? '⚠️ تنبيهات التحقق' : '⚠️ Validation Alerts'}
                </p>
              </div>
              <ul className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                {data.validationWarnings.map((warning: string, idx: number) => (
                  <li key={idx} className="text-sm text-orange-700 dark:text-orange-300 flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 font-bold mt-1">→</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-orange-600 dark:text-orange-400 italic">
                {language === 'ar'
                  ? 'هذه التنبيهات تعتمد على سجلك الطبي والأدوية الحالية. استشر طبيبك دائماً.'
                  : 'These alerts are based on your medical history and current medications. Always consult your doctor.'}
              </p>
            </div>
          )}

          {/* Download Report Button */}
          <Button
            onClick={downloadReport}
            disabled={isDownloading}
            className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white py-6 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {language === 'ar' ? 'جاري التحميل...' : 'Generating...'}
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                {language === 'ar' ? 'تحميل التقرير PDF' : 'Download Report PDF'}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Self-Care Tips */}
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border dark:border-gray-700">
          <CardHeader>
            <div
              className={`flex items-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t('selfCareTips')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {data.selfCareTips}
            </p>
          </CardContent>
        </Card>

        {/* Recommended Doctor */}
        <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border dark:border-gray-700">
          <CardHeader>
            <div
              className={`flex items-center gap-2 ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
            >
              <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {t('recommendedSpecialist')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
              {data.recommendedDoctor}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('nextSteps')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.nextSteps.map((step: string, idx: number) => (
              <div
                key={idx}
                className={`flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1 ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-3xl p-6">
        <div
          className={`flex items-start gap-4 ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-2">
              {t('importantNote')}
            </h3>
            <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
              {data.additionalNotes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
