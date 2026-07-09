const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "reference-scans";
const THUMB_WIDTH = 280;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Require admin password (matches admin-* function pattern)
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    let body: { password?: string } = {};
    try {
      body = await req.json();
    } catch {
      // No body provided
    }
    if (!adminPassword || body?.password !== adminPassword) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch scans that don't have a thumbnail yet
    const { data: scans, error: fetchErr } = await supabase
      .from("reference_scans")
      .select("id, slot_number, pdf_path")
      .is("thumbnail_path", null)
      .order("slot_number", { ascending: true });

    if (fetchErr) throw fetchErr;
    if (!scans?.length) {
      return new Response(
        JSON.stringify({ message: "All thumbnails up to date", processed: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const mupdf = await import("npm:mupdf@0.5.0");

    let processed = 0;
    const errors: string[] = [];

    for (const scan of scans) {
      try {
        // Download the PDF from storage
        const { data: fileBlob, error: dlErr } = await supabase.storage
          .from(BUCKET)
          .download(scan.pdf_path);
        if (dlErr || !fileBlob) throw dlErr || new Error("Empty file");

        const pdfBuffer = await fileBlob.arrayBuffer();

        // Open document and render page 1
        const doc = mupdf.Document.openDocument(pdfBuffer, "application/pdf");
        const page = doc.loadPage(0);
        const bounds = page.getBounds();
        const pageWidth = bounds[2] - bounds[0];
        const scale = THUMB_WIDTH / pageWidth;
        const matrix = mupdf.Matrix.scale(scale, scale);
        const pixmap = page.toPixmap(
          matrix,
          mupdf.ColorSpace.DeviceRGB,
          false,
          true
        );
        const pngBytes: Uint8Array = pixmap.asPNG();

        // Upload the thumbnail PNG
        const thumbPath = `thumbnails/slot-${scan.slot_number}.png`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(thumbPath, pngBytes, {
            contentType: "image/png",
            upsert: true,
          });
        if (upErr) throw upErr;

        // Update the DB record
        const { error: updErr } = await supabase
          .from("reference_scans")
          .update({ thumbnail_path: thumbPath })
          .eq("id", scan.id);
        if (updErr) throw updErr;

        processed++;
      } catch (e) {
        errors.push(`Slot ${scan.slot_number}: ${(e as Error).message}`);
      }
    }

    return new Response(
      JSON.stringify({ processed, total: scans.length, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-thumbnails error:", e);
    return new Response(
      JSON.stringify({ error: "An internal error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
