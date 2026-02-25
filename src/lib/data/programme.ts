import { ProgrammeItem } from "../types";

export const programme: ProgrammeItem[] = [
  {
    time: "18h30",
    title: "Ouverture Officielle",
    description:
      "Dans un monde en transformation rapide, le leadership ne se définit plus par le genre, mais par la vision. Innovation, Responsabilité, Accès aux opportunités.",
    type: "opening",
  },
  {
    time: "18h40",
    title: "Intervention : Laura Hassan",
    description:
      "Keynote inspirante sur le leadership et l'innovation dans le paysage technologique actuel.",
    speakers: ["Laura Hassan"],
    type: "talk",
  },
  {
    time: "18h50",
    title: "Table Ronde : Leadership, innovation et responsabilité dans la tech",
    description:
      "Un échange riche avec des intervenants experts de Microsoft, Google, X-HEC Entrepreneurs et AXA autour des enjeux du leadership et de l'innovation responsable.",
    speakers: [
      "Expert Microsoft",
      "Expert Google",
      "Expert X-HEC",
      "Expert AXA",
    ],
    type: "panel",
  },
  {
    time: "20h00",
    title: "Networking Stratégique",
    description:
      "Ce soir, on ne vient pas seulement écouter. On vient créer des connexions utiles. Transformer l'inspiration en action.",
    type: "networking",
  },
];
