export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Presentation & Speaking Skills", subtitle: "Own the Room", hook: "Speak Like a Pro", slug: "presentation-speaking-skills" },
  { id: "2", title: "Individual Coaching Session", subtitle: "Your Personal Leadership Edge", hook: "Re-examine the Situation From Different Angles and Discover New Options", slug: "individual-coaching" },
  { id: "3", title: "Six Hats Method", subtitle: "Meetings Moderation", hook: "Make Decisions in Half the Time", slug: "meetings-moderation" },
  { id: "4", title: "Keynote Speaking", subtitle: "Events That Resonate", hook: "Something Special for Your Guests", slug: "keynote-speaking" },
  { id: "5", title: "Conflict Mediation & Resolution", subtitle: "Mediation & De-escalation", hook: "Turning Battles Into Breakthroughs", slug: "conflict-resolution" },
  { id: "6", title: "Brainstorming Sessions", subtitle: "Where Ideas Go to Multiply", hook: "Success Fee Guarantee", slug: "brainstorming-sessions" },
  { id: "7", title: "Storytelling", subtitle: "Creating & Performing", hook: "Facts Tell, Stories Sell", slug: "storytelling" },
  { id: "8", title: "Interpersonal Communication Training", subtitle: "Your Message, Your Way", hook: "Form Your Message in the Way That Gets the Reply You Want", slug: "communication-skills" },
  { id: "9", title: "Negotiation Mediation", subtitle: "Strategy, Tactics & Confidence", hook: "Benefit From Howard's Edge, Guaranteed", slug: "negotiation-skills" },
];
