import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useT } from "@/hooks/useT";

const CV = () => {
  const t = useT();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-6 pt-28 pb-16 max-w-4xl">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t("Curriculum Vitae", "Životopis")}
          </h1>
          <Button asChild variant="cta" size="lg">
            <a href="/Howard_CV.pdf" download>
              <Download className="mr-2" />
              {t("Download PDF", "Stáhnout PDF")}
            </a>
          </Button>
        </div>

        <article className="prose prose-lg max-w-none text-foreground/90 space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("Summary of Qualifications", "Shrnutí kvalifikace")}</h2>
            <p className="text-base">
              {t("Refined interpersonal/teaching skills, inexhaustible flexibility and empathy, experience with a multitude of students and professionals from various industries and markets in diverse countries.", "Vytříbené interpersonální a pedagogické dovednosti, nevyčerpatelná flexibilita a empatie, zkušenosti s širokou škálou studentů i profesionálů z různých odvětví a trhů v mnoha zemích.")}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("Advantages", "Výhody")}</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li className="text-base">{t("Polyglot (CZ-NL-ENG) saves time with multilingual explanations", "Jazyková vybavenost (angličtina – čeština – nizozemština) který šetří čas díky vízejazyčnému vysvětlování")}</li>
              <li className="text-base">{t("Long-term experience enables immediate answers to most-asked questions", "Dlouholetá praxe umožňuje okamžitě odpovědět na nejčastější otázky")}</li>
              <li className="text-base">{t("Knowledge is assimilated quickly in a comfortable, relaxed, playful environment", "Znalosti si účastníci osvojují rychle v příjemném, uvolněném a hravém prostředí")}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">{t("Professional Experience", "Profesní zkušenosti")}</h2>

            <div className="space-y-6">
              <div>
                <p className="font-normal text-base"><strong>{t("2002 – pres:", "2002 – dosud: ")}</strong> <em>{t("Seminar Trainer: Rokofsky Communication Training", "Lektor seminářů: Rokofsky Communication Training")}</em></p>
                <p className="text-base">{t("Programs: Presentations, Negotiations, Assertiveness, Stress/Conflict Mgmt, Persuasion, NLP, Intercultural Communication, Business Writing, Storytelling", "Programy: Prezentační dovednosti, Vyjednávací dovednosti, Asertivita, Zvládání stresu a konfliktů, Přesvědčování, NLP, Mezikulturní komunikace, Obchodní korespondence, Storytelling.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>{t("2020 – pres:", "2020 – dosud: ")}</strong> <em>{t("Online Webinars and Storytelling Sessions", "Online webináře a sezení zaměřená na vyprávění příběhů")}</em></p>
                <p>{t(">150 webinars and sessions for ±6-96 participants (see the Live Webinars page for a taste. In addition to those, I also did \"Sit-down Comedy\", Improv, and debate events.", "Více než 150 webinářů a setkání pro přibližně 6 až 96 účastníků (ochutnávku najdete na stránce Živé webináře. Kromě nich jsem dělal také \"Sit-down Comedy\", improvizaci a debatní akce.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>2018 – 2022:</strong> <em>{t("English teacher: Trojské Gymnázium, Euroškola, Prague, CZ", "Učitel angličtiny: Trojské gymnázium, Euroškola, Praha, CZ")}</em></p>
                <p>{t("After an injury and – due to long-term crutches – the inability to resume corporate training, I took the opportunity to teach children fulltime at a local prep school.", "Po úrazu a kvůli dlouhodobému používání berlí, které mi znemožnilo návrat ke korporátním školením, jsem využil příležitosti učit děti na plný úvazek na místní gymnázium.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>2012 – 2014:</strong> <em>{t("Lecturer: Clinical Empathy, Charles University, First Medical Faculty, Prague, CZ", "Přednášející: „Klinická empatie“, Univerzita Karlova, První lékařská fakulta, Praha, CZ")}</em></p>
                <p>{t("Training communication skills and 'bedside manner' to medical students.", "Výuka komunikačních dovedností a „přístupu k pacientům“ pro studenty medicíny.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>2008 – 2009:</strong> <em>{t("Intensive English course: University of Aerospace and Aeronautics, Nanjing, China", "Intenzivní kurz angličtiny: University of Aerospace and Aeronautics, Nanking, Čína")}</em></p>
                <p>{t("Two 9-week intensive courses for Juneyao pilots. IELTS exam success rate was 93%.", "Dva devítitýdenní intenzivní kurzy pro piloty společnosti Juneyao Airlines. Úspěšnost u zkoušky IELTS dosáhla 93%.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>2002 & 2006:</strong> <em>{t("Suggestopedic English Instructor: Provincial Gov't Planning Dept., Hainan, China", "Lektor sugestopedické angličtiny: Provincial Government Planning Department, Hainan, Čína")}</em></p>
                <p>{t("Led three 8-week intensive Suggestopedic English language courses, and assisted Lonny Gold in two others.", "Vedl tři osmítýdenní intenzivní kurzy sugestopedické výuky angličtiny a ve dvou dalších asistoval Lonnymu Goldovi.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>1999 – 2002:</strong> <em>{t("English Language Instructor Prague, CZ", "Lektor anglického jazyka, Praha, ČR")}</em></p>
                <p>{t("Specialized English: Legal, Business, Financial, Medical, Technical, exam preparation. Small, international, and state-owned enterprises; references upon request.", "Odborná angličtina: právní, obchodní, finanční, lékařská, technická, příprava na zkoušky.\nMalé, mezinárodní i státní podniky.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>1996 – 1998:</strong> <em>{t("College English Instructor, Amsterdam Academy for Banking and Finance, NL", "Vysokoškolský lektor angličtiny, Amsterdam Academy for Banking and Finance, Nizozemsko")}</em></p>
                <p>{t("Polytechnic and University students at this institute for finance. Courses: Presentation & Negotiation Skills, English for Banking and Finance.", "Výuka studentů polytechniky a univerzity na institutu zaměřeném na finance. Kurzy: prezentační a vyjednávací dovednosti, angličtina pro bankovnictví a finance.")}</p>
              </div>

              <div>
                <p className="font-medium"><strong>1996 – 1998:</strong> <em>{t("College English Instructor, Hogeschool (Polytechnic) Holland, Amsterdam, NL", "Vysokoškolský lektor angličtiny, Hogeschool Holland, Amsterdam, Nizozemsko")}</em></p>
                <p>{t("Substituted whole semesters including Tourism, Literature, Education, Writing, Translation, Government, English for older adults, Rhetoric, Public Speaking.", "Zastupoval celé semestry ve výuce předmětů jako cestovní ruch, literatura, pedagogika, psaní, překlad, veřejná správa, angličtina pro starší dospělé, rétorika a veřejné vystupování.")}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("Education", "Vzdělání")}</h2>
            <div className="space-y-4">
              <div>
                <p><strong>SUNY-Binghamton, Binghamton, New York, USA</strong></p>
                <p><em>{t("Bachelor's program: Literature/Rhetoric, 1984-1989", "BA: literatura / rétorika, 1984-1989")}</em></p>
                <p>{t("Minor in Philosophy", "Vedlejší obor: filozofie")}</p>
              </div>
              <div>
                <p><strong>{t("University of Amsterdam, Amsterdam, NL", "Universiteit van Amsterdam (UvA), Amsterdam, Nizozemsko")}</strong></p>
                <p><em>{t("Master's program: English Literature, 1990-1993", "Magisterský program: anglická literatura, 1990-1993")}</em></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("Languages", "Jazyky")}</h2>
            <p>
              {t(
                "English (native), Czech, Dutch (fluent), Italian, German, Spanish (fair), Mandarin (impressive)",
                "Angličtina (rodilý mluvčí), čeština, nizozemština (plynně), italština, němčina, španělština (středně pokročilá), mandarínština (působivá)"
              )}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">{t("Book Published", "Vydaná kniha")}</h2>
            <p>
              {t(
                "\"How to GET Great Service – Upgrade From Everyday Customer to VIP\" ISBN 9788090720916. Available at ",
                "\"How to GET Great Service – Upgrade From Everyday Customer to VIP\" ISBN 9788090720916. K dispozici na: "
              )}
              <a
                href="https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                {t("How to GET Great Service", "How to GET Great Service")}
              </a>
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default CV;