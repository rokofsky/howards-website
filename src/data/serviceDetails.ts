export interface ServiceSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
  hatBullets?: { hat: string; color: string; image: string; description: string }[];
}

export interface ServiceTableRow {
  phase: string;
  action: string;
  outcome: string;
}

export interface ServiceDetailContent {
  pageTitle?: string;
  lead?: string;
  taglines?: string[];
  intro: string[];
  sections: ServiceSection[];
  tableTitle?: string;
  tableRows?: ServiceTableRow[];
  highlight?: {
    title: string;
    text: string;
  };
  highlightPosition?: "top" | "bottom";
  tone?: "default" | "executive";
}

export const serviceDetails: Record<string, ServiceDetailContent> = {
  "presentation-speaking-skills": {
    pageTitle: "Persuasive Presentations",
    lead: "Learn the mechanics and rhetoric to win any audience",
    intro: [
      "This workshop is designed especially for people who need to present in front of a multicultural group. However, the techniques we will study are universal and apply to any business culture.",
      "The training is rather hands-on \"technical\" in nature: we will practice the nuances of vocal usage, non-verbal language and rhetorical techniques, all designed to attract the audience, focus them where we want, and keep their attention. With these techniques and a healthy dose of self-control, anyone can learn how to be confident and persuasive in front of a group, even those with stage-fright.",
      "The trainer focuses on revealing specific points for individual improvement and repeating correct behaviours. After completing this workshop, you will have all the tools necessary to speak confidently, persuasively, and motivate your audience to action."
    ],
    sections: [
      {
        title: "Program Benefits",
        paragraphs: [
          "Enhanced self-confidence of speakers by proper preparation, calming the nerves, increased concentration and rhetorical skills. The goal is to appear pleasant, authoritative and, thereby, motivating. You will learn more than just public speaking; you will be a better communicator overall."
        ]
      },
      {
        title: "Program Contents",
        bullets: [
          "Individual video-camera work with analysis and feedback",
          "Vocal hygiene and the 4 vocal elements of persuasive speech: Inflection, Intonation, Pauses, Word emphasis",
          "Introduction and Conclusion — the most important parts of your speech",
          "How to build rapport and credibility with your audience",
          "Gaining and keeping audience attention",
          "Visual aids: how to do it and NOT to do it!",
          "Body language — use it to emphasize your strong points and play down the weaker ones",
          "Effective words and phrases used in presentations",
          "How to handle a hostile audience",
          "How to handle audience questions",
          "Overcoming nerves: cure the jitters in 1 minute!",
          "Optional third day follow up (usually 1-6 months later): making sure all skills have been maintained, plus expanded techniques for rhetoric and persuasion"
        ]
      },
      {
        title: "Training Methods",
        paragraphs: [
          "This is a highly interactive workshop, training the verbal and non-verbal skills necessary to deliver any kind of presentation (informative or persuasive). Techniques and activities will demonstrate and practice everything needed to perform a public-speaking task — and to make it compelling. Participants give short presentations on camera, with subsequent trainer analysis and corrections. The videos invariably reveal improvement, often significant. Feedback is encouraged at all times."
        ]
      }
    ]
  },
  "online-webinars": {
    pageTitle: "Choose from these interactive webinars. Inquire about each, or use the general form at the bottom ⬇️",
    lead: "Turn on your camera and unmute your microphone! Learn all sorts of stuff online in +/- two hours, just about any time of day.",
    intro: [],
    sections: []
  },
  "meetings-moderation": {
    pageTitle: "Six Thinking Hats",
    lead: "A structured method for smoother meetings, lateral thinking, and faster decisions.",
    intro: [
      "Howard will come to your meeting room and demonstrate this fun and miraculous method in about 3 hours.",
      "The 6 Thinking Hats framework is designed to facilitate creative, collaborative problem-solving discussions and meetings. Instead of the traditional meeting style, where people single-mindedly argue their points back and forth, around in circles, the 6 Hats method showcases parallel thinking — all participants are required to think and discuss\u00A0\u2014\u00A0in sync!",
      "All thinking styles are involved — one at a time — each hat is a different argumentation style. Everyone wears the same hat at the same time. All opinions are expressed at the right time, and consensus is reached smoother and quicker. The rules are simple and it takes a bit of self-discipline, but you'll immediately notice the difference as doors open up that you hadn't realized before.",
      "Many big and small companies — e.g. Prudential Insurance, Siemens, Boeing, IBM, 3M, among many others use this method to reduce meeting times and effectuate more grounded decision making.",
      "The meetings are also more fun!"
    ],
    sections: [
      {
        title: "The Hats",
        hatBullets: [
          { hat: "White Hat", color: "#FFFFFF", image: "white-hat", description: "Neutral information; focus on available information, data, objective facts, what is needed, how can we get it?" },
          { hat: "Black Hat", color: "#333333", image: "black-hat", description: "Judgmental; criticism; why something is wrong; difficulties, risk assessment; logical negative view." },
          { hat: "Red Hat", color: "#E53E3E", image: "red-hat", description: "Fire, warmth; emotions, feelings, intuition, brainstorming, gut instinct; presenting views without explanation or justification." },
          { hat: "Green Hat", color: "#38A169", image: "green-hat", description: "Creative thinking; possibilities and hypotheses; alternatives, solutions, new ideas." },
          { hat: "Yellow Hat", color: "#ECC94B", image: "yellow-hat", description: "Sunshine; optimism; logical positive view; look for values and benefits, what is good, why it will work." },
          { hat: "Blue Hat", color: "#4299E1", image: "blue-hat", description: "Overview; control of process, steps and other hats; chairperson, organizer; thinking about thinking, managing thinking processes, focus, next steps, action plans." }
        ]
      },
      {
        title: "When might you use Six Thinking Hats?",
        bullets: [
          "\nAnytime there are differences of opinion in a business meeting",
          "\nFacilitation of meetings",
          "Continuous process improvement",
          "New products / designs",
          "Conflict resolution",
          "Decision making and problem solving",
          "Customer focus groups / interviews",
          "Personnel and leadership development",
          "Making difficult decisions at home"
        ]
      },
      {
        title: "People who are comfortable sharing their ideas tend to show:",
        bullets: [
          "confidence that they have the ability to cope with and improve their environments",
          "opportunity-thinking and problem-solving competencies: spot opportunities, assess usefulness, predict consequences, propose alternative solutions, and evaluate outputs",
          "cooperative thinking competencies: can articulate another's point of view, devise an agenda, ensure equal participation"
        ]
      }
    ]
  },
  "conflict-resolution": {
    pageTitle: "Conflict Management",
    lead: "Learn to handle disputes, difficult people, and high-pressure conversations with clarity and control.",
    intro: [
      "Most people try to avoid conflict. But conflict can result in innovation and new, improved understandings, if we know how to manage it. Rather than reacting on an emotional level, you can learn and practice the techniques to manage disputes and disagreements\u00A0pro-actively\u00A0and positively at work, at home, and in society.",
      "In addition to various acute conflict settings, we will also learn how to cope with chronically difficult people. There are 7 main types, each with its own solution.",
      "On video you will see yourself as others see you, followed by instant peer/trainer feedback. In the next video your improvement will be already visible, demonstrating your own success and adaptability.",
      "By increasing your sensitivity to others' behaviors, projecting yourself properly in crucial situations and exercising self control, you will be able to respond constructively in difficult discussions. The result is better relationships and, ultimately, increased success.."
    ],
    sections: [
      {
        title: "Goals",
        bullets: [
          "Identify the filters of perception\u00A0and the root causes of conflict",
          "See the big picture and identify alternate angles of perception",
          "Practice effective listening and when to shut up",
          "Increase your personal impact and credibility",
          "Effectively give and get feedback",
          "Make sure you are never misunderstood",
          "Handle difficult meetings sensitively and constructively",
          "Speak fluently and confidently even under stress",
          "Become aware of your emotional triggers and prevent explosive situations",
          "Control anger with a simple technique",
          "Learn the 7 Types of Difficult People, their ways, and how to neutralize them"
        ]
      },
      {
        title: "Solutions for Conflict Situations",
        bullets: [
          "Understand your own and the other person's style, then identify and react accordingly",
          "Use intervention, mediation and voluntary arbitration as the process for settling issues",
          "Settle disputes through an empowering process",
          "Develop the art, science and practice of conflict resolution",
          "Maintain constructive joint processes to create organizational effectiveness",
          "Remember everyone's interests and try to help each protect theirs",
          "Offer a practical way to resolve disputes and preserve relationships",
          "Find any common ground and use this leverage to go forward"
        ]
      },
      {
        title: "Methods",
        paragraphs: [
          "As an 'intruder' it's my job to be as non-invasive as possible. My unbiased tactics may unnerve you but my position is secondary, occasionally commenting or asking a question to clarify. I can't help but be funny, not particularly intimidating, and I tend to make people feel comfortable. I identify the crux of the matter and facilitate a productive discussion. Meetings are usually shorter than expected, with outcomes both sides can live with. "
        ]
      }
    ]
  },
  "brainstorming-sessions": {
    pageTitle: "Brainstorming Sessions",
    lead: "Turn your meeting into a movement.",
    intro: [
      "Is your team stuck in the same-old-ideas loop? Most corporate brainstorming fails because it's too polite, too structured, or just plain boring. With high-energy, un-filtered brainstorming sessions, we can extract the brilliance your team already has, but doesn't know how to raise to the surface.",
      "We're not here to align — we're here to invent.",
      "Brainstorming is a group problem-solving method involving the spontaneous contribution of ideas from all members of the group. This means that all members are encouraged to share their ideas with no limitations.",
      "Whether it's a distribution issue, PR damage control, a takeover bid or an ad campaign, innovation is the key to keeping ahead of the competition. This is what brainstorming is all about — coming up with a unique solution that might well be thinking outside the box."
    ],
    sections: [
      {
        title: "What the session feels like",
        bullets: [
          "The messy middle is encouraged: we start with a blank canvas and end with a roadmap",
          "Ink everywhere: expect boards covered in arrows, circles, and wild connections",
          "Rapid-fire iteration: we scribble, pivot, and scrap the safe ideas until we find the gold",
          "Exhilarating and exhausting in that order"
        ]
      }
    ],
    tableTitle: "How does a brainstorming session look?",
    tableRows: [
      {
        phase: "Deconstruction",
        action: "We tear apart the current problem until we find the root cause.",
        outcome: "Total clarity on the why."
      },
      {
        phase: "Scribble Storm",
        action: "Non-stop visual mapping. No idea is too dumb to go on the board.",
        outcome: "A massive pool of raw potential."
      },
      {
        phase: "Kill-Chain",
        action: "We ruthlessly cut the fluff and stress-test the strongest concepts.",
        outcome: "A refined list of viable winners."
      },
      {
        phase: "Blueprint",
        action: "We turn the board scribbles into a concrete action plan.",
        outcome: "Immediate next steps for your team."
      }
    ]
  },
  storytelling: {
    pageTitle: "Storytelling in Business and Beyond",
    taglines: [
      "Empower your team to connect with story.",
      "Facts tell, stories sell."
    ],
    intro: [
      "Stop delivering data and start driving action. This isn't just about telling better anecdotes; it's about mastering the biological triggers that command attention. This training will give you the specific tools to connect with your listeners and, if your goal is to motivate someone to take direct action, you'll be better equipped. Whether you're pitching a board or leading a team, these techniques will transform the way you speak in public forever."
    ],
    sections: [
      {
        title: "You, Your Message, Your Audience",
        numbered: [
          "Your state, voice and body as an instrument through which you will deliver your message. Use it, vary it, and this will keep your audience focused as much as, or even more than, your story.",
          "Your message itself. Howard has developed a methodology for telling stories and delivering messages that is guaranteed to resonate with your audience. This method is based on a proven storytelling formula.",
          "Your audience — no two audiences are the same. Read your audience and be able to shift gears when necessary."
        ]
      },
      {
        title: "Who is this course for?",
        bullets: [
          "Mentors and leaders who want to impact their employees to motivation and success",
          "Professionals who want to deliver memorable presentations with greater impact",
          "Anyone who likes to tell stories in the pub, around the fire, etc."
        ]
      },
      {
        title: "Refined through perfect feedback",
        paragraphs: [
          "Whether you prefer telling personal, traditional, or fictional stories, we'll help you tighten them up and get them audience-ready. Carefully orchestrated trainer and peer feedback provide suggestions to improve not only the story, but also how you tell it. Everyone is invited to bring a 3 to 7-minute story, joke, anecdote, or similar piece for Round One."
        ]
      }
    ]
  },
  "communication-skills": {
    pageTitle: "Interpersonal Communication Training",
    intro: [
      "It's universally affirmed that personal relationships are the most important factor in any business. Communication is the oil for the machine. With a few techniques you can make a good impression, be a good listener, maybe use some charisma, and motivate people. Understanding the nuances of communication will help you avoid misunderstandings, and fix them when they occur.",
      "In this workshop, you will practice how to project yourself more effectively and persuasively by connecting with others, carefully following, guiding, and motivating them. Learn how to craft your message so as to evoke the response you desire. In practically any situation you may find yourself in."
    ],
    sections: [
      {
        title: "Workshop Contents",
        bullets: [
          "Vocal hygiene — exercise for a resonating voice",
          "The basic communication styles and how to deal with them",
          "Discussion: the various communication styles and how we can adapt",
          "4 barriers to communication and overcoming them",
          "Hara: demonstrate the power of speaking from your gut",
          "Vocal intonation for the proper authority",
          "Active listening",
          "Gaining rapport",
          "Empathy: the 180-degree mindset",
          "Take Me, Please! — a game to identify working styles",
          "Role playing on camera, analysis and feedback",
          "Dealing with difficult people",
          "Overcoming objections",
          "Assertiveness — 2/4 Step Technique",
          "Constructive feedback: giving, receiving and requesting",
          "Reframing — how to use it effectively and ethically",
          "SOFTEN technique for winning friends and influencing people"
        ]
      },
      {
        title: "Benefits",
        bullets: [
          "Speak calmly and confidently, even under stress",
          "Maximize your credibility and impact with non-verbal skills",
          "Learn the techniques to use for the rest of your life",
          "Handle difficult discussions sensitively and constructively",
          "Assertiveness: make your point and defend your space",
          "Overcome objections and express your requirements, even with difficult people",
          "Eased dealing with conflict",
          "Motivate others to action"
        ]
      },
      {
        title: "Training Methods",
        paragraphs: [
          "Experiential training by role-playing and resolving model situations. These are recorded, analysed by the trainer with appropriate feedback from all sides.",
          "The trainer focuses on revealing and repeating correct behaviors, demonstrating the most useful rhetorical formulations, non-verbal signals, and self-control mechanisms. Feedback is encouraged in all workshops and seminars. Everyone is kindly asked to participate and give feedback. There is space for everyone."
        ]
      }
    ]
  },
  "negotiation-skills": {
    pageTitle: "Negotiation Representation",
    intro: [
      "Secure a decisive advantage with Howard’s expert negotiation edge. We'll deconstruct problems to find root causes and deliver clear, actionable results.Whether it's a high-stakes contract, a delicate partnership exit, or a complex acquisition, this service provides the psychological leverage and tactical silence for a win-win."
    ],
    sections: [
      {
        title: "Service Pillar",
        paragraphs: [
          "As an 'intruder' it's my job to be as non-invasive as possible. My tactic of agreeing with the other side on small issues may unnerve you but my position is secondary, unbiased participant, occasionally commenting or asking a question to clarify. I can't help but be funny, not particularly intimidating, and I make people feel comfortable. I tend to get to the crux of the matter and facilitate a productive discussion. Meetings are usually shorter than expected and, depending on the culture, I'll be present or absent for the informal moments. Discretion guaranteed by NDA."
        ]
      }
    ],
    highlight: {
      title: "Success Fee",
      text: "I believe in skin in the game and am open to Success-fee Structures. My value is measured by your result."
    },
    highlightPosition: "bottom",
    tone: "executive"
  },
  "keynote-speaking": {
    pageTitle: "Speaking Appearances",
    lead: "Hire Howard to speak at your special event and they'll be talking about it a year later.",
    intro: [
      "Are you looking for a unique surprise for your employees or guests?",
      "Now you can hire Howard to speak at your event — his entertaining, educational themes and articulate, interactive speaking style are guaranteed to capture the attention of any audience and motivate them to action. They might even learn something along the way...",
      "Charismatic, charming and quick-witted, Howard's engaging personality and stage presence make him a genuine crowd-pleaser.",
      "Available in English, Czech, Dutch."
    ],
    sections: [
      {
        title: "A breath of fresh air at your",
        bullets: [
          "Dinner / Cocktail Party",
          "Family or Company Event",
          "Conference"
        ]
      },
      {
        title: "Choose your format",
        bullets: [
          "Speaker / storyteller — Howard can speak from 20 to 75 minutes or all night, to any group at any level or socioeconomic status. Note: this is not intended to be stand-up comedy. For one thing, I'll be mostly sitting. Still, you'll probably laugh once or twice.",
          "Master of Ceremonies (MC) — the thread that ties all the elements of the program together, keeps the tempo at the desired energy level, ensuring your event will be memorable."
        ]
      }
    ]
  }
};
