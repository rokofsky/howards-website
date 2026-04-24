import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import hero9b from "@/assets/hero-9b.png";
import { openCalendly } from "@/lib/calendly";
import { useT } from "@/hooks/useT";

const Bio = () => {
  const t = useT();
  return (
    <Layout>
      <section className="section-padding pt-24 font-medium">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-foreground/80 font-light leading-relaxed">
              <img
                src={hero9b}
                alt="Howard"
                className="w-full md:w-[45%] md:float-left md:mr-8 md:mb-4 rounded-lg object-cover aspect-[3/4]"
              />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{t("Who is Howard", "Kdo je Howard")}</h1>
              <p className="mb-4 text-lg font-semibold">No excuses!</p>
              <p className="mb-4">I'm Howard, a trainer/consultant with 24 years of experience focusing on practical productivity and interpersonal communication. I don't teach theory — I teach techniques and systems that immediately improve how you work, and how people work together.</p>
              <p className="mb-4">As a hobby, I collected baseball cards, memorizing the serial numbers, the photos on the front, the stats on the back… it was those cards that destroyed my vision. I also listened to a lot of talk radio.</p>
              <p className="mb-4">At 13, I started delivering the daily Newsday door-to-door, for 2½ years. We had to collect the subscription fees every week – a teenager tracking down deadbeat customers seems absurd nowadays (newspapers are now delivered by adults in vans). I babysat, shoveled snow, painted houses, installed insulation in neighbors' crawl-spaces, whatever anyone was willing to pay me to do.</p>
              <p className="mb-4">This pocket money was mostly spent on more baseball cards – dealing at conventions, placing ads, trading and selling through the mail all over the country. Dealing with middle-aged and emotionally fragile men turned out to be an invaluable experience in communication skills. Years later, those cards would finance more books, a couple of old but driveable cars, and my first two trips to Europe.</p>
              <p className="mb-4">Being away at college was a burst of freedom. I tried out just about everything intra- and extracurricular, on campus and off, making up for the girls and partying I'd ignored throughout high school. I eventually chose English Literature/Rhetoric as a major with a Philosophy minor, for no other reason than I'd earned more credits in those subjects than the others I dabbled in. Contrary to expectations, some of that study has proven useful from time to time.</p>
              <p className="mb-4">A poster about exchange programs caught my attention, and I applied for a semester in London. A couple of months later I was sitting in an English classroom, surrounded by British students, which was terrifying for about a day and a half. Everyone was friendly, I got a job in the school canteen, bought an old bike, and tooled around town on the left side of the road (!). We went to Hippodrome and Limelight at the onset of acid-house and rave culture. At one point I hitchhiked up to Liverpool, just to see if I could.</p>
              <p className="mb-4">When that fantasy semester came to an end around Christmas, I had a decision to make: validate my 2-month Eurail ticket (in the dead of winter), or kill time somewhere close by. Why not spend it immersed in a new culture, maybe learn a language? The Netherlands was a cheap place to live at the time, and so for the next 10 weeks I was the new kid in town in quaint, medieval Deventer.</p>
              <p className="mb-4">Per the drill, I got a bike, a job at the student club (De Soos), posted adverts at the supermarket for language exchange, basically killing time in the most productive way I could think of. When spring came, I validated the train pass, and embarked on a mystery tour – galivanting towns and cities, museums, customs, people, and street food. In those days you needed to get a paper map wherever you went, or at least I did. Travel journals linger at the bottom of the bookcase, full of memories, poems, anecdotes, and a lock of girl's hair.</p>
              <p className="mb-4">The holiday was over. I flew home for college graduation, and went back to my old summer job, delivering liquid oxygen to terminally ill patients. Thanks to my familiarity with NYC streets, bedside manner, and willingness to drive around with heavy, flammable liquids, I made a decent wage and spent quality time with the elderly. They were always happy to see me (hey, I brought them their precious oxygen). Anyway, I couldn't wait to get back to Europe, so I sold some more baseball cards and bought another plane and 2-month train ticket. This time I visited universities and collected grad-school admission forms.</p>
              <p className="mb-4">Mainly because I already spoke decent Dutch, and the tuition fees were incredibly cheap, I enrolled at the University of Amsterdam. They offered me a room in a student/refugee housing project, where I worked behind the counter at the community hangout (Diemense T-Huis). The customers were residents of the dorms: foreign students, middle-aged Dutch fringe characters, and refugees from the darkest corners of the earth. There were tensions between the ethnic groups and I often had to intervene. The immersion was exhilarating. One Somalian and a couple of Moroccans wanted to kill me. All in a day's work.</p>
              <p className="mb-4">It was not my intention to stay in Amsterdam for the next 10 years, but as an assimilated, albeit illegal alien in an amazing city, I was in no hurry to leave. I had some interesting jobs, the most fun of which were tending bar in a red-light-district music bar (Last Waterhole) and later, an unforgettable tenure on the board at the legendary squatted sauna club Fenomeen.</p>
              <p className="mb-4">Through the grapevine, I got wind of a teaching job at the Amsterdam Academy of Banking and Finance. I was no teacher, but desperately needed a job. At the interview, the dean grilled me (in Dutch) on finance. Little did he know, my roommate at college was a Finance major, and we would stay up late getting high and philosophizing about finance. So I rambled everything I knew about P/E ratios, and he offered me the job on the spot. Thank god he didn't ask me if I had a residence (let alone work) permit!</p>
              <p className="mb-4">The first day, I got a thrill explaining and discussing things with a room full of students. Teaching became my passion and I developed an experimental, if not reckless, reputation. But, as the results were high, they kept extending my contract, and I soon became the 'utility-man' at the sister school (Hogeschool Holland), substituting for all the teachers on sabbatical/maternity leave. They threw everything at me, from Poetry to British History to Tourism. The pay was good and I was free to do a "Dead Poets Society" schtick whenever I felt like it.</p>
              <p className="mb-4">At some point, I'd reached a disturbing level of comfort and an urge to explore new territory, so I picked myself and my stuff up and moved to Prague, a place I'd been enchanted with for years. With the teaching experience and good references, I was able to get a few teaching jobs. I made Prague home, and sowed my wild oats in a new country.</p>
              <p className="mb-4">In 2002, Lonny Gold invited me to assist him on a Suggestopedic English course in subtropical Hainan, China for a 2-month course, which was extended to four. I loved that island and its coconuts, eating mangoes off the tree and drinking green tea. What I loved perhaps most was bike riding in the chaotic traffic, developing a sense of vision (awareness?) in all directions. And being invited for karaoke and beer by strangers. I've been back there 3 times since, and have developed quite a love-hate relationship with the Middle Kingdom.</p>
              <p className="mb-4">Back in Prague, an Italian buddy was examining my book collection, consisting of, among other things, shelves and shelves of self-help classics. He knew me pretty well and chided, "So you learned all that magic from books, eh, Bastardo?!" A week later, his boss hired me to teach Presentation Skills at Fiat. I hadn't even known that 'corporate trainer' was a thing, and suddenly I was one, literally before I knew it.</p>
              <p className="mb-4">Since then I've trained at companies in practically every sector. It's a privilege coaching real pros in their livelihoods, and seeing the results. Among these gigs is my pet project, teaching Clinical Empathy (a.k.a. "bedside manner") at the Charles University Medical Faculty.</p>
              <p className="mb-4">
                In August 2018, two months after finishing my book (<a href="https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80 transition-colors">How to GET Great Service</a>), I managed to (double) break my femur, and life changed on a dime. My corporate training business was out of the question as, thanks to being relegated to crutches for the next 4+ months, I couldn't use my hands and feet at the same time. So, I went and took a job that even I, in my wildest dreams, had never imagined: teaching English at a local high school. Never mind that I was supposed to lie on my back for 3 months. 3½ weeks after the accident, I was hobbling around a classroom, desperately hoping that none of those kids would bump into a crutch and set me back all that physiotherapy, not to mention all that pain.
              </p>
              <p className="mb-4">
                Last and least, my horoscope: Western: Taurus; Chinese: Fire Horse. This combination, according to the sources on such detailed matters, is particularly inauspicious. Just ask my mother.
              </p>

              <div className="clear-both text-center mt-12">
                <Button variant="glassPetrol" size="lg" onClick={openCalendly}>
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
