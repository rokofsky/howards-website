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
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">
                {t(
                  "In 2002, Lonny Gold invited me to assist him on a Suggestopedic English course in subtropical Hainan, China for a 2-month course, which was extended to four. I loved that island and its coconuts, eating mangoes off the tree and drinking green tea. What I loved perhaps most was bike riding in the chaotic traffic, developing a sense of vision (awareness?) in all directions. And being invited for karaoke and beer by strangers. I've been back there 3 times since, and have developed quite a love-hate relationship with the Middle Kingdom.",
                  "V roce 2002 mě Lonny Gold pozval, abych mu pomáhal s kurzem angličtiny metodou Suggestopedie na subtropickém ostrově Hainan v Číně. Měl to být dvouměsíční kurz, který se nakonec protáhl na čtyři měsíce. Ten ostrov a jeho kokosy jsem si zamiloval, stejně jako jíst manga přímo ze stromu a pít zelený čaj. Nejvíc se mi asi líbilo jezdit na kole v chaotickém provozu a rozvíjet smysl pro vnímání (uvědomění?) ve všech směrech. A také to, že mě cizí lidé zvali na karaoke a pivo. Od té doby jsem se tam vrátil třikrát a k Čínské lidové republice jsem si vybudoval poměrně rozporuplný vztah lásky a nenávisti.",
                )}
              </p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>
              <p className="mb-4">{"\n"}</p>

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
