import Layout from "@/components/Layout";
import { useT } from "@/hooks/useT";

const TermsOfService = () => {
  const t = useT();
  return (
    <Layout>
      <section className="section-padding max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("Terms of Service", "Obchodní podmínky")}
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          {t("Last updated: [DATE]", "Naposledy aktualizováno: [DATUM]")}
        </p>

        <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("1. Overview", "1. Úvod")}
            </h2>
            <p>{t(
              "These Terms of Service (\"Terms\") govern your use of the website and services provided by [BUSINESS NAME] (\"we\", \"us\", \"our\"). By accessing our website or engaging our services, you agree to these Terms.",
              "Tyto obchodní podmínky („Podmínky“) upravují užívání webových stránek a služeb poskytovaných společností [NÁZEV FIRMY] („my“, „nás“, „náš“). Přístupem na naše webové stránky nebo využitím našich služeb vyjadřujete s těmito Podmínkami souhlas."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("2. Services", "2. Služby")}
            </h2>
            <p>{t(
              "We provide professional consulting, facilitation, coaching, and training services in the areas of communication, storytelling, meeting moderation, and related soft skills. The specific scope, deliverables, and fees for any engagement will be agreed upon in a separate proposal or contract.",
              "Poskytujeme profesionální poradenské, facilitační, koučovací a tréninkové služby v oblasti komunikace, vyprávění příběhů, moderace porad a souvisejících měkkých dovedností. Konkrétní rozsah, výstupy a odměna za jednotlivou zakázku budou sjednány v samostatné nabídce či smlouvě."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("3. Intellectual Property", "3. Duševní vlastnictví")}
            </h2>
            <p>{t(
              "All content on this website — including text, graphics, logos, and media — is the property of [BUSINESS NAME] and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.",
              "Veškerý obsah těchto webových stránek — texty, grafika, loga i média — je vlastnictvím [NÁZEV FIRMY] a je chráněn příslušnými předpisy o duševním vlastnictví. Bez předchozího písemného souhlasu nesmíte obsah rozmnožovat, šířit ani vytvářet odvozená díla."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("4. Booking & Cancellation", "4. Rezervace a storno")}
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t(
                "Bookings are confirmed upon written agreement or receipt of a deposit, where applicable.",
                "Rezervace jsou potvrzeny písemnou dohodou, případně přijetím zálohy, je-li sjednána."
              )}</li>
              <li>{t(
                "Cancellations made more than [NUMBER] business days before the scheduled date will receive a full refund.",
                "Storna učiněná více než [POČET] pracovních dnů před plánovaným termínem mají nárok na plné vrácení peněz."
              )}</li>
              <li>{t(
                "Cancellations made within [NUMBER] business days may incur a cancellation fee of up to [PERCENTAGE]% of the agreed fee.",
                "Storna učiněná do [POČET] pracovních dnů před termínem mohou být zpoplatněna stornopoplatkem až [PROCENTO] % sjednané odměny."
              )}</li>
              <li>{t(
                "We reserve the right to reschedule or cancel sessions due to unforeseen circumstances, in which case a full refund or alternative date will be offered.",
                "Vyhrazujeme si právo termín přesunout nebo zrušit z důvodu nepředvídaných okolností; v takovém případě nabídneme plné vrácení peněz nebo náhradní termín."
              )}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("5. Confidentiality", "5. Mlčenlivost")}
            </h2>
            <p>{t(
              "We treat all client information as confidential. Details shared during consulting engagements, workshops, or coaching sessions will not be disclosed to third parties without your explicit consent, except where required by law.",
              "Veškeré informace klientů považujeme za důvěrné. Údaje sdílené během poradenských zakázek, workshopů či koučovacích sezení nebudou bez Vašeho výslovného souhlasu sdělovány třetím stranám, s výjimkou případů, kdy to vyžaduje zákon."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("6. Limitation of Liability", "6. Omezení odpovědnosti")}
            </h2>
            <p>{t(
              "[BUSINESS NAME] provides services on an \"as-is\" basis. While we strive for the highest quality, we do not guarantee specific outcomes. Our total liability for any claim arising from our services shall not exceed the fees paid for the specific engagement in question.",
              "Společnost [NÁZEV FIRMY] poskytuje své služby „tak, jak jsou“. Přestože usilujeme o nejvyšší kvalitu, neručíme za konkrétní výsledky. Celková odpovědnost za jakýkoliv nárok vyplývající z našich služeb nepřesáhne odměnu uhrazenou za danou zakázku."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("7. Website Use", "7. Užívání webových stránek")}
            </h2>
            <p>{t(
              "You agree to use this website for lawful purposes only. You may not attempt to gain unauthorised access to any part of the website, its server, or any connected systems.",
              "Souhlasíte, že tyto webové stránky budete využívat výhradně k zákonným účelům. Nesmíte se pokoušet neoprávněně získat přístup k jakékoliv části webu, serveru ani propojeným systémům."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("8. External Links", "8. Externí odkazy")}
            </h2>
            <p>{t(
              "Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.",
              "Naše webové stránky mohou obsahovat odkazy na webové stránky třetích stran. Neneseme odpovědnost za jejich obsah ani za jejich postupy v oblasti ochrany osobních údajů."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("9. Governing Law", "9. Rozhodné právo")}
            </h2>
            <p>{t(
              "These Terms are governed by and construed in accordance with the laws of [JURISDICTION]. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of [JURISDICTION].",
              "Tyto Podmínky se řídí a vykládají v souladu s právním řádem [JURISDIKCE]. Veškeré spory z těchto Podmínek vyplývající podléhají výlučné pravomoci soudů [JURISDIKCE]."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("10. Changes to These Terms", "10. Změny Podmínek")}
            </h2>
            <p>{t(
              "We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised date. Continued use of our website or services constitutes acceptance of the updated Terms.",
              "Vyhrazujeme si právo tyto Podmínky kdykoliv upravit. Aktualizované Podmínky budou zveřejněny na této stránce s upraveným datem. Pokračujícím užíváním našich webových stránek nebo služeb vyjadřujete s aktualizovanými Podmínkami souhlas."
            )}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsOfService;
