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
    const firstName = (body.first_name ?? "").trim();
    const email = (body.email ?? "").trim();
    const sessionId = body.session_id;

    if (!sessionId || !email || !firstName) {
      return new Response(
        JSON.stringify({ error: "first_name, email, and session_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Look up session
    const { data: session, error: sessionError } = await supabase
      .from("storytelling_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "Session not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert into registrations table
    const { error: insertError } = await supabase
      .from("registrations")
      .insert({
        first_name: firstName,
        email,
        session_title: session.title || "Storytelling Session",
        session_date: session.session_date,
        zoom_meeting_id: session.zoom_meeting_id,
      });

    if (insertError) throw insertError;

    // Add Zoom registrant if credentials are available
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
              body: JSON.stringify({ email, first_name: firstName }),
            }
          );
        }
      } catch (zoomErr) {
        console.error("Zoom registrant error:", zoomErr);
        // Don't fail the registration if Zoom add fails
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        session_title: session.title || "Storytelling Session",
        session_date: session.session_date,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new Response(
      JSON.stringify({ error: "Registration failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
