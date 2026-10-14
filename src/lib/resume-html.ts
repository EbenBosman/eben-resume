import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';

const resumePath = path.join(process.cwd(), 'src', 'data', 'resume.json');
const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.hbs');

// Plain-string replace (not a RegExp), so arguments like '.com' match literally.
handlebars.registerHelper('replace', (str: string, toReplace: string, replaceWith: string) =>
  str ? str.split(toReplace).join(replaceWith) : '',
);

let cached: Promise<string> | null = null;

async function render(): Promise<string> {
  const [resumeData, templateSource] = await Promise.all([
    fs.promises.readFile(resumePath, 'utf8'),
    fs.promises.readFile(templatePath, 'utf8'),
  ]);
  return handlebars.compile(templateSource)(JSON.parse(resumeData));
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
