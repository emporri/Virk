import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import {
  Wrench, ShoppingBag, MapPin, ChevronRight, Star, Shield, Zap, Clock,
  Smartphone, Laptop, Tablet, ArrowRight, Phone
} from "lucide-react";

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}

// Orange palette constants
const O1 = "#f97316";   // orange-500
const O2 = "#ea580c";   // orange-600
const O3 = "#fb923c";   // orange-400
const O4 = "#fdba74";   // orange-300
const O5 = "#c2410c";   // orange-700

const SERVICES = [
  {
    icon: Wrench,
    title: "Expert Repairs",
    desc: "Same-day repairs on screens, batteries, charging ports and more across all major brands.",
    color: O1,
    path: "/repairing",
  },
  {
    icon: ShoppingBag,
    title: "Buy & Sell Devices",
    desc: "Trade in your old device or find a great deal on refurbished smartphones, tablets and laptops.",
    color: O3,
    path: "/buy-sell",
  },
  {
    icon: MapPin,
    title: "5 London Locations",
    desc: "Conveniently located across East London — Ilford, East Ham, Barking, Whitechapel & Walthamstow.",
    color: O2,
    path: "/stores",
  },
];

const STATS = [
  { value: "50K+", label: "Devices Repaired" },
  { value: "5★", label: "Average Rating" },
  { value: "5", label: "London Branches" },
  { value: "Same Day", label: "Repair Service" },
];

const REPAIR_TYPES = [
  { icon: Smartphone, label: "Smartphones", count: "All major brands" },
  { icon: Tablet, label: "Tablets", count: "iPad, Galaxy Tab" },
  { icon: Laptop, label: "Laptops", count: "MacBook & more" },
];

const TESTIMONIALS = [
  {
    name: "Ahmed K.",
    branch: "Ilford Branch",
    text: "Got my iPhone screen replaced in under 30 minutes. Absolutely brilliant service and very fair pricing!",
    rating: 5,
  },
  {
    name: "Sarah M.",
    branch: "East Ham Branch",
    text: "Sold my old Samsung and bought a refurbished iPhone 14 here. The staff are incredibly helpful and honest.",
    rating: 5,
  },
  {
    name: "James T.",
    branch: "Whitechapel Branch",
    text: "Water damaged my phone and they fixed it completely. Thought it was a write-off but Virk Tech saved it!",
    rating: 5,
  },
];

export function Home() {
  return (
    <div style={{ background: "transparent" }}>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Hero-specific background layer */}
        <div className="absolute inset-0 z-0">
          {/* Deep warm gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 70% 50%, rgba(249,115,22,0.12) 0%, rgba(234,88,12,0.06) 40%, transparent 70%), " +
                "linear-gradient(135deg, #060300 0%, #0c0600 50%, #060200 100%)",
            }}
          />

          {/* Hero orb 1 */}
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: 520, height: 520,
              background: "radial-gradient(circle, rgba(249,115,22,0.22), transparent 70%)",
              top: "5%", right: "8%",
            }}
            animate={{ y: [0, -40, 0], scale: [1, 1.08, 1] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          />
          {/* Hero orb 2 */}
          <motion.div
            className="absolute rounded-full blur-3xl"
            style={{
              width: 380, height: 380,
              background: "radial-gradient(circle, rgba(234,88,12,0.18), transparent 70%)",
              bottom: "15%", right: "25%",
            }}
            animate={{ y: [0, 30, 0], scale: [1, 1.12, 1] }}
            transition={{ repeat: Infinity, duration: 11, ease: "easeInOut", delay: 2 }}
          />
          {/* Hero orb 3 */}
          <motion.div
            className="absolute rounded-full blur-2xl"
            style={{
              width: 200, height: 200,
              background: "radial-gradient(circle, rgba(251,146,60,0.28), transparent 70%)",
              top: "40%", right: "15%",
            }}
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(249,115,22,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.8) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Floating phone mockup — right side */}
          <div className="absolute right-[5%] sm:right-[8%] lg:right-[10%] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6">
            <motion.div
              className="relative"
              animate={{ y: [0, -16, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div
                className="w-32 h-56 lg:w-44 lg:h-80 rounded-3xl flex flex-col items-center justify-center gap-3"
                style={{
                  background: "linear-gradient(160deg, rgba(249,115,22,0.18) 0%, rgba(234,88,12,0.10) 100%)",
                  border: "1.5px solid rgba(249,115,22,0.35)",
                  boxShadow: "0 0 60px rgba(249,115,22,0.25), inset 0 0 40px rgba(234,88,12,0.06)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f97316, #c2410c)", boxShadow: "0 0 30px rgba(249,115,22,0.5)" }}
                >
                  <Smartphone className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <div className="flex flex-col items-center gap-1.5 w-full px-4">
                  {[40, 65, 55, 80].map((w, i) => (
                    <motion.div
                      key={i}
                      className="h-1.5 rounded-full"
                      style={{ width: `${w}%`, background: "rgba(249,115,22,0.2)" }}
                      animate={{ opacity: [0.4, 0.9, 0.4] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.3 }}
                    />
                  ))}
                </div>
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}
                />
              </div>
              {/* Glow ring */}
              <motion.div
                className="absolute -inset-4 rounded-3xl pointer-events-none"
                style={{ border: "1px solid rgba(249,115,22,0.18)" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </motion.div>

            {/* Floating mini cards */}
            <motion.div
              className="absolute -left-20 top-10 px-4 py-3 rounded-2xl text-xs font-semibold text-white flex items-center gap-2"
              style={{
                background: "rgba(15,8,0,0.9)",
                border: "1px solid rgba(249,115,22,0.35)",
                backdropFilter: "blur(12px)",
                fontFamily: "Space Grotesk, sans-serif",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              animate={{ x: [0, -5, 0], y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Repair Ready
            </motion.div>
            <motion.div
              className="absolute -right-16 bottom-16 px-4 py-3 rounded-2xl text-xs font-semibold text-white flex items-center gap-2"
              style={{
                background: "rgba(15,8,0,0.9)",
                border: "1px solid rgba(251,146,60,0.35)",
                backdropFilter: "blur(12px)",
                fontFamily: "Space Grotesk, sans-serif",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
              animate={{ x: [0, 5, 0], y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              5★ Rated
            </motion.div>
          </div>

          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{ background: "linear-gradient(to top, #080500, transparent)" }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.35)",
                color: O3,
                fontFamily: "Space Grotesk, sans-serif",
                letterSpacing: "0.1em",
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: O1 }}
              />
              LONDON'S #1 TECH SPECIALISTS
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-white">Your Tech,</span>
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(135deg, ${O3} 0%, ${O4} 100%)` }}
              >
                Our Passion.
              </span>
            </motion.h1>

            <motion.p
              className="text-white/60 text-lg sm:text-xl mb-10 leading-relaxed max-w-xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Expert device repairs, quality refurbished phones, and unbeatable deals — all under one roof across 5 convenient London locations.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to="/repairing"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${O1}, ${O5})`,
                  boxShadow: "0 0 30px rgba(249,115,22,0.45)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
              >
                <Wrench className="w-5 h-5" />
                Book a Repair
              </Link>
              <Link
                to="/products"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(249,115,22,0.2)",
                  fontFamily: "Space Grotesk, sans-serif",
                  backdropFilter: "blur(12px)",
                }}
              >
                <ShoppingBag className="w-5 h-5" />
                Shop Devices
              </Link>
            </motion.div>

            {/* Quick Stats Row */}
            <motion.div
              className="flex flex-wrap gap-6 mt-14"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {STATS.map(({ value, label }) => (
                <div key={label}>
                  <div
                    className="text-2xl font-bold text-transparent bg-clip-text"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${O3}, ${O4})`,
                      fontFamily: "Orbitron, monospace",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs text-white/40 mt-0.5"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-px h-12 opacity-30" style={{ background: `linear-gradient(to bottom, transparent, ${O1})` }} />
          <div className="w-2 h-2 rounded-full" style={{ background: O1 }} />
        </motion.div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <p
                className="text-sm font-semibold tracking-widest uppercase mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: O3 }}
              >
                What We Offer
              </p>
              <h2
                className="text-4xl sm:text-5xl font-bold text-white mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Everything You Need
              </h2>
              <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                From cracked screens to trade-ins — we've got you covered.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, desc, color, path }, i) => (
              <FadeInSection key={title} delay={i * 0.1}>
                <Link to={path} className="block group">
                  <div
                    className="relative p-8 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                    style={{
                      background: "rgba(249,115,22,0.03)",
                      border: "1px solid rgba(249,115,22,0.08)",
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                      style={{
                        background: `radial-gradient(ellipse at 30% 30%, ${color}18, transparent 70%)`,
                      }}
                    />
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                    >
                      <Icon className="w-7 h-7" style={{ color }} />
                    </div>
                    <h3
                      className="text-white text-xl font-bold mb-3"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-white/50 leading-relaxed mb-5"
                      style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: 15 }}
                    >
                      {desc}
                    </p>
                    <div
                      className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                      style={{ color }}
                    >
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REPAIR DEVICES ===== */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent, rgba(249,115,22,0.04) 50%, transparent)` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1">
              <FadeInSection>
                <p
                  className="text-sm font-semibold tracking-widest uppercase mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif", color: O3 }}
                >
                  Repair Services
                </p>
                <h2
                  className="text-4xl sm:text-5xl font-bold text-white mb-6"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  We Repair
                  <br />
                  <span
                    className="text-transparent bg-clip-text"
                    style={{ backgroundImage: `linear-gradient(135deg, ${O3}, ${O4})` }}
                  >
                    All Devices
                  </span>
                </h2>
                <p
                  className="text-white/50 text-lg mb-8 leading-relaxed"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Our expert technicians handle everything from cracked screens and dead batteries to water damage and software issues — with a warranty on every repair.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {REPAIR_TYPES.map(({ icon: Icon, label, count }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center p-5 rounded-xl text-center"
                      style={{
                        background: "rgba(249,115,22,0.06)",
                        border: "1px solid rgba(249,115,22,0.15)",
                      }}
                    >
                      <Icon className="w-7 h-7 mb-2" style={{ color: O3 }} />
                      <span className="text-white font-semibold text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {label}
                      </span>
                      <span className="text-white/40 text-xs mt-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/repairing"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${O1}, ${O5})`,
                    boxShadow: "0 0 30px rgba(249,115,22,0.35)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                >
                  Book a Repair <ChevronRight className="w-5 h-5" />
                </Link>
              </FadeInSection>
            </div>

            {/* Feature pills */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { icon: Zap, label: "Same-Day Service", sub: "Most repairs done in 30–60 mins" },
                { icon: Shield, label: "Warranty Included", sub: "90-day guarantee on all repairs" },
                { icon: Star, label: "Expert Technicians", sub: "Certified & experienced team" },
                { icon: Clock, label: "Flexible Hours", sub: "Mon–Sat 9am–7pm, Sun 11am–5pm" },
              ].map(({ icon: Icon, label, sub }, i) => (
                <FadeInSection key={label} delay={i * 0.1}>
                  <div
                    className="p-5 rounded-2xl"
                    style={{
                      background: "rgba(249,115,22,0.03)",
                      border: "1px solid rgba(249,115,22,0.08)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                      style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: O3 }} />
                    </div>
                    <h4
                      className="text-white font-semibold text-sm mb-1"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {label}
                    </h4>
                    <p
                      className="text-white/40 text-xs leading-relaxed"
                      style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {sub}
                    </p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <p
                className="text-sm font-semibold tracking-widest uppercase mb-3"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: O3 }}
              >
                Customer Reviews
              </p>
              <h2
                className="text-4xl sm:text-5xl font-bold text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                What Our Customers Say
              </h2>
            </div>
          </FadeInSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, branch, text, rating }, i) => (
              <FadeInSection key={name} delay={i * 0.1}>
                <div
                  className="p-6 rounded-2xl h-full flex flex-col"
                  style={{
                    background: "rgba(249,115,22,0.03)",
                    border: "1px solid rgba(249,115,22,0.08)",
                  }}
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p
                    className="text-white/70 leading-relaxed flex-1 mb-5 text-sm"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    "{text}"
                  </p>
                  <div>
                    <p className="text-white font-semibold text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                      {name}
                    </p>
                    <p className="text-xs" style={{ fontFamily: "Space Grotesk, sans-serif", color: O3 }}>
                      {branch}
                    </p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div
              className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center"
              style={{
                background: `linear-gradient(135deg, rgba(249,115,22,0.22) 0%, rgba(234,88,12,0.15) 100%)`,
                border: "1px solid rgba(249,115,22,0.25)",
              }}
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-50"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.25), transparent 70%)" }}
              />
              <div className="relative z-10">
                <h2
                  className="text-4xl sm:text-5xl font-bold text-white mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Ready to Fix Your Device?
                </h2>
                <p
                  className="text-white/60 text-lg mb-8 max-w-xl mx-auto"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Walk in, or book an appointment online. Same-day service available at all 5 London branches.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/repairing"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: `linear-gradient(135deg, ${O1}, ${O5})`,
                      boxShadow: "0 0 30px rgba(249,115,22,0.5)",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    <Wrench className="w-5 h-5" />
                    Book Repair Online
                  </Link>
                  <a
                    href="tel:+447762121336"
                    className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(249,115,22,0.2)",
                      fontFamily: "Space Grotesk, sans-serif",
                    }}
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
}
