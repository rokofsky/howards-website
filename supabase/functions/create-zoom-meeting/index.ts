const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { session_date, password } = body ?? {};

    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!adminPassword || password !== adminPassword) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!session_date) {
      return new Response(JSON.stringify({ error: "session_date is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const zoomAccountId = Deno.env.get("ZOOM_ACCOUNT_ID");
    const zoomClientId = Deno.env.get("ZOOM_CLIENT_ID");
    const zoomClientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

    let zoomLink = null;
    let zoomMeetingId = null;

    if (zoomAccountId && zoomClientId && zoomClientSecret) {
      // Get Zoom access token (Server-to-Server OAuth)
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

      if (tokenData.access_token) {
        // Create Zoom meeting
        const meetingRes = await fetch("https://api.zoom.us/v2/users/me/meetings", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: title || "Storytelling Session",
            type: 2,
            start_time: session_date,
            duration: 60,
          settings: {
  host_video: true,
  participant_video: true,
  join_before_host: false,
  mute_upon_entry: false
  approval_type: 0,      // <--- ADD THIS (0 forces registration)
  registration_type: 1   // <--- ADD THIS (1 means register once)
}
          }),
        });
        const meetingData = await meetingRes.json();
        zoomLink = meetingData.registration_url;
        zoomMeetingId = String(meetingData.id);
      }
    }

    // Store session in database
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data, error } = await supabase
      .from("storytelling_sessions")
      .insert({
        session_date,
        zoom_link: zoomLink,
        zoom_meeting_id: zoomMeetingId,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
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
