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
            <h2 className="text-2xl font-bold mb-3 text-foreground">Summary of Qualifications</h2>
            <p>
              Refined interpersonal/teaching skills, inexhaustible flexibility and empathy,
              experience with a multitude of students and professionals from various
              industries and markets in diverse countries.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Advantages</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Polyglot (CZ-NL-ENG) saves time with multilingual explanations</li>
              <li>Long-term experience enables immediate answers to most-asked questions</li>
              <li>Knowledge is assimilated quickly in a comfortable, relaxed, playful environment</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Professional Experience</h2>

            <div className="space-y-6">
              <div>
                <p className="font-medium"><strong>2002 – pres:</strong> <em>Seminar Trainer: Rokofsky Communication Training</em></p>
                <p>Programs: Presentations, Negotiations, Assertiveness, Stress/Conflict Mgmt, Persuasion, NLP, Intercultural Communication, Business Writing, Storytelling</p>
              </div>

              <div>
                <p className="font-medium"><strong>2020 – pres:</strong> <em>Online Webinars and Storytelling Sessions</em></p>
                <p>&gt;150 webinars and sessions for ±6-96 participants including Effective Feedback, EQ, NLP, Cultural Intelligence, Storytelling Skills, Six Hats Thinking Meetings, Multiple Intelligences, Zazen Meditation, Image-streaming, Behavioral Economics.</p>
              </div>

              <div>
                <p className="font-medium"><strong>2018 – 2022:</strong> <em>English teacher: Trojské Gymnázium, Euroškola, Prague, CZ</em></p>
                <p>After an injury and – due to long-term crutches – the inability to resume corporate training, I took the opportunity to teach children fulltime at a local prep school.</p>
              </div>

              <div>
                <p className="font-medium"><strong>2012 – 2014:</strong> <em>Lecturer: Clinical Empathy, Charles University, First Medical Faculty, Prague, CZ</em></p>
                <p>Training communication skills and 'bedside manner' to medical students.</p>
              </div>

              <div>
                <p className="font-medium"><strong>2008 – 2009:</strong> <em>Intensive English course: University of Aerospace and Aeronautics, Nanjing, China</em></p>
                <p>Two 9-week intensive courses for Juneyao pilots. IELTS exam success rate was 93%.</p>
              </div>

              <div>
                <p className="font-medium"><strong>2002 &amp; 2006:</strong> <em>Suggestopedic English Instructor: Provincial Gov't Planning Dept., Hainan, China</em></p>
                <p>Led three 8-week intensive Suggestopedic English language courses, and assisted Lonny Gold in two others.</p>
              </div>

              <div>
                <p className="font-medium"><strong>1999 – 2002:</strong> <em>English Language Instructor Prague, CZ</em></p>
                <p>Specialized English: Legal, Business, Financial, Medical, Technical, exam preparation. Small, international, and state-owned enterprises; references upon request.</p>
              </div>

              <div>
                <p className="font-medium"><strong>1996 – 1998:</strong> <em>College English Instructor, Amsterdam Academy for Banking and Finance, NL</em></p>
                <p>Polytechnic and University students at this institute for finance. Courses: Presentation &amp; Negotiation Skills, English for Banking and Finance.</p>
              </div>

              <div>
                <p className="font-medium"><strong>1996 – 1998:</strong> <em>College English Instructor, Hogeschool (Polytechnic) Holland, Amsterdam, NL</em></p>
                <p>Substituted whole semesters including Tourism, Literature, Education, Writing, Translation, Government, English for older adults, Rhetoric, Public Speaking.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Education</h2>
            <div className="space-y-4">
              <div>
                <p><strong>SUNY-Binghamton, Binghamton, New York, USA</strong></p>
                <p><em>Bachelor's program: Literature/Rhetoric, 1984-1989</em></p>
                <p>Minor in Philosophy</p>
              </div>
              <div>
                <p><strong>University of Amsterdam, Amsterdam, NL</strong></p>
                <p><em>Master's program: English Literature, 1990-1993</em></p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Languages</h2>
            <p>
              <strong>English</strong> (native), <strong>Czech</strong>, <strong>Dutch</strong> (fluent),{" "}
              <em>Italian, German, Spanish</em> (fair), <em>Mandarin</em> (impressive)
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-3 text-foreground">Book Published</h2>
            <p>
              <em>"How to GET Great Service – Upgrade From Everyday Customer to VIP"</em>
              <br />
              ISBN 9788090720916. Available at{" "}
              <a
                href="https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                How to GET Great Service
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
