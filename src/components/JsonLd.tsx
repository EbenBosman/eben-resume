import React from 'react';
import resume from '../data/resume.json';

export const JsonLd: React.FC = () => {
	const data = resume;

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: data.basics.name,
		jobTitle: data.basics.position,
		url: `https://${data.basics.website}`,
		email: data.basics.business_email,
		telephone: data.basics.phone,
		address: {
			'@type': 'PostalAddress',
			addressLocality: data.basics.location,
		},
		sameAs: [
			data.basics.social.github,
			data.basics.social.linkedIn,
			data.basics.social.stackOverflow,
		],
		knowsAbout: data.skills.flatMap((s) => s.Items),
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
		/>
	);
};
