// Nothing reads from this page anymore
import haraImg from "@/assets/blog-hara.jpg";
import cvImg from "@/assets/blog-cv.jpg";
import storytellingImg from "@/assets/blog-storytelling.jpg";

export type L = { en: string; cs: string };

export const pickL = (value: L | string | undefined, lang: "en" | "cs"): string => {
  if (typeof value === "string") return value;
  return value?.[lang] || value?.en || "";
};

export interface BlogPost {
  slug: string;
  title: L;
  excerpt: L;
  date: L;
  category: L;
  imageUrl?: string;
  content: L;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "howards-principles-of-methodology",
    title: {
      en: "Howard's Principles of Methodology",
      cs: "Howardovy principy metodiky",
    },
    excerpt: {
      en: "Training and Learning Strategies",
      cs: "Strategie tréninku a učení",
    },
    date: { en: "Apr 18, 2026", cs: "18. dubna 2026" },
    category: { en: "Communication", cs: "Komunikace" },
    imageUrl: "https://i.postimg.cc/QxWSm4KL/methodology-2.jpg",
    content: {
      en: `The Learning Environment

The place where we learn is of paramount importance; we have to be comfortable and constantly stimulated. All our five senses contribute to absorbing the learning experience. The room is cozy, chairs are comfortable, walls are decorated with colorful pictures, music fills the air. Challenges, rewards and anticipation all create excitement. Music and games stimulate the brain. In all our workshops, the experience consists of all this plus, of course, the techniques. This is accelerated learning.

Emotional State

In traditional lessons, students were expected to draw on logic, opinions and knowledge. Therefore, retention was limited to (cognitive) abilities which did not appeal to everyone´s preferred learning style. When emotion is involved, motivation is created. People learn best when they are simultaneously stimulated and relaxed. When they are enjoying themselves. Emotional states and learning capacity are enhanced by the trainer's applications of elements: games, mysteries, movement, music, et al.

Voice and body language training

We may have neglected developing basic things in adult life like posture and voice. Proper vocal use is essential in all verbal communication, and body language is perhaps even more important. A simple regiment of voice exercises will make you sound clearer, more resounding and more serious. Practicing proper body language emphasizes our communication and aids clarity. In addition, we learn how to read others' non-verbal language, helping us to understand the other's meaning. When we realize that the true meaning is in how the receiver receives the information and adapt our communication to best suit our purposes, our skills in persuasion increase remarkably.

Personal Motivation

Robert Epstein, internationally acclaimed expert on human behavior, defines motivation as "an internal state of arousal that (often) precedes behavior." The basic two human motivations are either (1) towards pleasure or (2) away from pain; the more we structure our behaviors to number (1), the more we retain control our lives and the more motivated we are. We will learn how to plan our lives, set goals and keep promises to ourselves!

The Role of Music

Music is an important element in training. The right music at the right time stimulates emotional engagement and invokes retention. The tempos and keys in the music parallel the pacing of the environment.

Movement & Imagination

Imaginative, role-playing games and physical movement enrich verbal and written information with more meaning and, as a result, positive emotions are stimulated. This helps greatly in the learning process. Movement activates the so-called ´kinesthetic´ feeling onto the scene. Visualization skills enhance memory and creativity. The metaphors employed bring stronger meaning to the subject matter. You will assimilate and remember more.

Team Learning and Cooperation

In a cooperative work environment, more things get done in less time and with less hassle. Therefore we employ dynamic, social and cooperative activities that encourage participants to refine their talents as mentors, learners and colleagues. In this way, interpersonal skills are enriched and creative talents are stimulated. This element of teamwork is omnipresent in all the workshops.

Results, Feedback and Improvement

Learning expectations are clearly defined and shared with participants so that they can comprehend the relevance of the subject matter and measure progress. The data from this process is used to continuously improve and add value to planning, assessment, and improvement. To this end we have various means of feedback: constant review, questionnaires and meeting with the participants and constituents. Improvement can thus be guaranteed.`,
      cs: `Prostředí pro učení

Místo, kde se učíme, je nesmírně důležité; musíme se cítit pohodlně a být neustále stimulováni. Všech pět našich smyslů přispívá k vstřebávání učební zkušenosti. Místnost je útulná, židle pohodlné, stěny zdobí barevné obrazy a vzduch naplňuje hudba. Výzvy, odměny a očekávání vytvářejí vzrušení. Hudba a hry stimulují mozek. Ve všech našich workshopech se zkušenost skládá ze všeho zmíněného a samozřejmě z technik samotných. Tomu se říká akcelerované učení.

Emoční stav

V tradičních hodinách se od studentů očekávalo, že budou čerpat z logiky, názorů a znalostí. Zapamatování si tak bylo omezeno na (kognitivní) schopnosti, které neoslovovaly preferovaný styl učení každého z nás. Když je zapojena emoce, vzniká motivace. Lidé se učí nejlépe, když jsou současně stimulováni i uvolněni. Když si učení užívají. Emoční stavy a schopnost učit se jsou podporovány tím, jak lektor používá prvky: hry, záhady, pohyb, hudbu a další.

Trénink hlasu a řeči těla

V dospělém životě jsme možná zanedbali rozvoj základních věcí, jako je držení těla a hlas. Správné používání hlasu je zásadní pro veškerou verbální komunikaci a řeč těla je možná ještě důležitější. Jednoduchý režim hlasových cvičení zajistí, že budete znít jasněji, zvučněji a vážněji. Procvičování správné řeči těla zdůrazňuje naši komunikaci a napomáhá srozumitelnosti. Navíc se učíme číst neverbální řeč ostatních, což nám pomáhá porozumět jejich významu. Když si uvědomíme, že skutečný význam spočívá v tom, jak příjemce informaci přijme, a přizpůsobíme svou komunikaci tak, aby co nejlépe sloužila našim záměrům, naše přesvědčovací schopnosti pozoruhodně vzrostou.

Osobní motivace

Robert Epstein, mezinárodně uznávaný odborník na lidské chování, definuje motivaci jako „vnitřní stav vzrušení, který (často) předchází chování". Dvě základní lidské motivace jsou buď (1) směrem k potěšení, nebo (2) od bolesti; čím více strukturujeme své chování podle bodu (1), tím více si udržujeme kontrolu nad svými životy a tím jsme motivovanější. Naučíte se, jak plánovat svůj život, stanovovat si cíle a dodržovat sliby, které dáte sami sobě!

Role hudby

Hudba je důležitým prvkem tréninku. Správná hudba ve správný čas stimuluje emoční zapojení a podporuje zapamatování. Tempa a tóniny v hudbě odpovídají rytmu prostředí.

Pohyb a představivost

Imaginativní hry s rolemi a fyzický pohyb obohacují verbální a písemné informace o další význam, a v důsledku toho jsou stimulovány pozitivní emoce. To velmi pomáhá v procesu učení. Pohyb aktivuje takzvaný „kinestetický" pocit. Vizualizační schopnosti posilují paměť a kreativitu. Použité metafory přinášejí silnější význam danému tématu. Vstřebáte a zapamatujete si více.

Týmové učení a spolupráce

V kooperativním pracovním prostředí se zvládne více věcí za kratší čas a s menšími obtížemi. Proto využíváme dynamické, sociální a kooperativní aktivity, které účastníky povzbuzují, aby zdokonalovali své schopnosti jako mentoři, žáci i kolegové. Tímto způsobem jsou interpersonální dovednosti obohaceny a kreativní talenty stimulovány. Tento prvek týmové práce je přítomen ve všech workshopech.

Výsledky, zpětná vazba a zlepšování

Očekávání ohledně učení jsou jasně definována a sdílena s účastníky, aby mohli pochopit relevanci tématu a měřit pokrok. Data z tohoto procesu jsou využívána k neustálému zlepšování a přidávání hodnoty plánování, hodnocení a zdokonalování. Za tímto účelem využíváme různé prostředky zpětné vazby: průběžné hodnocení, dotazníky a setkání s účastníky a zúčastněnými stranami. Tím lze zlepšení zaručit.`,
    },
  },
  {
    slug: "hara-so-you-dont-fall-down",
    title: {
      en: "Hara, so you don't fall down",
      cs: "Hara, abyste neupadli",
    },
    excerpt: {
      en: "Discover the ancient Japanese secret of Hara: finding your center of gravity for balance, confidence, and control.",
      cs: "Objevte starodávné japonské tajemství Hara: najděte své těžiště pro rovnováhu, sebedůvěru a kontrolu.",
    },
    date: { en: "Mar 28, 2026", cs: "28. března 2026" },
    category: { en: "Mindset", cs: "Myšlení" },
    imageUrl: haraImg,
    content: {
      en: `In ancient Japan, to say that someone 'thinks with their head' was an insult. Thinking was understood as something that came from a point in the belly: the Hara. You've heard of Hara Kiri (ritualistic suicide by stabbing one's self in the gut). There are many other references to this special spot in ancient martial arts and sexuality texts.

According to these cultures, the body has its fulcrum in the Hara – (Dan tian in Chinese), (Seika Tanden or Kikai in Japanese). This point is considered the human's physical and spiritual gravity center.

After the brain, there are more nerve cells in the gut than any other body part, containing 100 million neurons – more than the spinal cord. The abdomen is, in neuro-physiological terms, a kind of 'second brain'. It's no coincidence that directing our attention there will have an immediate, physiological result.

Hara is located appx. 3 cm below the navel, and 3 cm inside (in the gut); you can feel it with your finger: probe around for the most sensitive spot in the area. It hurts when you press it. Concentrating ('focusing your energy') on this spot is accompanied by an instantaneous feeling of grounding and a physical feeling of balance. You can actually feel your weight getting redistributed. This grounding is
accompanied by a sense of confidence. It not only feels good, it also visibly manifests in your body posture and presence – other people will sense your confidence, and that cannot be bad.

The balance is cumulative: it gets easier with practice. Start with a few minutes a day, while walking on your daily rounds. The next time you feel you may lose your balance (on a rocky, icy, or uneven surface), just remember Hara and focus on it – equilibrium will appear, and you will not fall. Or when feeling uncertain or weak, anxiety's kicking in, aim your mind at your hara, and don't be surprised if you start feeling in control of yourself again. I credit Hara for enabling me to ride a
bicycle in chaotic traffic all over Chinese roads without incident.

In Kung Fu and Aikido, the hara is where all moves are based from. Figure skaters and acrobats know to concentrate on Hara to keep balance. It's basically the Yogi secret for sitting in the freezing cold. Spies know that focusing on Hara makes torture easier to withstand. But it's useful even for common things like walking on an icy street or standing in a moving bus. There is probably not a simpler, more basic technique that will have as broad an impact on your life. If breathing is the key, Hara is the door.

What does this mean in business? A benevolent leader is always grounded and their instructions come across as confident, motivating, and trustworthy. Go to your Hara while speaking – your presentations will appear more comfortable and persuasive.

According to the texts, the goal is to be aware of Hara 24/7, but that's for yogis and the like. Just practice it when you're walking, and it will get easier and easier. It works anywhere, anytime, from withstanding pain to stage-fright. Let me know if you lose your balance / step in dog poop / panic *a lot less*.`,
      cs: `Ve starověkém Japonsku byla věta, že někdo „myslí hlavou", urážkou. Myšlení bylo chápáno jako něco, co vychází z bodu v břiše: z Hary. Jistě jste slyšeli o Hara-kiri (rituální sebevraždě bodnutím do břicha). V dávných textech bojových umění i sexuality najdeme mnoho dalších odkazů na toto zvláštní místo.

Podle těchto kultur má tělo svůj opěrný bod v Haře – (Dan-tien v čínštině), (Seika Tanden nebo Kikai v japonštině). Tento bod je považován za fyzické i duchovní těžiště člověka.

Po mozku obsahuje střevo více nervových buněk než kterákoli jiná část těla – 100 milionů neuronů, více než mícha. Břicho je z neurofyziologického hlediska jakýmsi „druhým mozkem". Není náhoda, že nasměrování pozornosti právě sem má okamžitý fyziologický účinek.

Hara se nachází přibližně 3 cm pod pupkem a 3 cm dovnitř (do břicha); můžete ji nahmatat prstem: hledejte v této oblasti nejcitlivější místo. Při zatlačení to bolí. Soustředění („zaměření vaší energie") na toto místo je doprovázeno okamžitým pocitem ukotvení a fyzickým pocitem rovnováhy. Skutečně cítíte, jak se vaše váha přerozděluje. Toto ukotvení provází pocit sebejistoty. Nejenže se to dobře cítí, ale také se to viditelně projeví ve vašem držení těla a vystupování – ostatní vaši sebejistotu vycítí, a to nemůže být na škodu.

Rovnováha je kumulativní: s praxí to jde stále snáze. Začněte několika minutami denně při běžné chůzi. Až příště budete mít pocit, že ztrácíte rovnováhu (na kamenitém, zledovatělém nebo nerovném povrchu), vzpomeňte si na Haru a soustřeďte se na ni – rovnováha se dostaví a neupadnete. Nebo když se cítíte nejistí, slabí či vás přepadá úzkost, nasměrujte mysl na svou haru a nedivte se, že začnete znovu cítit, že máte sami nad sebou kontrolu. Haře vděčím za to, že jsem mohl bez nehod jezdit na kole v chaotickém provozu po celé Číně.

V kung-fu a aikidu je hara základem všech pohybů. Krasobruslaři a akrobaté vědí, že se musí soustředit na Haru, aby udrželi rovnováhu. Je to v podstatě tajemství jogínů pro sezení v mrazu. Špioni vědí, že zaměření na Haru usnadňuje snášení mučení. Ale je užitečná i pro běžné věci, jako je chůze po zledovatělé ulici nebo stání v jedoucím autobusu. Pravděpodobně neexistuje jednodušší a základnější technika, která by měla tak široký dopad na váš život. Pokud je dech klíčem, Hara jsou dveře.

Co to znamená v byznysu? Vstřícný lídr je vždy ukotvený a jeho pokyny působí sebejistě, motivačně a důvěryhodně. Při řeči se přeneste do své Hary – vaše prezentace budou působit přirozeněji a přesvědčivěji.

Podle textů je cílem být si Hary vědom 24 hodin denně, ale to je pro jogíny a podobně. Stačí ji procvičovat při chůzi a půjde to čím dál snáze. Funguje to kdekoli a kdykoli – od snášení bolesti až po trému. Dejte mi vědět, jestli ztratíte rovnováhu / šlápnete do psího exkrementu / propadnete panice *o hodně méně*.`,
    },
  },
  {
    slug: "my-secret-cv",
    title: {
      en: "13 jobs you won't find on my CV",
      cs: "13 prací, které v mém životopise nenajdete",
    },
    excerpt: {
      en: "Former jobs that led me to where I am today",
      cs: "Dřívější zaměstnání, která mě dovedla tam, kde jsem dnes",
    },
    date: { en: "Mar 15, 2026", cs: "15. března 2026" },
    category: { en: "Personal", cs: "Osobní" },
    imageUrl: cvImg,
    content: {
      en: `**Newspaper carrier**: from the ages of 13 to 16, I delivered the daily paper "Newsday".

**Babysitter**: for about 4 teenage years, while my friends were out drinking and gallivanting, I regularly babysat for 6 families in Long Island, NY. Yeah, even on New Years Eve.

**Flower delivery**: Pennock Wholesale Flowers, Plainview, NY. Delivered flowers to florists around Long Island. I had to know the names of all flowers we sold. My mom liked all the flowers I would bring home every day.

**University Law Enforcement Department (ULED) "Escort" service**. Night shifts during my first year at Binghamton University. If someone felt unsafe walking around campus at night, they could call Security and I would get a call by walkie-talkie: who to escort where. Between escorts I would monitor the peace and fire extinguishers in the dormitories, basements, lecture halls etc. I learned how to wield authority and responsibility professionally and friendly, even as a 'security guy'.

**Home Oxygen delivery**: for 4 summers while at university, I delivering (heavy) liquid oxygen tanks to dying patients all over NYC and Long Island. It paid well, thanks to hazard pay and heavy lifting. I regularly visited and spent time with these patients, each deathly afraid of not getting their O2 on time. I learned to organize my schedule so as to deliver the right amount of oxygen at the right time. And I got to refine my 'bedside manner'.

**Asbestos abatement**: South Bronx, NYC, 1990.
I wasn't actually removing the asbestos, but I had to don a hazmat suit at 8am to set up the air meter, and again at 4pm to take readings. In between, I either slept in the car and/or wandered around the most dangerous neighborhood in the City.

**Bartender**: "The Last Waterhole", red light district, Amsterdam, 1991-92. Probably the most fun job I ever had. Live band every night! I learned how to persuade drunk and sometimes aggressive people to go home at closing time. I never had to use the emergency 'protection' hotline to call the Hell's Angels.

**Cook**: kitchen work in various restaurants (1990s) in Amsterdam, NL. Managed the kitchen in two of these restaurants, in Diemen, and on Zeedijk.

**Rhetorical consultant**: "Network CV" Amsterdam, NL, 1991-1993.
Established a CV and resume writing service. I made flyers and placed them in employment agencies, eventually coaching job candidates at all levels.

**Telemarketing**: Amsterdam, NL, 1994. Selling 'international lottery tickets' to Brits over the phone. I eventually figured out that the company was not actually buying any lottery tickets, but was instead acting as the lottery. That pissed me off but I finished out the contract.

**Manager at Sauna Fenomeen**: Amsterdam, NL, 1995-1999.
Volunteer on the board and weekly shifts behind the bar. My mandate at this squatter's sauna club was to turn it from an illegal club to a legal one, with all the associated regulations. As most of the members were anarchists, this was an exercise in diplomacy, to say the least. I had to fire several people :(`,
      cs: `**Roznašeč novin**: ve věku od 13 do 16 let jsem roznášel deník „Newsday" na trase více než 30 domů v Plainview, NY (zabralo to asi 2 hodiny denně, déle, pokud jsem s sebou měl mladšího bratra nebo psa). Navíc jsem musel od každého zákazníka na trase vybírat týdenní poplatky a spropitné. Vždy se našli lidé, ke kterým bylo těžké se dostat, nebo prostě neradi platili. Zpětně vzato to bylo nepravděpodobné živobytí, ale co jiného jsem v tom věku mohl dělat? Otevřelo mi to světy odpovědnosti, samostatnosti a vytrvalosti.

**Hlídání dětí**: po dobu asi 4 let v dospívání, zatímco moji kamarádi popíjeli a flámovali, jsem pravidelně hlídal pro 6 rodin na Long Islandu, NY. Ano, i na Silvestra.

**Rozvoz květin**: Pennock Wholesale Flowers, Plainview, NY. Rozvážel jsem květiny do květinářství po celém Long Islandu. Musel jsem znát názvy všech květin, které jsme prodávali. Mé mámě se líbily všechny květiny, které jsem každý den přinesl domů.

**„Eskortní" služba Univerzitní bezpečnostní jednotky (ULED)**. Noční směny během mého prvního roku na Binghamton University. Pokud se někdo necítil bezpečně při chůzi po kampusu v noci, mohl zavolat ostrahu a já jsem dostal výzvu vysílačkou: koho a kam doprovodit. Mezi doprovody jsem hlídal klid a hasicí přístroje na kolejích, ve sklepech, přednáškových sálech atd. Naučil jsem se, jak profesionálně a přátelsky uplatňovat autoritu a odpovědnost, i jako „chlap od ostrahy".

**Rozvoz domácího kyslíku**: po 4 léta během vysoké školy jsem rozvážel (těžké) nádoby s tekutým kyslíkem umírajícím pacientům po celém NYC a Long Islandu. Platilo to dobře, díky příplatkům za rizikovou práci a těžké břemeno. Tyto pacienty jsem pravidelně navštěvoval a trávil s nimi čas, každý z nich měl smrtelný strach, že kyslík nedostane včas. Naučil jsem se organizovat si rozvrh tak, abych dodal správné množství kyslíku ve správný čas. A mohl jsem zdokonalit své „chování u lůžka".

**Odstraňování azbestu**: South Bronx, NYC, 1990.
Azbest jsem ve skutečnosti neodstraňoval, ale musel jsem si v 8 ráno obléknout ochranný oblek, abych nastavil měřič vzduchu, a v 16 hodin znovu, abych zaznamenal hodnoty. Mezitím jsem buď spal v autě, anebo se toulal po nejnebezpečnější čtvrti města.

**Barman**: „The Last Waterhole", čtvrť červených luceren, Amsterdam, 1991–92. Pravděpodobně nejzábavnější práce, kterou jsem kdy měl. Každý večer živá kapela! Naučil jsem se přesvědčit opilé a někdy agresivní lidi, aby v zavírací době šli domů. Nikdy jsem nemusel použít nouzovou „ochrannou" linku a zavolat Hell's Angels.

**Kuchař**: práce v kuchyních různých restaurací (90. léta) v Amsterdamu, NL. Vedl jsem kuchyni ve dvou z těchto restaurací, v Diemenu a na Zeedijku.

**Rétorický poradce**: „Network CV" Amsterdam, NL, 1991–1993.
Založil jsem službu pro psaní životopisů. Vyrobil jsem letáky a umístil je do pracovních agentur, postupně jsem koučoval uchazeče o zaměstnání na všech úrovních.

**Telemarketing**: Amsterdam, NL, 1994. Prodej „mezinárodních losů" Britům po telefonu. Nakonec jsem zjistil, že společnost ve skutečnosti žádné losy nekupuje, ale sama jednala jako loterie. To mě naštvalo, ale dokončil jsem smlouvu.

**Manažer v Sauna Fenomeen**: Amsterdam, NL, 1995–1999.
Dobrovolník ve správní radě a týdenní směny za barem. Mým úkolem v tomto squatterském saunovém klubu bylo proměnit ho z nelegálního klubu na legální, se vším, co k tomu patří. Protože většina členů byli anarchisté, bylo to mírně řečeno cvičení v diplomacii. Musel jsem několik lidí propustit :(`,
    },
  },
  {
    slug: "storytelling-is-not-optional-anymore",
    title: {
      en: "Storytelling Is Not Optional Anymore",
      cs: "Storytelling už není volitelný",
    },
    excerpt: {
      en: "In a world of AI-generated everything, your story is the last unfakeable asset.",
      cs: "Ve světě, kde vše generuje AI, je váš příběh posledním nezfalšovatelným aktivem.",
    },
    date: { en: "Feb 28, 2026", cs: "28. února 2026" },
    category: { en: "Storytelling", cs: "Storytelling" },
    imageUrl: storytellingImg,
    content: {
      en: "Content coming soon. Check back later for the full article.",
      cs: "Obsah bude brzy k dispozici. Vraťte se prosím později pro celý článek.",
    },
  },
];
