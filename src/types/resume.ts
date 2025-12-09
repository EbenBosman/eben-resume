export interface Social {
	github: string;
	stackOverflow: string;
	linkedIn: string;
}

export interface Basics {
	name: string;
	position: string;
	gender: string;
	birthDate: string;
	firstWorkYear: number;
	label: string;
	email: string;
	phone: string;
	website: string;
	location: string;
	social: Social;
}

export interface WorkItem {
	company: string;
	position: string;
	website: string;
	startDate: string;
	endDate: string;
	location: string;
	summary: string;
	highlights: string[];
}

export interface EducationItem {
	what: string;
	where: string;
	when: number;
	courses: string[];
}

export interface SkillItem {
	Title: string;
	Items: string[];
}

export interface ReferenceItem {
	name: string;
	reference: string;
}

export interface ResumeData {
	basics: Basics;
	about: string[];
	work: WorkItem[];
	education: EducationItem[];
	skills: SkillItem[];
	references: ReferenceItem[];
}
