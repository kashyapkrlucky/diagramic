import type { ReactNode } from "react";
import NavBar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
  navbarType: "home" | "editor";
  navbarProps?: Record<string, unknown>;
}

export default function Layout({ children, navbarType, navbarProps }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <NavBar type={navbarType} {...navbarProps} />
      <main className="flex-1 relative">
        {children}
      </main>
    </div>
  );
}
