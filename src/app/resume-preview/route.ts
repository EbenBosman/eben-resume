import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

export async function GET() {
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
		const htmlString = template(JSON.parse(resumeData));

		return new NextResponse(htmlString, {
			status: 200,
			headers: {
				'Content-Type': 'text/html',
			},
		});
	} catch (error) {
		console.error('Error generating preview:', error);
		return new NextResponse('Error generating preview', { status: 500 });
	}
}
