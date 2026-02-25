export interface Speaker {
  id: string;
  slug: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  topic?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ProgrammeItem {
  time: string;
  title: string;
  description: string;
  speakers?: string[];
  type: "opening" | "talk" | "panel" | "networking" | "break";
}

export interface Sponsor {
  name: string;
  logo: string;
  url: string;
  tier: "strategic" | "gold" | "silver";
}

export interface Pillar {
  icon: string;
  title: string;
  description: string;
}
