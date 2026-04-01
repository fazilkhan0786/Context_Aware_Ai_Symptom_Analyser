/**
 * AI Symptom Checker - Symptom Analysis Hook
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Custom React hook for managing symptom analysis workflow
 */

import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; 
import {SymptomAnalysisResult} from '../types/SymptomAnalysisResult';

export function useSymptomCheck() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SymptomAnalysisResult | null>(null);
  const [patientInfo, setPatientInfo] = useState<{
    age?: string;
    gender?: string;
    allergies?: string;
    chronicConditions?: string;
    symptomStartDate?: string;
    symptomStartTime?: string;
    currentMedications?: string;
  } | null>(null);
  const [symptomDescription, setSymptomDescription] = useState<string | null>(null);
  const { language } = useLanguage();

  async function checkSymptoms(data: {
    userInput: string;
    age?: string;
    gender?: string;
    allergies?: string;
    chronicConditions?: string;
    symptomStartDate?: string;
    symptomStartTime?: string;
    currentMedications?: string;
  }) {
    setLoading(true);
    setError(null);
    setResult(null);
    setPatientInfo(null);
    setSymptomDescription(null);

    try {
      const res = await fetch('/api/analyze-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: data.userInput,
          language,
          age: data.age,
          gender: data.gender,
          allergies: data.allergies,
          chronicConditions: data.chronicConditions,
          symptomStartDate: data.symptomStartDate,
          symptomStartTime: data.symptomStartTime,
          currentMedications: data.currentMedications,
        }), 
      });

      const responseData = await res.json();

      if (!res.ok) {
        setError(responseData.error || 'Failed to analyze symptoms');
      } else {
        setResult(responseData);
        setPatientInfo({
          age: data.age,
          gender: data.gender,
          allergies: data.allergies,
          chronicConditions: data.chronicConditions,
          symptomStartDate: data.symptomStartDate,
          symptomStartTime: data.symptomStartTime,
          currentMedications: data.currentMedications,
        });
        setSymptomDescription(data.userInput);
      }
    } catch (err: Error | unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, result, checkSymptoms, patientInfo, symptomDescription };
}
