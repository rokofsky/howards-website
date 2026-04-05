import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface Session {
  id: string;
  session_date: string;
  zoom_link: string | null;
}

const StorytellingWorkshops = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [email, setEmail] = useState("");
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("storytelling_sessions")
      .select("id, session_date, zoom_link")
      .gte("session_date", new Date().toISOString())
      .order("session_date", { ascending: true });

    if (!error && data) {
      setSessions(data);
      if (data.length > 0) setSelectedSession(data[0].id);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession || !email) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("session_signups")
        .insert({ session_id: selectedSession, email });

      if (error) throw error;

      const session = sessions.find((s) => s.id === selectedSession);
      toast.success("You're signed up!", {
        description: session?.zoom_link
          ? "Check your email for the Zoom link."
          : "We'll send you the Zoom link closer to the date.",
      });
      setEmail("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  const nextSession = sessions.length > 0 ? sessions[0] : null;

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Storytelling Sessions</h1>
            <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed font-medium">
              Join us in a round of neighborly storytelling. We come together on Zoom and take turns telling our story, anecdote, joke, whatever, and (if you want) get instant feedback from the others.
            </p>

            {/* Next session highlight */}
            {nextSession && (
              <div className="glass rounded-lg p-6 mb-8 border border-gold/30">
                <p className="text-sm text-muted-foreground font-light mb-1">Next storytelling session</p>
                <p className="text-2xl font-semibold">
                  {format(new Date(nextSession.session_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            )}

            {/* Upcoming sessions */}
            {loading ? (
              <p className="text-muted-foreground font-light">Loading sessions...</p>
            ) : sessions.length === 0 ? (
              <div className="glass rounded-lg p-6 mb-8">
                <p className="text-muted-foreground font-light">No upcoming sessions scheduled yet. Check back soon!</p>
              </div>
            ) : (
              <div className="space-y-3 mb-10">
                <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => setSelectedSession(session.id)}
                    className={`w-full text-left glass rounded-lg p-4 transition-all ${
                      selectedSession === session.id
                        ? "border-2 border-gold shadow-md"
                        : "border border-border/50 hover:border-gold/40"
                    }`}
                  >
                    <p className="font-medium">
                      {format(new Date(session.session_date), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground font-light">
                      {format(new Date(session.session_date), "h:mm a")}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Signup form */}
            {sessions.length > 0 && (
              <div className="glass rounded-lg p-8">
                <h2 className="text-xl font-semibold mb-2">Sign Up</h2>
                <p className="text-muted-foreground font-light mb-6">
                  Enter your email to receive the Zoom link for the selected session.
                </p>
                <form onSubmit={handleSignup} className="flex gap-3 max-w-md">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit" variant="cta" disabled={submitting}>
                    {submitting ? "Signing up..." : "Join"}
                  </Button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default StorytellingWorkshops;
