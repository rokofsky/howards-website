import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "reference-scans";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const password = Deno.env.get("ADMIN_PASSWORD");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json();
    if (body.password !== password) {
      return json({ error: "Invalid password" });
    }

    const action = body.action;

    if (action === "list") {
      const { data, error } = await supabase
        .from("reference_scans")
        .select("*")
        .order("slot_number", { ascending: true });
      if (error) throw error;
      return json(data);
    }

    if (action === "upload") {
      const { slot_number, file_base64, file_name, title } = body;
      if (!slot_number || !file_base64) {
        return json({ error: "slot_number and file_base64 required" });
      }

      const slot = Number(slot_number);
      if (!Number.isInteger(slot) || slot < 1 || slot > 80) {
        return json({ error: "Invalid slot_number" });
      }

      // Decode base64
      const binary = Uint8Array.from(atob(file_base64), (c) => c.charCodeAt(0));
      const safeName = (file_name || "scan.pdf").replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `slot-${slot}/${Date.now()}-${safeName}`;

      // Remove existing file for this slot if any
      const { data: existing } = await supabase
        .from("reference_scans")
        .select("pdf_path")
        .eq("slot_number", slot)
        .maybeSingle();

      if (existing?.pdf_path) {
        await supabase.storage.from(BUCKET).remove([existing.pdf_path]);
      }

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, binary, { contentType: "application/pdf", upsert: false });
      if (upErr) throw upErr;

      const { data, error } = await supabase
        .from("reference_scans")
        .upsert(
          { slot_number: slot, pdf_path: path, title: title || null, updated_at: new Date().toISOString() },
          { onConflict: "slot_number" }
        )
        .select()
        .single();
      if (error) throw error;

      return json(data);
    }

    if (action === "delete") {
      const { slot_number } = body;
      const slot = Number(slot_number);
      const { data: existing } = await supabase
        .from("reference_scans")
        .select("pdf_path")
        .eq("slot_number", slot)
        .maybeSingle();

      if (existing?.pdf_path) {
        await supabase.storage.from(BUCKET).remove([existing.pdf_path]);
      }
      const { error } = await supabase
        .from("reference_scans")
        .delete()
        .eq("slot_number", slot);
      if (error) throw error;
      return json({ success: true });
    }

    if (action === "update_title") {
      const { slot_number, title } = body;
      const { data, error } = await supabase
        .from("reference_scans")
        .update({ title: title || null, updated_at: new Date().toISOString() })
        .eq("slot_number", Number(slot_number))
        .select()
        .single();
      if (error) throw error;
      return json(data);
    }

    return json({ error: "Unknown action" });
  } catch (err) {
    return json({ error: (err as Error).message }, 500);
  }
});
