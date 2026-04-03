export interface ServiceSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  numbered?: string[];
}

export interface ServiceTableRow {
  phase: string;
  action: string;
  outcome: string;
}

export interface ServiceDetailContent {
  pageTitle?: string;
  lead?: string;
  intro: string[];
  sections: ServiceSection[];
  tableTitle?: string;
  tableRows?: ServiceTableRow[];
  highlight?: {
    title: string;
    text: string;
  };
  tone?: "default" | "executive";
}

export const serviceDetails: Record<string, ServiceDetailContent> = {
  "presentation-speaking-skills": {
    pageTitle: "Persuasive Presentations",
    lead: "A practical workshop for people who need to present with confidence and impact.",
    intro: [
      "This workshop is especially designed for people who need to present in front of a multicultural group. However, the techniques we will study are universal and apply to any business culture.",
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
          "Vocal hygiene and the four vocal elements of persuasive speech: inflection, intonation, pauses, and word emphasis",
          "Introduction and conclusion — the most important parts of your speech",
          "How to build rapport and credibility with your audience",
          "Gaining and keeping audience attention",
          "Visual aids: how to do it and NOT to do it",
          "Body language — use it to emphasize your strong points and play down the weaker ones",
          "Effective words and phrases used in presentations",
          "How to handle a hostile audience",
          "How to handle audience questions",
          "Overcoming nerves: cure the jitters in 1 minute",
          "Optional third day follow up (usually 1-6 months later) to maintain and expand the skills"
        ]
      },
      {
        title: "Training Methods",
        paragraphs: [
          "This is a highly interactive workshop, training the verbal and non-verbal skills necessary to deliver any kind of presentation (informative or persuasive). Techniques and activities will demonstrate and practice everything needed to perform a public-speaking task — and to make it compelling.",
          "Participants give short presentations on camera, with subsequent trainer analysis and corrections. The videos invariably reveal improvement, often significant. Feedback is encouraged at all times."
        ]
      }
    ]
  },
  "individual-coaching": {
    pageTitle: "Coaching sessions",
    lead: "One-to-one work for sharper communication, steadier self-control, and better decisions under pressure.",
    intro: [
      "These coaching sessions are designed for people who want to re-examine a situation from different angles, uncover new options, and strengthen the way they show up in important conversations.",
      "The focus is personal, practical, and tailored: we work on the exact communication habits, reactions, and patterns that matter most in your real-life context."
    ],
    sections: [
      {
        title: "Benefits",
        bullets: [
          "Maximize your credibility and impact with non-verbal skills",
          "Learn self-meditation/hypnosis techniques to use for the rest of your life",
          "Handle difficult discussions sensitively and constructively",
          "Assertiveness: make your point and defend your space",
          "Eased dealing with conflict"
        ]
      }
    ]
  },
  "meetings-moderation": {
    pageTitle: "The Six Thinking Hats",
    lead: "A structured method for smoother meetings, better thinking, and faster decisions.",
    intro: [
      "Management guru Edward de Bono developed the 6 Thinking Hats framework to facilitate creative, collaborative problem-solving meetings. Instead of the traditional meeting style, where people single-mindedly argue their points back and forth, around in circles, the 6 Hats method showcases parallel thinking — where all participants are required to think and discuss in sync.",
      "All thinking styles are involved — each hat is a different argumentation style, but here, everyone wears the same hat at the same time. The result is much smoother, more pleasant decision making. The rules are simple and it takes a bit of self-discipline; but you’ll immediately notice the difference as doors open up that you hadn’t thought of before.",
      "The meetings are not only more effective, they’re more pleasant."
    ],
    sections: [
      {
        title: "The Hats",
        bullets: [
          "White Hat — neutral information; focus on available information, data, objective facts, what is needed, and how to get it",
          "Black Hat — judgmental criticism; difficulties, risk assessment, and the logical negative view",
          "Red Hat — emotions, feelings, intuition, brainstorming, and gut instinct without explanation or justification",
          "Green Hat — creative thinking, possibilities, hypotheses, alternatives, solutions, and new ideas",
          "Yellow Hat — optimism, value, benefits, and why something will work",
          "Blue Hat — overview, process control, organization, focus, next steps, and action plans"
        ]
      },
      {
        title: "How Might You Use The Six Thinking Hats?",
        bullets: [
          "Facilitation of meetings",
          "Preparing for discussions",
          "Continuous process improvement",
          "New products / new designs",
          "Conflict resolution",
          "Decision making and problem solving",
          "Customer focus groups / interviews",
          "Leadership development",
          "Presentations",
          "Virtual meetings",
          "Individual thinking"
        ]
      },
      {
        title: "Training Course Objectives and Outcomes",
        bullets: [
          "An improved tendency to identify themselves as thinkers",
          "Confidence that they have the ability to cope with and improve their environments",
          "Problem-solving competencies: identify a problem, propose alternative solutions, predict consequences, assess usefulness, select the best alternative, implement it, and evaluate it",
          "Opportunity-thinking competencies: spot opportunities, weigh benefits against risks, design plans, and reassess them in progress",
          "Cooperative thinking competencies: facilitate a group meeting, articulate other people’s points of view, devise an agenda, follow it, and provide for equal participation"
        ]
      }
    ]
  },
  "conflict-resolution": {
    pageTitle: "Conflict Management",
    lead: "Learn to handle disputes, difficult people, and high-pressure conversations with clarity and control.",
    intro: [
      "Most people try to avoid conflict. But conflict is not always a bad thing. Conflict can result in innovation and new, improved understandings, if we know how to manage it. Rather than reacting on a purely emotional level, now you can learn and practice the skills to manage disputes and disagreements positively and pro-actively at work, at home and in society.",
      "In addition to various acute conflict settings, we will also learn how to cope with chronically difficult people. You will project yourself in crucial situations and practice the skills to respond perfectly. Increase your sensitivity to others’ behaviors and reply constructively; you will be surprised at how well it works.",
      "On video you will see yourself as others see you, followed by instant peer/trainer feedback. In the next video your correction will be already visible, demonstrating your own success and adaptability.",
      "By becoming aware of your own communication filters, understanding the action/reaction principle and opening other people’s minds to the possibilities and potentials, the result is better relationships and, ultimately, increased success."
    ],
    sections: [
      {
        title: "Program Goals",
        bullets: [
          "Increase your personal impact and credibility",
          "Identify the filters of perception",
          "See the big picture",
          "Practice effective / active listening",
          "Effectively give and get feedback",
          "Master body language",
          "Make sure you are never misunderstood",
          "Recognize the root causes of inter-personal conflict",
          "Speak fluently and confidently even under stress",
          "Become aware of your emotional triggers and prevent explosive situations",
          "Handle difficult meetings sensitively and constructively",
          "Maximize your verbal and non-verbal communication skills",
          "Control anger with a simple technique",
          "Learn the 7 Types of Difficult People, their ways, and how to neutralize them"
        ]
      },
      {
        title: "Solutions for Conflict Situations",
        bullets: [
          "Understand your own and the other person's style, then identify and react accordingly",
          "Promote the development of sound and stable labor-management relations",
          "Settle disputes through an empowering process",
          "Use intervention, mediation and voluntary arbitration as the preferred process for setting issues",
          "Develop the art, science and practice of conflict resolution",
          "Establish and maintain constructive joint processes to create organizational effectiveness",
          "Offer a practical way to resolve disputes and preserve relationships"
        ]
      },
      {
        title: "Training Methods",
        paragraphs: [
          "This interactive workshop is one in which we will all be doing a lot of exercises, demonstrations and practicing. The goal in all these seminars is to learn to apply these techniques each and every time we learn or teach something.",
          "After you try these techniques and see how effective they are, you will be ready to use them in your daily life. Feedback is encouraged in all workshops and seminars. Everyone attending is kindly asked to participate and give feedback. There is space for everyone."
        ]
      }
    ]
  },
  "brainstorming-sessions": {
    pageTitle: "Brainstorming Sessions",
    lead: "Turn your meeting into a movement.",
    intro: [
      "Is your team stuck in the same-old-ideas loop? Most corporate brainstorming fails because it’s too polite, too structured, or just plain boring. With high-energy, un-filtered brainstorming sessions, we can extract the brilliance your team already has, but doesn't know how to raise it to the surface.",
      "We’re not here to align — we’re here to invent.",
      "According to the Merriam-Webster dictionary, brainstorming is a group problem-solving method that involves the spontaneous contribution of ideas from all members of the group. This means that all members present are encouraged to share their ideas with no limitations.",
      "Whether it is a distribution issue, production, PR, a takeover bid or an ad campaign, innovation is the key to keeping ahead of the competition. This is what brainstorming is all about — coming up with a unique solution that might well be thinking outside the box.",
      "With Edward de Bono’s famous 6 Hats Method, every aspect of decision-making is covered. From idea generation all the way to idea attacking and every step in between, the 6 Hats Method has helped thousands of companies save time, money and energy with solutions that are clearly developed and executed."
    ],
    sections: [
      {
        title: "What the session feels like",
        bullets: [
          "The messy middle is encouraged: we start with a blank canvas and end with a roadmap",
          "Ink everywhere: expect boards covered in arrows, circles, and wild connections",
          "Rapid-fire iteration: we scribble, pivot, and scrap the safe ideas until we find the gold"
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
    lead: "Empower your team to connect with story.",
    intro: [
      "The Storytelling workshop is based on the neuroscience of communication and focuses on practice and learning through doing. This training will give you the ability to connect with and move your audience to action and will transform the way you speak in public forever."
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
        title: "Program Contents",
        bullets: [
          "Preparation vs Spontaneity",
          "Anchoring spaces",
          "Reading an audience, eliciting states, keeping their attention",
          "Rhetoric and influence",
          "Nested loops and other devices",
          "Use of visuals",
          "The key success secrets to winning over any audience",
          "Teach your managers to tell stories for more impact on their team"
        ]
      },
      {
        title: "Who is this course for?",
        bullets: [
          "Mentors and leaders who want to impact their employees to motivation and success",
          "Anyone who wants to deliver presentations with greater impression",
          "Anyone interested in continuing their personal or professional development"
        ]
      },
      {
        title: "How the workshop is tailored",
        paragraphs: [
          "The course is tailored to the needs of the participants: whether they prefer telling personal stories, traditional stories, improvisation, use of slides, and more. Corrections and peer feedback help improve the story and how you tell it. Everyone is expected to come with a 5- to 7-minute story, joke, anecdote, or similar piece for round one."
        ]
      }
    ]
  },
  "communication-skills": {
    pageTitle: "Interpersonal Communication Skills",
    lead: "Improve how you say it, show it, and write it — so people understand you the first time.",
    intro: [
      "It’s a generally accepted fact that personal relationships are the most important factor in any business. Communication is the oil for that machine. Make a good impression, be a good listener, maybe use charisma, and motivate people. Understanding the nuances of communication will help you avoid misunderstandings, and fix them when they occur.",
      "In this workshop, you will practice how to project yourself more effectively and persuasively by connecting with others and, thereby, motivating them. With these techniques at your disposal, your message will be clear and usually elicit the desired response, in practically any situation you may find yourself in."
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
          "Learn techniques to use for the rest of your life",
          "Handle difficult discussions sensitively and constructively",
          "Assertiveness: make your point and defend your space",
          "Overcome objections and express your requirements, even with difficult people",
          "Ease your dealings with conflict",
          "Motivate others to action"
        ]
      },
      {
        title: "Training Methods",
        paragraphs: [
          "Experiential training by role-playing and resolving model situations. These are recorded, analysed by the trainer with appropriate feedback from all sides.",
          "The trainer focuses on revealing and repeating correct behaviors, demonstrating the most useful rhetorical formulations, non-verbal signals, and self-control mechanisms. Feedback is encouraged in all workshops and seminars, and everyone is kindly asked to participate. There is space for everyone."
        ]
      }
    ]
  },
  "negotiation-skills": {
    pageTitle: "Negotiation Representation",
    lead: "Because fair is subjective. Let’s get you the edge.",
    intro: [
      "Most people walk into a negotiation hoping for the best. Howard’s clients walk in knowing they have the best. Whether it’s a high-stakes contract, a delicate partnership exit, or a complex acquisition, this service provides the psychological leverage and tactical silence required to win."
    ],
    sections: [
      {
        title: "Service Pillars",
        bullets: [
          "Strategic Ghosting — behind-the-scenes scripting, analysis of their tells, and a plan that keeps you from overplaying your hand",
          "Lead Negotiator — professional, unshakeable representation focused entirely on the closing conditions",
          "Conflict De-escalation — turning No into Not that way by navigating the emotional undercurrents that stall high-value deals"
        ]
      },
      {
        title: "Private Intake",
        bullets: [
          "Name / Company",
          "Nature of negotiation: M&A, Employment, Vendor, Dispute, or Other",
          "Estimated stake / value",
          "Timeline: Immediate / Within 30 days / Planning phase",
          "What’s the one thing you’re afraid to lose in this deal?"
        ]
      }
    ],
    highlight: {
      title: "Success Fee",
      text: "I believe in skin in the game. For high-stakes representation, I am open to Success-Fee Structures. My value is measured by your result."
    },
    tone: "executive"
  },
  "keynote-speaking": {
    pageTitle: "Speaking Appearances",
    lead: "Hire Howard to speak at your special event.",
    intro: [
      "Are you looking for a unique surprise for your employees or guests?",
      "Now you can hire Howard to speak at your event — his entertaining, educational themes and interactive speaking style are guaranteed to capture the attention of any audience and positively motivate them to action. They might even learn something.",
      "Charismatic, charming, intelligent and quick-witted, Howard’s engaging personality and stage presence make him a genuine crowd-pleaser.",
      "Available in English, Czech, Dutch."
    ],
    sections: [
      {
        title: "A welcome breath of fresh air at your",
        bullets: [
          "Dinner / Cocktail Party",
          "Family or Company Event",
          "Wedding",
          "Conference"
        ]
      },
      {
        title: "Choose the format you prefer",
        bullets: [
          "Speaker / storyteller — choose an interesting topic and Howard can speak from 20 to 75 minutes to all night, to any group at any level or socioeconomic status.",
          "Master of Ceremonies (MC) — the thread that ties all the elements of the program together, keeps the tempo right, and ensures your event will be remembered for a long time after."
        ]
      },
      {
        title: "Topics include",
        bullets: [
          "How to give the right instructions",
          "Brain Gym: get those hemispheres working together",
          "Emotional Intelligence: how it really can make your life easier",
          "Increase your powers of perception",
          "EQ & Leadership: how they go hand-in-hand",
          "Work-life Balance",
          "8 Intelligences and how to increase yours",
          "Self-motivation and concentration",
          "Time Management in 5 minutes a day"
        ]
      }
    ]
  }
};