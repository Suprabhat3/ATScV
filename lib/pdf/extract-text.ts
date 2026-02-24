'use server';

import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { unlink, writeFile } from 'node:fs/promises';

async function extractWithLangChain(file: File): Promise<string> {
  const { PDFLoader } = await import(
    '@langchain/community/document_loaders/fs/pdf'
  );

  const arrayBuffer = await file.arrayBuffer();
  const tempPdfPath = join(tmpdir(), `resume-${randomUUID()}.pdf`);

  try {
    await writeFile(tempPdfPath, Buffer.from(arrayBuffer));

    const loader = new PDFLoader(tempPdfPath, { splitPages: false });
    const docs = await loader.load();
    return docs.map((doc) => doc.pageContent).join('\n\n').trim();
  } finally {
    await unlink(tempPdfPath).catch(() => undefined);
  }
}

async function extractWithPdfParse(file: File): Promise<string> {
  const { PDFParse } = await import('pdf-parse');
  const arrayBuffer = await file.arrayBuffer();
  const pdf = new PDFParse({ data: new Uint8Array(arrayBuffer) });

  try {
    const pdfData = await pdf.getText();
    return (pdfData.text ?? '').trim();
  } finally {
    await pdf.destroy();
  }
}

export async function extractPdfText(file: File): Promise<string> {
  try {
    const langChainText = await extractWithLangChain(file);
    if (langChainText) return langChainText;
  } catch (error) {
    console.error('LangChain PDF extraction failed:', error);
  }

  const fallbackText = await extractWithPdfParse(file);
  if (!fallbackText) {
    throw new Error('Unable to extract text from PDF.');
  }

  return fallbackText;
}
