import { corsHeaders } from "@supabase/supabase-js/cors";
import { createClient } from "@supabase/supabase-js";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { session_id, email } = await req.json();
    if (!session_id || !email) {
      return new Response(JSON.stringify({ error: "session_id and email are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from("storytelling_sessions")
      .select("*")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) {
      return new Response(JSON.stringify({ error: "Session not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert signup
    const { error: signupError } = await supabase
      .from("session_signups")
      .insert({ session_id, email });

    if (signupError) throw signupError;

    // If Zoom credentials are available, add registrant
    const zoomAccountId = Deno.env.get("ZOOM_ACCOUNT_ID");
    const zoomClientId = Deno.env.get("ZOOM_CLIENT_ID");
    const zoomClientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

    if (zoomAccountId && zoomClientId && zoomClientSecret && session.zoom_meeting_id) {
      try {
        const tokenRes = await fetch(
          `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${zoomAccountId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${btoa(`${zoomClientId}:${zoomClientSecret}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        const tokenData = await tokenRes.json();

        if (tokenData.access_token) {
          await fetch(
            `https://api.zoom.us/v2/meetings/${session.zoom_meeting_id}/registrants`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, first_name: "Attendee" }),
            }
          );
        }
      } catch (zoomErr) {
        console.error("Zoom registrant error:", zoomErr);
        // Don't fail the signup if Zoom add fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        zoom_link: session.zoom_link,
        message: "Successfully signed up!",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
