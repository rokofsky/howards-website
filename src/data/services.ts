import type { L } from "./serviceDetails";

export interface ServiceItem {
  id: string;
  title: L;
  subtitle: L;
  hook: L;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: { en: "Presentation & Speaking Skills Training", cs: "Trénink prezentačních a řečnických dovedností" }, subtitle: { en: "Speak like a pro and own the room", cs: "Mluvte jako profík a ovládněte sál" }, hook: { en: "\n", cs: "\n" }, slug: "presentation-speaking-skills" },
  { id: "2", title: { en: "Live Webinar Sessions", cs: "Živé webináře" }, subtitle: { en: "So many to choose from!", cs: "Z čeho si vybrat!" }, hook: { en: "", cs: "" }, slug: "online-webinars" },
  { id: "3", title: { en: "The Six Hats Method", cs: "Metoda Šesti klobouků" }, subtitle: { en: "Stop wasting time. Turn every meeting into actionable decisions.", cs: "Přestaňte ztrácet čas. Proměňte každou poradu v rozhodnutí, která se dají realizovat." }, hook: { en: "\n", cs: "\n" }, slug: "meetings-moderation" },
  { id: "4", title: { en: "Conflict Mediation /Resolution", cs: "Mediace a řešení konfliktů" }, subtitle: { en: "Turn battles into breakthroughs", cs: "Proměňte boje v průlomy" }, hook: { en: "\n", cs: "\n" }, slug: "conflict-resolution" },
  { id: "5", title: { en: "Brainstorming Sessions", cs: "Brainstormingové workshopy" }, subtitle: { en: "Where ideas go to multiply", cs: "Místo, kde se nápady množí" }, hook: { en: "\n", cs: "\n" }, slug: "brainstorming-sessions" },
  { id: "6", title: { en: "The Art of Storytelling", cs: "Umění vyprávění příběhů" }, subtitle: { en: "Facts tell, stories sell", cs: "Fakta informují, příběhy prodávají" }, hook: { en: "\n", cs: "\n" }, slug: "storytelling" },
  { id: "7", title: { en: "Individual Coaching Sessions", cs: "Individuální koučovací sezení" }, subtitle: { en: "", cs: "" }, hook: { en: "Explore new angles and discover new options", cs: "Objevte nové úhly pohledu a nové možnosti" }, slug: "communication-skills" },
  { id: "8", title: { en: "Negotiation Representation", cs: "Vyjednávání jako zástupce" }, subtitle: { en: "Need an advantage? Benefit from Howard's edge", cs: "Potřebujete výhodu? Využijte Howardovu zkušenost" }, hook: { en: "\n", cs: "\n" }, slug: "negotiation-skills" },
  { id: "9", title: { en: "Keynote Speaking", cs: "Školení komunikace pro týmy" }, subtitle: { en: "Events that resonate for your guests", cs: "Akce, které ve vašich hostech rezonují" }, hook: { en: "\n", cs: "\n" }, slug: "keynote-speaking" },
];
