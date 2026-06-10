import { motion } from "framer-motion";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";

const FAQSection = () => {
  const t = useT();
  const isCz = useIsCzech();
  const faqs = [
    {
      q: t("What makes Howard different from other consultants?", "Čím se Howard liší od ostatních konzultantů?"),
      a: t(
        "He simply does things differently — and you’ll notice it from day one. From an uncommon standard of professional ethics and transparent communication to generous project outputs, there is no room for fluff. Howard focuses strictly on clarity, an open-minded approach, and uncovering new strategic options. Because he believes in having skin in the game, he offers success-fee structures for select projects. It keeps him sharp, and you certain.",
        "Jednoduše dělá věci jinak — bude to patrné od samého začátku, od neobvyklé profesní etiky přes transparentní komunikaci až po štědré výstupy. Okamžitě si všimnete absence (a netolerance) prázdných řečí a důrazu na jasnost, otevřenost a nové možnosti. Protože věří v osobní zaangažovanost, nabízí u některých aktivit honorář vázaný na úspěch. Jeho to udržuje ve střehu a Vás v jistotě.",
      ),
    },
    {
      q: t("How long are the sessions?", "Jak dlouho setkání trvají?"),
      a: t(
        "Thanks to video conferencing, all workshops can be tailored to any amount of time (2-2½ hours recommended), spread over any number of sessions you want. In-person training is usually 3-6½\u00a0hours a day. Half-day sessions are the sweet spot for most, though some courses are two intensive days for a room full of people.",
        "Díky videokonferencím lze všechny workshopy přizpůsobit libovolnému časovému rozsahu (doporučujeme 2–2,5 hodiny) a rozdělit do libovolného počtu setkání. Prezenční školení obvykle trvá 3–6 hodin, jeden nebo dva dny. Půldenní setkání jsou pro většinu ideální, ačkoliv Prezentační dovednosti obvykle probíhají dva intenzivní dny pro plný sál účastníků.",
      ),
    },
    {
      q: t("What's the investment?", "Jaká je investice?"),
      a: t(
        "Depending on the scope, group size, travel distance, we're talking a daily rate between 1000 and 2000 Euros, prorated. To all the overpriced consultants out there, there's no reason to be greedy. There are various success fee options for certain services, get in touch for a custom quote — I promise not to use the word 'synergy'.",
        "V závislosti na rozsahu, velikosti skupiny a dojezdové vzdálenosti se denní sazba pohybuje mezi 1 000 a 2 000 eury, poměrově. Na rozdíl od předražených konzultantů nemá smysl být chamtivý. U některých služeb existují různé varianty honoráře vázaného na úspěch, ozvěte se pro individuální nabídku — slibuji, že nepoužiji slovo „synergie“.",
      ),
      aElement: isCz ? (
        <>
          V závislosti na rozsahu, velikosti skupiny a dojezdové vzdálenosti se denní sazba pohybuje mezi 1 000 a 2 000
          eury, poměrově. Na rozdíl od předražených konzultantů nemá smysl být chamtivý. U některých služeb existují
          různé varianty honoráře vázaného na úspěch, ozvěte se pro individuální nabídku — slibuji, že nepoužiji slovo
          „synergie“.{" "}
          <a href="#pricing" className="text-primary underline">
            Cenové informace
          </a>
        </>
      ) : (
        <>
          Depending on the scope, group size, travel distance, we're talking a daily rate between 1000 and 2000 Euros,
          prorated. To all the overpriced consultants out there, there's no reason to be greedy. There are various
          success fee options for certain services, get in touch for a custom quote, and I promise not to use the word
          'synergy'.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="#pricing" className="text-primary underline">
            Pricing details
          </a>
        </>
      ),
    },
    {
      q: t("Is there some guarantee I'm not wasting money?", "Existuje nějaká záruka, že neutratím peníze zbytečně?"),
      a: t(
        'Howard has always included a satisfaction guarantee in T&C since his first website in 2004. It reads: "I am not satisfied until you the client is satisfied. If you are disappointed with a service, we will agree to continue working on it at no extra charge, until you are satisfied. Or, you can fire me on the spot and I\'ll cancel the invoice." Simple as that.',
        "Howard má od svých prvních webových stránek z roku 2004 ve smluvních podmínkách vždy zahrnutou záruku spokojenosti. Zní takto: „Nejsem spokojen, dokud nejste spokojeni Vy. Pokud je klient se službou nespokojen, dohodneme se na dalším pokračování bez příplatku, dokud nebude klient spokojen. Nebo mě můžete na místě propustit a já zruším fakturu.“ Tak jednoduché to je.",
      ),
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    // lower number = more padding between service boxes and FAQ
    <section id="faq" className="section-padding pt-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {t("Frequently Asked Questions", "Často kladené otázky")}
        </h2>
        <p className="font-semibold text-primary">
          {t("Questions I hope you're asking", "Otázky, které doufám, že si kladete")}
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <motion.details
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-lg group"
          >
            <summary className="cursor-pointer p-6 text-base font-medium list-none flex justify-between items-center">
              {faq.q}
              <span className="text-muted-foreground transition-transform duration-200 group-open:rotate-45 text-xl ml-4">
                +
              </span>
            </summary>
            <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed font-medium">
              {faq.aElement ?? faq.a}
            </div>
          </motion.details>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
