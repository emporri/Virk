import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Phone, Menu, X, Zap } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Repairing", path: "/repairing" },
  { label: "Buy & Sell", path: "/buy-sell" },
  { label: "Products", path: "/products" },
  { label: "Store Locator", path: "/stores" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled
            ? "rgba(8, 5, 0, 0.95)"
            : "rgba(8, 5, 0, 0.4)",
          backdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid rgba(249,115,22,0.2)" : "1px solid transparent",
          boxShadow: scrolled ? "0 4px 40px rgba(0,0,0,0.5)" : "none",
        }}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  boxShadow: "0 0 20px rgba(249,115,22,0.5)",
                }}
              >
                <span
                  className="text-white font-black text-lg"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  V
                </span>
              </div>
              <div>
                <span
                  className="text-white font-bold text-lg leading-none block"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  VIRK TECH
                </span>
                <span
                  className="text-xs leading-none tracking-widest uppercase"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: "rgba(249,115,22,0.5)" }}
                >
                  Solutions
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-4 py-2 text-sm transition-colors duration-200"
                    style={{
                      fontFamily: "Space Grotesk, sans-serif",
                      color: isActive ? "#fb923c" : "rgba(255,255,255,0.7)",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg"
                        style={{ background: "rgba(249,115,22,0.12)" }}
                        transition={{ type: "spring", duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 hover:text-white transition-colors">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Contact Button */}
            <div className="flex items-center gap-3">
              <a
                href="tel:+447762121336"
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  boxShadow: "0 0 20px rgba(249,115,22,0.4)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                <Phone className="w-4 h-4" />
                Contact Us
              </a>

              <button
                className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "rgba(4, 2, 0, 0.95)", backdropFilter: "blur(20px)" }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute top-20 left-0 right-0 mx-4 rounded-2xl p-6 flex flex-col gap-2"
              style={{
                background: "linear-gradient(135deg, rgba(20,10,0,0.98), rgba(12,6,0,0.98))",
                border: "1px solid rgba(249,115,22,0.25)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
            >
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all"
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        color: isActive ? "#fb923c" : "rgba(255,255,255,0.8)",
                        background: isActive ? "rgba(249,115,22,0.12)" : "transparent",
                        fontWeight: isActive ? 600 : 400,
                      }}
                    >
                      <Zap className="w-4 h-4 opacity-50" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <div className="border-t mt-2 pt-4" style={{ borderColor: "rgba(249,115,22,0.15)" }}>
                <a
                  href="tel:+447762121336"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #f97316, #c2410c)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  <Phone className="w-4 h-4" />
                  Call Us: +44 7762 121336
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
