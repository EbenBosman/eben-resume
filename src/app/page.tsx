import type { Metadata } from 'next';

import { ContactProvider } from '../components/contact/ContactProvider';
import AtaruSection from '../components/content/AtaruSection';
import Education from '../components/content/Education';
import Experience from '../components/content/Experience';
import Hero from '../components/content/Hero';
import Profile from '../components/content/Profile';
import Skills from '../components/content/Skills';
import Footer from '../components/Footer';
import { HeroFocusGuard, RevealObserver } from '../components/hud/Motion';
import { JsonLd } from '../components/JsonLd';
import { TopNav } from '../components/TopNav';
import resume from '../data/resume.json';
import { ResumeData } from '../types/resume';

// Resolved against metadataBase, so every host (herokuapp, bare domain) points at the www origin.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function Page() {
  const data = resume as ResumeData;
  const [lead, ...profile] = data.about;

  return (
    <ContactProvider>
      <JsonLd />
      <TopNav name={data.basics.name} />
      <main id="main" style={{ paddingTop: 'var(--nav-h)' }}>
        <Hero basics={data.basics} lead={lead} />
        {/* On large screens this sheet slides up over the pinned hero (.over-hero). */}
        <div className="over-hero">
          <Profile basics={data.basics} paragraphs={profile} />
          <AtaruSection content={data.ataru} />
          <Education content={data.education} />
          <Experience content={data.work} />
          <Skills content={data.skills} />
        </div>
      </main>
      <RevealObserver />
      <HeroFocusGuard heroId="about" />
      <Footer basics={data.basics} />
    </ContactProvider>
  );
}
