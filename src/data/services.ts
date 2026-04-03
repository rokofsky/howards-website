export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Presentation & Speaking Skills", subtitle: "Own the Room", hook: "Speak like a pro", slug: "presentation-speaking-skills" },
  { id: "2", title: "Individual Coaching Session", subtitle: "Re-examine the situation from different angles, discover new options", hook: "", slug: "individual-coaching" },
  { id: "3", title: "Six Hats Method", subtitle: "Meetings Moderation", hook: "Make decisions in half the time", slug: "meetings-moderation" },
  { id: "4", title: "Conflict Mediation & Resolution", subtitle: "Mediation & De-escalation", hook: "Turn battles into breakthroughs", slug: "conflict-resolution" },
  { id: "5", title: "Brainstorming Sessions", subtitle: "Where Ideas Go to Multiply", hook: "Success fee guarantee", slug: "brainstorming-sessions" },
  { id: "6", title: "Storytelling", subtitle: "Creating & Performing", hook: "Facts tell, stories sell", slug: "storytelling" },
  { id: "7", title: "Interpersonal Communication Training", subtitle: "", hook: "Shape your message in the way that gets the reply you want", slug: "communication-skills" },
  { id: "8", title: "Negotiation Representation", subtitle: "When You Need an Advantage", hook: "Benefit from Howard's edge, guaranteed", slug: "negotiation-skills" },
  { id: "9", title: "Keynote Speaking", subtitle: "Events That Resonate", hook: "Something special for your guests", slug: "keynote-speaking" },
];
