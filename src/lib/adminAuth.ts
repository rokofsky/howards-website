import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "admin_authenticated";
const PASSWORD_KEY = "admin_password";

export const isAdminAuthenticated = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const setAdminAuthenticated = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    /* ignore */
  }
};

export const clearAdminAuthenticated = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    /* ignore */
  }
};

export const getAdminPassword = (): string => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? "";
  } catch {
    return "";
  }
};

/**
 * Verify the admin password against the admin-sessions edge function.
 * The password is never compared in client code; it is sent to the server,
 * which holds the source-of-truth value as a secret.
 * On success, the password is cached in sessionStorage so subsequent
 * edge-function calls can authenticate.
 */
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("admin-sessions", {
      method: "POST",
      body: { password, action: "verify" },
    });
    if (error) return false;
    if (data && (data as any).ok === true) {
      try {
        sessionStorage.setItem(PASSWORD_KEY, password);
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
