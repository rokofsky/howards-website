import Layout from "@/components/Layout";
import { useT } from "@/hooks/useT";

const PrivacyPolicy = () => {
  const t = useT();
  return (
    <Layout>
      <section className="section-padding max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {t("Privacy Policy", "Zásady ochrany osobních údajů")}
        </h1>
        <p className="text-muted-foreground text-sm mb-10">
          {t("Last updated: 11 April 2026", "Naposledy aktualizováno: 11. dubna 2026")}
        </p>

        <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("1. Who We Are", "1. Kdo jsme")}
            </h2>
            <p>
              {t(
                "We at Rokofsky Communication Training value your privacy as much as we value our professional relationship. This policy explains how we handle your information when you book a session or send an inquiry. I provide professional consulting, facilitation, and coaching services. Our registered address is in Prague, 17000 Czech Republic. For questions about this policy, contact us at info@rokofsky.com.",
                "My v Rokofsky Communication Training si Vašeho soukromí ceníme stejně jako našeho profesního vztahu. Tyto zásady popisují, jak nakládáme s Vašimi údaji, když si objednáte sezení nebo nám pošlete poptávku. Poskytuji profesionální poradenské, facilitační a koučovací služby. Naše sídlo se nachází v Praze, 170 00, Česká republika. S dotazy ohledně těchto zásad nás kontaktujte na info@rokofsky.com."
              )}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("2. Information Collected", "2. Shromažďované údaje")}
            </h2>
            <p>{t("We may collect the following personal data:", "Můžeme shromažďovat následující osobní údaje:")}</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>{t(
                "Name and email address (via contact forms or event registrations), in order to coordinate consulting sessions in person or over Zoom, and respond to inquiries, although we will never save your name or email address for any other purpose.",
                "Jméno a e-mailovou adresu (z kontaktních formulářů nebo registrací na akce), abychom mohli koordinovat poradenská sezení osobně či přes Zoom a reagovat na dotazy. Vaše jméno ani e-mail nikdy neukládáme za jiným účelem."
              )}</li>
              <li>{t("Company name and role", "Název firmy a pracovní pozici")}</li>
              <li>{t("Messages and enquiry details you submit", "Zprávy a údaje z dotazů, které nám zašlete")}</li>
              <li>{t(
                "Technical data such as IP address, browser type, and pages visited (via cookies and analytics)",
                "Technické údaje jako IP adresu, typ prohlížeče a navštívené stránky (prostřednictvím cookies a analytiky)"
              )}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("3. How We Use Your Information", "3. Jak Vaše údaje používáme")}
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>{t("To respond to enquiries and provide my services", "K odpovědím na dotazy a k poskytování mých služeb")}</li>
              <li>{t("To send event confirmations and relevant follow-ups", "K zasílání potvrzení o akcích a souvisejících navazujících informací")}</li>
              <li>{t("To improve our website and user experience", "Ke zlepšování našich webových stránek a uživatelského zážitku")}</li>
              <li>{t("To comply with legal obligations", "K plnění zákonných povinností")}</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("4. Legal Basis for Processing", "4. Právní základ zpracování")}
            </h2>
            <p>{t(
              "We process personal data based on: (a) your consent, (b) the performance of a contract, or (c) our legitimate business interests, provided these do not override your rights.",
              "Osobní údaje zpracováváme na základě: (a) Vašeho souhlasu, (b) plnění smlouvy nebo (c) našich oprávněných obchodních zájmů, pokud nepřevažují nad Vašimi právy."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("5. Data Sharing", "5. Sdílení údajů")}
            </h2>
            <p>{t(
              "We do not sell your personal data. We may share information ONLY with trusted service providers (e.g., hosting, email delivery, video conferencing) who process data on our behalf under strict confidentiality agreements. Nothing else.",
              "Vaše osobní údaje neprodáváme. Údaje můžeme sdílet POUZE s důvěryhodnými poskytovateli služeb (např. hosting, doručování e-mailů, videokonference), kteří údaje zpracovávají naším jménem na základě přísných smluv o mlčenlivosti. Nic víc."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("6. Data Retention", "6. Doba uchování údajů")}
            </h2>
            <p>{t(
              "We retain personal data only as long as necessary for the purposes described above, or as required by law. You may request deletion at any time by contacting info@rokofsky.com.",
              "Osobní údaje uchováváme pouze tak dlouho, jak je nezbytné pro výše uvedené účely, nebo jak vyžaduje zákon. O výmaz můžete kdykoliv požádat na info@rokofsky.com."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("7. Your Rights", "7. Vaše práva")}
            </h2>
            <p>{t(
              "You have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact info@rokofsky.com.",
              "Máte právo na přístup ke svým osobním údajům, jejich opravu, výmaz nebo omezení zpracování. Tato práva uplatníte na info@rokofsky.com."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("8. Cookies", "8. Cookies")}
            </h2>
            <p>{t(
              "Our website uses cookies to enhance your experience and analyse traffic. You can manage cookie preferences through your browser settings.",
              "Naše webové stránky používají cookies ke zlepšení Vašeho zážitku a k analýze provozu. Předvolby cookies můžete spravovat v nastavení svého prohlížeče."
            )}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              {t("9. Changes to This Policy", "9. Změny těchto zásad")}
            </h2>
            <p>{t(
              "We may update this policy from time to time, although probably not. Changes will be posted on this page with an updated revision date.",
              "Tyto zásady můžeme čas od času aktualizovat, i když pravděpodobně ne. Změny budou zveřejněny na této stránce s aktualizovaným datem revize."
            )}</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPolicy;
