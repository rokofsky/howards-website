import haraImg from "@/assets/blog-hara.jpg";
import cvImg from "@/assets/blog-cv.jpg";
import storytellingImg from "@/assets/blog-storytelling.jpg";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  imageUrl?: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "howards-principles-of-methodology",
    title: "Howard's Principles of Methodology",
    excerpt: "Training and Learning Strategies",
    date: "Apr 18, 2026",
    category: "Communication",
    imageUrl: "https://i.postimg.cc/QxWSm4KL/methodology-2.jpg",
    content: `The Learning Environment

The place where we learn is of paramount importance; we have to be comfortable and constantly stimulated. All our five senses contribute to absorbing the learning experience. The room is cozy, chairs are comfortable, walls are decorated with colorful pictures, music fills the air. Challenges, rewards and anticipation all create excitement. Music and games stimulate the brain. In all our workshops, the experience consists of all this plus, of course, the techniques. This is accelerated learning.

Emotional State

In traditional lessons, students were expected to draw on logic, opinions and knowledge. Therefore, retention was limited to (cognitive) abilities which did not appeal to everyone´s preferred learning style. When emotion is involved, motivation is created. People learn best when they are simultaneously stimulated and relaxed. When they are enjoying themselves. Emotional states and learning capacity are enhanced by the trainer’s applications of elements: games, mysteries, movement, music, et al.

Voice and body language training

We may have neglected developing basic things in adult life like posture and voice. Proper vocal use is essential in all verbal communication, and body language is perhaps even more important. A simple regiment of voice exercises will make you sound clearer, more resounding and more serious. Practicing proper body language emphasizes our communication and aids clarity. In addition, we learn how to read others’ non-verbal language, helping us to understand the other’s meaning. When we realize that the true meaning is in how the receiver receives the information and adapt our communication to best suit our purposes, our skills in persuasion increase remarkably.

Personal Motivation

Robert Epstein, internationally acclaimed expert on human behavior, defines motivation as “an internal state of arousal that (often) precedes behavior.” The basic two human motivations are either (1) towards pleasure or (2) away from pain; the more we structure our behaviors to number (1), the more we retain control our lives and the more motivated we are. We will learn how to plan our lives, set goals and keep promises to ourselves!

The Role of Music

Music is an important element in training. The right music at the right time stimulates emotional engagement and invokes retention. The tempos and keys in the music parallel the pacing of the environment.

Movement & Imagination

Imaginative, role-playing games and physical movement enrich verbal and written information with more meaning and, as a result, positive emotions are stimulated. This helps greatly in the learning process. Movement activates the so-called ´kinesthetic´ feeling onto the scene. Visualization skills enhance memory and creativity. The metaphors employed bring stronger meaning to the subject matter. You will assimilate and remember more.

Team Learning and Cooperation

In a cooperative work environment, more things get done in less time and with less hassle. Therefore we employ dynamic, social and cooperative activities that encourage participants to refine their talents as mentors, learners and colleagues. In this way, interpersonal skills are enriched and creative talents are stimulated. This element of teamwork is omnipresent in all the workshops.

Results, Feedback and Improvement

Learning expectations are clearly defined and shared with participants so that they can comprehend the relevance of the subject matter and measure progress. The data from this process is used to continuously improve and add value to planning, assessment, and improvement. To this end we have various means of feedback: constant review, questionnaires and meeting with the participants and constituents. Improvement can thus be guaranteed.`,
  },
  {
    slug: "hara-so-you-dont-fall-down",
    title: "Hara, so you don't fall down",
    excerpt: "Discover the ancient Japanese secret of Hara: finding your center of gravity for balance, confidence, and control.",
    date: "Mar 28, 2026",
    category: "Mindset",
    imageUrl: haraImg,
    content: `In ancient Japan, to say that someone ‘thinks with their head’ was an insult. Thinking was understood as something that came from a point in the belly: the Hara. You’ve heard of Hara Kiri (ritualistic suicide by stabbing one’s self in the gut). There are many other references to this special spot in ancient martial arts and sexuality texts.

According to these cultures, the body has its fulcrum in the Hara – (Dan tian in Chinese), (Seika Tanden or Kikai in Japanese). This point is considered the human’s physical and spiritual gravity center.

After the brain, there are more nerve cells in the gut than any other body part, containing 100 million neurons – more than the spinal cord. The abdomen is, in neuro-physiological terms, a kind of ‘second brain’. It’s no coincidence that directing our attention there will have an immediate, physiological result.

Hara is located appx. 3 cm below the navel, and 3 cm inside (in the gut); you can feel it with your finger: probe around for the most sensitive spot in the area. It hurts when you press it. Concentrating (‘focusing your energy’) on this spot is accompanied by an instantaneous feeling of grounding and a physical feeling of balance. You can actually feel your weight getting redistributed. This grounding is
accompanied by a sense of confidence. It not only feels good, it also visibly manifests in your body posture and presence – other people will sense your confidence, and that cannot be bad.

The balance is cumulative: it gets easier with practice. Start with a few minutes a day, while walking on your daily rounds. The next time you feel you may lose your balance (on a rocky, icy, or uneven surface), just remember Hara and focus on it – equilibrium will appear, and you will not fall. Or when feeling uncertain or weak, anxiety’s kicking in, aim your mind at your hara, and don’t be surprised if you start feeling in control of yourself again. I credit Hara for enabling me to ride a
bicycle in chaotic traffic all over Chinese roads without incident.

In Kung Fu and Aikido, the hara is where all moves are based from. Figure skaters and acrobats know to concentrate on Hara to keep balance. It’s basically the Yogi secret for sitting in the freezing cold. Spies know that focusing on Hara makes torture easier to withstand. But it’s useful even for common things like walking on an icy street or standing in a moving bus. There is probably not a simpler, more basic technique that will have as broad an impact on your life. If breathing is the key, Hara is the door.

What does this mean in business? A benevolent leader is always grounded and their instructions come across as confident, motivating, and trustworthy. Go to your Hara while speaking – your presentations will appear more comfortable and persuasive.

According to the texts, the goal is to be aware of Hara 24/7, but that’s for yogis and the like. Just practice it when you’re walking, and it will get easier and easier. It works anywhere, anytime, from withstanding pain to stage-fright. Let me know if you lose your balance / step in dog poop / panic *a lot less*.`,
  },
  {
    slug: "my-secret-cv",
    title: "12 jobs you won’t find on my CV",
    excerpt: "Former jobs that led me to where I am today",
    date: "Mar 15, 2026",
    category: "Personal",
    imageUrl: cvImg,
    content: `**Newspaper carrier**: from the ages of 13 to 16, I delivered the daily paper "Newsday" on a route of 30+ homes in Plainview, NY (it took about 2 hours a day, longer if I took my baby brother or the dog). In addition, I had to collect the weekly fees and tips from each customer on the route. There were always people who were hard to reach, or just didn’t like to pay. Looking back, it was an unlikely livelihood but what else could I do at that age? This opened up for me the worlds of responsibility, independence and perseverance. Probably time management as well. Length of job: 2.5 years.

**Babysitter**: for about 4 teenage years, while my friends were out drinking and gallivanting, I regularly babysat for 6 families in Long Island, NY. Yeah, even on New Years Eve.

    **Handyman **at "Casual Corner", Plainview, NY.
    I worked in this woman's clothing store doing whatever the ladies wanted me to do. As the only male in the store, including customers, I enjoyed the "special attention" afforded to the outlier. 

    **University Security Department “Escort” service**
    Night shifts during my first year at Binghamton University. If someone felt unsafe walking around campus at night, they could call Security and I would get a call by walkie-talkie: who to escort where. Between escorts I would monitor the peace and fire extinguishers in the dormitories, basements, lecture halls etc. I learned how to wield authority and responsibility professionally and friendly, even as a ‘security guy’.

    **Oxygen delivery**: for 4 summers while at university, I delivering (heavy) liquid oxygen tanks to dying patients all over NYC and Long Island. It paid well, thanks to hazard pay and heavy lifting. I regularly visited and spent time with these patients, each deathly afraid of not getting their O2 on time. I learned to organize my schedule so as to deliver the right amount of oxygen at the right time. And I got to refine my 'bedside manner'.

    **Asbestos abatement:** South Bronx, NYC
    I wasn’t actually removing the asbestos, but I had to don a hazmat suit at 8am to set up the air meter, and again at 4pm to take readings. In between, I either slept in the car and/or wandered around the most dangerous neighborhood in the City.

    **Bartender:** The Last Waterhole, red light district, Amsterdam, 1991-92: probably the best job I ever had. Live band every night. I learned how to persuade drunk and sometimes aggressive people to go home at closing time. I never had to use the emergency 'protection' hotline to call the Hell's Angels.

    **Cook**: kitchen work in various restaurants (1990s) in Amsterdam, NL. Managed the kitchen in two of these restaurants, in Diemen, and on Zeedijk.

    **Rhetorical consultant**, “Network CV” Amsterdam, NL, 1991-1993. Established a CV and resume writing service. I made flyers and placed them in employment agencies, eventually coaching job candidates at all levels. 

    **Sauna Fenomeen**, Amsterdam, NL, 1995- 1999: Weekly shifts behind the bar, volunteer on the board. My mandate at this official squatter's club was to make an illegal sauna legal, incl. all regulations. It turned out to be more difficult than I thought, as diplomat and henchman. The legendary sauna is now defunct. I learned a lot about diplomacy.

    **Telemarketing** fake lottery tickets, Amsterdam, NL, 1994. Selling 'international lottery tickets’ to Brits over the phone. I eventually figured out that the company was not actually buying any lottery tickets, but was instead acting as the lottery. That pissed me off but I finished out the contract.

    **Last and least, my horoscope**. Western: Taurus; Chinese: Fire Horse. This combination, according to the sources on such detailed matters, is particularly inauspicious. Just ask my mother.`,

  },
  {
    slug: "storytelling-is-not-optional-anymore",
    title: "Storytelling Is Not Optional Anymore",
    excerpt: "In a world of AI-generated everything, your story is the last unfakeable asset.",
    date: "Feb 28, 2026",
    category: "Storytelling",
    imageUrl: storytellingImg,
    content: "Content coming soon. Check back later for the full article.",
  },
];
