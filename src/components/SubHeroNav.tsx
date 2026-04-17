import { Link } from "react-router-dom";

const SubHeroNav = () => {
  return (
    <div className="relative -mt-24 z-20 flex items-center justify-center pb-10 border-b border-border pt-4">
      <Link
        to="/bio"
        className="rounded-full bg-background/60 px-6 py-3 text-base font-bold text-foreground hover:bg-background/75 transition-colors tracking-wide relative group backdrop-blur-md shadow-sm"
      >
        Who is Howard?
        <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
      </Link>
    </div>
  );
};

export default SubHeroNav;
