const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { title, date, description } = body ?? {};

    if (!date) {
      return new Response(JSON.stringify({ error: "date is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const zoomAccountId = Deno.env.get("ZOOM_ACCOUNT_ID");
    const zoomClientId = Deno.env.get("ZOOM_CLIENT_ID");
    const zoomClientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");
const ZOOM_HOST_EMAIL = "howeroko@yahoo.com";
    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      return new Response(JSON.stringify({ error: "Zoom credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get Zoom access token
    const tokenRes = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return new Response(JSON.stringify({ error: "Failed to obtain Zoom access token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Zoom meeting
    const meetingRes = await fetch(`https://api.zoom.us/v2/users/${howeroko@yahoo.com}/meetings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: title || "Storytelling Session",
        type: 2,
        start_time: date,
        agenda: description || "",
        duration: 60,
       settings: {
  host_video: true,
  participant_video: true,
  join_before_host: false,

  mute_upon_entry: true,
  use_pmi: false,

  // IMPORTANT: must be 0 or 1 depending on flow
  approval_type: 1,  // 👈 key fix (manual approval enables registration flow reliably)

  registration_type: 1,

  registrants_email_notification: true,
  close_registration: false,

  waiting_room: true
}
      }),
    });

    const meetingData = await meetingRes.json();

console.log("Zoom meeting response:", meetingData);

if (!meetingRes.ok) {
  throw new Error("Zoom meeting creation failed");
}
    await fetch(`https://api.zoom.us/v2/meetings/${meetingData.id}`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${tokenData.access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    settings: {
      approval_type: 1,
      registration_type: 1,
      registrants_email_notification: true,
      close_registration: false,
    },
  }),
});
    console.log(
  "AUDIT LOG - Response Fields:",
  JSON.stringify(meetingData, null, 2)
);

console.log("join_url:", meetingData.join_url);
console.log("registration_url:", meetingData.registration_url);
console.log("id:", meetingData.id);

console.log("meetingData:", JSON.stringify(meetingData));
console.log("registration_url:", meetingData.registration_url);
console.log("id:", meetingData.id);
    console.log("meetingData:", JSON.stringify(meetingData));

    const meetingUrl = meetingData.registration_url ?? meetingData.join_url;
    const meetingId = String(meetingData.id);

    return new Response(JSON.stringify({ meetingUrl, meetingId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-zoom-meeting error:", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
