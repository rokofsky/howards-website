import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
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

// deno-lint-ignore no-explicit-any
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
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json();

    if (!password || !(await isAuthorized(body, password))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const action = body.action;

    if (action === "create") {
      const title = String(body.title ?? "").trim().slice(0, 300);
      const description = String(body.description ?? "").trim().slice(0, 5000);
      const sort_order = Number.isFinite(body.sort_order) ? Number(body.sort_order) : 0;
      if (!title) {
        return new Response(JSON.stringify({ error: "title is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data, error } = await supabase
        .from("keynote_topics")
        .insert({ title, description, sort_order, active: true })
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const id = String(body.id ?? "");
      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const updates: Record<string, unknown> = {};
      if (typeof body.title === "string") updates.title = body.title.trim().slice(0, 300);
      if (typeof body.description === "string") updates.description = body.description.trim().slice(0, 5000);
      if (typeof body.active === "boolean") updates.active = body.active;
      if (Number.isFinite(body.sort_order)) updates.sort_order = Number(body.sort_order);
      const { data, error } = await supabase
        .from("keynote_topics")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reorder") {
      const items = Array.isArray(body.items) ? body.items : [];
      for (const item of items) {
        const { error } = await supabase
          .from("keynote_topics")
          .update({ sort_order: Number(item.sort_order) })
          .eq("id", String(item.id));
        if (error) throw error;
      }
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete") {
      const id = String(body.id ?? "");
      if (!id) {
        return new Response(JSON.stringify({ error: "id is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { error } = await supabase.from("keynote_topics").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("admin-keynote-topics error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
