import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";
import { setPageSeo } from "@/lib/pageSeo";

const NotFound = () => {
  const location = useLocation();
  const t = useT();
  const isCz = useIsCzech();
  const homeHref = isCz ? "/cz" : "/";

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  useEffect(() => {
    setPageSeo(
      isCz
        ? "Stránka nenalezena | Rokofsky Communication Training"
        : "Page Not Found | Rokofsky Communication Training",
      isCz
        ? "Tato stránka neexistuje. Vraťte se na hlavní stránku Rokofsky Communication Training."
        : "This page doesn't exist. Return to the Rokofsky Communication Training homepage."
    );
  }, [isCz]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">
          {t("Oops! Page not found", "Jejda! Stránka nenalezena")}
        </p>
        <a
          href={homeHref}
          className="text-primary underline hover:text-primary/90"
        >
          {t("Return to Home", "Zpět na hlavní stránku")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
