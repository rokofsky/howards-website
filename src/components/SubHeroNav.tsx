import { Link } from "react-router-dom";

const SubHeroNav = () => {
  return (
    <div className="relative -mt-16 z-20 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pb-8 border-b border-border pt-4">
      <Link
        to="/bio"
        className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors tracking-wide relative group"
      >
        Who is Howard
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
      </Link>
      <span className="hidden sm:block w-px h-4 bg-border" />
      <Link
        to="/references"
        className="text-sm font-light text-muted-foreground hover:text-foreground transition-colors tracking-wide relative group"
      >
        References
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
      </Link>
    </div>
  );
};

export default SubHeroNav;
