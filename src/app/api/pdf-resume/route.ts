import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import pdf from 'html-pdf-node';

export async function POST(req: Request) {
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

		// Read Ataru logo as base64 for PDF embedding
		const logoPath = path.join(process.cwd(), 'src', 'images', 'fav-sm.png');
		const logoBase64 = fs.readFileSync(logoPath).toString('base64');

		const data = JSON.parse(resumeData);
		data.ataruLogoBase64 = `data:image/png;base64,${logoBase64}`;

		const htmlString = template(data);

		const options = {
			format: 'A4',
			printBackground: true,
		};

		const file = {
			content: htmlString,
		};

		// Generate PDF
		// html-pdf-node uses promises
		const pdfBuffer = await pdf.generatePdf(file, options);

		return new NextResponse(pdfBuffer, {
			status: 200,
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=result.pdf',
			},
		});
	} catch (error) {
		console.error('Error generating PDF:', error);
		return new NextResponse('Error generating PDF', { status: 500 });
	}
}
