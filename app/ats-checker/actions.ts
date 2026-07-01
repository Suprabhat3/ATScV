'use server'

import { aiClient, AI_MODEL } from '@/utils/ai/openai';
import { extractPdfText } from '@/lib/pdf/extract-text';

const MAX_RESUME_CHARS = 9000;

async function getAtsResponse(prompt: string) {
  return await aiClient.chat.completions.create({
    model: AI_MODEL,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
    max_completion_tokens: 3600,
    response_format: { type: 'json_object' },
  });
}

export async function analyzeResume(formData: FormData) {
  try {
    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!resumeFile || !jobDescription) {
      return { error: 'Both resume and job description are required.' };
    }

    let resumeText = '';
    try {
      resumeText = await extractPdfText(resumeFile);
    } catch (error) {
      console.error('PDF extraction failed in analyzeResume:', error);
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

    const prompt = `You are an expert ATS (Applicant Tracking System) Analyzer and Recruiter. 
Analyze the original resume against the provided Job Description.

Job Description:
${jobDescription}

Resume Text:
${compactResumeText}

Score the resume across these 4 sub-categories, each out of 100, then compute the overall "score" as the weighted average using these weights: keywordMatch 40%, quantifiedImpact 25%, formatting 20%, lengthAndDensity 15%.

- keywordMatch: How well the resume's skills/tools/responsibilities align with keywords, technologies, and requirements explicitly stated in the job description.
- quantifiedImpact: How much of the experience/projects content uses strong action verbs and quantifies results (numbers, %, time saved, scale, revenue, users, etc.) versus vague descriptions.
- formatting: Likely ATS parseability - standard section headers, no tables/columns/graphics that break parsing, consistent dates, simple bullet structure, contact info present.
- lengthAndDensity: Whether the resume length and content density is appropriate (not too sparse, not overloaded, ideally fits 1 page for <10 years experience).

Provide an evaluation in valid JSON format only, with the following structure:
{
  "score": <number between 0 and 100, weighted average of the 4 sub-scores below>,
  "feedback": "<A few sentences of constructive feedback on how well it matches>",
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "matchingKeywords": ["<keyword3>", "<keyword4>"],
  "subScores": {
    "keywordMatch": { "score": <0-100>, "note": "<one concise sentence explaining this sub-score>" },
    "quantifiedImpact": { "score": <0-100>, "note": "<one concise sentence explaining this sub-score>" },
    "formatting": { "score": <0-100>, "note": "<one concise sentence explaining this sub-score>" },
    "lengthAndDensity": { "score": <0-100>, "note": "<one concise sentence explaining this sub-score>" }
  }
}

Ensure the output is ONLY the JSON object, with no markdown code blocks or extra text wrapper.`;

    const response = await getAtsResponse(prompt);

    const content = response.choices[0]?.message?.content || '';
    
    // Attempt to parse JSON (handling potential markdown wrapper if model ignores instruction)
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const result = JSON.parse(jsonStr.trim());

    return { success: true, analysis: result };

  } catch (error) {
    console.error('Error analyzing resume:', error);
    return { error: 'Failed to analyze resume. Please try again.' };
  }
}
