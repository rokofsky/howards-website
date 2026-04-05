import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";

const Bio = () => {
  return (
    <Layout>
      <section className="section-padding pt-24 font-medium">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start font-medium"
          >
            <div>
              <img
                src={hero1}
                alt="Howard"
                className="rounded-lg w-full object-cover aspect-[3/4]"
                width={600}
                height={800}
              />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Who is Howard</h1>
              <div className="space-y-4 text-foreground/80 font-light leading-relaxed">
                <p className="font-medium">
                  Update: fully healed, sometimes I nostalgically miss my limp.
                </p>
                <p className="font-normal">

                </p>
                <p className="font-medium">
                  His workshops have been described as "the first training I've attended where nobody checked their phone"
                </p>
                <p className="font-medium">

                </p>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-semibold mb-4 font-medium">
</h3>
                <ul className="space-y-2 text-sm text-foreground/70 font-light">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Bio;
