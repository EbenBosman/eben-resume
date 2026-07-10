import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';

async function generatePdf(): Promise<Uint8Array<ArrayBuffer>> {
  // Read data and template
  const resumePath = path.join(process.cwd(), 'src', 'data', 'resume.json');
  const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.hbs');

  const resumeData = await fs.promises.readFile(resumePath, 'utf8');
  const templateSource = await fs.promises.readFile(templatePath, 'utf8');

  // Compile template
  handlebars.registerHelper('replace', (str, toReplace, replaceWith) => {
    return str ? str.replace(new RegExp(toReplace, 'g'), replaceWith) : '';
  });

  const template = handlebars.compile(templateSource);
  const data = JSON.parse(resumeData);
  const htmlString = template(data);

  // On Heroku, PUPPETEER_EXECUTABLE_PATH points at the chrome-for-testing
  // buildpack's Chrome. Locally it is unset, so Puppeteer uses its own
  // bundled Chromium. --no-sandbox is required on Heroku dynos.
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
  });

  try {
    const page = await browser.newPage();
    // Template is fully self-contained (no external fonts/images), so 'load' is enough.
    await page.setContent(htmlString, { waitUntil: 'load' });
    // Printer-safe margins on every page (Puppeteer otherwise prints with zero
    // margins). Keep in sync with the template's @page rule.
    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.5in', left: '0.55in', right: '0.55in' },
    });
    // Copy into an ArrayBuffer-backed Uint8Array. `new Uint8Array(length)` is
    // unambiguously Uint8Array<ArrayBuffer>, a valid BodyInit — avoids the
    // Uint8Array<ArrayBufferLike> vs BodyInit mismatch under @types/node 24 / TS 6.
    const out = new Uint8Array(pdfBuffer.length);
    out.set(pdfBuffer);
    return out;
  } finally {
    await browser.close();
  }
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
      'Content-Disposition': `attachment; filename="Resume of Eben Bosman (${formattedDate}).pdf"`,
    },
  });
}

// GET so the browser can fetch the PDF via a normal navigation/link. This works
// reliably on mobile (iOS Safari/Android), where the previous client-side
// file-saver + blob download did not. POST kept for backward compatibility.
export async function GET() {
  try {
    return pdfResponse(await generatePdf());
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  }
}

export async function POST() {
  return GET();
}
