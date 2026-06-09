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

    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      return new Response(JSON.stringify({ error: "Zoom credentials not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Step 1: Get Zoom access token
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

    const authHeader = `Bearer ${tokenData.access_token}`;

    // Step 2: Create Zoom meeting (basic)
    const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: authHeader,
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
          waiting_room: false,
        },
      }),
    });

    const meetingData = await meetingRes.json();
    console.log("Step 2 - Created meeting:", JSON.stringify(meetingData));

    if (!meetingData.id) {
      return new Response(JSON.stringify({ error: "Failed to create meeting", detail: meetingData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const meetingId = String(meetingData.id);

    // Step 3: PATCH meeting to enable registration
    const patchRes = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      method: "PATCH",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        settings: {
          approval_type: 0,
          registration_type: 1,
        },
      }),
    });
    console.log("Step 3 - PATCH status:", patchRes.status);

    // Step 4: Fetch meeting again to get registration_url
    const getRes = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
      headers: { Authorization: authHeader },
    });
    const updatedMeeting = await getRes.json();
    console.log("Step 4 - Updated meeting:", JSON.stringify(updatedMeeting));

    const meetingUrl = updatedMeeting.registration_url ?? updatedMeeting.join_url ?? meetingData.join_url;

    return new Response(JSON.stringify({ meetingUrl, meetingId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-zoom-meeting error:", String(err));
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
