import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { useT } from "@/hooks/useT";
import { trackCTA, trackClick } from "@/lib/analytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Session {
  id: string;
  session_date: string;
  title: string | null;
  description: string | null;
}

const StorytellingWorkshops = () => {
  const t = useT();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; date: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    // Public view only exposes safe marketing columns and only published sessions.
    const { data, error } = await supabase
      .from("storytelling_sessions_public" as any)
      .select("id, session_date, title, description")
      .eq("status", "published")
      .gte("session_date", new Date().toISOString())
      .order("session_date", { ascending: true });

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
    setModalOpen(true);
    trackCTA("storytelling_reserve_open", { session_id: session.id, session_date: session.session_date });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !name.trim() || !email.trim()) return;
    trackCTA("storytelling_register_submit", { session_id: selectedSession.id });

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("signup-for-session", {
        body: {
          name: name.trim(),
          email: email.trim(),
          session_id: selectedSession.id,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuccess({
        title: data.session_title,
        date: format(new Date(data.session_date), "EEEE, d MMMM yyyy 'at' HH:mm 'CET'"),
      });
    } catch (err: any) {
      const message = err?.message || "Registration failed. Please try again.";
      toast.error(message);
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("Free Storytelling Sessions!", "Bezplatná sezení Storytellingu!")}
            </h1>
            <p className="mb-10 max-w-2xl leading-relaxed font-semibold text-secondary-foreground">
              {t(
                "Join us in a round of neighborly storytelling. We come together on Zoom and take turns telling our story, anecdote, joke, whatever. If you want, get instant feedback from the others.",
                "Přidejte se k nám na sousedské vyprávění příběhů. Sejdeme se na Zoomu a po jednom vyprávíme svůj příběh, anekdotu, vtip — cokoliv. Pokud chcete, dostanete od ostatních okamžitou zpětnou vazbu."
              )}
            </p>

            {loading ? (
              <p className="text-muted-foreground font-light">{t("Loading sessions...", "Načítám termíny…")}</p>
            ) : sessions.length === 0 ? (
              <div className="glass rounded-lg p-8">
                <p className="text-muted-foreground font-light">
                  {t(
                    "No upcoming sessions scheduled yet. Check back soon!",
                    "Zatím nejsou naplánovány žádné nadcházející termíny. Podívejte se brzy znovu!"
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
                          <span className="text-xs ml-1 opacity-70">(CET)</span>
                        </span>
                      </p>
                      {session.description && (
                        <p className="text-sm text-muted-foreground mb-4 flex-1 font-normal">
                          {session.description}
                        </p>
                      )}
                      <Button
                        variant="cta"
                        className="w-full mt-auto"
                        onClick={() => openRegistration(session)}
                      >
                        {t("Reserve your spot", "Rezervovat místo")}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          {success ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">🌱 You're signed up! 🌱</DialogTitle>
                <DialogDescription className="pt-2 text-base font-medium">
                  Check your email for the Zoom link, see you there!<br />/HR
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
                    format(new Date(selectedSession.session_date), "d MMMM, yyyy 'at' h:mm a 'CET'")}
                </DialogDescription>
              </DialogHeader>
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
