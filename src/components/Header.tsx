import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/hooks/useT";
import bookCover from "@/assets/book-cover.png";
import logo from "@/assets/logo.png";
import LanguageToggle from "./LanguageToggle";
import { useLocalizedPath, useIsCzech } from "@/hooks/useLanguageRouting";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const t = useT();
  const lp = useLocalizedPath();
  const isCz = useIsCzech();

  // Determine if we're on the language root
  const isRoot =
    location.pathname === "/" ||
    location.pathname === "/cz" ||
    location.pathname === "/cz/";
  const homeHref = isCz ? "/cz" : "/";

  // Plain links (no scroll/hash logic) - mirrors how Blog/References work
  const plainLinks = [
    { label: t("Home", "Domů"), href: homeHref },
    { label: t("References", "Reference"), href: lp("/references") },
    { label: t("Blog", "Blog"), href: lp("/blog") },
  ];

  // Hash/scroll links (only smooth-scroll when already on root)
  const hashLinks = [
    { label: t("Services", "Služby"), href: lp("/#services"), id: "services" },
    { label: t("FAQ", "FAQ"), href: lp("/#faq"), id: "faq" },
    { label: t("Pricing", "Ceník"), href: lp("/#pricing"), id: "pricing" },
    { label: t("Contact", "Kontakt"), href: lp("/#contact-area"), id: "contact-area" },
  ];

  // Final ordered nav for rendering
  const navOrder: Array<
    | { kind: "plain"; label: string; href: string }
    | { kind: "hash"; label: string; href: string; id: string }
    | { kind: "external"; label: string; href: string }
  > = [
    { kind: "plain", label: plainLinks[0].label, href: plainLinks[0].href }, // Home
    { kind: "hash", ...hashLinks[0] }, // Services
    { kind: "hash", ...hashLinks[1] }, // FAQ
    { kind: "hash", ...hashLinks[2] }, // Pricing
    { kind: "plain", label: plainLinks[1].label, href: plainLinks[1].href }, // References
    {
      kind: "external",
      label: t("My book", "Moje kniha"),
      href: "https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN",
    },
    { kind: "plain", label: "CV", href: lp("/cv") }, // CV
    { kind: "plain", label: plainLinks[2].label, href: plainLinks[2].href }, // Blog
    { kind: "hash", ...hashLinks[3] }, // Contact
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Always close the mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  const scrollToElement = (id: string) => {
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: elementPosition - headerOffset, behavior: "smooth" });
      } else if (attempts < 10) {
        attempts++;
        setTimeout(tryScroll, 100);
      }
    };
    tryScroll();
  };

  // Only used by hash/section links
  const handleHashClick = (e: React.MouseEvent, id: string) => {
    setMobileOpen(false);
    if (isRoot) {
      e.preventDefault();
      window.history.replaceState(null, "", `${isCz ? "/cz" : "/"}#${id}`);
      setTimeout(() => scrollToElement(id), 250);
    }
  };

  const goHome = (targetPath: string) => {
    navigate(targetPath);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  };

  const handleHomeClick = (e: React.MouseEvent, targetPath = homeHref) => {
    e.preventDefault();
    flushSync(() => setMobileOpen(false));
    goHome(targetPath);
  };

  useEffect(() => {
    if (isRoot && location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => scrollToElement(id), 400);
    }
  }, [location.pathname, location.hash]);

  const desktopLinkClass =
    "text-sm text-foreground/70 hover:text-foreground transition-colors tracking-wide font-bold relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out [@media(hover:none)]:hover:after:scale-x-0";

  const mobileLinkClass =
    "text-base font-light text-foreground/70 hover:text-foreground py-2";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 md:h-[72px] items-center justify-between px-6">
        {/* Logo — manual navigation so root routes always reset */}
        <a
          href={homeHref}
          onClick={(e) => handleHomeClick(e)}
          className="flex h-full items-center self-stretch bg-transparent transition-all duration-200 hover:scale-[1.02] hover:opacity-80"
          style={{ backgroundColor: "transparent" }}
        >
          <img
            src={logo}
            alt="Rokofsky Communication Consulting Logo"
            className="block h-8 md:h-10 w-auto shrink-0 object-contain"
            style={{ backgroundColor: "transparent" }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navOrder.map((link) => {
            if (link.kind === "external") {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${desktopLinkClass} flex items-center gap-1.5`}
                >
                  <img
                    src={bookCover}
                    alt="How to GET Great Service by Howard Rokofsky"
                    className="w-5 h-7 object-cover rounded-sm"
                    width={20}
                    height={28}
                  />
                  {link.label}
                </a>
              );
            }
            if (link.kind === "hash") {
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleHashClick(e, link.id)}
                  className={desktopLinkClass}
                >
                  {link.label}
                </Link>
              );
            }
            const isHomeLink = link.href === homeHref;
            if (isHomeLink) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleHomeClick(e, link.href)}
                  className={desktopLinkClass}
                >
                  {link.label}
                </a>
              );
            }
            return (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={desktopLinkClass}
              >
                {link.label}
              </Link>
            );
          })}
          <LanguageToggle />
        </nav>

        <div className="hidden md:block">
          <Button variant="cta" size="lg" asChild>
            <Link to={lp("/storytelling-workshops")}>
              {t("Storytelling Sessions", "Rozprávění příběhů")}
            </Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-3">
          <LanguageToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30"
          >
            <nav className="relative z-[1000] flex flex-col px-6 py-4 gap-4">
              {navOrder.map((link) => {
                if (link.kind === "external") {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className={`${mobileLinkClass} flex items-center gap-2`}
                    >
                      <img
                        src={bookCover}
                        alt="How to GET Great Service by Howard Rokofsky"
                        className="w-5 h-7 object-cover rounded-sm"
                        width={20}
                        height={28}
                      />
                      {link.label}
                    </a>
                  );
                }
                if (link.kind === "hash") {
                  return (
                    <Link
                      key={link.label}
                      to={link.href}
                      onClick={(e) => handleHashClick(e, link.id)}
                      className={mobileLinkClass}
                    >
                      {link.label}
                    </Link>
                  );
                }
                // Home uses manual navigation so / and /cz always close/reset, even on the same route.
                const isHomeLink = link.href === homeHref;
                if (isHomeLink) {
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleHomeClick(e, link.href)}
                      className={mobileLinkClass}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClass}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button variant="cta" size="lg" asChild className="mt-2">
                <Link
                  to={lp("/storytelling-workshops")}
                  onClick={() => setMobileOpen(false)}
                >
                  {t("Storytelling Sessions", "Rozprávění příběhů")}
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
