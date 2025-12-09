import React from 'react';
import { WorkItem } from '../../types/resume';

interface ExperienceProps {
	content: WorkItem[];
}

const generateSummaryParagraphs = (summary: string) => {
	if (!summary || summary.length <= 0) return;

	return <p className="mt-2 text-sm text-foreground">{summary}</p>;
};

const generateSummaryHighlights = (highlights: string[]) => {
	if (!highlights || highlights.length <= 0) return null;

	return (
		<ul className="list-disc list-inside mt-2 text-sm text-foreground">
			{highlights.map((highlight, key) => {
				return (
					<li key={key} className="mb-1">
						<span>{highlight}</span>
					</li>
				);
			})}
		</ul>
	);
};

const generateHeader = (website: string, company: string, position: string) => {
	return (
		<div className="flex flex-wrap items-baseline gap-2">
			<span className="font-bold text-lg text-foreground">{position}</span>
			{generateLink(website, company)}
		</div>
	);
};

const generateLink = (website: string, company: string) => {
	if (typeof website !== 'undefined' && website.includes('http'))
		return (
			<span className="text-sm text-muted">
				<small> at </small>
				<a
					className="text-primary hover:underline hover:text-primary-dark"
					rel="noreferrer"
					href={website}
					target="_blank"
				>
					<small>{company}</small>
				</a>
			</span>
		);

	return null;
};

import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { SectionTitle } from '../ui/SectionTitle';

// ... (existing helper functions: generateSummaryParagraphs, generateSummaryHighlights, generateHeader, generateLink)

const generateCard = (key: number, job: WorkItem) => {
	return (
		<div key={key} className="flex flex-wrap -mx-4 mb-4">
			<div className="w-full px-4" data-aos="zoom-in">
				<Card>
					<div className="flex flex-col h-full">
						<div className="mb-1">
							{generateHeader(job.website, job.company, job.position)}
						</div>
						<h5 className="text-md font-medium text-muted mb-2">
							{job.startDate} - {job.endDate}
						</h5>
						<div className="text-sm italic text-muted mb-2">
							{job.location}
						</div>
						{generateSummaryParagraphs(job.summary)}
						{generateSummaryHighlights(job.highlights)}
					</div>
				</Card>
			</div>
		</div>
	);
};

const Experience: React.FC<ExperienceProps> = ({ content }) => {
	if (!content) return null;

	return (
		<Section id="experience">
			<SectionTitle title="Experience" />
			{content.map((job, key) => generateCard(key, job))}
		</Section>
	);
};

export default Experience;
