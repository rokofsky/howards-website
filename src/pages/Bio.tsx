import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import hero9b from "@/assets/hero-9b.png";
import { openCalendly } from "@/lib/calendly";

const Bio = () => {
  return (
    <Layout>
      <section className="section-padding pt-24 font-medium">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Photo + first text block side by side on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div>
                <img
                  src={hero9b}
                  alt="Howard"
                  className="rounded-lg w-full object-cover aspect-[3/4]"
                  width={600}
                  height={800}
                />
              </div>
              <div className="space-y-4 text-foreground/80 font-light leading-relaxed">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">Who is Howard</h1>
                <p className="font-medium">No excuses!</p>
                <p>I'm Howard, a trainer/consultant with 24 years of experience focusing on practical productivity and interpersonal communication. I don't teach theory — I teach techniques and systems that immediately improve how you work, and how people work together.</p>
                <p>As a hobby, I collected baseball cards, memorizing the serial numbers, the photos on the front, the stats on the back… it was those cards that destroyed my vision. In addition to music, I listened to talk radio a lot.</p>
              </div>
            </div>

            <div className="space-y-4 text-foreground/80 font-light leading-relaxed">
              <p>At 13, I started delivering the daily Newsday door-to-door, for 2½ years. We had to collect the subscription fees every week – a teenager tracking down deadbeat customers seems absurd nowadays (newspapers are now delivered by adults in vans). I babysat, shoveled snow, painted houses, installed insulation in neighbors' crawl-spaces, whatever anyone was willing to pay me to do.</p>
              <p>This pocket money was mostly spent on more baseball cards – dealing at conventions, placing ads, trading and selling through the mail all over the country. Dealing with middle-aged and emotionally fragile men turned out to be an invaluable experience in communication skills. Years later, those cards would finance more books, a couple of old but driveable cars, and my first two trips to Europe.</p>

              <div className="text-center mt-12">
                <Button variant="glassPetrol" size="lg" onClick={openCalendly}>
                  Book a free call with Howard
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
