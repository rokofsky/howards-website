import Layout from "@/components/Layout";
import { useT } from "@/hooks/useT";

const GDPR = () => {
  const t = useT();
  return (
    <Layout>
      <section className="section-padding max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("GDPR & Data Protection", "GDPR a ochrana osobních údajů")}
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          {t("Last updated: 14.04.2026", "Naposledy aktualizováno: 14. 4. 2026")}
        </p>

        <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("1. Data Controller", "1. Správce údajů")}
            </h2>
            <p>{t(
              "Rokofsky Events s.r.o. acts as the data controller for personal data collected through this website. Registered address: Simackova 24, Prague, CZ. Data protection contact: info@rokofsky.com",
              "Společnost Rokofsky Events s.r.o. vystupuje jako správce osobních údajů shromažďovaných prostřednictvím těchto webových stránek. Sídlo: Šimáčkova 24, Praha, ČR. Kontakt pro ochranu osobních údajů: info@rokofsky.com"
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("2. Scope", "2. Rozsah")}
            </h2>
            <p>{t(
              "This policy applies to all individuals whose personal data we process, including clients, prospects, and website visitors within the European Union (EU), European Economic Area (EEA), and internationally.",
              "Tyto zásady se vztahují na všechny osoby, jejichž osobní údaje zpracováváme — klienty, potenciální zákazníky a návštěvníky webu v Evropské unii (EU), Evropském hospodářském prostoru (EHP) i mezinárodně."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("3. Lawful Basis for Processing", "3. Právní titul zpracování")}
            </h2>
            <p>{t(
              "Under the General Data Protection Regulation (EU 2016/679), we process personal data on the following legal bases:",
              "V souladu s obecným nařízením o ochraně osobních údajů (EU 2016/679) zpracováváme osobní údaje na následujících právních základech:"
            )}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>{t("Consent", "Souhlas")}</strong>{" — "}
                {t(
                  "When you voluntarily submit information via our contact or registration forms.",
                  "když dobrovolně zašlete údaje prostřednictvím našeho kontaktního či registračního formuláře."
                )}
              </li>
              <li>
                <strong>{t("Contractual necessity", "Plnění smlouvy")}</strong>{" — "}
                {t(
                  "To deliver services you have engaged us to provide.",
                  "abychom mohli poskytnout služby, které jste si u nás objednali."
                )}
              </li>
              <li>
                <strong>{t("Legitimate interest", "Oprávněný zájem")}</strong>{" — "}
                {t(
                  "To improve our services and communicate relevant updates, where this does not override your fundamental rights.",
                  "ke zlepšování našich služeb a předávání relevantních informací, pokud tím nepřevažujeme nad Vašimi základními právy."
                )}
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("4. Data Subject Rights", "4. Práva subjektu údajů")}
            </h2>
            <p>{t("Under GDPR, you have the right to:", "Podle GDPR máte právo na:")}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>{t("Access", "Přístup")}</strong>{" — "}
                {t("Request a copy of the personal data we hold about you.", "vyžádat si kopii osobních údajů, které o Vás vedeme.")}
              </li>
              <li>
                <strong>{t("Rectification", "Opravu")}</strong>{" — "}
                {t("Request correction of inaccurate data.", "požádat o opravu nepřesných údajů.")}
              </li>
              <li>
                <strong>{t("Erasure", "Výmaz")}</strong>{" — "}
                {t("Request deletion of your data (\"right to be forgotten\").", "požádat o výmaz svých údajů („právo být zapomenut“).")}
              </li>
              <li>
                <strong>{t("Restriction", "Omezení")}</strong>{" — "}
                {t("Request limitation of processing in certain circumstances.", "požádat o omezení zpracování za určitých okolností.")}
              </li>
              <li>
                <strong>{t("Portability", "Přenositelnost")}</strong>{" — "}
                {t("Receive your data in a structured, machine-readable format.", "obdržet své údaje ve strukturovaném, strojově čitelném formátu.")}
              </li>
              <li>
                <strong>{t("Objection", "Námitku")}</strong>{" — "}
                {t("Object to processing based on legitimate interests or direct marketing.", "vznést námitku proti zpracování na základě oprávněných zájmů nebo přímého marketingu.")}
              </li>
            </ul>
            <p className="mt-2">{t(
              "To exercise any of these rights, contact us at info@rokofsky.com. We will respond within 30 days.",
              "Pro uplatnění kteréhokoliv z těchto práv nás kontaktujte na info@rokofsky.com. Odpovíme do 30 dnů."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("5. International Data Transfers", "5. Mezinárodní předávání údajů")}
            </h2>
            <p>{t(
              "Where data is transferred outside the EU/EEA (e.g., to service providers in the United States), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission.",
              "Pokud jsou údaje předávány mimo EU/EHP (např. poskytovatelům služeb ve Spojených státech), zajišťujeme odpovídající záruky, jako jsou Standardní smluvní doložky (SCC) schválené Evropskou komisí."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("6. Data Security", "6. Zabezpečení údajů")}
            </h2>
            <p>{t(
              "We implement appropriate technical and organisational measures to protect personal data against unauthorised access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments.",
              "Zavádíme odpovídající technická a organizační opatření k ochraně osobních údajů před neoprávněným přístupem, změnou, zveřejněním nebo zničením. Patří sem šifrování, řízení přístupů a pravidelné bezpečnostní audity."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("7. Data Breach Notification", "7. Oznamování porušení zabezpečení")}
            </h2>
            <p>{t(
              "In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and inform affected individuals without undue delay.",
              "V případě porušení zabezpečení osobních údajů, které představuje riziko pro Vaše práva a svobody, oznámíme tuto skutečnost příslušnému dozorovému úřadu do 72 hodin a bez zbytečného odkladu informujeme dotčené osoby."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("8. Third-Party Processors", "8. Zpracovatelé třetích stran")}
            </h2>
            <p>{t("We use the following categories of third-party processors:", "Využíváme následující kategorie zpracovatelů třetích stran:")}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t("Website hosting and infrastructure", "Hosting webu a infrastruktura")}</li>
              <li>{t("Email delivery services", "Služby pro doručování e-mailů")}</li>
              <li>{t("Video conferencing platforms", "Platformy pro videokonference")}</li>
              <li>{t("Analytics tools", "Analytické nástroje")}</li>
            </ul>
            <p className="mt-2">{t(
              "All processors are bound by data processing agreements in compliance with GDPR Article 28.",
              "Všichni zpracovatelé jsou vázáni smlouvami o zpracování osobních údajů v souladu s článkem 28 GDPR."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("9. Supervisory Authority", "9. Dozorový úřad")}
            </h2>
            <p>
              {t(
                "If you believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority. A list of EU data protection authorities can be found at ",
                "Pokud se domníváte, že byla porušena Vaše práva na ochranu osobních údajů, máte právo podat stížnost u místního dozorového úřadu (v ČR Úřad pro ochranu osobních údajů, www.uoou.cz). Seznam dozorových úřadů EU naleznete na "
              )}
              <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">edpb.europa.eu</a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GDPR;
