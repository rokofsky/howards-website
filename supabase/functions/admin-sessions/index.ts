import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const password = Deno.env.get("ADMIN_PASSWORD");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();

    if (body.password !== password) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const action = body.action;

    if (action === "verify") {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list") {
      const { data, error } = await supabase
        .from("storytelling_sessions")
        .select("*")
        .order("session_date", { ascending: true });
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const { title, description, session_date, zoom_link, zoom_meeting_id, status } = body;
      if (!session_date) {
        return new Response(JSON.stringify({ error: "session_date is required" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Normalize meeting ID: strip non-digits
      const cleanMeetingId = zoom_meeting_id ? zoom_meeting_id.replace(/\D/g, "") : null;

      const { data, error } = await supabase
        .from("storytelling_sessions")
        .insert({
          title,
          description,
          session_date,
          zoom_link,
          zoom_meeting_id: cleanMeetingId,
          status: status === "published" ? "published" : "draft",
        })
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { id, title, description, session_date, zoom_link, zoom_meeting_id } = body;
      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (session_date !== undefined) updates.session_date = session_date;
      if (zoom_link !== undefined) updates.zoom_link = zoom_link;
      if (zoom_meeting_id !== undefined) updates.zoom_meeting_id = zoom_meeting_id ? zoom_meeting_id.replace(/\D/g, "") : null;

      const { data, error } = await supabase
        .from("storytelling_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase
        .from("storytelling_sessions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-sessions error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
