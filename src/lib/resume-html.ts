import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

const resumePath = path.join(process.cwd(), 'src', 'data', 'resume.json');
const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.hbs');
const fontsDir = path.join(process.cwd(), 'src', 'templates', 'fonts');

// The Cesium brand faces, embedded as data URLs so the template stays self-contained and the PDF
// looks the same on every host (see src/templates/fonts/README.md).
const FONT_FACES = [
  { family: 'Ubuntu', weight: 400, file: 'ubuntu-latin-400-normal.woff2' },
  { family: 'Ubuntu', weight: 700, file: 'ubuntu-latin-700-normal.woff2' },
  { family: 'Electrolize', weight: 400, file: 'electrolize-latin-400-normal.woff2' },
];

// Plain-string replace (not a RegExp), so arguments like '.com' match literally.
handlebars.registerHelper('replace', (str: string, toReplace: string, replaceWith: string) =>
  str ? str.split(toReplace).join(replaceWith) : '',
);

let cached: Promise<string> | null = null;

async function fontFaceCss(): Promise<string> {
  const faces = await Promise.all(
    FONT_FACES.map(async ({ family, weight, file }) => {
      const data = await fs.promises.readFile(path.join(fontsDir, file));
      return `@font-face { font-family: '${family}'; font-weight: ${weight}; font-style: normal; src: url(data:font/woff2;base64,${data.toString('base64')}) format('woff2'); }`;
    }),
  );
  return faces.join('\n');
}

async function render(): Promise<string> {
  const [resumeData, templateSource, fontFaces] = await Promise.all([
    fs.promises.readFile(resumePath, 'utf8'),
    fs.promises.readFile(templatePath, 'utf8'),
    fontFaceCss(),
  ]);
  const html = handlebars.compile(templateSource)(JSON.parse(resumeData));
  // Prepend the embedded fonts to the template's single <style> (kept out of the .hbs itself).
  return html.replace('<style>', `<style>\n${fontFaces}\n`);
}

/**
 * The resume rendered through template.hbs: the single setup shared by the PDF route and
 * /resume-preview. resume.json and the template only change on deploy, so production renders
 * once per process; development re-renders every call so edits show up immediately.
 */
export function renderResumeHtml(): Promise<string> {
  if (process.env.NODE_ENV !== 'production') return render();
  cached ??= render().catch((error) => {
    cached = null;
    throw error;
  });
  return cached;
}
