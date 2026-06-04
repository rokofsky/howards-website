export const ADMIN_PASSWORD = "rokofskyzzz";
const STORAGE_KEY = "admin_authenticated";

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
  } catch {
    /* ignore */
  }
};
