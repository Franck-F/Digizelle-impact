import { Speaker } from "../types";

// Placeholder speaker data — will be updated with real info later
export const speakers: Speaker[] = [
  {
    id: "1",
    slug: "laura-hassan",
    name: "Laura Hassan",
    title: "Intervenante Principale",
    company: "À confirmer",
    bio: "Intervenante principale du Digizelle Impact Event 2026. Plus de détails à venir.",
    image: "/images/speakers/placeholder.jpg",
    topic: "Leadership & Innovation",
  },
  {
    id: "2",
    slug: "speaker-microsoft",
    name: "Expert Microsoft",
    title: "Intervenant Table Ronde",
    company: "Microsoft",
    bio: "Expert de Microsoft participant à la table ronde sur le leadership, l'innovation et la responsabilité dans la tech.",
    image: "/images/speakers/placeholder.jpg",
    topic: "Leadership, innovation et responsabilité dans la tech",
  },
  {
    id: "3",
    slug: "speaker-google",
    name: "Expert Google",
    title: "Intervenant Table Ronde",
    company: "Google",
    bio: "Expert de Google participant à la table ronde sur le leadership, l'innovation et la responsabilité dans la tech.",
    image: "/images/speakers/placeholder.jpg",
    topic: "Leadership, innovation et responsabilité dans la tech",
  },
  {
    id: "4",
    slug: "speaker-axa",
    name: "Expert AXA",
    title: "Intervenant Table Ronde",
    company: "AXA",
    bio: "Expert d'AXA participant à la table ronde sur le leadership, l'innovation et la responsabilité dans la tech.",
    image: "/images/speakers/placeholder.jpg",
    topic: "Leadership, innovation et responsabilité dans la tech",
  },
  {
    id: "5",
    slug: "speaker-xhec",
    name: "Expert X-HEC",
    title: "Intervenant Table Ronde",
    company: "X-HEC Entrepreneurs",
    bio: "Expert de X-HEC Entrepreneurs participant à la table ronde.",
    image: "/images/speakers/placeholder.jpg",
    topic: "Leadership, innovation et responsabilité dans la tech",
  },
];

export function getSpeakerBySlug(slug: string): Speaker | undefined {
  return speakers.find((s) => s.slug === slug);
}

export function getAllSpeakerSlugs(): string[] {
  return speakers.map((s) => s.slug);
}
