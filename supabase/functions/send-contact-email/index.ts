import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "info@rokofsky.com";
const TO_EMAIL = "info@rokofsky.com";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function notificationHtml(data: Record<string, string>) {
  const esc = (key: string) => escapeHtml(data[key] || "");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <div style="background:#c4805a;padding:24px 28px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">New Inquiry</h1>
  </div>
  <div style="background:#f7f0ea;padding:28px;border-radius:0 0 8px 8px">
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3d2c1e">
      <tr><td style="padding:8px 0;font-weight:600;width:140px">Name</td><td>${esc("name") || "—"}</td></tr>
      <tr><td style="padding:8px 0;font-weight:600">Email</td><td>${esc("email") || "—"}</td></tr>
      ${data.service ? `<tr><td style="padding:8px 0;font-weight:600">Service</td><td>${esc("service")}</td></tr>` : ""}
      ${data.companyName ? `<tr><td style="padding:8px 0;font-weight:600">Company</td><td>${esc("companyName")}</td></tr>` : ""}
      ${data.groupSize ? `<tr><td style="padding:8px 0;font-weight:600">Group Size</td><td>${esc("groupSize")}</td></tr>` : ""}
      ${data.projectType ? `<tr><td style="padding:8px 0;font-weight:600">Project Type</td><td>${esc("projectType")}</td></tr>` : ""}
      ${data.preferredDates ? `<tr><td style="padding:8px 0;font-weight:600">Preferred Dates</td><td>${esc("preferredDates")}</td></tr>` : ""}
      ${data.timeline ? `<tr><td style="padding:8px 0;font-weight:600">Timeline</td><td>${esc("timeline")}</td></tr>` : ""}
    </table>
    <hr style="border:none;border-top:1px solid #d4b8a0;margin:20px 0">
    <p style="font-size:14px;color:#3d2c1e;white-space:pre-wrap;line-height:1.6">${esc("message")}</p>
  </div>
</div></body></html>`;
}

function copyHtml(data: Record<string, string>, locale: string, formKind: string) {
  const esc = (key: string) => escapeHtml(data[key] || "");
  const isCz = locale === "cs";
  const name = esc("name") || (isCz ? "tam" : "there");
  const service = esc("service");

  const headerText = isCz
    ? (formKind === "webinar" && service
        ? `Vaše zpráva pro Howarda Rokofského o ${service}`
        : "Vaše zpráva pro Howarda Rokofského")
    : "Your message to Howard Rokofsky";

  const intro = isCz
    ? `Zdravím ${name}, děkuji za Váš dotaz. Zde je kopie toho, co jste poslal/a:`
    : `Hi ${name}, thanks for reaching out. Here's a copy of what you sent:`;

  const reLine = isCz
    ? (service ? `<strong>Předmět: ${service}</strong>` : "")
    : (service ? `<strong>Re: ${service}</strong>` : "");

  const footer = isCz
    ? "Howard se vám brzy ozve. Na tento e-mail nemusíte odpovídat."
    : "Howard will be in touch soon. No need to reply to this email.";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <div style="background:#336b7a;padding:24px 28px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">${headerText}</h1>
  </div>
  <div style="background:#f7f0ea;padding:28px;border-radius:0 0 8px 8px">
    <p style="font-size:14px;color:#3d2c1e;line-height:1.6;margin:0 0 16px">
      ${intro}
    </p>
    ${reLine ? `<p style="font-size:14px;color:#3d2c1e;line-height:1.6;margin:0 0 16px">${reLine}</p>` : ""}
    <div style="background:#efe4d9;padding:16px 20px;border-radius:6px;font-size:14px;color:#3d2c1e;white-space:pre-wrap;line-height:1.6">
${esc("message")}
    </div>
    <p style="font-size:13px;color:#7a6a5e;margin:24px 0 0;line-height:1.5">
      ${footer}
    </p>
  </div>
</div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const body = await req.json();

    // Bot defenses (server-side)
    // 1) Honeypot: if "website" is filled, silently accept and drop.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      console.warn("Honeypot triggered, dropping submission");
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // 2) Submission delay: form must have been open >3s.
    const elapsedMs = Number(body.elapsedMs);
    if (!Number.isFinite(elapsedMs) || elapsedMs < 3000) {
      console.warn("Submission too fast, dropping. elapsedMs=", elapsedMs);
      return new Response(JSON.stringify({ error: "Please take a moment before submitting." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize: strip control chars and HTML tags, then trim + cap length.
    const clean = (v: unknown, max: number) =>
      String(v ?? "")
        .replace(/[\u0000-\u001F\u007F]/g, " ") // control chars
        .replace(/<[^>]*>/g, "") // strip HTML tags
        .trim()
        .slice(0, max);

    // Validate and sanitize inputs
    const name = clean(body.name, 200);
    const email = clean(body.email, 255);
    const message = clean(body.message, 5000);
    const service = clean(body.service, 200);
    const companyName = clean(body.companyName, 200);
    const groupSize = clean(body.groupSize, 100);
    const preferredDates = clean(body.preferredDates, 100);
    const projectType = clean(body.projectType, 100);
    const timeline = clean(body.timeline, 100);
    const copyToMe = body.copyToMe === true;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email address" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save to database (service role bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { error: dbError } = await supabase.from("contact_submissions").insert({
      name,
      email,
      message,
      service: service || null,
      company_name: companyName || null,
      group_size: groupSize || null,
      preferred_dates: preferredDates || null,
      project_type: projectType || null,
      timeline: timeline || null,
      copy_to_me: copyToMe,
    });
    if (dbError) {
      console.error("DB insert error:", dbError);
    }

    const data = { name, email, message, service, companyName, groupSize, preferredDates, projectType, timeline };

    async function sendEmail(payload: Record<string, unknown>) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (!r.ok) {
        const errBody = await r.json().catch(() => ({}));
        console.error("Resend error:", errBody);
        return false;
      }
      return true;
    }

    // Always send notification to the hardcoded inbox
    const notifySubject = data.service
      ? `New inquiry: ${data.service} — ${name}`
      : `New inquiry from ${name}`;
    const notifyOk = await sendEmail({
      from: `Howard Rokofsky <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      subject: notifySubject,
      html: notificationHtml(data),
      reply_to: email,
    });

    if (!notifyOk) {
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If requested, send copy ONLY to the submitter's own email (never an arbitrary address)
    if (copyToMe) {
      await sendEmail({
        from: `Howard Rokofsky <${FROM_EMAIL}>`,
        to: [email],
        subject: `Copy of your message to Howard${data.service ? ` about ${data.service}` : ""}`,
        html: copyHtml(data),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
