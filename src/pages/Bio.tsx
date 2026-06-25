import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import hero1 from "@/assets/hero-1.jpg";
import { openCalendly } from "@/lib/calendly";
import { useT } from "@/hooks/useT";
import { useIsCzech, useLocalizedPath } from "@/hooks/useLanguageRouting";
// SEO managed centrally by GlobalSeoSync in App.tsx

const Bio = () => {
  const t = useT();
  const isCz = useIsCzech();
  const lp = useLocalizedPath();

  return (
    <Layout>
      <section className="section-padding pt-24 font-medium">
        <div className="max-w-4xl mx-auto">
          <motion.div key={isCz ? "cz" : "en"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-foreground/80 font-light leading-relaxed">
              <img
                src={hero1}
                alt="Howard"
                className="w-full md:w-[45%] md:float-left md:mr-8 md:mb-4 rounded-lg object-cover aspect-[3/4]"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                {t("Who is Howard", "Kdo je Howard")}
              </h1>
              <p className="mb-4 text-lg font-semibold">{t("No excuses!", "Žádné výmluvy!")}</p>
              <p className="mb-4">
                <Link to={lp("/cv")} className="underline hover:text-foreground transition-colors">
                  {t("My CV", "Můj CV")}
                </Link>
              </p>
              <p className="mb-4">
                {t(
                  "Howard Rokofsky had no idea what to do with his life until he found himself in front of a classroom. Before that, he'd tried just about everything. At age 13, after failing at gardening and snow shoveling, he went for broke and started delivering the local newspaper \"Newsday\" seven days a week, dragging a rusty shopping wagon around the suburbs. In those days, paperboys went door-to-door collecting weekly subscription fees. A teenager tracking down deadbeat customers seems absurd nowadays (newspapers are now delivered by adults in vans). The pimply adolescent spent his wages on baseball cards, which he traded and sold by the thousands (15 years before internet). Nearly all his dealings were with emotionally fragile, middle-aged men, and this turned out to be a priceless lesson in communication skills.",
                  "Howard Rokofsky neměl ponětí, co se svým životem, dokud se neocitl před třídou. Předtím už vyzkoušel snad všechno. Ve 13 letech, poté co selhal v zahradničení a odklízení sněhu, šel do toho po hlavě a začal roznášet místní noviny „Newsday“ sedm dní v týdnu, přičemž po předměstí táhl rezavý nákupní vozík. V té době chodili roznášeči novin od dveří ke dveřím a vybírali týdenní předplatné. Představa teenagera, který honí neplatiče, se dnes jeví jako absurdní (noviny dnes rozvážejí dospělí v dodávkách). Tento puberťák s akné utrácel svůj výdělek za baseballové kartičky, které tisíce po tisících vyměňoval a prodával (15 let před příchodem internetu). Téměř všechny jeho obchody se odehrávaly s emocionálně křehkými muži středního věku, což se pro něj ukázalo jako neocenitelná lekce komunikačních dovedností.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Summers while at university, he delivered heavy liquid O₂ tanks to terminal patients’ homes around NYC, refining his bedside manner and punishing his back. Although most bridges were forbidden to his hazardous materials, he had a 24-hour emergency parking permit that allowed him to park anywhere he wanted. And that he did!",
                  "Během letních prázdnin na univerzitě rozvážel těžké nádrže s kapalným kyslíkem do domovů nevyléčitelně nemocných pacientů po celém New Yorku, čímž zdokonaloval své jednání s pacienty a dával zabrat svým zádům. Ačkoli na většině mostů byl s tímto nebezpečným nákladem zákaz vjezdu, měl 24hodinové nouzové parkovací povolení, které mu umožňovalo zaparkovat kdekoli chtěl. A to také dělal!",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "At 13, I started delivering the daily Newsday door-to-door, for 2½ years. We had to collect the subscription fees every week – a teenager tracking down deadbeat customers seems absurd nowadays (newspapers are now delivered by adults in vans). I babysat, shoveled snow, painted houses, installed insulation in neighbors' crawl-spaces, whatever anyone was willing to pay me to do.",
                  "Ve 13 letech jsem začal roznášet deník Newsday od dveří ke dveřím, a to po dobu 2½ roku. Každý týden jsem musel vybírat předplatné – teenager, který honí neplatiče, se dnes zdá absurdní (noviny dnes rozvážejí dospělí v dodávkách). Hlídal jsem děti, odklízel sníh, maloval domy, instaloval izolaci v podkrovích sousedů, zkrátka cokoli, za co mi někdo byl ochoten zaplatit.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "After touring Europe, he enrolled in a master’s program at the University of Amsterdam (Netherlands), living off proceeds from the baseball cards and, after his visa expired, whatever he could do to pay the rent and avoid returning to the USA. Cooking, catering, red-light district bartending, managing an illegal sauna club, and ‘donating’ bodily fluids were just some of the exploits he engaged in as a relatively integrated, albeit illegal alien. ",
                  "Po cestě po Evropě se zapsal do magisterského studia na Amsterodamské univerzitě (Nizozemsko) a žil z výnosů z prodeje těch baseballových karet a – po vypršení platnosti víza – z čehokoli, co mu umožnilo zaplatit nájem a vyhnout se návratu do USA. Vaření, catering, práce barmana v čtvrti „red lights“, vedení nelegálního saunového klubu a „darování“ tělních tekutin byly jen některé z činností, kterým se věnoval jako relativně dobře integrovaný, byť nelegální cizinec.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "One day, an advert appeared in the local paper for a teaching position at the polytechnic \"Hogeschool Holland\". He had no desire to teach, but he really needed a job. Fortunately for him, his Dutch was better than the director's English, and so he was hired on the spot without being asked to show a work permit, let alone a residence visa. When he walked into a lecture hall full of cheeky, bright-eyed students, he knew this was his calling. After a couple of years he took the show on the road, moved to Prague and started training corporates in ‘soft skills’: assertiveness, negotiations, EQ, and public speaking skills. His pet project was four semesters of ‘Clinical Empathy’ at the Charles University Medical School and he dreams of someday teaching this to bonafide doctors.",
                  "Jednoho dne se v místních novinách objevil inzerát na místo učitele na polytechnice „Hogeschool Holland“. Neměl sice chuť učit, ale práci opravdu potřeboval. Naštěstí pro něj byla jeho holandština lepší než angličtina ředitele, a tak ho přijali na místě, aniž by po něm požadovali pracovní povolení, natož pobytové vízum. Když vešel do přednáškového sálu plného drzých studentů s jiskřivýma očima, věděl, že to je jeho poslání. Po pár letech se vydal na cesty, přestěhoval se do Prahy a začal školit zaměstnance firem v „měkkých dovednostech“: asertivitě, vyjednávání, emoční inteligenci a řečnických dovednostech. Jeho srdcovou záležitostí byl čtyřsemestrální kurz „Klinická empatie“ na Lékařské fakultě Univerzity Karlovy a sní o tom, že jednoho dne bude tento předmět vyučovat skutečné lékaře.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Travels have included, in addition to the standard fare of train tickets and backpacking, hitchhiking, couchsurfing, trespassing, and squatting. Ever flirting with danger, he’s been in and out of a fair amount of trouble and has survived to create this website with no major scars. Edit: except for that broken femur. ",
                  "Mezi jeho cestovatelské zážitky patří kromě běžných způsobů cestování, jako jsou jízdenky na vlak a cestování s batohem, také stopování, couchsurfing a squatování. Vždy si pohrával s nebezpečím, několikrát se dostal do potíží, ale přežil a vytvořil tuto webovou stránku bez větších následků. Pozn.: až na tu zlomeninu stehenní kosti.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "When that fantasy semester came to an end around Christmas, I had a decision to make: validate my 2-month Eurail ticket (in the dead of winter), or kill time somewhere close by. Why not spend it immersed in a new culture, maybe learn a language? The Netherlands was a cheap place to live at the time, and so for the next 10 weeks I was the new kid in town in quaint, medieval Deventer.",
                  "Když se ten pohádkový semestr kolem Vánoc chýlil ke konci, musel jsem se rozhodnout: uplatnit svou dvouměsíční jízdenku Eurail (v mrazivé zimě) nebo zabíjet čas někde poblíž. Proč to nestrávit ponořený do nové kultury, třeba se naučit jazyk? Nizozemsko bylo v té době levné zemi, a tak jsem byl následujících 10 týdnů nováčkem v malebném středověkém Deventeru.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Per the drill, I got a bike, a job at the student club (De Soos), posted adverts at the supermarket for language exchange, basically killing time in the most productive way I could think of. When spring came, I validated the train pass, and embarked on a mystery tour – galivanting towns and cities, museums, customs, people, and street food. In those days you needed to get a paper map wherever you went, or at least I did. Travel journals linger at the bottom of the bookcase, full of memories, poems, anecdotes, and a lock of girl's hair.",
                  "Jak už to tak bývá, pořídil jsem si kolo, našel si práci ve studentském klubu (De Soos), vylepil v supermarketu inzeráty na jazykovou výměnu a v podstatě zabíjel čas tím nejproduktivnějším způsobem, jaký mě napadl. Když přišlo jaro, aktivoval jsem si jízdenku a vydal se na tajemnou cestu – toulal jsem se po městech, navštěvoval muzea, poznával zvyky, lidi a pouliční jídlo. V té době jste si museli pořídit papírovou mapu, kamkoli jste jeli, nebo alespoň já jsem to tak dělal. Cestovní deníky leží na dně knihovny, plné vzpomínek, básní, anekdot a pramínků dívčích vlasů.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "The holiday was over. I flew home for college graduation, and went back to my old summer job, delivering liquid oxygen to terminally ill patients. Thanks to my familiarity with NYC streets, bedside manner, and willingness to drive around with heavy, flammable liquids, I made a decent wage and spent quality time with the elderly. They were always happy to see me (hey, I brought them their precious oxygen). Anyway, I couldn't wait to get back to Europe, so I sold some more baseball cards and bought another plane and 2-month train ticket. This time I visited universities and collected grad-school admission forms.",
                  "Dovolená skončila. Odletěl jsem domů na promoci na vysoké škole a vrátil se ke své staré letní brigádě – rozvážel jsem tekutý kyslík nevyléčitelně nemocným pacientům. Díky tomu, že jsem dobře znal newyorské ulice, uměl jsem jednat s lidmi a byl ochoten vozit těžké hořlavé kapaliny, vydělával jsem si slušně a trávil kvalitní čas se staršími lidmi. Vždycky mě rádi viděli (no jo, přece jsem jim přivezl jejich drahocenný kyslík). Každopádně jsem se nemohl dočkat, až se vrátím do Evropy, tak jsem prodal další baseballové kartičky a koupil si další letenku a dvouměsíční jízdenku na vlak. Tentokrát jsem navštívil univerzity a sbíral přihlášky na postgraduální studium.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Mainly because I already spoke decent Dutch, and the tuition fees were incredibly cheap, I enrolled at the University of Amsterdam. They offered me a room in a student/refugee housing project, where I worked behind the counter at the community hangout (Diemense T-Huis). The customers were residents of the dorms: foreign students, middle-aged Dutch fringe characters, and refugees from the darkest corners of the earth. There were tensions between the ethnic groups and I often had to intervene. The immersion was exhilarating. One Somalian and a couple of Moroccans wanted to kill me. All in a day's work.",
                  "Hlavně proto, že jsem už docela dobře mluvil holandsky a školné bylo neuvěřitelně levné, zapsal jsem se na amsterdamskou univerzitu (UvA). Nabídli mi pokoj v ubytovacím projektu pro studenty a uprchlíky, kde jsem pracoval za pultem v komunitním centru (Diemense T-Huis). Zákazníky byli obyvatelé kolejí: zahraniční studenti, holandští outsideri středního věku a uprchlíci z nejtemnějších koutů světa. Mezi etnickými skupinami panovalo napětí a já jsem často musel zasahovat. Ponoření se do nového prostředí bylo vzrušující. Jeden Somálec a pár Maročanů mě chtěli zabít. To k práci prostě patří.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "It was not my intention to stay in Amsterdam for the next 10 years, but as an assimilated, albeit illegal alien in an amazing city, I was in no hurry to leave. I had some interesting jobs, the most fun of which were tending bar in a red-light-district music bar (Last Waterhole) and later, an unforgettable tenure on the board at the legendary squatted sauna club Fenomeen.",
                  "Neměl jsem v úmyslu zůstat v Amsterdamu dalších 10 let, ale jako asimilovaný, byť nelegální cizinec v úžasném městě jsem neměl spěch s odchodem. Měl jsem několik zajímavých zaměstnání, z nichž nejzábavnější bylo obsluhování v hudebním baru v červené čtvrti (Last Waterhole) a později nezapomenutelné působení ve vedení legendárního squattového saunového klubu Fenomeen.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Through the grapevine, I got wind of a teaching job at the Amsterdam Academy of Banking and Finance. I was no teacher, but desperately needed a job. At the interview, the dean grilled me (in Dutch) on finance. Little did he know, my roommate at college was a Finance major, and we would stay up late getting high and philosophizing about finance. So I rambled everything I knew about P/E ratios, and he offered me the job on the spot. Thank god he didn't ask me if I had a residence (let alone work) permit!",
                  "Z doslechu jsem se dozvěděl o volném místě učitele na Amsterdamské akademii bankovnictví a financí. Nebyl jsem sice učitel, ale zoufale jsem potřeboval práci. Na pohovoru mě děkan (v holandštině) podrobně vyslýchal ohledně financí. Netušil, že můj spolubydlící na vysoké škole studoval finance a že jsme zůstávali dlouho vzhůru, byli sjetí a filozofovali o financích. Tak jsem vyklopil všechno, co jsem věděl o poměrech cen a výnosů, a on mi na místě nabídl práci. Díky bohu, že se mě nezeptal, jestli mám povolení k pobytu (natož pracovní)!",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "The first day, I got a thrill explaining and discussing things with a room full of students. Teaching became my passion and I developed an experimental, if not reckless, reputation. But, as the results were high, they kept extending my contract, and I soon became the 'utility-man' at the sister school (Hogeschool Holland), substituting for all the teachers on sabbatical/maternity leave. They threw everything at me, from Poetry to British History to Tourism. The pay was good and I was free to do a \"Dead Poets Society\" schtick whenever I felt like it.",
                  "Hned první den mě naplňovalo vzrušení, když jsem přednášel a diskutoval s celou třídou studentů. Výuka se stala mou vášní a získal jsem pověst experimentátora, možná až trochu dobrodruha. Ale protože výsledky byly skvělé, neustále mi prodlužovali smlouvu a brzy jsem se stal „všestranným pomocníkem“ na sesterské škole (Hogeschool Holland), kde jsem zastupoval všechny učitele na studijní dovolené nebo mateřské dovolené. Svěřili mi všechno možné, od poezie přes britskou historii až po cestovní ruch. Plat byl dobrý a mohl jsem si dělat, co se mi zachtělo, kdykoli jsem měl chuť.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "At some point, I'd reached a disturbing level of comfort and an urge to explore new territory, so I picked myself and my stuff up and moved to Prague, a place I'd been enchanted with for years. With the teaching experience and good references, I was able to get a few teaching jobs. I made Prague home, and sowed my wild oats in a new country.",
                  "V určitém okamžiku jsem dosáhl znepokojivé úrovně pohodlí a pocítil nutkání prozkoumat nové území, a tak jsem se sbalil a přestěhoval se do Prahy, místa, které mě už léta okouzlovalo. Díky pedagogickým zkušenostem a dobrým doporučením se mi podařilo získat několik míst učitele. Praha se stala mým domovem a já se zase naučil žít v nové zemi.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "In 2002, Lonny Gold invited me to assist him on a Suggestopedic English course in subtropical Hainan, China for a 2-month course, which was extended to four. I loved that island and its coconuts, eating mangoes off the tree and drinking green tea. What I loved perhaps most was bike riding in the chaotic traffic, developing a sense of vision (awareness?) in all directions. And being invited for karaoke and beer by strangers. I've been back there 3 times since, and have developed quite a love-hate relationship with the Middle Kingdom.",
                  "V roce 2002 mě Lonny Gold pozval, abych mu pomáhal s kurzem angličtiny metodou Suggestopedie na subtropickém ostrově Hainan v Číně. Měl to být dvouměsíční kurz, který se nakonec protáhl na čtyři měsíce. Ten ostrov a jeho kokosy jsem si zamiloval, stejně jako jíst manga přímo ze stromu a pít zelený čaj. Nejvíc se mi asi líbilo jezdit na kole v chaotickém provozu a rozvíjet smysl pro vnímání (uvědomění?) ve všech směrech. A také to, že mě cizí lidé zvali na karaoke a pivo. Od té doby jsem se tam vrátil třikrát a k Čínské lidové republice jsem si vybudoval poměrně rozporuplný vztah lásky a nenávisti.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Back in Prague, an Italian buddy was examining my book collection, consisting of, among other things, shelves and shelves of self-help classics. He knew me pretty well and chided, \"So you learned all that magic from books, eh, Bastardo?!\" A week later, his boss hired me to teach Presentation Skills at Fiat. I hadn't even known that 'corporate trainer' was a thing, and suddenly I was one, literally before I knew it.",
                  "Zpátky v Praze si můj italský kamarád prohlížel mou sbírku knih, která mimo jiné obsahovala police a police klasických příruček o osobním rozvoji. Znal mě docela dobře a pokáral mě: „Tak ty ses tu magii naučil z knížek, co, Bastardo?!” O týden později mě jeho šéf najal, abych učil prezentační dovednosti ve Fiatu. Ani jsem nevěděl, že něco jako „firemní trenér” existuje, a najednou jsem jím byl, doslova než jsem se nadál.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Since then I've trained at companies in practically every sector. It's a privilege coaching real pros in their livelihoods, and seeing the results. Among these gigs is my pet project, teaching Clinical Empathy (a.k.a. \"bedside manner\") at the Charles University Medical Faculty.",
                  "Od té doby jsem školil ve firmách prakticky ve všech odvětvích. Je to privilegium koučovat skutečné profesionály v jejich obživě a vidět výsledky. Mezi těmito zakázkami je i můj oblíbený projekt, výuka klinické empatie (neboli „způsob jednání s pacienty“) na Lékařské fakultě Univerzity Karlovy.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "In August 2018, two months after finishing my book (How to GET Great Service), I managed to (double) break my femur, and life changed on a dime. My corporate training business was out of the question as, thanks to being relegated to crutches for the next 4+ months, I couldn't use my hands and feet at the same time. So, I went and took a job that even I, in my wildest dreams, had never imagined: teaching English at a local high school. Never mind that I was supposed to lie on my back for 3 months. 3½ weeks after the accident, I was hobbling around a classroom, desperately hoping that none of those kids would bump into a crutch and set me back all that physiotherapy, not to mention all that pain.",
                  "V srpnu 2018, dva měsíce po dokončení mé knihy (Jak získat skvělý servis), se mi podařilo si zlomit stehenní kost a život se mi rázem obrátil vzhůru nohama. O podnikání v oblasti firemního školení nemohlo být ani řeči, protože jsem byl na více než čtyři měsíce odkázán na berle a nemohl jsem používat ruce a nohy současně. Tak jsem přijal práci, o které se mi ani v nejdivočejších snech nesnilo: učit angličtinu na místní střední škole. Nevadilo, že jsem měl tři měsíce ležet na zádech. Tři a půl týdne po nehodě jsem se belhal po třídě a zoufale doufal, že žádné z těch dětí nevrazí do berle a nevrátí mě zpátky na fyzioterapii, nemluvě o té bolesti.",
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Last and least, my horoscope: Western: Taurus; Chinese: Fire Horse. This combination, according to the sources on such detailed matters, is particularly inauspicious. Just ask my mother.",
                  "A na závěr to nejméně důležité: můj horoskop. Podle západního horoskopu jsem Býk, podle čínského Ohnivý kůň. Tato kombinace je podle odborných zdrojů zabývajících se těmito podrobnostmi obzvláště neblahá. Zeptejte se třeba mé matky.",
                )}
              </p>

              <div className="clear-both text-center mt-12">
                <Button variant="glassPetrol" size="lg" className="w-full sm:w-auto" onClick={openCalendly}>
                  {t("Book a free call with Howard", "Zamluvit bezplatný hovor s Howardem")}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Bio;
