import { Link } from "react-router";
import { MapPin, Phone, Clock, Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import { STORES } from "../data/stores";

export function Footer() {
  return (
    <footer
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #080500 0%, #050300 100%)" }}
    >
      {/* Top glow border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #f97316 50%, transparent)" }}
      />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full blur-3xl opacity-10"
          style={{
            width: 600,
            height: 300,
            background: "radial-gradient(circle, #f97316, transparent)",
            bottom: 0,
            left: "20%",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 xl:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  boxShadow: "0 0 20px rgba(249,115,22,0.4)",
                }}
              >
                <span
                  className="text-white font-black text-xl"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  V
                </span>
              </div>
              <div>
                <span
                  className="text-white font-bold text-xl block"
                  style={{ fontFamily: "Orbitron, monospace" }}
                >
                  VIRK TECH
                </span>
                <span
                  className="text-xs tracking-widest uppercase"
                  style={{ fontFamily: "Space Grotesk", color: "rgba(249,115,22,0.5)" }}
                >
                  Solutions
                </span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              London's trusted tech repair specialists. Expert repairs, quality devices, and unbeatable service across 5 convenient locations.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: "#", label: "Instagram" },
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Youtube, href: "#", label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white transition-all duration-300 hover:scale-110"
                  style={{
                    background: "rgba(249,115,22,0.06)",
                    border: "1px solid rgba(249,115,22,0.12)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white font-semibold text-sm tracking-widest uppercase mb-5"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Repair Services", path: "/repairing" },
                { label: "Buy & Sell Devices", path: "/buy-sell" },
                { label: "Products", path: "/products" },
                { label: "Store Locator", path: "/stores" },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <span
                      className="w-1 h-1 rounded-full transition-all duration-300 group-hover:w-3"
                      style={{ background: "linear-gradient(90deg, #f97316, #ea580c)" }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Branches */}
          <div className="md:col-span-2">
            <h4
              className="text-white font-semibold text-sm tracking-widest uppercase mb-5"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Our 5 London Locations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
              {STORES.map((store) => (
                <div
                  key={store.id}
                  className="rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: "rgba(249,115,22,0.03)",
                    border: "1px solid rgba(249,115,22,0.1)",
                  }}
                >
                  <h5
                    className="text-white font-semibold text-sm mb-2"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {store.name}
                  </h5>
                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#fb923c" }} />
                      <span className="text-white/40 text-xs" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {store.address}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: "#f97316" }} />
                      <a
                        href={`tel:${store.phone}`}
                        className="text-white/40 text-xs transition-colors"
                        style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                      <span className="text-white/30 text-xs" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Mon–Sat: 9am–7pm
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(249,115,22,0.08)" }}
        >
          <p
            className="text-white/30 text-xs text-center sm:text-left"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            © {new Date().getFullYear()} Virk Tech Solutions. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
