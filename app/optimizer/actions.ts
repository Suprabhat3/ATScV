'use server'

import { aiClient } from '@/utils/ai/gemini';
import { extractPdfText } from '@/lib/pdf/extract-text';

const MAX_RESUME_CHARS = 12000;
const TARGET_RESUME_WORDS = '350-500';

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
  const models = ['gemini-3-flash-preview','gemini-2.5-flash'];
  let lastError: unknown = null;

  for (const model of models) {
    try {
      return await aiClient.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 3600,
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
      resumeText = await extractPdfText(resumeFile);
    } catch (error) {
      console.error('PDF extraction failed in optimizeResume:', error);
      return {
        error:
          'We could not read this PDF. Please upload a text-based PDF or export your resume again and try once more.',
      };
    }
    if (!resumeText.trim()) {
      return { error: 'Could not extract text from the provided PDF.' };
    }
    const normalizedResumeText = resumeText.replace(/\s+/g, ' ').trim();
    const compactResumeText = normalizedResumeText.slice(0, MAX_RESUME_CHARS);

    const prompt = `You are an expert Resume Writer and Career Coach. 
Optimize the following resume content to be ATS-friendly, impactful, and results-oriented.

${targetJob ? `TARGET JOB DESCRIPTION:
${targetJob}
=> INSTRUCTION: Heavily tailor the resume summary, skills, and bullet points to strategically emphasize keywords, tools, and requirements found in this job description without fabricating experience.` : ''}

Target Context / User Request:
${additionalContext || 'Make it general but highly professional and optimized for modern ATS systems.'}

Original Resume Text:
${compactResumeText}

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

Ensure the output is ONLY the JSON object, with no markdown wrappers or extra text. Make the language strong, professional, and action-oriented.

ONE-PAGE DENSITY REQUIREMENTS (IMPORTANT):
- Target total content length: approximately ${TARGET_RESUME_WORDS} words.
- Summary: 50-80 words.
- Experience: as per the orignal
- Projects: at least 2 entries.
- Skills: provide 8-10 relevant, ATS-friendly skills.

SPARSE-RESUME RULES:
- If the original resume has limited details, expand responsibly using the candidate's actual domain, tools, and responsibilities inferred from the source text and target job.
- Do not fabricate employers, degrees, dates, certifications, or exact metrics that are not supported by input.
- If needed, use safe section labels like "Relevant Experience" or "Selected Projects" and write outcome-focused bullets without fake claims.
- Prioritize completeness and readability so the final resume feels like a full one-page document. don't more then that `;

    const response = await getOptimizationResponse(prompt);

    const content = response.choices[0]?.message?.content || '';
    const result = JSON.parse(extractJsonObject(content));

    return { success: true, optimizedResume: result };

  } catch (error) {
    console.error('Error optimizing resume:', error);
    return { error: 'Failed to optimize resume. Please try again.' };
  }
}
