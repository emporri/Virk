import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Loader2, ShoppingBag, ArrowUpDown, Smartphone, Laptop, Tablet, Star, User, Mail, Phone, ChevronDown } from "lucide-react";
import { DEVICE_MAKES } from "../data/repairs";
import { STORE_NAMES } from "../data/stores";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type RequestType = "sell" | "buy";

interface BuySellForm {
  type: RequestType;
  name: string;
  email: string;
  phone: string;
  deviceMake: string;
  deviceModel: string;
  condition: string;
  branch: string;
  additionalInfo: string;
}

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor", "For Parts Only"];

const SELL_BENEFITS = [
  { icon: Star, title: "Best Price Guaranteed", desc: "We offer the most competitive rates for your used devices." },
  { icon: Check, title: "Instant Valuation", desc: "Get a quote in minutes when you walk into any of our branches." },
  { icon: Smartphone, title: "All Brands Accepted", desc: "Apple, Samsung, Google, Huawei and more." },
];

const BUY_BENEFITS = [
  { icon: Shield, title: "Quality Assured", desc: "Every device is tested & certified before sale." },
  { icon: Check, title: "Warranty Included", desc: "30-day warranty on all refurbished devices." },
  { icon: Star, title: "Great Prices", desc: "Up to 50% off RRP on premium refurbished devices." },
];

function Shield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

export function BuyAndSell() {
  const [activeTab, setActiveTab] = useState<"sell" | "buy">("sell");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<RequestType>("sell");
  const [form, setForm] = useState<BuySellForm>({
    type: "sell", name: "", email: "", phone: "",
    deviceMake: "", deviceModel: "", condition: "", branch: "", additionalInfo: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentMake = DEVICE_MAKES.find((m) => m.name === form.deviceMake);

  const openModal = (type: RequestType) => {
    setModalType(type);
    setForm({ ...form, type, condition: "" });
    setSubmitted(false);
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/buysell`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
              background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)",
              color: "#fb923c", fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            BUY & SELL DEVICES
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Trade Smart,{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)" }}
            >
              Save Big.
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Get top cash for your old devices, or find premium refurbished tech at unbeatable prices.
          </p>
        </motion.div>
      </div>

      {/* Tab Selector */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div
          className="flex gap-2 p-1.5 rounded-2xl w-fit mx-auto mb-12"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {[
            { key: "sell", label: "Sell Your Device", icon: ArrowUpDown },
            { key: "buy", label: "Buy a Device", icon: ShoppingBag },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "sell" | "buy")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300"
              style={{
                background: activeTab === key ? "linear-gradient(135deg, #f97316, #c2410c)" : "transparent",
                color: activeTab === key ? "white" : "rgba(255,255,255,0.4)",
                fontFamily: "Space Grotesk, sans-serif",
                boxShadow: activeTab === key ? "0 0 20px rgba(124,58,237,0.3)" : "none",
              }}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "sell" ? (
            <motion.div
              key="sell"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-24"
            >
              <div>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Sell Your Device
                  <br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #a78bfa, #67e8f9)" }}>
                    Get Top Cash
                  </span>
                </h2>
                <p className="text-white/50 mb-8 text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Turn your old devices into cash instantly. We buy all brands in any condition — iPhones, Samsung, Google Pixel, and more.
                </p>
                <div className="space-y-4 mb-8">
                  {SELL_BENEFITS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.25)" }}
                      >
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {title}
                        </h4>
                        <p className="text-white/40 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    boxShadow: "0 0 30px rgba(124,58,237,0.4)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => openModal("sell")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ArrowUpDown className="w-5 h-5" />
                  Sell My Device
                </motion.button>
              </div>

              <div
                className="rounded-3xl p-8"
                style={{
                  background: "rgba(249,115,22,0.05)",
                  border: "1px solid rgba(249,115,22,0.18)",
                }}
              >
                <h3 className="text-white text-lg font-bold mb-5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  How It Works
                </h3>
                {[
                  { step: "01", title: "Submit Your Request", desc: "Fill in the form with your device details and contact info." },
                  { step: "02", title: "Get a Quote", desc: "We'll assess your device and give you a fair cash offer." },
                  { step: "03", title: "Visit Any Branch", desc: "Come in at your convenience to complete the transaction." },
                  { step: "04", title: "Get Paid Instantly", desc: "Walk out with cash in hand — no waiting, no hassle." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4 mb-5 last:mb-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        fontFamily: "Orbitron, monospace",
                        fontSize: 11,
                      }}
                    >
                      {step}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {title}
                      </h4>
                      <p className="text-white/40 text-xs mt-0.5" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="buy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center pb-24"
            >
              <div>
                <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Buy Devices
                  <br />
                  <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)" }}>
                    Save Big
                  </span>
                </h2>
                <p className="text-white/50 mb-8 text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                  Browse our range of quality refurbished smartphones, tablets and laptops — all tested, certified and ready to go.
                </p>
                <div className="space-y-4 mb-8">
                  {BUY_BENEFITS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.25)" }}
                      >
                        <Icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {title}
                        </h4>
                        <p className="text-white/40 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <motion.button
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #7c3aed)",
                    boxShadow: "0 0 30px rgba(6,182,212,0.4)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => openModal("buy")}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  Enquire About Buying
                </motion.button>
              </div>

              {/* Device category cards */}
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Smartphone, label: "Smartphones", desc: "iPhone, Samsung Galaxy, Google Pixel & more", count: "30+ models" },
                  { icon: Tablet, label: "Tablets", desc: "iPad, Galaxy Tab & more", count: "10+ models" },
                  { icon: Laptop, label: "Laptops", desc: "MacBook, Windows laptops & more", count: "5+ models" },
                ].map(({ icon: Icon, label, desc, count }) => (
                  <div
                    key={label}
                    className="flex items-center gap-5 p-5 rounded-2xl"
                    style={{ background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.12)" }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: "rgba(249,115,22,0.12)" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: "#fb923c" }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{label}</h4>
                      <p className="text-white/40 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>{desc}</p>
                    </div>
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                      style={{ background: "rgba(249,115,22,0.12)", color: "#fb923c", fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ===== REQUEST MODAL ===== */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl p-8"
              style={{
                background: "linear-gradient(135deg, #120800, #0a0500)",
                border: "1px solid rgba(249,115,22,0.25)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setShowModal(false)}
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: "linear-gradient(135deg, #f97316, #c2410c)" }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Request Submitted!
                  </h3>
                  <p className="text-white/50 mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Thank you, {form.name}! Our team will be in touch with you shortly regarding your {modalType === "sell" ? "device valuation" : "purchase enquiry"}.
                  </p>
                  <button
                    className="px-6 py-3 rounded-xl text-white font-semibold"
                    style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)", fontFamily: "Space Grotesk, sans-serif" }}
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    {modalType === "sell" ? "Sell Your Device" : "Buy a Device"}
                  </h3>
                  <p className="text-white/40 text-sm mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Fill in your details and we'll get back to you promptly.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { name: "name", label: "Full Name", type: "text", icon: User, placeholder: "John Smith" },
                      { name: "email", label: "Email Address", type: "email", icon: Mail, placeholder: "john@example.com" },
                      { name: "phone", label: "Phone Number", type: "tel", icon: Phone, placeholder: "+44 7xxx xxxxxx" },
                    ].map(({ name, label, type, icon: Icon, placeholder }) => (
                      <div key={name}>
                        <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          {label} <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type={type}
                            required
                            placeholder={placeholder}
                            value={(form as any)[name]}
                            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                            style={{
                              background: "rgba(255,255,255,0.05)",
                              border: "1px solid rgba(255,255,255,0.1)",
                              fontFamily: "Space Grotesk, sans-serif",
                            }}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Device Make */}
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Device Brand <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                          required
                          value={form.deviceMake}
                          onChange={(e) => setForm({ ...form, deviceMake: e.target.value, deviceModel: "" })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontFamily: "Space Grotesk, sans-serif",
                            colorScheme: "dark",
                          }}
                        >
                          <option value="">Select brand...</option>
                          {DEVICE_MAKES.map((m) => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Device Model */}
                    {form.deviceMake && (
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          Device Model <span className="text-red-400">*</span>
                        </label>
                        <select
                          required
                          value={form.deviceModel}
                          onChange={(e) => setForm({ ...form, deviceModel: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            fontFamily: "Space Grotesk, sans-serif",
                            colorScheme: "dark",
                          }}
                        >
                          <option value="">Select model...</option>
                          {currentMake?.models.map((m) => (
                            <option key={m.name} value={m.name}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Condition (only for sell) */}
                    {modalType === "sell" && (
                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          Device Condition <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {CONDITIONS.map((cond) => (
                            <button
                              key={cond}
                              type="button"
                              onClick={() => setForm({ ...form, condition: cond })}
                              className="py-2.5 px-3 rounded-xl text-xs font-semibold text-center transition-all"
                              style={{
                                background: form.condition === cond ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.04)",
                                border: form.condition === cond ? "1px solid rgba(249,115,22,0.55)" : "1px solid rgba(249,115,22,0.1)",
                                color: form.condition === cond ? "white" : "rgba(255,255,255,0.5)",
                                fontFamily: "Space Grotesk, sans-serif",
                              }}
                            >
                              {cond}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Branch */}
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Preferred Branch <span className="text-red-400">*</span>
                      </label>
                      <select
                        required
                        value={form.branch}
                        onChange={(e) => setForm({ ...form, branch: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontFamily: "Space Grotesk, sans-serif",
                          colorScheme: "dark",
                        }}
                      >
                        <option value="">Select a branch...</option>
                        {STORE_NAMES.map((name) => (
                          <option key={name} value={name}>{name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Info */}
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Additional Information
                      </label>
                      <textarea
                        rows={3}
                        placeholder={modalType === "sell" ? "Describe any faults, accessories included, original box etc..." : "Tell us what you're looking for, budget, preferred storage size..."}
                        value={form.additionalInfo}
                        onChange={(e) => setForm({ ...form, additionalInfo: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      />
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                        boxShadow: "0 0 25px rgba(124,58,237,0.4)",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                      {submitting ? "Submitting..." : "Submit Request"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}