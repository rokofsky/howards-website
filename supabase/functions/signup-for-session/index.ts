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
    const fullName = (body.name ?? `${body.first_name ?? ""} ${body.last_name ?? ""}`).trim().slice(0, 200);
    const email = (body.email ?? "").trim().slice(0, 255);
    const sessionId = (body.session_id ?? "").trim();

    console.log('Received email:', email);

    if (!sessionId || !email || !fullName) {
      return new Response(
        JSON.stringify({ error: "name, email, and session_id are required" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(sessionId)) {
      return new Response(
        JSON.stringify({ error: "Invalid session_id" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || firstName;

    // Permissive email check — accepts all standard public domains (yahoo, gmail, etc.)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log('Validation passed, calling Zoom/Resend for:', email);

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

    // Normalize meeting ID: strip everything except digits
    const rawMeetingId = session.zoom_meeting_id || "";
    const meetingId = rawMeetingId.replace(/\D/g, "");

    // Check Zoom credentials
    const zoomAccountId = Deno.env.get("ZOOM_ACCOUNT_ID");
    const zoomClientId = Deno.env.get("ZOOM_CLIENT_ID");
    const zoomClientSecret = Deno.env.get("ZOOM_CLIENT_SECRET");

    if (!zoomAccountId || !zoomClientId || !zoomClientSecret) {
      console.error("Missing Zoom credentials");
      return new Response(
        JSON.stringify({ error: "Zoom is not configured. Please contact the organizer." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!meetingId) {
      console.error("Session has no valid Zoom meeting ID", { rawMeetingId, sessionId });
      return new Response(
        JSON.stringify({ error: "This session does not have a valid Zoom meeting ID configured." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 1: Get Zoom access token
    console.log("Requesting Zoom token for account:", zoomAccountId);
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

    const tokenBody = await tokenRes.text();
    if (!tokenRes.ok) {
      console.error("Zoom token request failed:", tokenRes.status, tokenBody);
      return new Response(
        JSON.stringify({ error: "Failed to authenticate with Zoom. Please contact the organizer." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokenData = JSON.parse(tokenBody);
    if (!tokenData.access_token) {
      console.error("Zoom token response missing access_token:", tokenBody);
      return new Response(
        JSON.stringify({ error: "Zoom authentication error. Please contact the organizer." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Step 2: Register the user in Zoom
    const registrantUrl = `https://api.zoom.us/v2/meetings/${meetingId}/registrants`;
    console.log("Adding Zoom registrant:", registrantUrl, { email, first_name: firstName });

    const registrantRes = await fetch(registrantUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
    });

    const registrantBody = await registrantRes.text();
    console.log("Zoom registrant response:", registrantRes.status, registrantBody);

    let zoomJoinUrl: string | null = null;
    let registrationDisabled = false;

    if (!registrantRes.ok) {
      let zoomError = `Zoom registration failed (HTTP ${registrantRes.status}): ${registrantBody}`;
      let isAlreadyRegistered = false;
      try {
        const parsed = JSON.parse(registrantBody);
        if (parsed.message) zoomError = parsed.message;
        if (parsed.code === 200 || (parsed.message && parsed.message.toLowerCase().includes("already"))) {
          isAlreadyRegistered = true;
        }
        if (parsed.code === 3001) {
          registrationDisabled = true;
        }
        if (
          parsed.code === 3027 ||
          parsed.code === 404 ||
          (parsed.message && parsed.message.toLowerCase().includes("registration has not been enabled"))
        ) {
          registrationDisabled = true;
        }
      } catch {
        // keep generic message
      }

      if (!registrationDisabled && !isAlreadyRegistered) {
        // Pass the literal Zoom/Resend error back so the frontend can display it
        return new Response(
          JSON.stringify({ error: zoomError }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      zoomJoinUrl = session.zoom_link || null;
    } else {
      try {
        const parsedOk = JSON.parse(registrantBody);
        zoomJoinUrl = parsedOk.join_url || session.zoom_link || null;
      } catch {
        zoomJoinUrl = session.zoom_link || null;
      }
    }

    // Step 3: Save locally with safe fallbacks
    const workshopTitle = session.title || "Storytelling Workshop";
    const sessionDate = session.session_date ?? new Date().toISOString();
    const safeZoomLink = zoomJoinUrl ?? session.zoom_link ?? "";

    try {
      const { error: insertError } = await supabase
        .from("registrations")
        .insert({
          first_name: firstName,
          email,
          session_title: workshopTitle,
          session_date: sessionDate,
          zoom_meeting_id: meetingId,
        });

      if (insertError) {
        console.error("Local registration insert failed:", insertError);
      }
    } catch (e) {
      console.error("Local registration insert threw:", e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        session_title: workshopTitle,
        session_date: sessionDate,
        join_url: safeZoomLink,
        registration_disabled: registrationDisabled,
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
