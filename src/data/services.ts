import type { L } from "./serviceDetails";

export interface ServiceItem {
  id: string;
  title: L;
  subtitle: L;
  hook: L;
  slug: string;
}

export const services: ServiceItem[] = [
  {
    id: "1",
    title: { en: "Presentation & speaking skills", cs: "Trénink prezentačních a řečnických dovedností" },
    subtitle: { en: "speak like a pro and own the room", cs: "Mluvte jako profík a ovládněte sál" },
    hook: { en: "\n", cs: "\n" },
    slug: "presentation-speaking-skills",
  },
  {
    id: "2",
    title: { en: "Live Webinars", cs: "Živé webináře" },
    subtitle: { en: "choose from a wide range of useful topics", cs: "Z čeho si vybrat!" },
    hook: { en: "", cs: "" },
    slug: "live-webinars",
  },
  {
    id: "3",
    title: { en: "Six Hats for meetings", cs: "Metoda Šesti klobouků pro porady" },
    subtitle: {
      en: "much faster meetings with actionable decisions",
      cs: "Přestaňte ztrácet čas. Proměňte každou poradu v rozhodnutí, která se dají realizovat.",
    },
    hook: { en: "\n", cs: "\n" },
    slug: "six-hats",
  },
  {
    id: "4",
    title: { en: "Conflict Mediation /Resolution", cs: "Mediace a řešení konfliktů" },
    subtitle: { en: "turn battles into breakthroughs", cs: "Proměňte boje v průlomy" },
    hook: { en: "\n", cs: "\n" },
    slug: "conflict-resolution",
  },
  {
    id: "5",
    title: { en: "Brainstorming Sessions", cs: "Brainstormingové workshopy" },
    subtitle: { en: "where ideas go to multiply", cs: "Místo, kde se nápady množí" },
    hook: { en: "\n", cs: "\n" },
    slug: "brainstorming-sessions",
  },
  {
    id: "6",
    title: { en: "The Art of Storytelling", cs: "Umění vyprávění příběhů" },
    subtitle: { en: "facts tell, stories sell", cs: "Fakta informují, příběhy prodávají" },
    hook: { en: "\n", cs: "\n" },
    slug: "storytelling",
  },
  {
    id: "7",
    title: { en: "Individual Coaching Sessions", cs: "Individuální koučovací sezení" },
    subtitle: { en: "", cs: "" },
    hook: { en: "explore new angles, discover new options", cs: "Objevte nové úhly pohledu a nové možnosti" },
    slug: "coaching-sessions",
  },
  {
    id: "8",
    title: { en: "Negotiation Representation", cs: "Vyjednávání jako zástupce" },
    subtitle: {
      en: "need an advantage? \ntake Howard's edge with you",
      cs: "Potřebujete výhodu? Využijte Howardovu zkušenost",
    },
    hook: { en: "\n", cs: "\n" },
    slug: "negotiation-representation",
  },
  {
    id: "9",
    title: { en: "Intercultural communication training", cs: "Školení komunikace pro týmy" },
    subtitle: {
      en: "when you're dealing with people from all over the world",
      cs: "Akce, které ve vašich hostech rezonují",
    },
    hook: { en: "\n", cs: "\n" },
    slug: "intercultural-communication",
  },
];
