import { ProgrammeItem } from "../types";

export const programme: ProgrammeItem[] = [
  {
    time: "18h00",
    title: "Ouverture Officielle",
    description:
      "Dans un monde en transformation rapide, le leadership ne se définit plus par le genre, mais par la vision. Innovation, Responsabilité, Accès aux opportunités.",
    type: "opening",
  },
  {
    time: "18h15 - 19h00",
    title: "Table Ronde : Demain se code aujourd'hui",
    description:
      "Échange autour de la vision, de la création et des leviers concrets pour construire le futur dès maintenant.",
    speakers: ["El Mehdi NAAINIAA", "Kévin Polossat", "Mélissa Sari"],
    type: "panel",
  },
  {
    time: "19h05 - 19h50",
    title: "Table Ronde : L'ambition sans limites",
    description:
      "Discussion inspirante sur l'ambition, le passage à l'action et l'impact sans plafond dans les parcours tech et business.",
    speakers: ["Laura Hassan", "Audrey Ludivine Baha Wognou", "Luc Olivier Yebga"],
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
