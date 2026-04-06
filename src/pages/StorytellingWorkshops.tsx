import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
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
  zoom_link: string | null;
  zoom_meeting_id: string | null;
  title: string | null;
  description: string | null;
}

const StorytellingWorkshops = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ title: string; date: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("storytelling_sessions")
      .select("id, session_date, zoom_link, zoom_meeting_id, title, description")
      .gte("session_date", new Date().toISOString())
      .order("session_date", { ascending: true });

    if (!error && data) {
      setSessions(data);
    }
    setLoading(false);
  };

  const openRegistration = (session: Session) => {
    setSelectedSession(session);
    setFirstName("");
    setEmail("");
    setSuccess(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !firstName.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("signup-for-session", {
        body: {
          first_name: firstName.trim(),
          email: email.trim(),
          session_id: selectedSession.id,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setSuccess({
        title: data.session_title,
        date: format(new Date(data.session_date), "EEEE, MMMM d, yyyy 'at' h:mm a"),
      });
    } catch {
      toast.error("Registration failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Storytelling Sessions</h1>
            <p className="text-muted-foreground mb-10 max-w-2xl leading-relaxed font-medium">
              Join us in a round of neighborly storytelling. We come together on Zoom and take
              turns telling our story, anecdote, joke, whatever, and (if you want) get instant
              feedback from the others.
            </p>

            {loading ? (
              <p className="text-muted-foreground font-light">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <div className="glass rounded-lg p-8">
                <p className="text-muted-foreground font-light">
                  No upcoming sessions scheduled yet. Check back soon!
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
                        {session.title || "Storytelling Session"}
                      </h3>
                      <p className="text-sm text-gold font-medium mb-3">
                        {format(new Date(session.session_date), "EEEE, MMMM d, yyyy")}
                        <span className="text-muted-foreground ml-2">
                          {format(new Date(session.session_date), "h:mm a")}
                        </span>
                      </p>
                      {session.description && (
                        <p className="text-sm text-muted-foreground font-light mb-4 flex-1">
                          {session.description}
                        </p>
                      )}
                      <Button
                        variant="cta"
                        className="w-full mt-auto"
                        onClick={() => openRegistration(session)}
                      >
                        Reserve your spot
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
                <DialogTitle className="text-xl">You're registered! 🎉</DialogTitle>
                <DialogDescription className="pt-2 text-base">
                  Check your email for your Zoom link.
                </DialogDescription>
              </DialogHeader>
              <div className="glass rounded-lg p-4 mt-2">
                <p className="font-semibold">{success.title}</p>
                <p className="text-sm text-muted-foreground">{success.date}</p>
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
                  {selectedSession?.title || "Storytelling Session"} —{" "}
                  {selectedSession &&
                    format(new Date(selectedSession.session_date), "MMMM d, yyyy 'at' h:mm a")}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label htmlFor="firstName" className="text-sm font-medium mb-1 block">
                    First name
                  </label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-1 block">
                    Email
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
