import { supabase } from "@/integrations/supabase/client";

const AUTH_KEY = "admin_authenticated";
const TOKEN_KEY = "admin_session_token";

export const isAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === "true" && !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (): void => {
  try {
    localStorage.setItem(AUTH_KEY, "true");
  } catch {
    /* ignore */
  }
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
    if (payload?.ok === true && payload.token) {
      try {
        localStorage.setItem(TOKEN_KEY, payload.token);
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
