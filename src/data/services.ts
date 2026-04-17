export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Presentation & Speaking Skills Training", subtitle: "Speak like a pro and own the room", hook: "\n", slug: "presentation-speaking-skills" },
  { id: "2", title: "Live Webinar Sessions", subtitle: "So many to choose from!", hook: "", slug: "online-webinars" },
  { id: "3", title: "The Six Hats Method", subtitle: "Stop wasting time. Turn every meeting into actionable decisions.", hook: "\n", slug: "meetings-moderation" },
  { id: "4", title: "Conflict Mediation /Resolution", subtitle: "Turn battles into breakthroughs", hook: "\n", slug: "conflict-resolution" },
  { id: "5", title: "Brainstorming Sessions", subtitle: "Where ideas go to multiply", hook: "\n", slug: "brainstorming-sessions" },
  { id: "6", title: "The Art of Storytelling", subtitle: "Facts tell, stories sell", hook: "\n", slug: "storytelling" },
  { id: "7", title: "Individual Coaching Sessions", subtitle: "", hook: "Explore new angles and discover new options", slug: "communication-skills" },
  { id: "8", title: "Negotiation Representation", subtitle: "Need an advantage? Benefit from Howard's edge", hook: "\n", slug: "negotiation-skills" },
  { id: "9", title: "Keynote Speaking", subtitle: "Events that resonate for your guests", hook: "\n", slug: "keynote-speaking" },
];
