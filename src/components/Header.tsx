import { useState, useEffect, useRef } from "react";
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
  const headerRef = useRef<HTMLElement>(null);

  const isRoot = location.pathname === "/" || location.pathname === "/cz" || location.pathname === "/cz/";
  const homeHref = isCz ? "/cz" : "/";

  const homeLink = { kind: "plain" as const, label: t("Home", "Domů"), href: homeHref };
  const referencesLink = { kind: "plain" as const, label: t("References", "Reference"), href: lp("/references") };
  const blogLink = { kind: "plain" as const, label: t("Blog", "Blog"), href: lp("/blog") };
  const storySandboxLink = { kind: "plain" as const, label: t("Story Sandbox", "Story Sandbox"), href: lp("/story-sandbox") };
  const cvLink = { kind: "plain" as const, label: "CV", href: lp("/cv") };
  const bookLink = {
    kind: "external" as const,
    label: t("My Book", "Moje kniha"),
    href: "https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN",
  };

  const hashLinks = [
    { kind: "hash" as const, label: t("Services", "Služby"), href: lp("/#services"), id: "services" },
    { kind: "hash" as const, label: t("FAQ", "FAQ"), href: lp("/#faq"), id: "faq" },
    { kind: "hash" as const, label: t("Pricing", "Ceník"), href: lp("/#pricing"), id: "pricing" },
    { kind: "hash" as const, label: t("Contact", "Kontakt"), href: lp("/#contact-area"), id: "contact-area" },
  ];

  const navOrder: Array<
    | { kind: "plain"; label: string; href: string }
    | { kind: "hash"; label: string; href: string; id: string }
    | { kind: "external"; label: string; href: string }
  > = [
    homeLink,
    hashLinks[0],
    hashLinks[1],
    hashLinks[2],
    referencesLink,
    bookLink,
    cvLink,
    blogLink,
    storySandboxLink,
    hashLinks[3],
  ].filter(Boolean) as any;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  // Visual Viewport API — keeps header visible and thin during mobile pinch-zoom
  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => {
      const header = headerRef.current;
      if (!header) return;
      // Reposition to stay at top of visual viewport
      header.style.top = `${vv.offsetTop}px`;
      header.style.left = `${vv.offsetLeft}px`;
      header.style.width = `${vv.width}px`;
      // Counter-scale so navbar doesn't get fat when user pinch-zooms
      header.style.transform = `scale(${1 / vv.scale})`;
      header.style.transformOrigin = "top left";
      // Adjust width to compensate for the counter-scale
      header.style.width = `${vv.width * vv.scale}px`;
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
      const header = headerRef.current;
      if (header) {
        header.style.top = "";
        header.style.left = "";
        header.style.width = "";
        header.style.transform = "";
        header.style.transformOrigin = "";
      }
    };
  }, []);

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
    "text-sm max-lg:landscape:text-xs text-foreground/70 hover:text-foreground transition-colors tracking-wide font-bold whitespace-nowrap relative after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-primary after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out [@media(hover:none)]:hover:after:scale-x-0";

  const mobileLinkClass = "text-base font-light text-foreground/70 hover:text-foreground py-2";

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex h-16 md:h-[72px] max-lg:landscape:h-11 items-center justify-between px-6 max-lg:landscape:px-4">
        <a
          href={homeHref}
          onClick={(e) => handleHomeClick(e)}
          className="flex h-full items-center self-stretch bg-transparent transition-all duration-200 hover:scale-[1.02] hover:opacity-80"
          style={{ backgroundColor: "transparent" }}
        >
          <img
            src={logo}
            alt="Rokofsky Communication Consulting Logo"
            className="block h-8 md:h-10 max-lg:landscape:h-6 w-auto shrink-0 object-contain"
            style={{ backgroundColor: "transparent" }}
          />
        </a>

        <nav className="hidden md:flex items-center gap-4 lg:gap-6 max-lg:landscape:gap-2">
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
              <Link key={link.label} to={link.href} onClick={() => setMobileOpen(false)} className={desktopLinkClass}>
                {link.label}
              </Link>
            );
          })}
          <LanguageToggle />
        </nav>

        <div className="hidden md:block">
          <Button
            variant="cta"
            asChild
            className="rounded-full py-1 px-3.5 text-sm h-auto whitespace-nowrap max-lg:landscape:text-xs max-lg:landscape:px-2 max-lg:landscape:py-0.5"
          >
            <Link to={lp("/storytelling-sessions")}>
              {t("Free Storytelling Sessions!", "Bezplatná sezení Storytellingu!")}
            </Link>
          </Button>
        </div>

        <div className="flex md:hidden items-center gap-3">
          <LanguageToggle />
          <button className="p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

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
              <Button
                variant="cta"
                asChild
                className="mt-2 rounded-full py-1 px-3.5 text-sm h-auto whitespace-nowrap self-start"
              >
                <Link to={lp("/storytelling-sessions")} onClick={() => setMobileOpen(false)}>
                  {t("Free Storytelling Sessions!", "Bezplatná sezení Storytellingu!")}
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
