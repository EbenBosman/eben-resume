import Content from '../components/Content';
import { JsonLd } from '../components/JsonLd';
import Sidebar from '../components/Sidebar';
import resume from '../data/resume.json';
import { ResumeData } from '../types/resume';

export default function Page() {
  // Cast strict type
  const data = resume as ResumeData;

  return (
    <div className="w-full min-h-screen bg-background">
      <JsonLd />
      <div className="flex flex-col md:flex-row min-h-screen">
        <Sidebar basics={data.basics} />
        <Content
          basics={data.basics}
          about={data.about}
          ataru={data.ataru}
          work={data.work}
          education={data.education}
          skills={data.skills}
        />
      </div>
    </div>
  );
}
