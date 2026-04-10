import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import bookCover from "@/assets/book-cover.png";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "FAQ", href: "/#faq" },
  { label: "Pricing", href: "/#pricing" },
  { label: "References", href: "/references" },
  { label: "HR's book", href: "https://www.amazon.com/How-GET-Great-Service-everyday-ebook/dp/B07CLK5KXN", external: true },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

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

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith("/#")) {
      const id = href.slice(2);
      if (location.pathname === "/") {
        e.preventDefault();
        scrollToElement(id);
      }
    }
    setMobileOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.slice(1);
      setTimeout(() => scrollToElement(id), 400);
    }
  }, [location.pathname, location.hash]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 md:h-[72px] items-center justify-between px-6">
        <Link to="/" onClick={handleLogoClick} className="flex h-full items-center self-stretch bg-transparent transition-all duration-200 hover:opacity-80 hover:scale-[1.02]" style={{ backgroundColor: "transparent" }}>
          <img src={logo} alt="Rokofski Communication & Training" className="block h-7 md:h-8 w-auto shrink-0 object-contain align-middle" style={{ backgroundColor: "transparent" }} />
        </Link>
        </Link>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.external ? (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors tracking-wide flex items-center gap-1.5 font-bold"
              >
                <img src={bookCover} alt="HR's book cover" className="w-5 h-7 object-cover rounded-sm" width={20} height={28} />
                {link.label}
              </a>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors tracking-wide font-bold"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden md:block">
          <Button variant="cta" size="lg" asChild>
            <Link to="/storytelling-workshops">Storytelling Sessions</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-border/30"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-light text-foreground/70 hover:text-foreground py-2 flex items-center gap-2"
                  >
                    <img src={bookCover} alt="HR's book cover" className="w-5 h-7 object-cover rounded-sm" width={20} height={28} />
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-base font-light text-foreground/70 hover:text-foreground py-2"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Button variant="cta" size="lg" asChild className="mt-2">
                <Link to="/storytelling-workshops">Storytelling Sessions</Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
