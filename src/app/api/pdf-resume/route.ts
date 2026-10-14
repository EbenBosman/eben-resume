import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

import { renderResumeHtml } from '../../../lib/resume-html';

// Upper bound for each Chrome step, so a hung browser can't pin a request (and the dyno) forever.
const STEP_TIMEOUT_MS = 30_000;

async function generatePdf(): Promise<Uint8Array<ArrayBuffer>> {
  const htmlString = await renderResumeHtml();

  // On Heroku, PUPPETEER_EXECUTABLE_PATH points at the chrome-for-testing
  // buildpack's Chrome. Locally it is unset, so Puppeteer uses its own
  // bundled Chromium. --no-sandbox is required on Heroku dynos.
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    timeout: STEP_TIMEOUT_MS,
  });

  try {
    const page = await browser.newPage();
    // Template is fully self-contained (no external fonts/images), so 'load' is enough.
    await page.setContent(htmlString, { waitUntil: 'load', timeout: STEP_TIMEOUT_MS });
    // Printer-safe margins on every page (Puppeteer otherwise prints with zero
    // margins). Keep in sync with the template's @page rule.
    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.55in', right: '0.55in' },
      timeout: STEP_TIMEOUT_MS,
    });
    // Copy into an ArrayBuffer-backed Uint8Array. `new Uint8Array(length)` is
    // unambiguously Uint8Array<ArrayBuffer>, a valid BodyInit — avoids the
    // Uint8Array<ArrayBufferLike> vs BodyInit mismatch under @types/node / TS 6.
    const out = new Uint8Array(pdfBuffer.length);
    out.set(pdfBuffer);
    return out;
  } finally {
    await browser.close();
  }
}

// The PDF only changes on deploy, so production builds it once per process and every request
// (including concurrent ones) shares that single Chrome run. A failed run is not cached.
let cachedPdf: Promise<Uint8Array<ArrayBuffer>> | null = null;

function getPdf(): Promise<Uint8Array<ArrayBuffer>> {
  if (process.env.NODE_ENV !== 'production') return generatePdf();
  cachedPdf ??= generatePdf().catch((error) => {
    cachedPdf = null;
    throw error;
  });
  return cachedPdf;
}

function pdfResponse(body: Uint8Array<ArrayBuffer>): NextResponse {
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      // Browsers/proxies must revalidate, so a new deploy's PDF is always what gets downloaded.
      'Cache-Control': 'no-cache',
      'Content-Disposition': `attachment; filename="Resume of Eben Bosman (${formattedDate}).pdf"`,
    },
  });
}

// GET so the browser can fetch the PDF via a normal navigation/link. This works
// reliably on mobile (iOS Safari/Android), where the previous client-side
// file-saver + blob download did not. POST kept for backward compatibility.
export async function GET() {
  try {
    return pdfResponse(await getPdf());
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}

export async function POST() {
  return GET();
}
