import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the structure matching your 'keynote_topics' table
interface KeynoteTopic {
  id: string;
  title: string;
  description: string | null;
  active: boolean;
  sort_order: number;
}

export default function KeynoteTopics() {
  const [topics, setTopics] = useState<KeynoteTopic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKeynoteTopics = async () => {
      try {
        setLoading(true);

        const { data, error: supabaseError } = await supabase
          .from("keynote_topics")
          .select("id, title, description, active, sort_order")
          .eq("active", true)
          .order("sort_order", { ascending: true });

        if (supabaseError) throw supabaseError;

        setTopics(data || []);
      } catch (err: any) {
        console.error("Error fetching keynote topics:", err);
        setError(err.message || "Failed to load topics.");
      } finally {
        setLoading(false);
      }
    };

    fetchKeynoteTopics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-pulse text-muted-foreground">Loading topics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive my-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Keynote Topics</h1>

      {topics.length === 0 ? (
        <p className="text-muted-foreground">No active topics found.</p>
      ) : (
        <div className="space-y-6">
          {topics.map((topic, index) => (
            <div key={topic.id}>
              {/* Topic Wrapper */}
              <div className="py-2">
                <h2 className="text-xl font-semibold text-foreground">{topic.title}</h2>

                {/* Conditional Description: Lighter, smaller font */}
                {topic.description && (
                  <p className="mt-1.5 text-sm text-muted-foreground/80 font-normal leading-relaxed">
                    {topic.description}
                  </p>
                )}
              </div>

              {/* Subtle separator between topics (omitted after the final item) */}
              {index < topics.length - 1 && <hr className="mt-6 border-t border-border/40" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
