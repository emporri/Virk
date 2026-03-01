import { Outlet, useLocation } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { CursorGlow } from "../components/CursorGlow";
import { GlobalBackground } from "../components/GlobalBackground";

export function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        background: "#080500",
        fontFamily: "Space Grotesk, sans-serif",
      }}
    >
      {/* Cursor effect (desktop only, hidden on touch devices) */}
      <CursorGlow />

      {/* Global animated background */}
      {!isAdmin && <GlobalBackground />}

      {/* Page content sits above background */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {!isAdmin && <Navbar />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAdmin && <Footer />}
        {!isAdmin && <WhatsAppButton />}
      </div>
    </div>
  );
}
