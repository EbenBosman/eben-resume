import React from 'react';

import { Decode } from './Motion';

interface SectionHeadProps {
  /** Static HUD label, rendered as `// LABEL` (e.g. "EXPERIENCE.07"). */
  eyebrow: string;
  title: string;
  id?: string;
}

/** Cesium section heading: a `//` eyebrow in Electrolize above a bold display h2. */
export const SectionHead: React.FC<SectionHeadProps> = ({ eyebrow, title, id }) => (
  <div className="mb-10">
    <div className="t-eyebrow">
      <Decode text={`// ${eyebrow}`} />
    </div>
    <h2 id={id} className="t-h2 mt-2">
      {title}
    </h2>
  </div>
);

/** Zero-padded HUD counter: 7 → "07". */
export const pad2 = (n: number) => String(n).padStart(2, '0');
