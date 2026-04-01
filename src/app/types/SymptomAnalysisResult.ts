/**
 * AI Symptom Checker - Symptom Analysis Result Type Definition
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Type definition for AI symptom analysis output
 */

export interface SymptomAnalysisResult {
  possibleCondition: string;
  severity: 'mild' | 'moderate' | 'severe';
  selfCareTips: string;
  recommendedDoctor: string;
  symptomsExtracted: string[];
  feelingSummary: string;
  additionalNotes: string;
  nextSteps: string[];
  hasEmergencyWarnings?: boolean;
  emergencyWarnings?: string[];
  medicationNotes?: string;
  symptomOnsetInfo?: {
    daysAgo: number;
    exactDateTime: string;
  };
  diagnosticReasoning?: {
    keyFactors: string[];
    symptomsAnalysis: string;
    clinicalLogic: string;
  };
  confidenceScore?: number;
  confidenceLevel?: 'high' | 'medium' | 'low';
  validationWarnings?: string[];
  // Phase 2: Multi-model consensus fields
  modelConsensus?: {
    modelCount: number;
    unanimousAgreement: boolean;
    modelVotes: { [condition: string]: number };
    confidenceByModel: { [model: string]: number };
    consistencyScore: number; // 0-100, how well models agreed
    dissentingModels?: string[];
  };
  consensusSummary?: string; // Human-readable summary of model agreement
}
