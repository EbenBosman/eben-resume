import React from 'react';

export const metadata = {
  title: 'Eben Bosman | Resume',
};

export default function ResumeLetterLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-300 flex flex-col items-center justify-center p-2">
      <div className="shadow-lg">{children}</div>
    </main>
  );
}
