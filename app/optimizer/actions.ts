'use server'

import { aiClient } from '@/utils/ai/gemini';

export async function optimizeResume(formData: FormData) {
  try {
    const resumeFile = formData.get('resume') as File | null;
    const targetJob = formData.get('targetJob') as string | null;
    const additionalContext = formData.get('context') as string | null;

    if (!resumeFile) {
      return { error: 'Please upload a resume to optimize.' };
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

    const response = await aiClient.chat.completions.create({
      model: 'gemini-3-flash-preview',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6, 
    });

    const content = response.choices[0]?.message?.content || '';
    
    let jsonStr = content.trim();
    if (jsonStr.startsWith('```json')) jsonStr = jsonStr.slice(7);
    if (jsonStr.startsWith('```')) jsonStr = jsonStr.slice(3);
    if (jsonStr.endsWith('```')) jsonStr = jsonStr.slice(0, -3);
    
    const result = JSON.parse(jsonStr.trim());

    return { success: true, optimizedResume: result };

  } catch (error) {
    console.error('Error optimizing resume:', error);
    return { error: 'Failed to optimize resume. Please try again.' };
  }
}
