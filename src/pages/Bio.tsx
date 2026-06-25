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
                  "After touring Europe, he enrolled in a master’s program at the University of Amsterdam (Netherlands), living off proceeds from the baseball cards and, after his visa expired, whatever he could do to pay the rent and avoid returning to the USA. Cooking, catering, red-light district bartending, managing an illegal sauna club, and ‘donating’ bodily fluids were just some of the exploits he engaged in as a relatively integrated, albeit illegal alien.\u00a0\u00a0",
                  "Po cestě po Evropě se zapsal do magisterského studia na Amsterodamské univerzitě (Nizozemsko) a žil z výnosů z prodeje těch baseballových karet a – po vypršení platnosti víza – z čehokoli, co mu umožnilo zaplatit nájem a vyhnout se návratu do USA. Vaření, catering, práce barmana v čtvrti „red lights“, vedení nelegálního saunového klubu a „darování“ tělních tekutin byly jen některé z činností, kterým se věnoval jako relativně dobře integrovaný, byť nelegální cizinec.\u00a0\u00a0"
                )}
              </p>
              <p className="mb-4">{"\n"}</p>
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
                  "In 2002, Lonny Gold invited him to assist him on a Suggestopedic English course in subtropical Hainan, China for a 2-month course, which was so successful they immediately hired him to teach his own course for another two months. He's been back there 3 times since, and has developed quite a love-hate relationship with the Middle Kingdom.",
                  "V roce 2002 ho Lonny Gold pozval, aby mu asistoval na kurzu angličtiny metodou Suggestopedie v subtropickém Hainanu v Číně. Kurz trval 2 měsíce a byl tak úspěšný, že ho okamžitě najali, aby další dva měsíce učil svůj vlastní kurz. Od té doby se tam vrátil třikrát a k Říši středu si vybudoval poměrně rozporuplný vztah lásky a nenávisti."
                )}
              </p>
              <p className="mb-4">
                {t(
                  "Travels have included, in addition to the standard fare of train tickets and backpacking, hitchhiking, couchsurfing, trespassing, and squatting. Ever flirting with danger, he’s been in and out of a fair amount of trouble and has survived to create this website with no major scars. Except for that broken femur.",
                  "Jeho cesty zahrnovaly kromě běžných jízdenek na vlak a baťůžkářství také stopování, couchsurfing, neoprávněné vniknutí a squatting. Neustále flirtoval s nebezpečím, dostal se do nejednoho problému a přežil, aby mohl vytvořit tyto webové stránky bez větších jizev. Tedy až na tu zlomenou stehenní kost."
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
