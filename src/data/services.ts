export interface ServiceItem {
  id: string;
  title: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Keynote Speaking", hook: "Leave them quoting you at dinner.", slug: "keynote-speaking" },
  { id: "2", title: "Team Workshops", hook: "Because trust falls are so 2005.", slug: "team-workshops" },
  { id: "3", title: "1-on-1 Coaching", hook: "Your personal leadership whisperer.", slug: "one-on-one-coaching" },
  { id: "4", title: "Storytelling Mastery", hook: "Facts tell, stories sell.", slug: "storytelling-mastery" },
  { id: "5", title: "Conflict Resolution", hook: "Turning battles into breakthroughs.", slug: "conflict-resolution" },
  { id: "6", title: "Presentation Skills", hook: "Death to death-by-PowerPoint.", slug: "presentation-skills" },
  { id: "7", title: "Leadership Retreats", hook: "Elevation without the altitude sickness.", slug: "leadership-retreats" },
  { id: "8", title: "Communication Audit", hook: "Find out what your team isn't saying.", slug: "communication-audit" },
  { id: "9", title: "Culture Consulting", hook: "Build a culture worth bragging about.", slug: "culture-consulting" },
];
