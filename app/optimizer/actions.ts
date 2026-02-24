'use server'

import { aiClient } from '@/utils/ai/gemini';

function extractJsonObject(raw: string): string {
  const trimmed = raw.trim();

  if (trimmed.startsWith('```json')) {
    const unwrapped = trimmed.slice(7).replace(/```$/, '').trim();
    if (unwrapped) return unwrapped;
  }
  if (trimmed.startsWith('```')) {
    const unwrapped = trimmed.slice(3).replace(/```$/, '').trim();
    if (unwrapped) return unwrapped;
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }

  return trimmed;
}

async function getOptimizationResponse(prompt: string) {
  const models = ['gemini-3-flash-preview', 'gemini-2.5-flash'];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      return await aiClient.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        response_format: { type: 'json_object' },
      });
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('No model call succeeded.');
}

export async function optimizeResume(formData: FormData) {
  try {
    const resumeFile = formData.get('resume') as File | null;
    const targetJob = formData.get('targetJob') as string | null;
    const additionalContext = formData.get('context') as string | null;

    if (!resumeFile) {
      return { error: 'Please upload a resume to optimize.' };
    }

    let resumeText = '';
    try {
      // Extract text from PDF
      const { PDFParse } = await import('pdf-parse');
      const arrayBuffer = await resumeFile.arrayBuffer();
      const pdf = new PDFParse({ data: new Uint8Array(arrayBuffer) });
      try {
        const pdfData = await pdf.getText();
        resumeText = pdfData.text ?? '';
      } finally {
        await pdf.destroy();
      }
    } catch (error) {
      console.error('PDF extraction failed in optimizeResume:', error);
      return {
        error:
          'Failed to read this PDF in production. Please try another text-based PDF or re-export the file.',
      };
    }

    if (!resumeText.trim()) {
      return { error: 'Could not extract text from the provided PDF.' };
    }

    const prompt = `You are an expert Resume Writer and Career Coach. 
Optimize the following resume content to be ATS-friendly, impactful, and results-oriented.

${targetJob ? `TARGET JOB DESCRIPTION:
${targetJob}
=> INSTRUCTION: Heavily tailor the resume summary, skills, and bullet points to strategically emphasize keywords, tools, and requirements found in this job description without fabricating experience.` : ''}

Target Context / User Request:
${additionalContext || 'Make it general but highly professional and optimized for modern ATS systems.'}

Original Resume Text:
${resumeText}

Provide the optimized resume in JSON format exactly matching this structure:
{
  "fullName": "<Extract or infer user name>",
  "email": "<Extract or infer email>",
  "phone": "<Extract or infer phone>",
  "location": "<Extract or infer location>",
  "linkedin": "<Extract or infer linkedin link if present>",
  "github": "<Extract or infer github link if present>",
  "portfolio": "<Extract or infer portfolio link if present>",
  "targetRole": "<Extract or infer target role based on experience or job description>",
  "summary": "<Optimized professional summary paragraph>",
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<dates>",
      "bullets": [
        "<optimized resume bullet starting with an action verb, highlighting impact/metrics>",
        ...
      ]
    }
  ],
  "projects": [
    {
      "name": "<project name>",
      "description": "<short project description>",
      "liveLink": "<optional live link or empty>",
      "githubLink": "<optional github link or empty>",
      "bullets": [
        "<optimized bullet point describing the technical implementation and outcome>",
        ...
      ]
    }
  ],
  "education": [
    { "institution": "...", "degree": "...", "year": "..." }
  ],
  "skills": ["<skill1>", "<skill2>"]
}

Ensure the output is ONLY the JSON object, with no markdown wrappers or extra text. Make the language strong, professional, and action-oriented.`;

    const response = await getOptimizationResponse(prompt);

    const content = response.choices[0]?.message?.content || '';
    const result = JSON.parse(extractJsonObject(content));

    return { success: true, optimizedResume: result };

  } catch (error) {
    console.error('Error optimizing resume:', error);
    return { error: 'Failed to optimize resume. Please try again.' };
  }
}
