import React from 'react';
import { Basics } from '../../types/resume';

interface AboutProps {
	basics: Basics;
	about: string[];
}

const extractParagraphs = (about: string[]) => {
	return about.map((p, key) => {
		return <p key={key}>{p}</p>;
	});
};

import { Section } from '../ui/Section';

const About: React.FC<AboutProps> = ({ basics, about }) => {
	if (!about) return null;

	return (
		<Section id="about">
			<div className="flex flex-wrap">
				<div className="w-full">
					<h1 className="text-4xl font-light text-foreground mb-4">
						Hi, I&apos;m {basics.name}
					</h1>
				</div>
			</div>
			<div className="text-foreground space-y-4">
				{extractParagraphs(about)}
			</div>
		</Section>
	);
};

export default About;
