// Short browser-tab titles per service slug, by language.
export const serviceShortTitles: Record<string, { en: string; cs: string }> = {
  "presentation-speaking-skills": { en: "Presentation Skills", cs: "Prezentační dovednosti" },
  "live-webinars": { en: "Webinars", cs: "Webináře" },
  "six-hats": { en: "Six Hats", cs: "Šest klobouků" },
  "conflict-resolution": { en: "Conflict Mediation", cs: "Mediace konfliktů" },
  "brainstorming-sessions": { en: "Brainstorming", cs: "Brainstorming" },
  "storytelling": { en: "Storytelling", cs: "Storytelling" },
  "communication-skills": { en: "Coaching", cs: "Koučink" },
  "negotiation-skills": { en: "Negotiation Representation", cs: "Vyjednávací zastoupení" },
  "keynote-speaking": { en: "Communication Training", cs: "Školení komunikace" },
};

export function getServiceShortTitle(slug: string, isCz: boolean): string | null {
  const entry = serviceShortTitles[slug];
  if (!entry) return null;
  return isCz ? entry.cs : entry.en;
}
