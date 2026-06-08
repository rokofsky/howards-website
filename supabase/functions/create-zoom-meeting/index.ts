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
       const ZOOM_HOST_EMAIL = "howeroko@yahoo.com"; 

        const meetingRes = await fetch(`https://api.zoom.us/v2/users/${ZOOM_HOST_EMAIL}/meetings`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
  topic: title,
  type: 2,
  start_time: date,
  agenda: description,
  settings: {
    host_video: true,
    participant_video: true,
    join_before_host: false,
    mute_upon_entry: true,
    use_pmi: false,
    approval_type: 0,
    registration_type: 1,
    waiting_room: false,
  },
})
        });

       const meetingData = await meetingRes.json();
        console.log("Zoom API Server Response:", meetingData);

        zoomLink = meetingData.registration_url ?? meetingData.join_url;
        zoomMeetingId = String(meetingData.id);

        return new Response(
          JSON.stringify({ 
            zoom_link: zoomLink || meetingData.join_url,
            zoom_meeting_id: zoomMeetingId 
          }), 
          { 
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200 
          }
        );
      } else {
        return new Response(JSON.stringify({ error: "Failed to obtain Zoom access token" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "An internal error occurred" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  });
   
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
