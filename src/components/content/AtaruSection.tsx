import React from 'react';
import Image from 'next/image';
import { Ataru } from '../../types/resume';

import { Section } from '../ui/Section';

import ataruLogo from '../../images/fav.png';

interface AtaruSectionProps {
	content: Ataru;
}

const AtaruSection: React.FC<AtaruSectionProps> = ({ content }) => {
	if (!content) return null;

	return (
		<Section id="ataru" className="bg-background-alt">
			<div className="max-w-4xl mx-auto">
				{/* Main layout: logo + content side by side on desktop, stacked on mobile */}
				<div className="flex flex-col md:flex-row items-center md:items-start gap-8">

					{/* Left: Logo + Branding */}
					<div className="flex flex-col items-center flex-shrink-0" data-aos="fade-right">
						<a href={content.url} target="_blank" rel="noopener noreferrer" className="transition-transform duration-200 hover:scale-105">
							<Image
								src={ataruLogo}
								alt="Ataru Logo"
								width={100}
								height={100}
								className="rounded-2xl shadow-lg"
								placeholder="blur"
							/>
						</a>
						<h3 className="text-3xl font-bold text-foreground mt-4 tracking-tight">
							{content.name}
						</h3>
						<span
							className="text-sm font-semibold tracking-[0.25em] mt-1"
							style={{ color: '#6d28d9' }}
						>
							{content.subtitle}
						</span>
					</div>

					{/* Right: Description */}
					<div className="flex-1 text-center md:text-left" data-aos="fade-left">

						{/* Tagline */}
						<p className="text-sm italic text-muted mb-4">{content.tagline}</p>

						{/* Summary paragraphs */}
						<div className="text-foreground space-y-3">
							{content.summary.map((paragraph, key) => (
								<p key={key}>{paragraph}</p>
							))}
						</div>

						{/* Feature pills */}
						<div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
							{content.features.map((feature, key) => (
								<span
									key={key}
									className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border border-border text-muted"
								>
									{feature}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</Section>
	);
};

export default AtaruSection;
