const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "Howard Rokofsky <info@rokofsky.com>";
const NOTIFY_EMAIL = "howard@rokofsky.com";

function esc(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
    const err = await r.text();
    console.error("Resend error:", err);
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY not configured");

    const body = await req.json();
    const customer_name = String(body.customer_name ?? "").trim().slice(0, 200);
    const customer_email = String(body.customer_email ?? "").trim().slice(0, 255);
    const chosen_date = String(body.chosen_date ?? "").trim().slice(0, 500);
    const webinar_title = String(body.webinar_title ?? "").trim().slice(0, 300);
    const note = String(body.note ?? "").trim().slice(0, 2000);

    if (!customer_name || !customer_email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const confirmHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fff;font-family:Inter,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <div style="background:#336b7a;padding:24px 28px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">Thanks for your webinar inquiry!</h1>
  </div>
  <div style="background:#f7f0ea;padding:28px;border-radius:0 0 8px 8px;color:#3d2c1e;font-size:14px;line-height:1.6">
    <p>Hi ${esc(customer_name)},</p>
    <p>Thank you for your interest in <strong>${esc(webinar_title) || "the webinar"}</strong>. I've received your inquiry and will be in touch within 24 hours to confirm details.</p>
    ${chosen_date ? `<p><strong>Preferred dates:</strong> ${esc(chosen_date)}</p>` : ""}
    <p>Looking forward to speaking with you.</p>
    <p>— Howard Rokofsky</p>
  </div>
</div></body></html>`;

    const notifyHtml = `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#fff;font-family:Inter,Arial,sans-serif">
<div style="max-width:600px;margin:0 auto;padding:40px 24px">
  <div style="background:#c4805a;padding:24px 28px;border-radius:8px 8px 0 0">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">New Webinar Order</h1>
  </div>
  <div style="background:#f7f0ea;padding:28px;border-radius:0 0 8px 8px;color:#3d2c1e;font-size:14px;line-height:1.6">
    <p><strong>Name:</strong> ${esc(customer_name)}</p>
    <p><strong>Email:</strong> ${esc(customer_email)}</p>
    <p><strong>Webinar:</strong> ${esc(webinar_title) || "—"}</p>
    <p><strong>Chosen date:</strong> ${esc(chosen_date) || "—"}</p>
    ${note ? `<p><strong>Note:</strong> ${esc(note)}</p>` : ""}
  </div>
</div></body></html>`;

    await sendEmail({
      from: FROM_EMAIL,
      to: [customer_email],
      subject: "Thanks for your webinar inquiry!",
      html: confirmHtml,
      reply_to: NOTIFY_EMAIL,
    });

    await sendEmail({
      from: FROM_EMAIL,
      to: [NOTIFY_EMAIL],
      subject: `New webinar order from ${customer_name}`,
      html: notifyHtml,
      reply_to: customer_email,
    });

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
