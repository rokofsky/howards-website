export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  hook: string;
  slug: string;
}

export const services: ServiceItem[] = [
  { id: "1", title: "Storytelling", subtitle: "Creating, Writing & Performing", hook: "Facts tell, stories sell.", slug: "storytelling" },
  { id: "2", title: "Presentation & Speaking Skills", subtitle: "Own the Room", hook: "Death to death-by-PowerPoint.", slug: "presentation-speaking-skills" },
  { id: "3", title: "Conflict Resolution", subtitle: "Mediation & De-escalation", hook: "Turning battles into breakthroughs.", slug: "conflict-resolution" },
  { id: "4", title: "Individual Coaching", subtitle: "Your Personal Leadership Edge", hook: "Your personal leadership whisperer.", slug: "individual-coaching" },
  { id: "5", title: "Communication Skills", subtitle: "Interpersonal & Written", hook: "Say what you mean. Mean what you say.", slug: "communication-skills" },
  { id: "6", title: "Keynote Speaking", subtitle: "Events That Resonate", hook: "Leave them quoting you at dinner.", slug: "keynote-speaking" },
  { id: "7", title: "Meetings Moderation", subtitle: "Six Thinking Hats Method", hook: "Better meetings in half the time.", slug: "meetings-moderation" },
  { id: "8", title: "Brainstorming Sessions", subtitle: "Structured Creative Thinking", hook: "Where good ideas go to multiply.", slug: "brainstorming-sessions" },
  { id: "9", title: "Negotiation Skills", subtitle: "Strategy, Tactics & Confidence", hook: "Get to yes without the arm-wrestling.", slug: "negotiation-skills" },
];
