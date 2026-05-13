import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import "./i18n";


declare global {
  interface Window {
    __rokofskyDomMutationGuardInstalled?: boolean;
  }
}

if (
  typeof window !== "undefined" &&
  typeof Node === "function" &&
  Node.prototype &&
  !window.__rokofskyDomMutationGuardInstalled
) {
  window.__rokofskyDomMutationGuardInstalled = true;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) return child;
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) return newNode;
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

createRoot(document.getElementById("root")!).render(<App />);
