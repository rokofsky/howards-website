import { supabase } from "@/integrations/supabase/client";

const PASSWORD_KEY = "admin_password";

export const getAdminPassword = (): string | null => {
  try {
    return sessionStorage.getItem(PASSWORD_KEY);
  } catch {
    return null;
  }
};

export const setAdminPassword = (password: string): void => {
  try {
    sessionStorage.setItem(PASSWORD_KEY, password);
  } catch {
    /* ignore */
  }
};

export const clearAdminPassword = (): void => {
  try {
    sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    /* ignore */
  }
};

export const isAdminAuthenticated = (): boolean => !!getAdminPassword();

export const clearAdminAuthenticated = clearAdminPassword;
export const setAdminAuthenticated = (): void => {
  /* deprecated no-op; password is stored via setAdminPassword */
};

/**
 * Verify admin password against the server. On success, password is stored in
 * sessionStorage for reuse by subsequent admin edge function calls.
 */
export const verifyAdminPassword = async (password: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke("admin-sessions", {
      body: { password, action: "verify" },
    });
    if (error) return false;
    if (data && (data as { ok?: boolean }).ok) {
      setAdminPassword(password);
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
