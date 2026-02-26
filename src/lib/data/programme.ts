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
      "Keynote inspirante sur le leadership et l'innovation dans le paysage technologique et éducatif actuel, par la Directrice Générale d'Epitech.",
    speakers: ["Laura Hassan"],
    type: "talk",
  },
  {
    time: "18h50",
    title: "Table Ronde : Leadership, innovation et responsabilité dans la tech",
    description:
      "Un échange riche avec des intervenants de X-HEC Entrepreneurs, Allianz Technology, Epitech, Microsoft et New Deal Founders autour des enjeux du leadership et de l'innovation responsable.",
    speakers: [
      "Audrey L. Baha Wognou",
      "El Mehdi Naainiaa",
      "Laura Hassan",
      "Mélissa Sari",
      "Luc Olivier Yebga",
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
