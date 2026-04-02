import { Link } from "react-router-dom";
import { Linkedin, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-4">Howard</h3>
            <p className="text-primary-foreground/60 font-light text-sm leading-relaxed max-w-xs">
              Helping teams find their voice, one story at a time. Because the best meetings are the ones where everyone forgets they're in a meeting.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-foreground/80">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/bio" className="text-sm font-light text-primary-foreground/60 hover:text-primary-foreground transition-colors">Who is Howard</Link>
              <Link to="/references" className="text-sm font-light text-primary-foreground/60 hover:text-primary-foreground transition-colors">References</Link>
              <Link to="/storytelling-workshops" className="text-sm font-light text-primary-foreground/60 hover:text-primary-foreground transition-colors">Storytelling Workshops</Link>
              <Link to="/blog" className="text-sm font-light text-primary-foreground/60 hover:text-primary-foreground transition-colors">Blog</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-primary-foreground/80">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-6 text-xs text-primary-foreground/40 font-light">
            <Link to="/privacy" className="hover:text-primary-foreground/60 transition-colors">Privacy Policy</Link>
            <Link to="/gdpr" className="hover:text-primary-foreground/60 transition-colors">GDPR</Link>
            <Link to="/terms" className="hover:text-primary-foreground/60 transition-colors">Terms</Link>
          </div>
          <p className="text-xs text-primary-foreground/30 font-light italic">
            "Every great leader is first a great storyteller." — Howard (probably)
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
