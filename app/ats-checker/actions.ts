'use server'

import { aiClient } from '@/utils/ai/gemini';

export async function analyzeResume(formData: FormData) {
  try {
    const resumeFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!resumeFile || !jobDescription) {
      return { error: 'Both resume and job description are required.' };
    }

    // Extract text from PDF
    const { PDFParse } = await import('pdf-parse');
    const arrayBuffer = await resumeFile.arrayBuffer();
    const pdf = new PDFParse({ data: new Uint8Array(arrayBuffer) });
    let resumeText = '';
    try {
      const pdfData = await pdf.getText();
      resumeText = pdfData.text ?? '';
    } finally {
      await pdf.destroy();
    }

    if (!resumeText.trim()) {
      return { error: 'Could not extract text from the provided PDF.' };
    }

    const prompt = `You are an expert ATS (Applicant Tracking System) Analyzer and Recruiter. 
Analyze the original resume against the provided Job Description.

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Provide an evaluation in valid JSON format only, with the following structure:
{
  "score": <number between 0 and 100>,
  "feedback": "<A few sentences of constructive feedback on how well it matches>",
  "missingKeywords": ["<keyword1>", "<keyword2>"],
  "matchingKeywords": ["<keyword3>", "<keyword4>"]
}

Ensure the output is ONLY the JSON object, with no markdown code blocks or extra text wrapper.`;

    const response = await aiClient.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2, // Low temperature for deterministic/analytical response
    });

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
