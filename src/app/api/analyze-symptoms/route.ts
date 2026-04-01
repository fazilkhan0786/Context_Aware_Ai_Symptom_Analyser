/**
 * AI Symptom Checker - Symptom Analysis API Endpoint
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Core API handler for symptom analysis using Groq AI models
 * @endpoint POST /api/analyze-symptoms
 */

import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { z } from 'zod';
import { SERVER_SETTINGS } from '../../../settings';
import { checkDrugInteractions, runValidationRules, calculateConfidenceAdjustment, getConfidenceLevel } from '../../utils/drug-interactions';
import { callMultipleModels, aggregateModelResponses, applyConsensusBoost, getConsensusSummary } from '../../utils/multi-model-consensus';
import { validateSymptomInput, getInvalidInputResponse } from '../../utils/symptom-validator';

const SymptomResponseSchema = z.object({
  possibleCondition: z.string(),
  severity: z.enum(['mild', 'moderate', 'severe']),
  selfCareTips: z.string(),
  recommendedDoctor: z.string(),
  symptomsExtracted: z.array(z.string()),
  feelingSummary: z.string(),
  additionalNotes: z.string(),
  nextSteps: z.array(z.string()),
  hasEmergencyWarnings: z.boolean().optional(),
  emergencyWarnings: z.array(z.string()).optional(),
  medicationNotes: z.string().optional(),
  symptomOnsetInfo: z.object({
    daysAgo: z.number(),
    exactDateTime: z.string(),
  }).optional(),
  diagnosticReasoning: z.object({
    keyFactors: z.array(z.string()),
    symptomsAnalysis: z.string(),
    clinicalLogic: z.string(),
  }).optional(),
  confidenceScore: z.number().min(0).max(100).optional(),
});

const groq = new Groq({
  apiKey: SERVER_SETTINGS.groqApiKey,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userInput, 
      language = 'en', 
      age, 
      gender, 
      allergies, 
      chronicConditions,
      symptomStartDate,
      symptomStartTime,
      currentMedications,
    } = body;

    if (!userInput) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    // Validate symptom input for legitimacy
    const validation = validateSymptomInput(userInput);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid symptom input',
          message: getInvalidInputResponse(language, validation),
          validationReason: validation.issues,
        },
        { status: 400 }
      );
    }

    const languageInstructions = {
      en: 'Respond in English.',
      ar: 'Respond in Arabic (العربية). All fields must be in Arabic language.',
    };

    // Build patient context
    const patientContext = [
      age ? `Age: ${age}` : '',
      gender ? `Gender: ${gender}` : '',
      allergies ? `Allergies: ${allergies}` : '',
      chronicConditions ? `Chronic Conditions: ${chronicConditions}` : '',
      symptomStartDate ? `Symptom onset date: ${symptomStartDate}` : '',
      symptomStartTime ? `Symptom onset time (approx): ${symptomStartTime}` : '',
      currentMedications ? `Current medications: ${currentMedications}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    // Calculate days since symptom onset
    let daysAgo = 0;
    let exactDateTime = '';
    if (symptomStartDate) {
      const startDate = new Date(symptomStartDate);
      const today = new Date();
      daysAgo = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      exactDateTime = symptomStartTime 
        ? `${symptomStartDate} at ${symptomStartTime}`
        : symptomStartDate;
    }

    const prompt = `
You are a professional medical AI assistant. The user provides the following information about their health:

PATIENT INFORMATION:
${patientContext || 'Not provided'}

SYMPTOMS AND HEALTH DESCRIPTION:
"${userInput}"

**CRITICAL INSTRUCTION**: ALWAYS respond with severity ONLY as one of these three English words in lowercase: "mild", "moderate", or "severe". NEVER translate severity to another language.

${
  languageInstructions[language as keyof typeof languageInstructions] ||
  languageInstructions.en
}

Analyze the information carefully, taking into account the patient's age, gender, allergies, chronic conditions, and current medications.

CRITICAL: Detect EMERGENCY WARNING SIGNS that require immediate medical attention (chest pain, difficulty breathing, loss of consciousness, severe bleeding, signs of stroke, severe allergic reaction, confusion, etc.). If emergency signs are present, include them in the emergencyWarnings array and set hasEmergencyWarnings to true.

Provide a detailed response including:
1) The most likely medical condition (considering patient context).
2) Severity level MUST BE English: "mild", "moderate", or "severe" - NEVER IN ANOTHER LANGUAGE.
3) Self-care tips (avoiding allergens if mentioned, respecting medications).
4) Recommended doctor type to consult.
5) Extracted symptoms from the text as a list.
6) Summary of how the user is feeling.
7) Any medication interaction notes or warnings.
8) Any additional notes or warnings (especially regarding allergies and chronic conditions).
9) Next steps or actions the user should take.
10) Emergency warnings if detected (set hasEmergencyWarnings to true if any found).
11) DIAGNOSTIC REASONING explaining WHY you arrived at this diagnosis:
    - keyFactors: List 3-4 specific patient factors that influenced the diagnosis (e.g., "Age 45 with hypertension history", "Reported chest pain and difficulty breathing")
    - symptomsAnalysis: Brief explanation of which symptoms are most relevant (e.g., "The combination of chest pain and dyspnea are classic indicators of cardiac issues")
    - clinicalLogic: Overall clinical reasoning connecting the symptoms to the condition (e.g., "Given the acute onset of chest discomfort with respiratory distress in a middle-aged patient with cardiovascular risk factors, acute coronary syndrome must be ruled out immediately")
12) CONFIDENCE SCORE (0-100): How confident are you in this diagnosis?
    - 90-100: Classic presentation, clear pattern match
    - 75-89: Strong indicators but some ambiguity
    - 60-74: Reasonable diagnosis but needs confirmation
    - 40-59: Multiple possibilities, needs tests
    - 0-39: Very uncertain, immediate doctor consultation needed

Output ONLY in JSON format as an object with the following structure:
{
  "possibleCondition": "string",
  "severity": "mild | moderate | severe" (ENGLISH ONLY, lowercase),
  "selfCareTips": "string",
  "recommendedDoctor": "string",
  "symptomsExtracted": ["string", ...],
  "feelingSummary": "string",
  "medicationNotes": "string (optional notes about medication interactions)",
  "additionalNotes": "string",
  "nextSteps": ["string", ...],
  "hasEmergencyWarnings": boolean,
  "emergencyWarnings": ["string", ...] (only if hasEmergencyWarnings is true),
  "diagnosticReasoning": {
    "keyFactors": ["string", "string", "string"],
    "symptomsAnalysis": "string",
    "clinicalLogic": "string"
  },
  "confidenceScore": number (0-100)
}

FINAL CRITICAL INSTRUCTIONS: 
- SEVERITY MUST ALWAYS BE: "mild", "moderate", or "severe" IN ENGLISH LOWERCASE - NEVER TRANSLATE IT
- ALWAYS include confidenceScore (0-100 range) based on diagnostic clarity
- Always include diagnosticReasoning object with all three fields (keyFactors, symptomsAnalysis, clinicalLogic)
- All other text content should be in ${
      language === 'ar' ? 'Arabic' : 'English'
    } except severity which is ALWAYS English
- Respond concisely, clearly, and ONLY in JSON format. Do NOT include any extra text.
    `;

    // Phase 2: Call multiple models in parallel for consensus voting
    const modelResponses = await callMultipleModels(userInput, {
      age: age ? parseInt(age) : undefined,
      gender,
      allergies,
      chronicConditions,
      currentMedications,
    });

    // For compatibility, also get single-model response for detailed output
    // Using the groq instance already declared at the top of file

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.2,
      max_completion_tokens: 1500,
      top_p: 1,
      stream: false,
      response_format: { type: 'json_object' },
    });

    const content = chatCompletion.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: 'No content returned by Groq' },
        { status: 500 }
      );
    }

    const parsedData = SymptomResponseSchema.safeParse(JSON.parse(content));
    if (!parsedData.success) {
      return NextResponse.json(
        { error: 'Invalid response format from Groq', rawContent: content },
        { status: 500 }
      );
    }

    // Add symptom onset information to the response
    const response = {
      ...parsedData.data,
      symptomOnsetInfo: symptomStartDate ? {
        daysAgo,
        exactDateTime,
      } : undefined,
    };

    // Run validation rules and check drug interactions
    const medicationsList = currentMedications 
      ? currentMedications.split(',').map((m) => m.trim())
      : [];

    const drugInteractions = checkDrugInteractions(
      medicationsList,
      parsedData.data.possibleCondition
    );

    const validationWarnings = runValidationRules({
      condition: parsedData.data.possibleCondition,
      severity: parsedData.data.severity,
      medications: medicationsList,
      age: age ? parseInt(age) : undefined,
      allergies: allergies ? allergies.split(',').map((a) => a.trim()) : undefined,
      chronicConditions: chronicConditions 
        ? chronicConditions.split(',').map((c) => c.trim()) 
        : undefined,
    });

    // Combine all warnings
    const allWarnings = [
      ...drugInteractions.map((i) => i.warning),
      ...validationWarnings,
    ];

    // Calculate confidence adjustment
    const confidenceAdjustment = calculateConfidenceAdjustment({
      interactions: drugInteractions,
      warnings: validationWarnings,
    });

    // Final confidence score (LLM score + adjustment)
    const lLMConfidenceScore = response.confidenceScore || 75;
    const finalConfidenceScore = Math.max(
      0,
      Math.min(100, lLMConfidenceScore + confidenceAdjustment)
    );

    // Phase 2: Process multi-model consensus
    const consensusResult = aggregateModelResponses(modelResponses);
    
    // Apply consensus boost to final confidence
    const consensusBoostedConfidence = applyConsensusBoost(
      finalConfidenceScore,
      consensusResult
    );

    // Add validation and consensus data to response
    const finalResponse = {
      ...response,
      confidenceScore: consensusBoostedConfidence,
      confidenceLevel: getConfidenceLevel(consensusBoostedConfidence),
      validationWarnings: allWarnings.length > 0 ? allWarnings : undefined,
      // Phase 2: Add consensus voting data
      modelConsensus: {
        modelCount: consensusResult.modelCount,
        unanimousAgreement: consensusResult.unanimousAgreement,
        modelVotes: consensusResult.modelVotes,
        confidenceByModel: consensusResult.confidenceScores,
        consistencyScore: consensusResult.unanimousAgreement ? 100 : Math.round(
          ((consensusResult.modelCount - (consensusResult.dissenting?.length || 0)) / consensusResult.modelCount) * 100
        ),
        dissentingModels: consensusResult.dissenting,
      },
      consensusSummary: getConsensusSummary(consensusResult),
    };

    return NextResponse.json(finalResponse, { status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}