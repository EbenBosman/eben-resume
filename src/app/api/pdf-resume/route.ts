import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  let browser;
  try {
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
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    const page = await browser.newPage();
    await page.setContent(htmlString, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'letter', printBackground: true });

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=result.pdf',
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Error generating PDF', { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
