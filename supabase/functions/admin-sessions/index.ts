import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function issueToken(secret: string): Promise<string> {
  const issuedAt = Date.now().toString();
  const sig = await hmacSign(secret, issuedAt);
  return `${issuedAt}.${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [issuedAt, sig] = parts;
  const ts = Number(issuedAt);
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > TOKEN_MAX_AGE_MS) return false;
  const expected = await hmacSign(secret, issuedAt);
  return expected === sig;
}

async function isAuthorized(body: any, secret: string): Promise<boolean> {
  if (typeof body?.token === "string" && body.token.length > 0) {
    return await verifyToken(body.token, secret);
  }
  return typeof body?.password === "string" && body.password === secret;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const password = Deno.env.get("ADMIN_PASSWORD") ?? "";
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const body = await req.json();

    if (!(await isAuthorized(body, password))) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const action = body.action;

    if (action === "verify") {
      const token = await issueToken(password);
      return new Response(JSON.stringify({ ok: true, token }), {
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
      const { title, description, details, session_date, zoom_link, zoom_meeting_id, status } = body;
      if (!session_date) {
        return new Response(JSON.stringify({ error: "session_date is required" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const cleanMeetingId = zoom_meeting_id ? zoom_meeting_id.replace(/\D/g, "") : null;

      const { data, error } = await supabase
        .from("storytelling_sessions")
        .insert({
          title,
          description,
          details,
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
      const { id, title, description, details, session_date, zoom_link, zoom_meeting_id, status } = body;
      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      if (title !== undefined) updates.title = title;
      if (description !== undefined) updates.description = description;
      if (details !== undefined) updates.details = details;
      if (session_date !== undefined) updates.session_date = session_date;
      if (zoom_link !== undefined) updates.zoom_link = zoom_link;
      if (zoom_meeting_id !== undefined) updates.zoom_meeting_id = zoom_meeting_id ? zoom_meeting_id.replace(/\D/g, "") : null;
      if (status !== undefined) updates.status = status === "published" ? "published" : "draft";

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
