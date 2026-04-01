/**
 * AI Symptom Checker - Drug Interaction & Validation Rule Engine
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Prevents dangerous drug combinations and validates diagnosis safety
 */

export interface DrugConditionInteraction {
  drug: string;
  condition: string;
  risk: 'high' | 'medium' | 'low';
  warning: string;
}

export interface ValidationRule {
  id: string;
  check: (data: ValidationData) => boolean;
  warning: string;
}

export interface ValidationData {
  condition: string;
  severity: string;
  medications: string[];
  age?: number;
  allergies?: string[];
  chronicConditions?: string[];
}

// Drug-Condition Interaction Database
const DRUG_CONDITION_INTERACTIONS: DrugConditionInteraction[] = [
  // ASPIRIN interactions
  {
    drug: 'Aspirin',
    condition: 'COPD',
    risk: 'high',
    warning: 'Aspirin can worsen breathing in COPD patients. Use alternatives like acetaminophen.',
  },
  {
    drug: 'Aspirin',
    condition: 'Asthma',
    risk: 'high',
    warning: 'Aspirin can trigger asthma attacks. Consider alternatives.',
  },
  // IBUPROFEN interactions
  {
    drug: 'Ibuprofen',
    condition: 'Heart failure',
    risk: 'high',
    warning: 'NSAIDs like ibuprofen can worsen heart failure. Use acetaminophen instead.',
  },
  {
    drug: 'Ibuprofen',
    condition: 'Kidney disease',
    risk: 'high',
    warning: 'NSAIDs can damage kidneys further. Consult doctor before use.',
  },
  // ACE INHIBITOR / BLOOD PRESSURE interactions
  {
    drug: 'Lisinopril',
    condition: 'Hyperkalemia',
    risk: 'high',
    warning: 'ACE inhibitors raise potassium levels. Monitor closely.',
  },
  {
    drug: 'Lisinopril',
    condition: 'Kidney disease',
    risk: 'medium',
    warning: 'ACE inhibitors can affect kidney function. Regular monitoring needed.',
  },
  // METFORMIN interactions
  {
    drug: 'Metformin',
    condition: 'Acute kidney injury',
    risk: 'high',
    warning: 'Metformin contraindicated in acute kidney problems. Risk of lactic acidosis.',
  },
  // WARFARIN interactions
  {
    drug: 'Warfarin',
    condition: 'Fever',
    risk: 'medium',
    warning: 'Fever may increase Warfarin effects. Monitor INR closely.',
  },
  // ANTIHISTAMINES
  {
    drug: 'Diphenhydramine',
    condition: 'Glaucoma',
    risk: 'high',
    warning: 'Antihistamines can worsen glaucoma. Avoid or use with caution.',
  },
];

// Medical Validation Rules
const VALIDATION_RULES: ValidationRule[] = [
  {
    id: 'elderly-severe-fever',
    check: (data) =>
      !!(data.age && 
      data.age > 65 && 
      data.severity === 'severe' && 
      data.condition?.toLowerCase().includes('fever')),
    warning: 'Severe fever in elderly patients requires urgent medical attention (high dehydration risk).',
  },
  {
    id: 'pediatric-respiratory',
    check: (data) =>
      !!(data.age && 
      data.age < 5 && 
      data.condition?.toLowerCase().match(/cough|pneumonia|bronchitis/)),
    warning: 'Respiratory issues in young children require prompt medical evaluation.',
  },
  {
    id: 'pregnancy-medication',
    check: (data) =>
      !!(data.medications?.some(m => 
        m.toLowerCase().match(/ibuprofen|naproxen|ace inhibitor|warfarin/)
      ) && data.allergies?.some(a => a.toLowerCase().includes('pregnancy'))),
    warning: 'Some medications are unsafe during pregnancy. Consult healthcare provider.',
  },
  {
    id: 'multiple-risk-factors',
    check: (data) =>
      !!(data.chronicConditions && 
      data.chronicConditions.length >= 3 && 
      data.severity === 'moderate'),
    warning: 'Multiple chronic conditions increase complexity. Strong recommendation to see a doctor.',
  },
  {
    id: 'conflicting-symptoms',
    check: (data) =>
      !!(data.condition?.toLowerCase().includes('cold') && 
      data.severity === 'severe'),
    warning: 'Severe symptoms for what appears to be a common cold may indicate something more serious.',
  },
];

/**
 * Check for drug-condition interactions
 */
export function checkDrugInteractions(
  medications: string[] = [],
  condition: string
): DrugConditionInteraction[] {
  if (!medications || medications.length === 0) return [];

  const interactions: DrugConditionInteraction[] = [];
  const conditionLower = condition.toLowerCase();

  medications.forEach((med) => {
    const medLower = med.toLowerCase();
    DRUG_CONDITION_INTERACTIONS.forEach((interaction) => {
      if (
        medLower.includes(interaction.drug.toLowerCase()) &&
        conditionLower.includes(interaction.condition.toLowerCase())
      ) {
        interactions.push(interaction);
      }
    });
  });

  return interactions;
}

/**
 * Run all validation rules
 */
export function runValidationRules(data: ValidationData): string[] {
  const warnings: string[] = [];

  VALIDATION_RULES.forEach((rule) => {
    if (rule.check(data)) {
      warnings.push(rule.warning);
    }
  });

  return warnings;
}

/**
 * Calculate confidence adjustment based on validations
 */
export function calculateConfidenceAdjustment(
  validations: {
    interactions: DrugConditionInteraction[];
    warnings: string[];
  }
): number {
  let adjustment = 0;

  // High-risk drug interactions reduce confidence by 15%
  const highRiskInteractions = validations.interactions.filter((i) => i.risk === 'high');
  adjustment -= highRiskInteractions.length * 15;

  // Medium-risk interactions reduce by 5%
  const mediumRiskInteractions = validations.interactions.filter((i) => i.risk === 'medium');
  adjustment -= mediumRiskInteractions.length * 5;

  // Each validation warning reduces by 3%
  adjustment -= validations.warnings.length * 3;

  return Math.max(adjustment, -50); // Don't reduce by more than 50%
}

/**
 * Get severity level from confidence score
 */
export function getConfidenceLevel(
  score: number
): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}
