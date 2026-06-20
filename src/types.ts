export interface StatItem {
  value: string;
  label: string;
}

export interface DiagnosticStep {
  id: string;
  name: string;
  details: string;
  radius: number;
  angleOffset: number;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
}

export interface ServiceCard {
  id: string;
  title: string;
  badge: string;
  image: string;
}

export interface ScienceStep {
  id: number;
  label: string;
  description: string;
}

export interface AdvantageItem {
  id: string;
  index: string;
  title: string;
  description: string;
  tags?: string[];
}

export interface WebinarItem {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface HistoryYear {
  year: number;
  title: string;
  description: string;
  image: string;
}
