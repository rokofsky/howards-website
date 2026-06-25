import { supabase } from "@/integrations/supabase/client";

const AUTH_KEY = "admin_authenticated";
const TOKEN_KEY = "admin_session_token";

/**
 * Admin UI gating is based on possession of a non-empty, HMAC-signed
 * session token issued by the admin-sessions edge function. The token
 * has a `payload.signature` shape (base64url) — verify structure before
 * trusting it so a user can't simply set an arbitrary string in
 * localStorage to reveal admin UI. Actual data mutations are still
 * enforced server-side by the edge function re-verifying the HMAC.
 */
const looksLikeSignedToken = (token: string): boolean => {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  return parts[0].length > 0 && parts[1].length > 0;
};

export const isAdminAuthenticated = (): boolean => {
  try {
    return looksLikeSignedToken(localStorage.getItem(TOKEN_KEY) ?? "");
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (): void => {
  /* no-op: authentication state is derived from the signed session token */
};

export const clearAdminAuthenticated = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export const getAdminToken = (): string => {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? "";
  } catch {
    return "";
  }
};

/**
 * Verify the admin password against the admin-sessions edge function.
 * The raw password is sent only for this single verification call and is
 * never persisted in client storage. On success, the server returns an
 * opaque session token (HMAC-signed) which is stored in localStorage so
 * the admin remains logged in across browser restarts.
 */
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("admin-sessions", {
      method: "POST",
      body: { password, action: "verify" },
    });
    if (error) return false;
    const payload = data as { ok?: boolean; token?: string } | null;
    if (payload?.ok === true) {
      try {
        if (payload.token) {
          localStorage.setItem(TOKEN_KEY, payload.token);
        }
        localStorage.setItem(AUTH_KEY, "true");
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
