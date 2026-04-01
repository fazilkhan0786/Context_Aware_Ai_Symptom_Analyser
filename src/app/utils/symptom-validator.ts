/**
 * AI Symptom Checker - Symptom Input Validator
 * 
 * @author Fazilkhan Malek
 * @created 2026
 * @license MIT with Attribution
 * @description Validates user input contains legitimate medical symptoms before processing
 */

// Comprehensive list of medical symptom keywords
const MEDICAL_SYMPTOM_KEYWORDS = [
  // Common symptoms
  'pain', 'ache', 'hurt', 'sore', 'aching', 'throbbing', 'burning', 'cramping',
  'fever', 'temperature', 'hot', 'chills', 'sweating',
  'cough', 'coughing', 'wheezing', 'wheeze',
  'headache', 'migraine', 'head pain',
  'nausea', 'nauseous', 'vomit', 'vomiting', 'sick',
  'diarrhea', 'diarrhoea', 'loose stool', 'constipation',
  'rash', 'hives', 'itching', 'itchy', 'skin',
  'fatigue', 'tired', 'exhausted', 'weakness', 'weak',
  'shortness of breath', 'breathing', 'breathless', 'dyspnea', 'wheezing',
  'congestion', 'congested', 'nasal', 'runny nose', 'sneezing', 'sneeze',
  'sore throat', 'throat pain', 'throat ache',
  'cyst', 'lump', 'bump', 'swelling', 'swollen', 'inflammation',
  'bleeding', 'bleed', 'bruise', 'bruising', 'wound',
  'dizziness', 'dizzy', 'vertigo', 'lightheaded',
  'anxiety', 'anxious', 'panic', 'nervous', 'stress',
  'depression', 'depressed', 'sad', 'low mood',
  'insomnia', 'sleep', 'sleeping', 'sleepless',
  'constipation', 'irregular bowel', 'bowel',
  'chest', 'heart palpitations', 'palpitations', 'arrhythmia',
  'back pain', 'back ache', 'spine',
  'leg pain', 'leg ache', 'arm pain', 'arm ache',
  'muscle', 'joint', 'arthritis', 'osteoporosis',
  'diabetes', 'diabetic', 'high blood sugar',
  'hypertension', 'high blood pressure', 'bp',
  'asthma', 'copd', 'bronchitis', 'pneumonia',
  'allergy', 'allergic', 'allergy reaction',
  'infection', 'infectious', 'bacterial', 'viral',
  'inflammation', 'inflamed', 'inflammatory',
  'trauma', 'injury', 'accident', 'sprain', 'fracture',
  'seizure', 'epilepsy', 'convulsion',
  'stroke', 'tia', 'transient ischemic',
  'cancer', 'malignancy', 'tumor', 'tumour',
  'ulcer', 'ulceration', 'peptic',
  'heartburn', 'reflux', 'gerd', 'acid reflux',
  'kidney', 'renal', 'bladder', 'urinary',
  'prostate', 'reproductive',
  'period', 'menstrual', 'miscarriage', 'pregnancy',
  'erectile dysfunction', 'impotence',
  'thyroid', 'endocrine',
  'liver', 'hepatic', 'cirrhosis', 'hepatitis',
  'tremor', 'shaking', 'trembling',
  'numbness', 'tingling', 'paresthesia',
  'vision', 'eye', 'sight', 'blind', 'blurred',
  'hearing', 'ear', 'deaf', 'tinnitus',
  'discharge', 'secretion', 'pus',
  'odor', 'smell', 'foul',
  'flake', 'scaling', 'peeling',
];

// Medical condition keywords (to catch self-diagnosis)
const MEDICAL_CONDITION_KEYWORDS = [
  'diabetes', 'asthma', 'copd', 'copd', 'arthritis', 'cancer', 'hypertension',
  'depression', 'anxiety', 'pneumonia', 'bronchitis', 'migraine', 'epilepsy',
  'fibromyalgia', 'lupus', 'ibs', 'acid reflux', 'ulcer', 'hepatitis',
];

// Words that indicate nonsense or spam
const SPAM_KEYWORDS = [
  'bitcoin', 'crypto', 'lottery', 'poker', 'casino', 'dating', 'sex',
  'viagra', 'cialis', 'weight loss pill', 'xxx', 'adult',
  'spam', 'scam', 'free money', 'click here', 'buy now',
];

interface ValidationResult {
  isValid: boolean;
  confidence: number; // 0-100, how likely this is actual symptoms
  message: string;
  issues: string[];
}

/**
 * Validate symptom input
 */
export function validateSymptomInput(input: string): ValidationResult {
  const issues: string[] = [];
  let confidence = 0;

  // Check if input is empty or too short
  if (!input || input.trim().length === 0) {
    return {
      isValid: false,
      confidence: 0,
      message: 'Please describe your symptoms.',
      issues: ['Empty input'],
    };
  }

  if (input.trim().length < 5) {
    issues.push('Input too short - please provide more detail');
  }

  const lowerInput = input.toLowerCase();

  // Check for spam keywords
  const hasSpam = SPAM_KEYWORDS.some((keyword) =>
    lowerInput.includes(keyword.toLowerCase())
  );
  if (hasSpam) {
    return {
      isValid: false,
      confidence: 0,
      message:
        'This does not appear to be a legitimate medical symptom query.',
      issues: ['Spam/inappropriate content detected'],
    };
  }

  // Check if input contains actual symptom keywords
  let symptomCount = 0;
  const foundSymptoms: string[] = [];

  for (const keyword of MEDICAL_SYMPTOM_KEYWORDS) {
    if (lowerInput.includes(keyword.toLowerCase())) {
      symptomCount++;
      // Only add first mention of each symptom type
      if (foundSymptoms.length < 5) {
        foundSymptoms.push(keyword);
      }
    }
  }

  // Check for condition mentions (can count towards validity)
  let conditionCount = 0;
  for (const condition of MEDICAL_CONDITION_KEYWORDS) {
    if (lowerInput.includes(condition.toLowerCase())) {
      conditionCount++;
    }
  }

  // Calculate confidence based on indicators
  if (symptomCount >= 3) {
    confidence = 95; // Strong: multiple symptoms mentioned
  } else if (symptomCount === 2) {
    confidence = 80; // Good: two symptoms mentioned
  } else if (symptomCount === 1) {
    confidence = 60; // Fair: one symptom mentioned
  } else if (conditionCount > 0) {
    confidence = 50; // Weak: only condition mentioned, no symptoms
  } else {
    confidence = 20; // Very weak: no medical keywords found
  }

  // Check for rambling or nonsensical patterns
  const wordCount = input.split(/\s+/).length;
  const avgWordLength = input.replace(/\s+/g, '').length / wordCount;

  // Very short words or odd patterns might indicate spam
  if (wordCount < 3) {
    confidence = Math.max(0, confidence - 20);
    issues.push('Very brief input - unclear if medical symptoms');
  }

  // Check for excessive repetition (possible spam)
  const words = lowerInput.split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = words.length / uniqueWords.size;

  if (repetitionRatio > 2) {
    confidence = Math.max(0, confidence - 15);
    issues.push('Excessive word repetition detected');
  }

  // Require at least one symptom keyword OR condition
  const hasValidContent = symptomCount > 0 || conditionCount > 0;

  // Final validation
  const isValid = hasValidContent && confidence >= 40;

  return {
    isValid,
    confidence,
    message: isValid
      ? 'Input appears to contain medical symptoms.'
      : 'This does not appear to contain legitimate medical symptoms. Please describe your actual symptoms.',
    issues,
  };
}

/**
 * Get user-friendly rejection message
 */
export function getInvalidInputResponse(
  language: string,
  validation: ValidationResult
) {
  const messages = {
    en: {
      invalid_input: 'Please provide a detailed description of your symptoms.',
      too_short:
        'Your input is too brief. Please describe your symptoms in more detail.',
      not_medical:
        'This does not appear to be a medical symptom query. Please describe any symptoms you are experiencing.',
      spam:
        'This input does not appear to be a legitimate medical symptom query.',
    },
    ar: {
      invalid_input:
        'يرجى تقديم وصف مفصل لأعراضك. (Please provide a detailed description of your symptoms.)',
      too_short:
        'إدخالك قصير جداً. يرجى وصف أعراضك بمزيد من التفاصيل. (Your input is too brief. Please describe your symptoms in more detail.)',
      not_medical:
        'لا يبدو أن هذا استعلام عن أعراض طبية. يرجى وصف أي أعراض تعاني منها. (This does not appear to be a medical symptom query.)',
      spam: 'هذا الإدخال لا يبدو أنه استعلام طبي شرعي. (This input does not appear to be legitimate.)',
    },
  };

  const lang = language === 'ar' ? 'ar' : 'en';
  const msgSet = messages[lang as keyof typeof messages];

  if (validation.issues.includes('Spam/inappropriate content detected')) {
    return msgSet.spam;
  }
  if (validation.issues.includes('Input too short - please provide more detail')) {
    return msgSet.too_short;
  }
  if (validation.issues.includes('Empty input')) {
    return msgSet.invalid_input;
  }

  return msgSet.not_medical;
}
