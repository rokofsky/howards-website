export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Storytelling", subtitle: "Creating & Performing", hook: "facts tell, stories sell", slug: "storytelling" },
  { id: "2", title: "Presentation & Speaking Skills", subtitle: "Own the Room", hook: "speak like a pro", slug: "presentation-speaking-skills" },
  { id: "3", title: "Conflict Mediation & Resolution", subtitle: "Mediation & De-escalation", hook: "turning battles into breakthroughs", slug: "conflict-resolution" },
  { id: "4", title: "Individual Communication Coaching", subtitle: "Your Personal Leadership Edge", hook: "hone your message to get the reply you want", slug: "individual-coaching" },
  { id: "5", title: "Interpersonal Communication Skills", subtitle: "Your Message, Your Way", hook: "the way you say, show, and write it", slug: "communication-skills" },
  { id: "6", title: "Keynote Speaking", subtitle: "Events That Resonate", hook: "something special for your guests", slug: "keynote-speaking" },
  { id: "7", title: "Meetings Moderation", subtitle: "Six Thinking Hats Method", hook: "make decisions in half the time", slug: "meetings-moderation" },
  { id: "8", title: "Brainstorming Sessions", subtitle: "Let the Ideas Fly", hook: "where ideas go to multiply", slug: "brainstorming-sessions" },
  { id: "9", title: "Negotiation Mediation", subtitle: "Strategy, Tactics & Confidence", hook: "benefit from Howard's edge, guaranteed", slug: "negotiation-skills" },
];
