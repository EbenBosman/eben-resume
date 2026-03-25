import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

async function getResumeContent() {
    const resumePath = path.join(process.cwd(), 'src', 'data', 'resume.json');
    const templatePath = path.join(process.cwd(), 'src', 'templates', 'template.hbs');

    const resumeData = await fs.promises.readFile(resumePath, 'utf8');
    const templateSource = await fs.promises.readFile(templatePath, 'utf8');

    handlebars.registerHelper('replace', (str, toReplace, replaceWith) => {
        return str ? str.replace(new RegExp(toReplace, 'g'), replaceWith) : '';
    });

    const template = handlebars.compile(templateSource);

    // Read Ataru logo as base64 for embedding
    const logoPath = path.join(process.cwd(), 'src', 'images', 'fav-sm.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');

    const data = JSON.parse(resumeData);
    data.ataruLogoBase64 = `data:image/png;base64,${logoBase64}`;

    const html = template(data);

    // Extract Styles
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    let styles = styleMatch ? styleMatch[1] : '';

    // Extract Body Content (everything inside body tags)
    const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);
    const bodyContent = bodyMatch ? bodyMatch[1] : '';

    // Scope global selectors to our wrapper to prevent leaking into layout
    styles = styles.replace(/\*\s*\{/g, '.resume-scope * {');
    styles = styles.replace(/(?:body|html)\s*\{/g, '.resume-scope {');

    return { styles, bodyContent };
}

export default async function ResumeLetterPage() {
    const { styles, bodyContent } = await getResumeContent();

    return (
        <>
            {/* Inject extracted styles */}
            <style dangerouslySetInnerHTML={{ __html: styles }} />

            {/* Override for US Letter Size in Preview Mode */}
            <style dangerouslySetInnerHTML={{
                __html: `
				@media screen {
					.resume-scope .page-container {
						width: 215.9mm !important; /* 8.5in */
						min-height: 279.4mm !important; /* 11in */
                        /* Container styling is already in HBS for screen, but we ensure overrides here */
					}
				}
			`}} />

            {/* Render content inside a scoped wrapper */}
            <div
                className="resume-scope"
                dangerouslySetInnerHTML={{ __html: bodyContent }}
            />
        </>
    );
}
