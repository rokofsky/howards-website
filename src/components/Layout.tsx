import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-background focus:text-foreground focus:rounded-md focus:shadow-md"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
