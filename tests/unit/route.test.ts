import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { z } from 'zod';
vi.mock('../../src/settings.ts', () => ({
  SERVER_SETTINGS: { groqApiKey: 'test-key' },
}));

const { createSpy } = vi.hoisted(() => ({
  createSpy: vi.fn(),
}));

vi.mock('groq-sdk', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: { create: createSpy },
      },
    })),
  };
});

import { POST } from '../../src/app/api/analyze-symptoms/route';
export const AnalyzeSymptomsInputSchema = z.object({
  userInput: z.string(),
  language: z.enum(['en', 'ar']).optional().default('en'),
});
export type AnalyzeSymptomsBody = z.infer<typeof AnalyzeSymptomsInputSchema>;


function makeRequest(body: AnalyzeSymptomsBody) {
  return { json: async () => body } as unknown as Pick<Request, 'json'>;
}

async function readJson(res: Response) {
  const data = await res.json();
  return { status: (res as Response).status, data };
}

const validGroqPayload = {
  possibleCondition: 'Common cold',
  severity: 'mild',
  selfCareTips: 'Rest and drink fluids.',
  recommendedDoctor: 'General practitioner',
  symptomsExtracted: ['cough', 'runny nose'],
  feelingSummary: 'Feeling tired and stuffy.',
  additionalNotes: 'Monitor symptoms for 48 hours.',
  nextSteps: ['Rest', 'Hydrate'],
};

describe('POST /api/health', () => {
  beforeEach(() => {
    createSpy.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when userInput is missing', async () => {
    const req = makeRequest({ language: 'en' });
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);
    expect(status).toBe(400);
    expect(data).toEqual({ error: 'Input is required' });
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('returns 200 with valid parsed data (English)', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(validGroqPayload),
          },
        },
      ],
    });

    const req = makeRequest({
      userInput: 'I have a cough and runny nose',
      language: 'en',
    } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(200);
    expect(data).toEqual(validGroqPayload);
    expect(createSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
      })
    );
  });

  it('returns 200 with valid parsed data (Arabic)', async () => {
    const arabicPayload = {
      possibleCondition: 'نزلة برد',
      severity: 'moderate',
      selfCareTips: 'اشرب سوائل دافئة واسترح.',
      recommendedDoctor: 'طبيب عام',
      symptomsExtracted: ['سعال', 'انسداد الأنف'],
      feelingSummary: 'أشعر بالإرهاق وانسداد الأنف.',
      additionalNotes: 'راقب الأعراض لمدة 48 ساعة.',
      nextSteps: ['الراحة', 'السوائل'],
    };
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify(arabicPayload) } }],
    });

    const req = makeRequest({
      userInput: 'سعال وانسداد الأنف',
      language: 'ar',
    } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(200);
    expect(data).toEqual(arabicPayload);
  });

  it('returns 500 if Groq returns no content', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: undefined } }],
    });

    const req = makeRequest({ userInput: 'headache', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data).toEqual({ error: 'No content returned by Groq' });
  });

  it('returns 500 if schema validation fails', async () => {
    createSpy.mockResolvedValueOnce({
      choices: [{ message: { content: JSON.stringify({ foo: 'bar' }) } }],
    });

    const req = makeRequest({ userInput: 'random text', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data.error).toBe('Invalid response format from Groq');
    expect(typeof data.rawContent).toBe('string');
  });

  it('returns 500 on Groq client error (exception thrown)', async () => {
    createSpy.mockRejectedValueOnce(new Error('API down'));

    const req = makeRequest({ userInput: 'fever', language: 'en' } as AnalyzeSymptomsBody);
    const res = await POST(req);
    const { status, data } = await readJson(res as unknown as Response);

    expect(status).toBe(500);
    expect(data.error).toMatch(/Server error: API down/);
  });
});
