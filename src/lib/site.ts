import resume from '../data/resume.json';

// Public origin of the site, derived from resume.json so the PDF link, JSON-LD and page metadata agree.
export const SITE_URL = `https://${resume.basics.website}`;
