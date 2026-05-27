// Bilingual content for service detail pages.
// Each string field is a {en, cs} pair so that Lovable's Visual Editor can
// target the English or Czech literal independently when the language toggle
// is switched. ServiceDetail.tsx uses pickL() to render the active language.

export type L = { en: string; cs: string };

export const pickL = (value: L | string | undefined, lang: "en" | "cs"): string => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] || value.en || "";
};

export const pickLArr = (
  value: L[] | string[] | undefined,
  lang: "en" | "cs"
): string[] => {
  if (!value) return [];
  return value.map((v) => pickL(v as L | string, lang));
};

export interface ServiceSection {
  title: L;
  paragraphs?: L[];
  bullets?: L[];
  numbered?: L[];
  hatBullets?: { hat: L; color: string; image: string; description: L }[];
}

export interface ServiceTableRow {
  phase: L;
  action: L;
  outcome: L;
}

export interface ServiceDetailContent {
  pageTitle?: L;
  lead?: L;
  taglines?: L[];
  intro: L[];
  sections: ServiceSection[];
  tableTitle?: L;
  tableRows?: ServiceTableRow[];
  highlight?: {
    title: L;
    text: L;
  };
  highlightPosition?: "top" | "bottom";
  tone?: "default" | "executive";
}

export const serviceDetails: Record<string, ServiceDetailContent> = {
  "presentation-speaking-skills": {
    pageTitle: { en: "Persuasive Presentations", cs: "Přesvědčivé prezentace" },
    lead: { en: "Learn the rhetoric and mechanics to win any audience", cs: "Naučte se mechaniku a rétoriku, abyste si získali jakékoliv publikum" },
    intro: [
      { en: "This workshop is designed especially for anyone who needs to present in front of a group. Most of the techniques are universal, across any culture, business or personal. ", cs: "Tento workshop je určen především lidem, kteří potřebují prezentovat před multikulturní skupinou. Techniky, které si osvojíte, jsou však univerzální a uplatní se v jakékoliv firemní kultuře." },
      { en: "The training is rather hands-on \"technical\" in nature: we will practice the nuances of vocal usage, non-verbal language and rhetorical techniques, all designed to attract the audience, focus them where we want, and keep their attention. With these techniques and a healthy dose of self-control, anyone can learn how to be confident and persuasive in front of a group, even those with stage-fright.", cs: "Trénink je poměrně praktický a „technický\" v tom smyslu, že si vyzkoušíme nuance práce s hlasem, neverbální komunikaci a rétorické techniky — vše navržené tak, aby přitáhlo publikum, zaměřilo jeho pozornost tam, kam potřebujeme, a udrželo ji. S těmito technikami a zdravou dávkou sebekontroly se kdokoliv naučí být před skupinou sebejistý a přesvědčivý, i ten, kdo trpí trémou." },
      { en: "The trainer focuses on revealing specific points for individual improvement and repeating correct behaviours. After completing this workshop, you will have all the tools necessary to speak confidently, persuasively, and motivate your audience to action.", cs: "Trenér se zaměřuje na odhalení konkrétních bodů pro individuální zlepšení a na opakování správných návyků. Po absolvování tohoto workshopu budete mít všechny nástroje potřebné k tomu, abyste mluvili sebejistě, přesvědčivě a dokázali motivovat své publikum k činu." },
    ],
    sections: [
      {
        title: { en: "Program Benefits", cs: "Přínosy programu" },
        paragraphs: [
          { en: "Enhanced self-confidence of speakers by proper preparation, calming the nerves, increased concentration and rhetorical skills. The goal is to appear pleasant, authoritative and, thereby, motivating. You will learn more than just public speaking; you will be a better communicator overall.", cs: "Zvýšená sebejistota řečníků díky správné přípravě, zklidnění nervů, vyšší koncentraci a rétorickým dovednostem. Cílem je působit příjemně, autoritativně a tím i motivačně. Naučíte se víc než jen veřejné vystupování — stanete se celkově lepším komunikátorem." },
        ],
      },
      {
        title: { en: "Program Contents", cs: "Obsah programu" },
        bullets: [
          { en: "Individual video-camera work with analysis and feedback", cs: "Individuální práce s videokamerou s analýzou a zpětnou vazbou" },
          { en: "Vocal hygiene and the 4 vocal elements of persuasive speech: Inflection, Intonation, Pauses, Word emphasis", cs: "Hlasová hygiena a 4 hlasové prvky přesvědčivé řeči: modulace, intonace, pauzy, důraz slov" },
          { en: "Introduction and Conclusion — the most important parts of your speech", cs: "Úvod a závěr — nejdůležitější části vašeho projevu" },
          { en: "How to build rapport and credibility with your audience", cs: "Jak si vybudovat vztah a důvěryhodnost u publika" },
          { en: "Gaining and keeping audience attention", cs: "Jak získat a udržet pozornost publika" },
          { en: "Visual aids: how to do it and NOT to do it!", cs: "Vizuální pomůcky: jak je používat a jak NE!" },
          { en: "Body language — use it to emphasize your strong points and play down the weaker ones", cs: "Řeč těla — využijte ji ke zdůraznění silných stránek a k zmírnění těch slabších" },
          { en: "Effective words and phrases used in presentations", cs: "Efektivní slova a fráze používané v prezentacích" },
          { en: "How to handle a hostile audience", cs: "Jak zvládnout nepřátelské publikum" },
          { en: "How to handle audience questions", cs: "Jak zvládat otázky z publika" },
          { en: "Overcoming nerves: cure the jitters in 1 minute!", cs: "Překonání nervozity: zbavte se trémy za 1 minutu!" },
          { en: "Optional third day follow up (usually 1-6 months later): making sure all skills have been maintained, plus expanded techniques for rhetoric and persuasion", cs: "Volitelný třetí den navazujícího tréninku (obvykle 1–6 měsíců poté): ověření, že si dovednosti udržujete, plus rozšířené techniky rétoriky a přesvědčování" },
        ],
      },
      {
        title: { en: "Training Methods", cs: "Metody tréninku" },
        paragraphs: [
          { en: "This is a highly interactive workshop, training the verbal and non-verbal skills necessary to deliver any kind of presentation (informative or persuasive). Techniques and activities will demonstrate and practice everything needed to perform a public-speaking task — and to make it compelling. Participants give short presentations on camera, with subsequent trainer analysis and corrections. The videos invariably reveal improvement, often significant. Feedback is encouraged at all times.", cs: "Jde o vysoce interaktivní workshop, který trénuje verbální i neverbální dovednosti potřebné k přednesení jakékoliv prezentace (informativní i přesvědčovací). Techniky a aktivity ukazují a procvičují vše, co je k veřejnému vystupování potřeba — a jak ho udělat zajímavým. Účastníci přednášejí krátké prezentace na kameru, následuje analýza trenéra a korekce. Videa pokaždé ukazují zlepšení, často výrazné. Zpětná vazba je vítána po celou dobu." },
        ],
      },
    ],
  },
  "live-webinars": {
    pageTitle: { en: "Choose from these interactive webinars. Inquire about each, or use the general form at the bottom ⬇️", cs: "Vyberte si z těchto interaktivních webinářů. Pošlete dotaz ke konkrétnímu, nebo použijte obecný formulář níže ⬇️" },
    lead: { en: "Turn on your camera and unmute your microphone! Learn all sorts of stuff online in +/- two hours, just about any time of day.", cs: "Zapněte kameru a odhlučněte mikrofon! Online se naučíte spoustu věcí přibližně za dvě hodiny, prakticky kdykoliv během dne." },
    intro: [],
    sections: [],
  },
  "six-hats": {
    pageTitle: { en: "Six Thinking Hats", cs: "Šest klobouků myšlení" },
    lead: { en: "Helping managers improve team communication by fixing how meetings work, enabling parallel thinking and reaching faster decisions for measurable productivity.", cs: "Pomáháme manažerům zlepšit komunikaci v týmu opravou způsobu, jakým fungují porady — umožňujeme paralelní myšlení a rychlejší rozhodování s měřitelnou produktivitou." },
    intro: [
      { en: "Howard will come to your meeting room and, together with your team, demonstrate this fun and innovative method (+/- 3 hours).", cs: "Howard přijde k vám do zasedací místnosti a společně s týmem vám tuto zábavnou a inovativní metodu předvede (cca 3 hodiny)." },
      { en: "{{COLUMNS}}Most meetings are:|too long|unclear|lead nowhere||The result?|wasted time|frustrated teams|slow decision-making{{/COLUMNS}}", cs: "{{COLUMNS}}Většina porad je:|příliš dlouhá|nejasná|nikam nevede||Výsledek?|ztracený čas|frustrované týmy|pomalé rozhodování{{/COLUMNS}}" },
      { en: "The 6 Thinking Hats framework is designed to facilitate creative, collaborative problem-solving discussions and meetings. Instead of the traditional meeting style, where people single-mindedly argue their points back and forth, around in circles, the 6 Hats method showcases parallel thinking — all participants are required to think and discuss — in sync!\n\nAll thinking styles are involved — one at a time — each hat is a different argumentation style. Everyone wears the same hat at the same time. All opinions are expressed at the right time, and consensus is reached smoother and quicker. The rules are simple and it takes a bit of self-discipline, but you'll immediately notice the difference as doors open up that you hadn't realized before.", cs: "Metodika 6 klobouků myšlení je navržena tak, aby usnadnila kreativní, společnou diskuzi a řešení problémů. Místo tradičního stylu porad, kde si lidé tvrdohlavě dokola brání své pozice, metoda 6 klobouků zavádí paralelní myšlení — všichni účastníci přemýšlejí a diskutují — synchronně!\n\nZapojené jsou všechny styly myšlení — postupně po jednom — každý klobouk představuje jiný styl argumentace. Všichni mají v daný okamžik nasazený stejný klobouk. Každý názor zazní ve správnou chvíli a konsenzus se hledá hladčeji a rychleji. Pravidla jsou jednoduchá a vyžadují jen trochu sebekázně, ale rozdíl ucítíte okamžitě — otevřou se dveře, o kterých jste netušili." },
      { en: "Many big and small companies — e.g. Prudential Insurance, Siemens, Boeing, IBM, 3M, among many others use this method to reduce meeting times and effectuate more grounded decision making.", cs: "Mnoho velkých i malých firem — např. Prudential Insurance, Siemens, Boeing, IBM, 3M a řada dalších — využívá tuto metodu ke zkrácení porad a ke kvalitnějšímu rozhodování." },
      { en: "{{BULLET_LIST}}Through hands-on workshops and consulting, you'll learn how to:|run shorter, focused meetings|make clear decisions|turn discussions into action{{/BULLET_LIST}}", cs: "{{BULLET_LIST}}Prostřednictvím praktických workshopů a konzultací se naučíte:|vést kratší a soustředěné porady|činit jasná rozhodnutí|proměnit diskuzi v akci{{/BULLET_LIST}}" },
      { en: "Now you can lead meetings that lead to real decisions, better collaboration, and less wasted time.", cs: "Nyní můžete vést porady, které vedou ke skutečným rozhodnutím, lepší spolupráci a menší ztrátě času." },
    ],
    sections: [
      {
        title: { en: "The Hats", cs: "Klobouky" },
        hatBullets: [
          { hat: { en: "White Hat", cs: "Bílý klobouk" }, color: "#FFFFFF", image: "white-hat", description: { en: "Neutral information; focus on available information, data, objective facts, what is needed, how can we get it?", cs: "Neutrální informace; zaměření na dostupná data, objektivní fakta, co potřebujeme a jak to získáme?" } },
          { hat: { en: "Black Hat", cs: "Černý klobouk" }, color: "#333333", image: "black-hat", description: { en: "Judgmental; criticism; why something is wrong; difficulties, risk assessment; logical negative view.", cs: "Hodnotící; kritika; proč něco nefunguje; obtíže, hodnocení rizik; logicky negativní pohled." } },
          { hat: { en: "Red Hat", cs: "Červený klobouk" }, color: "#E53E3E", image: "red-hat", description: { en: "Fire, warmth; emotions, feelings, intuition, brainstorming, gut instinct; presenting views without explanation or justification.", cs: "Oheň, vřelost; emoce, pocity, intuice, brainstorming, instinkt; vyjádření názorů bez vysvětlení či ospravedlnění." } },
          { hat: { en: "Green Hat", cs: "Zelený klobouk" }, color: "#38A169", image: "green-hat", description: { en: "Creative thinking; possibilities and hypotheses; alternatives, solutions, new ideas.", cs: "Kreativní myšlení; možnosti a hypotézy; alternativy, řešení, nové nápady." } },
          { hat: { en: "Yellow Hat", cs: "Žlutý klobouk" }, color: "#ECC94B", image: "yellow-hat", description: { en: "Sunshine; optimism; logical positive view; look for values and benefits, what is good, why it will work.", cs: "Slunce; optimismus; logicky pozitivní pohled; hledání hodnot a přínosů, co je dobré a proč to bude fungovat." } },
          { hat: { en: "Blue Hat", cs: "Modrý klobouk" }, color: "#4299E1", image: "blue-hat", description: { en: "Overview; control of process, steps and other hats; chairperson, organizer; thinking about thinking, managing thinking processes, focus, next steps, action plans.", cs: "Nadhled; řízení procesu, kroků a ostatních klobouků; předsedající, organizátor; přemýšlení o přemýšlení, řízení myšlenkových procesů, soustředění, další kroky, akční plány." } },
        ],
      },
      {
        title: { en: "When can you use Six Thinking Hats?", cs: "Kdy použít metodu Šesti klobouků?" },
        bullets: [
          { en: "Anytime there are differences of opinion in a business meeting", cs: "Kdykoliv vzniknou rozdílné názory na poradě" },
          { en: "Facilitation of meetings", cs: "Facilitace porad" },
          { en: "Continuous process improvement", cs: "Neustálé zlepšování procesů" },
          { en: "New products / designs", cs: "Nové produkty / návrhy" },
          { en: "Conflict resolution", cs: "Řešení konfliktů" },
          { en: "Decision making and problem solving", cs: "Rozhodování a řešení problémů" },
          { en: "Customer focus groups / interviews", cs: "Zákaznické fokusní skupiny / rozhovory" },
          { en: "Personnel and leadership development", cs: "Personální rozvoj a leadership" },
          { en: "Making difficult decisions at home", cs: "Obtížná rozhodnutí v rodině" },
        ],
      },
      {
        title: { en: "People who are comfortable sharing their ideas tend to show:", cs: "Lidé, kteří se nebojí sdílet své nápady, obvykle vykazují:" },
        bullets: [
          { en: "confidence that they have the ability to cope with and improve their environments", cs: "důvěru, že dokáží zvládat a zlepšovat své prostředí" },
          { en: "opportunity-thinking and problem-solving competencies: spot opportunities, assess usefulness, predict consequences, propose alternative solutions, and evaluate outputs", cs: "schopnost vidět příležitosti a řešit problémy: rozpoznat příležitosti, posoudit jejich užitečnost, předvídat důsledky, navrhnout alternativní řešení a vyhodnotit výsledky" },
          { en: "cooperative thinking competencies: can articulate another's point of view, devise an agenda, ensure equal participation", cs: "schopnost spolupracujícího myšlení: dokáží formulovat pohled druhého, sestavit agendu a zajistit rovnoměrnou účast" },
        ],
      },
    ],
  },
  "conflict-resolution": {
    pageTitle: { en: "Conflict Management", cs: "Řešení konfliktů" },
    lead: { en: "Learn to handle disputes, difficult people, and high-pressure conversations with clarity and control.", cs: "Naučte se řešit spory, jednat s obtížnými lidmi a zvládat náročné rozhovory s jasnou hlavou a pod kontrolou." },
    intro: [
      { en: "Most people try to avoid conflict. But conflict can result in innovation and new, improved understandings, if we know how to manage it. Rather than reacting on an emotional level, you can learn and practice the techniques to manage disputes and disagreements\u00A0pro-actively\u00A0and positively at work, at home, and in society.", cs: "Většina lidí se konfliktům vyhýbá. Konflikt však může vést k inovaci a novému, lepšímu porozumění — pokud ho dokážeme zvládnout. Místo emocionální reakce se můžete naučit a procvičit techniky, jak spory řešit\u00A0proaktivně\u00A0a pozitivně — v práci, doma i ve společnosti." },
      { en: "In addition to various acute conflict settings, we will also learn how to cope with chronically difficult people. There are 7 main types, each with its own solution.", cs: "Kromě nejrůznějších akutních konfliktních situací se naučíme zvládat i chronicky obtížné lidi. Existuje 7 hlavních typů a každý má vlastní řešení." },
      { en: "On video you will see yourself as others see you, followed by instant peer/trainer feedback. In the next video your improvement will be already visible, demonstrating your own success and adaptability.", cs: "Na videu uvidíte sami sebe tak, jak vás vidí ostatní, a dostanete okamžitou zpětnou vazbu od kolegů i trenéra. V dalším videu už bude zlepšení patrné — důkaz vaší schopnosti se přizpůsobit a uspět." },
      { en: "By increasing your sensitivity to others' behaviors, projecting yourself properly in crucial situations and exercising self control, you will be able to respond constructively in difficult discussions. The result is better relationships and, ultimately, increased success..", cs: "Zvýšením citlivosti k chování druhých, správnou prezentací sebe sama v klíčových situacích a sebekontrolou dokážete v obtížných diskuzích reagovat konstruktivně. Výsledkem jsou lepší vztahy a v konečném důsledku větší úspěch." },
    ],
    sections: [
      {
        title: { en: "Goals", cs: "Cíle" },
        bullets: [
          { en: "Identify the filters of perception\u00A0and the root causes of conflict", cs: "Rozpoznat filtry vnímání\u00A0a kořenové příčiny konfliktu" },
          { en: "See the big picture and identify alternate angles of perception", cs: "Vidět celý obraz a rozpoznat alternativní úhly pohledu" },
          { en: "Practice effective listening and when to shut up", cs: "Procvičit efektivní naslouchání a vědět, kdy mlčet" },
          { en: "Increase your personal impact and credibility", cs: "Zvýšit osobní dopad a důvěryhodnost" },
          { en: "Effectively give and get feedback", cs: "Efektivně dávat a přijímat zpětnou vazbu" },
          { en: "Make sure you are never misunderstood", cs: "Zajistit, abyste nikdy nebyli špatně pochopeni" },
          { en: "Handle difficult meetings sensitively and constructively", cs: "Zvládat obtížné porady citlivě a konstruktivně" },
          { en: "Speak fluently and confidently even under stress", cs: "Mluvit plynule a sebejistě i pod stresem" },
          { en: "Become aware of your emotional triggers and prevent explosive situations", cs: "Uvědomit si své emoční spouštěče a předcházet výbušným situacím" },
          { en: "Control anger with a simple technique", cs: "Ovládat hněv jednoduchou technikou" },
          { en: "Learn the 7 Types of Difficult People, their ways, and how to neutralize them", cs: "Naučit se 7 typů obtížných lidí, jejich chování a jak je neutralizovat" },
        ],
      },
      {
        title: { en: "Solutions for Conflict Situations", cs: "Řešení konfliktních situací" },
        bullets: [
          { en: "Understand your own and the other person's style, then identify and react accordingly", cs: "Pochopit svůj styl i styl druhé strany a podle toho reagovat" },
          { en: "Use intervention, mediation and voluntary arbitration as the process for settling issues", cs: "Využít intervenci, mediaci a dobrovolnou arbitráž jako způsob řešení sporů" },
          { en: "Settle disputes through an empowering process", cs: "Řešit spory procesem, který posiluje obě strany" },
          { en: "Develop the art, science and practice of conflict resolution", cs: "Rozvíjet umění, vědu i praxi řešení konfliktů" },
          { en: "Maintain constructive joint processes to create organizational effectiveness", cs: "Udržovat konstruktivní společné procesy pro efektivitu organizace" },
          { en: "Remember everyone's interests and try to help each protect theirs", cs: "Pamatovat na zájmy všech a pomoci každému je hájit" },
          { en: "Offer a practical way to resolve disputes and preserve relationships", cs: "Nabídnout praktický způsob, jak řešit spory a zachovat vztahy" },
          { en: "Find any common ground and use this leverage to go forward", cs: "Najít společnou půdu a využít ji k dalšímu postupu" },
        ],
      },
      {
        title: { en: "Methods", cs: "Metody" },
        paragraphs: [
          { en: "As an 'intruder' it's my job to be as non-invasive as possible. My unbiased tactics may unnerve you but my position is secondary, occasionally commenting or asking a question to clarify. I can't help but be funny, not particularly intimidating, and I tend to make people feel comfortable. I identify the crux of the matter and facilitate a productive discussion. Meetings are usually shorter than expected, with outcomes both sides can live with. ", cs: "Jako „vetřelec\" se snažím být co nejméně rušivý. Moje nestranné postupy vás možná zaskočí, ale moje pozice je vedlejší — občas okomentuji či položím otázku k upřesnění. Nedokážu si pomoct, jsem zábavný, nepůsobím zastrašujícím dojmem a lidé se v mé přítomnosti cítí dobře. Najdu jádro problému a usnadním produktivní diskuzi. Porady bývají kratší, než se čeká, a obě strany odcházejí s výsledkem, se kterým mohou žít. " },
        ],
      },
    ],
  },
  "brainstorming-sessions": {
    pageTitle: { en: "Brainstorming Sessions", cs: "Brainstormingové workshopy" },
    lead: { en: "Turn your meeting into a movement.", cs: "Proměňte poradu v hnutí." },
    intro: [
      { en: "Is your team stuck in the same-old-ideas loop? Most corporate brainstorming fails because it's too polite, too structured, or just plain boring. With high-energy, un-filtered brainstorming sessions, we can extract the brilliance your team already has, but doesn't know how to raise to the surface.", cs: "Jede váš tým pořád dokola se stejnými nápady? Většina firemních brainstormingů selhává, protože je příliš zdvořilá, příliš strukturovaná nebo prostě nudná. Energickými, nefiltrovanými brainstormingy dokážeme vytáhnout brilanci, kterou váš tým už má, jen ji neumí dostat na povrch." },
      { en: "We're not here to align — we're here to invent.", cs: "Nejsme tu od toho, abychom hledali shodu — jsme tu od toho, abychom vymýšleli." },
      { en: "Brainstorming is a group problem-solving method involving the spontaneous contribution of ideas from all members of the group. This means that all members are encouraged to share their ideas with no limitations.", cs: "Brainstorming je skupinová metoda řešení problémů, při níž všichni členové spontánně přispívají nápady. To znamená, že se každý vybízí, aby své nápady sdílel bez jakéhokoli omezení." },
      { en: "Whether it's a distribution issue, PR damage control, a takeover bid or an ad campaign, innovation is the key to keeping ahead of the competition. This is what brainstorming is all about — coming up with a unique solution that might well be thinking outside the box.", cs: "Ať už jde o problém s distribucí, krizovou PR komunikaci, nabídku převzetí firmy nebo reklamní kampaň — inovace je klíčem k tomu, jak udržet náskok před konkurencí. O tom je brainstorming: přijít s jedinečným řešením, které je klidně mimo zavedené rámce." },
    ],
    sections: [
      {
        title: { en: "What the session feels like", cs: "Jak workshop vypadá" },
        bullets: [
          { en: "The messy middle is encouraged: we start with a blank canvas and end with a roadmap", cs: "Chaos uprostřed je vítán: začínáme s prázdnou plochou a končíme s plánem" },
          { en: "Ink everywhere: expect boards covered in arrows, circles, and wild connections", cs: "Inkoust všude: počítejte s tabulemi plnými šipek, kruhů a divokých propojení" },
          { en: "Rapid-fire iteration: we scribble, pivot, and scrap the safe ideas until we find the gold", cs: "Rychlá iterace: čmáráme, otáčíme směr a zahazujeme bezpečné nápady, dokud nenajdeme zlato" },
          { en: "Exhilarating and exhausting in that order", cs: "Vzrušující a vyčerpávající — přesně v tomto pořadí" },
        ],
      },
    ],
    tableTitle: { en: "How does a brainstorming session look?", cs: "Jak vypadá brainstormingový workshop?" },
    tableRows: [
      {
        phase: { en: "Deconstruction", cs: "Dekonstrukce" },
        action: { en: "We tear apart the current problem until we find the root cause.", cs: "Rozebereme současný problém, dokud nenajdeme jeho kořen." },
        outcome: { en: "Total clarity on the why.", cs: "Naprostá jasnost v tom, proč." },
      },
      {
        phase: { en: "Scribble Storm", cs: "Bouře nápadů" },
        action: { en: "Non-stop visual mapping. No idea is too dumb to go on the board.", cs: "Nepřetržité vizuální mapování. Žádný nápad není tak hloupý, aby se nedostal na tabuli." },
        outcome: { en: "A massive pool of raw potential.", cs: "Obrovský bazén surového potenciálu." },
      },
      {
        phase: { en: "Kill-Chain", cs: "Vyřazování" },
        action: { en: "We ruthlessly cut the fluff and stress-test the strongest concepts.", cs: "Bezohledně osekáme zbytečnosti a podrobíme zátěžovému testu nejsilnější koncepty." },
        outcome: { en: "A refined list of viable winners.", cs: "Vytříbený seznam životaschopných vítězů." },
      },
      {
        phase: { en: "Blueprint", cs: "Plán realizace" },
        action: { en: "We turn the board scribbles into a concrete action plan.", cs: "Čmáranice z tabule proměníme v konkrétní akční plán." },
        outcome: { en: "Immediate next steps for your team.", cs: "Okamžité další kroky pro váš tým." },
      },
    ],
  },
  storytelling: {
    pageTitle: { en: "The Art of Storytelling", cs: "Umění vyprávění příběhů" },
    taglines: [
      { en: "Empower your team to connect with story.", cs: "Dejte svému týmu sílu spojit se prostřednictvím příběhu." },
      { en: "facts tell, stories sell", cs: "Fakta informují, příběhy prodávají." },
    ],
    intro: [
      { en: "Stop delivering data and start driving action. This isn't just about telling better anecdotes; it's about mastering the biological triggers that command attention. This training will give you the specific tools to connect with your listeners and, if your goal is to motivate someone to take direct action, you'll be better equipped. Whether you're pitching a board or leading a team, these techniques will transform the way you speak in public forever.", cs: "Přestaňte podávat data a začněte vyvolávat akci. Nejde jen o lepší vyprávění historek — jde o ovládnutí biologických spouštěčů, které řídí pozornost. Tento trénink vám dá konkrétní nástroje, jak se spojit s posluchači, a pokud je vaším cílem někoho motivovat k přímé akci, budete mít lepší výbavu. Ať už prezentujete před představenstvem nebo vedete tým, tyto techniky navždy promění způsob, jakým mluvíte na veřejnosti." },
    ],
    sections: [
      {
        title: { en: "You, Your Message, Your Audience", cs: "Vy, vaše sdělení, vaše publikum" },
        numbered: [
          { en: "Your state, voice and body as an instrument through which you will deliver your message. Use it, vary it, and this will keep your audience focused as much as, or even more than, your story.", cs: "Vaše vnitřní rozpoložení, hlas a tělo jako nástroj, kterým předáváte své sdělení. Používejte ho, obměňujte — udrží publikum soustředěné stejně, ne-li víc, než samotný příběh." },
          { en: "Your message itself. Howard has developed a methodology for telling stories and delivering messages that is guaranteed to resonate with your audience. This method is based on a proven storytelling formula.", cs: "Samotné sdělení. Howard vyvinul metodiku vyprávění příběhů a předávání sdělení, která zaručeně rezonuje s publikem. Tato metoda vychází z osvědčeného vypravěčského vzorce." },
          { en: "Your audience — no two audiences are the same. Read your audience and be able to shift gears when necessary.", cs: "Vaše publikum — žádná dvě publika nejsou stejná. Čtěte je a buďte schopni přeřadit, když je potřeba." },
        ],
      },
      {
        title: { en: "Who is this course for?", cs: "Pro koho je tento kurz?" },
        bullets: [
          { en: "Mentors and leaders who want to impact their employees to motivation and success", cs: "Mentory a lídry, kteří chtějí své zaměstnance motivovat k úspěchu" },
          { en: "Professionals who want to deliver memorable presentations with greater impact", cs: "Profesionály, kteří chtějí přednášet zapamatovatelné prezentace s větším dopadem" },
          { en: "Anyone who likes to tell stories in the pub, around the fire, etc.", cs: "Kohokoliv, kdo rád vypráví příběhy v hospodě, u ohně apod." },
        ],
      },
      {
        title: { en: "Refined through perfect feedback", cs: "Vybroušené dokonalou zpětnou vazbou" },
        paragraphs: [
          { en: "Whether you prefer telling personal, traditional, or fictional stories, we'll help you tighten them up and get them audience-ready. Carefully orchestrated trainer and peer feedback provide suggestions to improve not only the story, but also how you tell it. Everyone is invited to bring a 3 to 7-minute story, joke, anecdote, or similar piece for Round One.", cs: "Ať už raději vyprávíte osobní, tradiční nebo smyšlené příběhy, pomůžeme vám je vypilovat a připravit pro publikum. Pečlivě řízená zpětná vazba trenéra i kolegů přináší podněty, jak zlepšit nejen příběh, ale i způsob, jakým ho podáváte. Každý je zván, aby si na první kolo přinesl příběh, vtip nebo anekdotu v délce 3 až 7 minut." },
        ],
      },
    ],
  },
  "communication-skills": {
    pageTitle: { en: "Interpersonal Communication Training", cs: "Trénink mezilidské komunikace" },
    intro: [
      { en: "It's universally affirmed that personal relationships are the most important factor in any business. Communication is the oil for the machine. With a few techniques you can make a good impression, be a good listener, maybe use some charisma, and motivate people. Understanding the nuances of communication will help you avoid misunderstandings, and fix them when they occur. Optional Leadership module.", cs: "Obecně se uznává, že osobní vztahy jsou nejdůležitějším faktorem v jakémkoliv podnikání. Komunikace je olejem celého stroje. Pomocí několika technik můžete udělat dobrý dojem, naslouchat, využít trochu charismatu a motivovat lidi. Pochopení nuancí komunikace vám pomůže předcházet nedorozuměním a napravit je, když nastanou. Volitelný modul Leadership." },
      { en: "In this workshop, you will practice how to project yourself more effectively and persuasively by connecting with others, carefully following, guiding, and motivating them. Learn how to craft your message so as to evoke the response you desire. In practically any situation you may find yourself in.", cs: "V tomto workshopu si vyzkoušíte, jak působit efektivněji a přesvědčivěji díky spojení s druhými, pozornému naslouchání, vedení a motivaci. Naučíte se formulovat sdělení tak, aby vyvolalo požadovanou reakci. Prakticky v jakékoliv situaci, do které se dostanete." },
    ],
    sections: [
      {
        title: { en: "Workshop Contents", cs: "Obsah workshopu" },
        bullets: [
          { en: "Vocal hygiene — exercise for a resonating voice", cs: "Hlasová hygiena — cvičení pro rezonující hlas" },
          { en: "The basic communication styles\u00A0how we can adapt,\u00A0and how to deal with them", cs: "Základní komunikační styly\u00A0jak se přizpůsobit\u00A0a jak je zvládat" },
          { en: "\n", cs: "\n" },
          { en: "\n", cs: "\n" },
          { en: "Hara: learn the power of speaking from your gut", cs: "Hara: poznejte sílu mluvení z břicha" },
          { en: "Vocal intonation for the proper authority", cs: "Hlasová intonace pro správnou autoritu" },
          { en: "Active listening", cs: "Aktivní naslouchání" },
          { en: "Gaining rapport", cs: "Budování vztahu (rapport)" },
          { en: "Empathy: the 180-degree mindset", cs: "Empatie: 180stupňové myšlení" },
          { en: "Take Me, Please! — a game to identify working styles", cs: "Take Me, Please! — hra na rozpoznání pracovních stylů" },
          { en: "Role playing on camera, analysis and feedback", cs: "Hraní rolí na kameru, analýza a zpětná vazba" },
          { en: "\n", cs: "\n" },
          { en: "Overcoming objections", cs: "Překonávání námitek" },
          { en: "Assertiveness — 2/4 Step Technique", cs: "Asertivita — technika 2/4 kroků" },
          { en: "Constructive feedback: giving, receiving and requesting", cs: "Konstruktivní zpětná vazba: dávat, přijímat a žádat o ni" },
          { en: "\n", cs: "\n" },
          { en: "\n", cs: "\n" },
          { en: "4 barriers to communication and overcoming them", cs: "4 bariéry komunikace a jak je překonat" },
          { en: "Dealing with difficult people", cs: "Jednání s obtížnými lidmi" },
          { en: "Reframing — how to use it effectively and ethically", cs: "Přerámování — jak ho používat efektivně a eticky" },
          { en: "SOFTEN technique for winning friends and influencing people", cs: "Technika SOFTEN pro získávání přátel a ovlivňování lidí" },
          { en: "\n", cs: "\n" },
        ],
      },
      {
        title: { en: "Benefits", cs: "Přínosy" },
        bullets: [
          { en: "Speak calmly and confidently, even under stress", cs: "Mluvit klidně a sebejistě i pod stresem" },
          { en: "Maximize your credibility and impact with non-verbal skills", cs: "Maximalizovat důvěryhodnost a dopad neverbálními dovednostmi" },
          { en: "Learn the techniques to use for the rest of your life", cs: "Naučit se techniky využitelné po celý život" },
          { en: "Handle difficult discussions sensitively and constructively", cs: "Zvládat obtížné diskuze citlivě a konstruktivně" },
          { en: "Assertiveness: make your point and defend your space", cs: "Asertivita: prosadit svůj názor a obhájit svůj prostor" },
          { en: "Overcome objections and express your requirements, even with difficult people", cs: "Překonat námitky a vyjádřit své požadavky i s obtížnými lidmi" },
          { en: "Eased dealing with conflict", cs: "Snadnější zvládání konfliktů" },
          { en: "Motivate others to action", cs: "Motivovat ostatní k akci" },
        ],
      },
      {
        title: { en: "Training Methods", cs: "Metody tréninku" },
        paragraphs: [
          { en: "Experiential training by role-playing and resolving model situations. These are recorded, analysed by the trainer with appropriate feedback.", cs: "Zážitkový trénink formou hraní rolí a řešení modelových situací. Ty se nahrávají a trenér je analyzuje s odpovídající zpětnou vazbou." },
          { en: "The trainer focuses on revealing and repeating correct behaviors, demonstrating the most useful rhetorical formulations, non-verbal signals, and self-control mechanisms. Feedback is encouraged in all workshops and seminars. Everyone is kindly asked to participate and give feedback. There is space for everyone.", cs: "Trenér se zaměřuje na odhalení a opakování správného chování, předvedení nejužitečnějších rétorických formulací, neverbálních signálů a mechanismů sebekontroly. Zpětná vazba je vítána ve všech workshopech a seminářích. Každý je zdvořile vyzván k účasti a poskytnutí zpětné vazby. Prostor je pro všechny." },
        ],
      },
    ],
  },
  "negotiation-skills": {
    pageTitle: { en: "Negotiation Representation", cs: "Vyjednávání jako zástupce" },
    intro: [
      { en: "Secure a decisive advantage with Howard's expert negotiation edge. We'll deconstruct problems to find root causes and deliver clear, actionable results.Whether it's a high-stakes contract, a delicate partnership exit, or a complex acquisition, this service provides the psychological leverage and tactical silence for a win-win.", cs: "Získejte rozhodující výhodu díky Howardově vyjednávací zručnosti. Rozebereme problémy do hloubky, najdeme jejich kořeny a dodáme jasné, použitelné výsledky. Ať jde o vysokou hru o smlouvu, citlivý odchod z partnerství nebo složitou akvizici, tato služba nabízí psychologickou páku i taktické mlčení pro výsledek win-win." },
    ],
    sections: [
      {
        title: { en: "Service Pillar", cs: "Pilíř služby" },
        paragraphs: [
          { en: "As an 'intruder' it's my job to be as non-invasive as possible. My tactic of agreeing with the other side on small issues may unnerve you but my position is secondary, unbiased participant, occasionally commenting or asking a question to clarify. I can't help but be funny, not particularly intimidating, and I make people feel comfortable. I tend to get to the crux of the matter and facilitate a productive discussion. Meetings are usually shorter than expected and, depending on the culture, I'll be present or absent for the informal moments. Discretion guaranteed by NDA.", cs: "Jako „vetřelec\" je mým úkolem být co nejméně rušivý. Moje taktika souhlasit s druhou stranou v drobnostech vás možná zaskočí, ale moje pozice je vedlejší — jsem nestranný účastník, který občas okomentuje nebo položí upřesňující otázku. Nedokážu si pomoct, jsem zábavný, nepůsobím zastrašujícím dojmem a lidé se vedle mě cítí dobře. Dostávám se k jádru věci a usnadňuji produktivní diskuzi. Porady bývají kratší, než se čeká, a podle firemní kultury jsem přítomen nebo absentuji během neformálních momentů. Diskrétnost je zaručena NDA." },
        ],
      },
    ],
    highlight: {
      title: { en: "Success Fee", cs: "Success Fee (odměna za výsledek)" },
      text: { en: "I believe in skin in the game and am open to Success-fee Structures. My value is measured by your result.", cs: "Věřím v to, že má osobní zájem na výsledku. Jsem otevřen modelům odměny vázané na úspěch (success fee). Moje hodnota se měří vaším výsledkem." },
    },
    highlightPosition: "bottom",
    tone: "executive",
  },
  "keynote-speaking": {
    pageTitle: { en: "\n", cs: "\n" },
    lead: { en: "Choose from various trainings to improve communication and effectiveness for your team.", cs: "Najměte Howarda jako řečníka na svou významnou akci a ještě rok poté se o ní bude mluvit." },
    intro: [
      { en: "\n", cs: "\n" },
      { en: "It has been universally affirmed that personal relationships are the most important factor in any business. Communication is the oil for the machine. With a few techniques you can make a good impression, be a good listener, maybe use some charisma, and motivate people. Understanding the nuances of communication will help you avoid misunderstandings, and fix them when they occur. Optional Leadership module. In this workshop, you will practice how to project yourself more effectively and persuasively by connecting with others, carefully following, guiding, and motivating them. Learn how to craft your message so as to evoke the response you desire. In practically any situation you may find yourself in.", cs: "Howarda si můžete najmout jako řečníka na svou akci — jeho zábavná, vzdělávací témata a artikulovaný, interaktivní řečnický styl si zaručeně získají pozornost každého publika a motivují ho k akci. A možná se cestou i něco naučí…" },
      { en: "\n", cs: "\n" },
      { en: "\n", cs: "\n" },
    ],
    sections: [
      {
        title: { en: "Available workshops\n", cs: "Dostupné workshopy\n" },
        bullets: [
          { en: "\n", cs: "\n" },
          { en: "\n", cs: "\n" },
          { en: "Assertiveness\nIntercultural Communication\nEffective Feedback - Giving & Receiving\n\n\n", cs: "Asertivita\nMezikulturní komunikace\nEfektivní zpětná vazba – poskytování a přijímání\n\n\n" },
        ],
      },
      {
        title: { en: "Training Methods", cs: "Metody tréninku" },
        bullets: [
          { en: "\n", cs: "\n" },
          { en: "\n", cs: "\n" },
        ],
      },
    ],
  },
};
