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

function copyHtml(data: Record<string, string>) {
  const esc = (key: string) => escapeHtml(data[key] || "");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Inter,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <div style="background:#336b7a;padding:24px 28px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:600">Your message to Howard Rokofsky</h1>
  </div>
  <div style="background:#f7f0ea;padding:28px;border-radius:0 0 8px 8px">
    <p style="font-size:14px;color:#3d2c1e;line-height:1.6;margin:0 0 16px">
      Hi ${esc("name") || "there"}, thanks for reaching out. Here's a copy of what you sent:
    </p>
    <p style="font-size:14px;color:#3d2c1e;line-height:1.6;margin:0 0 16px">
      <strong>Re: ${esc("service")}</strong>
    </p>
    <div style="background:#efe4d9;padding:16px 20px;border-radius:6px;font-size:14px;color:#3d2c1e;white-space:pre-wrap;line-height:1.6">
${esc("message")}
    </div>
    <p style="font-size:13px;color:#7a6a5e;margin:24px 0 0;line-height:1.5">
      Howard will be in touch soon. No need to reply to this email.
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
    const { type } = body;

    // Validate and sanitize inputs
    const name = (body.name ?? "").trim().slice(0, 200);
    const email = (body.email ?? "").trim().slice(0, 255);
    const message = (body.message ?? "").trim().slice(0, 5000);
    const service = (body.service ?? "").trim().slice(0, 200);
    const companyName = (body.companyName ?? "").trim().slice(0, 200);
    const groupSize = (body.groupSize ?? "").trim().slice(0, 100);
    const preferredDates = (body.preferredDates ?? "").trim().slice(0, 100);
    const projectType = (body.projectType ?? "").trim().slice(0, 100);
    const timeline = (body.timeline ?? "").trim().slice(0, 100);
    const copyToMe = body.copyToMe === true;

    if (!type || !name || !email || !message) {
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
    if (type === "notification") {
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
    }

    const data = { name, email, message, service, companyName, groupSize, preferredDates, projectType, timeline };

    const to = type === "copy" ? email : TO_EMAIL;
    const subject = type === "copy"
      ? `Copy of your message to Howard about ${data.service}`
      : (data.service ? `New inquiry: ${data.service} — ${name}` : `New inquiry from ${name}`);
    const html = type === "copy" ? copyHtml(data) : notificationHtml(data);

    const emailPayload: Record<string, unknown> = {
      from: `Howard Rokofsky <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html,
    };
    if (type !== "copy") {
      emailPayload.reply_to = email;
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
