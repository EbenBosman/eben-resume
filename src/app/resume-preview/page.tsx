import type { Metadata } from 'next';

import { renderResumeHtml } from '../../lib/resume-html';

export const metadata: Metadata = {
  title: 'Eben Bosman | Resume',
  robots: {
    index: false,
    follow: false,
  },
};

async function getResumeContent() {
  const html = await renderResumeHtml();

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
				@media screen {
					.resume-scope .page-container {
						width: 215.9mm !important; /* 8.5in */
						min-height: 279.4mm !important; /* 11in */
						/* Mirror the PDF's @page margins so the on-screen sheet matches print */
						padding: 0.5in 0.55in !important;
					}
				}
			`,
        }}
      />

      {/* Render content inside a scoped wrapper */}
      <div className="resume-scope" dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </>
  );
}
