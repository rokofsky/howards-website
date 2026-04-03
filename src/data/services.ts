export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Presentation & Speaking skills", subtitle: "Own the room", hook: "Speak like a pro", slug: "presentation-speaking-skills" },
  { id: "2", title: "Individual coaching sessions", subtitle: "Re-examine the situation from different angles, uncover new options", hook: "", slug: "individual-coaching" },
  { id: "3", title: "Six Hats Method", subtitle: "Meetings moderation", hook: "Make even difficult decisions easier, in half the time", slug: "meetings-moderation" },
  { id: "4", title: "Conflict mediation/resolution", subtitle: "Mediation and de-escalation", hook: "Turn battles into breakthroughs", slug: "conflict-resolution" },
  { id: "5", title: "Brainstorming sessions", subtitle: "Where ideas go to multiply", hook: "Success fee guarantee", slug: "brainstorming-sessions" },
  { id: "6", title: "Storytelling", subtitle: "Creating and performing", hook: "Facts tell, stories sell", slug: "storytelling" },
  { id: "7", title: "Interpersonal Communication Training", subtitle: "", hook: "Shape your message in the way that gets the reply you want", slug: "communication-skills" },
  { id: "8", title: "Negotiation Representation", subtitle: "Need an advantage?", hook: "Benefit from Howard's edge", slug: "negotiation-skills" },
  { id: "9", title: "Keynote speaking", subtitle: "Events that resonate", hook: "Something special for your guests", slug: "keynote-speaking" },
];
