/**
 * AI Symptom Checker - Global Type Definitions
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Global TypeScript type declarations for the project
 */

interface Window {
  webkitSpeechRecognition?: SpeechRecognition;
  SpeechRecognition?: SpeechRecognition;
}
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: 'no-speech' | 'audio-capture' | 'not-allowed' | string;
  message?: string;
}
