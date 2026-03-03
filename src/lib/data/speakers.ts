import { Speaker } from "../types";

export const speakers: Speaker[] = [
  {
    id: "1",
    slug: "laura-hassan",
    name: "Laura Hassan",
    title: "Directrice Générale d'Epitech",
    company: "Epitech",
    bio: "Laura Hassan est Directrice Générale d'Epitech, école d'informatique de référence du Groupe IONIS. Titulaire d'un Master en Ingénierie Pédagogique de CY Cergy Paris Université et doctorante à l'Université Paris-Est Créteil, elle conjugue expertise académique et vision stratégique. Après avoir rejoint le Groupe IONIS en 2018, elle a pris la direction d'Epitech Digital School en 2022 avant de diriger l'ensemble d'Epitech. Passionnée par l'innovation pédagogique et la transformation numérique, elle œuvre à former les talents tech de demain.",
    image: "/images/speakers/Laura-Hassan.jpg",
    topic: "Leadership & Innovation dans l'éducation tech",
    linkedin: "https://www.linkedin.com/in/laura-hassan",
  },
  {
    id: "2",
    slug: "melissa-sari",
    name: "Mélissa Sari",
    title: "Customer Engineer",
    company: "Microsoft",
    bio: "Mélissa Sari est Customer Engineer chez Microsoft France, experte sur les sujets Power Platform et IA. Diplômée du Groupe IONIS, elle accompagne les entreprises dans leur transformation cloud et digitale. Finaliste des Women Role Model Awards de Microsoft France dans la catégorie « Femme engagée », elle est reconnue pour son implication en faveur de la diversité et de l'inclusion dans la tech. Récompensée par le Microsoft Gold Club Award et distinguée CSU Top Performer, elle incarne l'excellence et le leadership au quotidien.",
    image: "/images/speakers/melissa-sari.jpg",
    topic: "Power Platform, IA & diversité dans la tech",
    linkedin: "https://www.linkedin.com/in/sarimelissa",
  },
  {
    id: "3",
    slug: "el-mehdi-naainiaa",
    name: "El Mehdi NAAINIAA",
    title: "Responsable transformation digitale – IA",
    company: "Allianz Technology",
    bio: "El Mehdi NAAINIAA est responsable de la transformation digitale autour de l’IA et des interactions digitales chez Allianz Technology pour Allianz Partners. Il intervient sur des enjeux de transformation à l’échelle des organisations, en contribuant aux choix structurants, à la définition des trajectoires et aux cadres de gouvernance permettant de faire de l’IA un levier durable de performance et de création de valeur.\n\nSon parcours s’inscrit dans un environnement international. Diplômé d’une école d’ingénieur, il a suivi des formations exécutives à Sciences Po, à la London School of Economics, ainsi que INSEAD Executive Education – “Transforming Your Business with AI”. Il se positionne comme un praticien de la transformation, orienté leadership, passage à l’échelle et impact business.",
    image: "/images/speakers/mehdi-final.jpg",
    topic: "IA et transformation digitale",
    linkedin: "https://www.linkedin.com/in/elmehdinaainiaaitgouvernanceaidata",
  },
  {
    id: "4",
    slug: "audrey-ludivine-baha-wognou",
    name: "Audrey Ludivine Baha Wognou",
    title: "Co-fondatrice de Nofey & Ingénieure",
    company: "X-HEC Entrepreneurs",
    bio: "Audrey Ludivine Baha Wognou est ingénieure et entrepreneure, co-fondatrice de Nofey. Issue de formations d'excellence — Polytechnique et HEC Paris — elle a été accompagnée par Station F et évolue au sein de l'écosystème X-HEC Entrepreneurs. Son parcours illustre la convergence entre excellence technique, entrepreneuriat et innovation. Elle est engagée pour la promotion des talents dans la tech et l'accompagnement de la nouvelle génération de leaders.",
    image: "/images/speakers/audrey-final.jpg",
    topic: "Entrepreneuriat, compétence et ambition",
    linkedin: "https://www.linkedin.com/in/audrey-ludivine-baha-wognou",
  },
  {
    id: "5",
    slug: "luc-olivier-yebga",
    name: "Luc Olivier Yebga",
    title: "Fondateur et Directeur de la stratégie",
    company: "New Deal Founders",
    bio: "Luc Olivier Yebga est un expert en finance et entrepreneur. Après des études en finance et un parcours au sein d'institutions comme la Deutsche Bank, EY, ou encore en M&A chez Rothschild & Cie, il a choisi la voie de l'entrepreneuriat en fondant New Deal Founders. Aujourd'hui consultant stratégique, il dédie son expertise au secteur de la Fintech, tout en œuvrant pour démocratiser l'accès aux opportunités et inspirer une nouvelle génération de leaders.",
    image: "/images/speakers/luc-olivier-final.jpg",
    topic: "Finance, entrepreneuriat & accès aux opportunités",
    linkedin: "https://www.linkedin.com/in/luc-olivier-yebga",
  },
];

export function getSpeakerBySlug(slug: string): Speaker | undefined {
  return speakers.find((s) => s.slug === slug);
}

export function getAllSpeakerSlugs(): string[] {
  return speakers.map((s) => s.slug);
}
