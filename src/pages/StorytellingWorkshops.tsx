import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useT } from "@/hooks/useT";
import { useLocalizedPath } from "@/hooks/useLanguageRouting";
import { trackCTA, trackClick } from "@/lib/analytics";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Session {
  id: string;
  session_date: string;
  title: string | null;
  description: string | null;
}

const StorytellingWorkshops = () => {
  const t = useT();
  const lp = useLocalizedPath();
  const tableName = "storytelling_sessions";
  const statusFilter = "published";
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryError, setQueryError] = useState<unknown>(null);
  const [unfilteredSessions, setUnfilteredSessions] = useState<unknown[] | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; date: string } | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSessions();
  }, []);

  // Debug query removed: sensitive columns (zoom_link, zoom_meeting_id) are no longer
  // exposed to anon/authenticated, so a select("*") on the base table would fail by design.

  const fetchSessions = async () => {
    const now = new Date().toISOString();
    // Public view only exposes safe marketing columns and only published sessions.
    const { data, error } = await supabase
      .from(tableName as any)
      .select("id, session_date, title, description")
      .eq("status", statusFilter)
      .gte("session_date", now)
      .order("session_date", { ascending: true });

    setQueryError(error || null);

    if (!error && data) {
      setSessions(data as unknown as Session[]);
    }
    setLoading(false);
  };

  const openRegistration = (session: Session) => {
    setSelectedSession(session);
    setName("");
    setEmail("");
    setSuccess(null);
    setErrorBanner(null);
    setModalOpen(true);
    trackCTA("storytelling_reserve_open", { session_id: session.id, session_date: session.session_date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !name.trim() || !email.trim()) return;
    trackCTA("storytelling_register_submit", { session_id: selectedSession.id });

    setSubmitting(true);
    setErrorBanner(null);
    try {
      const { data, error } = await supabase.functions.invoke("signup-for-session", {
        body: {
          name: name.trim(),
          email: email.trim(),
          session_id: selectedSession.id,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      });

      if (error) throw error;
      if (data?.success === false || data?.error || data?.registration_disabled) {
        const msg =
          data?.error ||
          (data?.registration_disabled
            ? "Zoom registration is not enabled for this session. Please contact the organizer."
            : "Registration failed. Please try again.");
        setErrorBanner(msg);
        setSubmitting(false);
        return;
      }

      setSuccess({
        title: data.session_title,
        date: new Date(data.session_date).toLocaleString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
      });
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again.";
      setErrorBanner(message);
      toast.error(message);
    }
    setSubmitting(false);
  };

  const downloadIcs = (session: Session) => {
    const start = new Date(session.session_date);
    const end = new Date(start.getTime() + 90 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    const fmt = (d: Date) =>
      `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
    const escape = (s: string) =>
      s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
    const title = session.title || "Storytelling Session";
    const uid = `${session.id}@howardrocks`;
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Howard//Storytelling Sessions//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${escape(title)}`,
      ...(session.description ? [`DESCRIPTION:${escape(session.description)}`] : []),
      "END:VEVENT",
      "END:VCALENDAR",
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const y = start.getFullYear();
    const m = pad(start.getMonth() + 1);
    const d = pad(start.getDate());
    const a = document.createElement("a");
    a.href = url;
    a.download = `storytelling-session-${y}${m}${d}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Free Storytelling Sessions!", "Bezplatná sezení Storytellingu!")}
            </h1>
            <div className="mb-10 max-w-2xl leading-relaxed text-secondary-foreground whitespace-pre-wrap font-semibold">
              {t(
                "Storytelling has been around since the dawn of language. Stories were shared and retold around the community fire, at family gatherings in huts, pueblos, igloos and yurts. Do you want to practice your storytelling?\n\nThis is not a reading or writing event; it is a storyTELLING event, where we practice the art of oral storytelling.\n\nYou are encouraged to tell one story (or joke) in English up to 8 minutes; it can be true, fake, myth, fable, metaphor, anecdote. After each turn, if you want, we’ll have a short round of feedback to hopefully improve your story and/or how you tell it.\n\nYou can also just watch, just do us the courtesy of putting your camera on.\nGet out of your comfort zone in a safe space of fellow storytellers!\n\n",
                "Storytelling existuje už od úsvitu jazyka. Příběhy se sdílely a převyprávěly u komunitního ohně, na rodinných setkáních v chatrčích, pueblech, iglú a jurtách. Chcete si procvičit své vypravěčství?\n\nToto není čtenářská ani spisovatelská akce; je to akce storyTELLINGOVÁ, kde trénujeme umění ústního vyprávění.\n\nJste povzbuzováni k vyprávění jednoho příběhu (nebo vtipu) v angličtině v délce do 8 minut; může být pravdivý, vymyšlený, mýtus, bajka, metafora, anekdota. Po každém vystoupení budeme mít, pokud budete chtít, krátké kolo zpětné vazby, abychom doufejme vylepšili váš příběh a/nebo způsob, jakým ho vyprávíte.\n\nMůžete se také jen dívat, jen nám prokažte laskavost a zapněte si kameru.\nVystupte ze své komfortní zóny v bezpečném prostoru kolegů vypravěčů!\n\n",
              )}
            </div>

            {loading ? (
              <p className="text-muted-foreground font-light">{t("Loading sessions...", "Načítám termíny…")}</p>
            ) : sessions.length === 0 ? (
              <div className="glass rounded-lg border border-border/50 p-10 md:p-14 text-center max-w-2xl mx-auto">
                <div className="text-5xl mb-4" aria-hidden="true">📅</div>
                <h3 className="text-xl md:text-2xl font-semibold mb-3">
                  {t("Stay tuned!", "Zůstaňte naladěni!")}
                </h3>
                <p className="text-muted-foreground font-normal leading-relaxed">
                  {t(
                    "No upcoming sessions scheduled at the moment. Check again in a few days for future sessions!",
                    "Momentálně nejsou naplánované žádné vyprávěcí sezení. Za pár dní se sem podívejte znovu, až budou zveřejněny další termíny!",
                  )}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, i) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass rounded-lg border border-border/50 hover:border-gold/40 transition-all flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold mb-2">
                        {session.title || t("Storytelling Session", "Sezení Storytellingu")}
                      </h3>
                      <p className="text-sm text-gold font-medium mb-3">
                        {format(new Date(session.session_date), "EEEE, MMMM d, yyyy")}
                        <span className="text-muted-foreground ml-2">
                          {format(new Date(session.session_date), "h:mm a")}
                        </span>
                      </p>
                      {session.description && (
                        <p className="text-sm text-muted-foreground mb-4 flex-1 font-normal">{session.description}</p>
                      )}
                      <div className="mt-auto flex flex-col gap-2">
                        <Button variant="cta" className="w-full" onClick={() => openRegistration(session)}>
                          {t("Reserve your spot", "Rezervovat místo")}
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => downloadIcs(session)}>
                          {t("Add to Calendar", "Přidat do kalendáře")}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Story Sandbox CTA - centered, 2/3 width below sessions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-lg border border-border/50 p-6 md:p-8 mt-10 mx-auto w-full lg:w-2/3"
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-3">
                {t("Interactive Story Sandbox", "Interaktivní Story Sandbox")}
              </h2>
              <p className="text-muted-foreground mb-5 max-w-2xl leading-relaxed font-normal">
                {t(
                  "Use the Story Sandbox to instantly generate creative characters, unexpected incidents, and obstacles for your story outline.",
                  "Použijte Story Sandbox a okamžitě generujte kreativní postavy, nečekané události a překážky pro váš příběhový nástřel.",
                )}
              </p>
              <Button variant="cta" asChild>
                <Link to={lp("/story-sandbox")}>{t("Open Story Sandbox", "Otevřít Story Sandbox")}</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          {success ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {t("🌿Thanks for signing up🌿", "🌿Díky za přihlášení🌿")}
                </DialogTitle>
                <DialogDescription className="pt-2 text-base font-medium">
                  {t(
                    "Check your email for the Zoom link, no need to install or setup anything. See you there!",
                    "Zkontrolujte si e-mail, kde najdete odkaz na Zoom, nemusíte nic instalovat ani nastavovat. Uvidíme se tam!",
                  )}
                  <br />
                  /HR
                </DialogDescription>
              </DialogHeader>
              <div className="glass rounded-lg p-4 mt-2">
                <p className="font-semibold">{success.title}</p>
                <p className="text-sm text-muted-foreground font-medium">{success.date}</p>
              </div>
              <Button variant="outline" className="mt-4" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Reserve your spot</DialogTitle>
                <DialogDescription>
                  {selectedSession?.title || t("Storytelling Session", "Sezení Storytellingu")} —{" "}
                  {selectedSession &&
                    new Date(selectedSession.session_date).toLocaleString(undefined, {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZoneName: "short",
                    })}
                </DialogDescription>
              </DialogHeader>
              {errorBanner && (
                <div className="mt-3 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                  <p className="font-semibold mb-1">Registration failed</p>
                  <p className="font-normal break-words">{errorBanner}</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-1 block">
                    Name <span className="text-gold">* (required)</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={200}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">
                    Email <span className="text-gold">* (required)</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                  />
                </div>
                <Button type="submit" variant="cta" className="w-full" disabled={submitting}>
                  {submitting ? "Registering..." : "Register"}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default StorytellingWorkshops;
