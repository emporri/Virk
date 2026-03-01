import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, ExternalLink, Navigation } from "lucide-react";
import { STORES } from "../data/stores";

export function StoreLocator() {
  const [activeStore, setActiveStore] = useState(STORES[0]);

  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="relative pt-32 pb-20 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(249,115,22,0.08) 0%, transparent 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.15), transparent 60%)" }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)",
              color: "#fb923c", fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            <MapPin className="w-3.5 h-3.5" />
            5 LONDON LOCATIONS
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Find Your{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)" }}
            >
              Nearest Store
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Visit any of our 5 conveniently located London branches for repairs, sales, and trade-ins.
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Branch Selector Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {STORES.map((store) => (
            <button
              key={store.id}
              onClick={() => setActiveStore(store)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeStore.id === store.id ? "linear-gradient(135deg, #f97316, #c2410c)" : "rgba(249,115,22,0.05)",
                border: activeStore.id === store.id ? "1px solid transparent" : "1px solid rgba(249,115,22,0.12)",
                color: activeStore.id === store.id ? "white" : "rgba(255,255,255,0.5)",
                fontFamily: "Space Grotesk, sans-serif",
                boxShadow: activeStore.id === store.id ? "0 0 20px rgba(249,115,22,0.3)" : "none",
              }}
            >
              <MapPin className="w-4 h-4" />
              {store.name.replace(" Branch", "")}
            </button>
          ))}
        </div>

        {/* Active Store Detail + Map */}
        <motion.div
          key={activeStore.id}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Store Info Panel */}
          <div
            className="lg:col-span-2 rounded-3xl p-8 flex flex-col"
            style={{
              background: "rgba(249,115,22,0.03)",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-6 w-fit"
              style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "#f97316" }}
              />
              <span
                className="text-xs font-semibold"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
              >
                Open Now
              </span>
            </div>

            <h2 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {activeStore.name}
            </h2>

            <div className="space-y-5 flex-1">
              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#fb923c" }} />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>ADDRESS</p>
                  <p className="text-white text-sm font-medium" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{activeStore.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "#f97316" }} />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>PHONE</p>
                  <a
                    href={`tel:${activeStore.phone}`}
                    className="text-white text-sm font-medium transition-colors"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#f97316")}
                    onMouseLeave={e => (e.currentTarget.style.color = "white")}
                  >
                    {activeStore.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(249,115,22,0.12)" }}
                >
                  <Clock className="w-4 h-4" style={{ color: "#fdba74" }} />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-0.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>OPENING HOURS</p>
                  <p className="text-white text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{activeStore.hours}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6" style={{ borderTop: "1px solid rgba(249,115,22,0.08)" }}>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${activeStore.mapQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
              <a
                href={`tel:${activeStore.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105"
                style={{
                  background: "rgba(249,115,22,0.08)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                <Phone className="w-4 h-4" />
                Call
              </a>
            </div>
          </div>

          {/* Map */}
          <div
            className="lg:col-span-3 rounded-3xl overflow-hidden relative"
            style={{
              height: "480px",
              border: "1px solid rgba(249,115,22,0.2)",
            }}
          >
            <iframe
              src={activeStore.mapEmbed}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "invert(92%) hue-rotate(180deg)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${activeStore.name} map`}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(8,5,0,0.5), transparent)" }}
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${activeStore.mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105"
              style={{
                background: "rgba(8,5,0,0.9)",
                border: "1px solid rgba(249,115,22,0.35)",
                backdropFilter: "blur(12px)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open in Google Maps
            </a>
          </div>
        </motion.div>

        {/* All Stores Grid */}
        <div>
          <h3
            className="text-white text-2xl font-bold mb-6 text-center"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            All Locations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {STORES.map((store, i) => (
              <motion.button
                key={store.id}
                className="text-left p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{
                  background: activeStore.id === store.id ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.03)",
                  border: activeStore.id === store.id ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(249,115,22,0.08)",
                }}
                onClick={() => setActiveStore(store)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ borderColor: "rgba(249,115,22,0.4)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: "rgba(249,115,22,0.15)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "#fb923c" }} />
                </div>
                <h4
                  className="text-white font-semibold text-sm mb-1"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {store.name}
                </h4>
                <p
                  className="text-white/40 text-xs leading-relaxed"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  {store.address}
                </p>
                <p
                  className="text-xs mt-2 font-medium"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
                >
                  {store.phone}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}