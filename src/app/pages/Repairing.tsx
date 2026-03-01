import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, X, Check, Loader2, Wrench, Calendar, Clock, User, Mail, Phone, MapPin } from "lucide-react";
import { DEVICE_MAKES, REPAIR_SERVICES } from "../data/repairs";
import { STORE_NAMES } from "../data/stores";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type Step = "make" | "model" | "variant" | "service";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  branch: string;
  notes: string;
}

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
  "18:00", "18:30",
];

export function Repairing() {
  const [step, setStep] = useState<Step>("make");
  const [selectedMake, setSelectedMake] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [showBooking, setShowBooking] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    name: "", email: "", phone: "", date: "", time: "", branch: "", notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentMake = DEVICE_MAKES.find((m) => m.name === selectedMake);
  const currentModel = currentMake?.models.find((m) => m.name === selectedModel);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({
          ...form,
          deviceMake: selectedMake,
          deviceModel: selectedModel,
          deviceVariant: selectedVariant,
          repairService: selectedService,
        }),
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

  const resetAll = () => {
    setStep("make"); setSelectedMake(""); setSelectedModel("");
    setSelectedVariant(""); setSelectedService(""); setShowBooking(false);
    setSubmitted(false); setForm({ name: "", email: "", phone: "", date: "", time: "", branch: "", notes: "" });
  };

  const Breadcrumb = () => (
    <div className="flex items-center gap-2 text-sm mb-8 flex-wrap" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
      {[
        { label: "Select Make", done: step !== "make", active: step === "make" },
        { label: selectedMake || "Model", done: step === "variant" || step === "service", active: step === "model" },
        { label: selectedModel ? "Variant" : "Variant", done: step === "service", active: step === "variant" },
        { label: "Repair Type", done: false, active: step === "service" },
      ].map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="w-4 h-4 text-white/20" />}
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              item.active
                ? "text-white font-semibold"
                : item.done
                ? ""
                : "text-white/30"
            }`}
            style={
              item.active
                ? { background: "rgba(249,115,22,0.18)", border: "1px solid rgba(249,115,22,0.4)" }
                : item.done
                ? { color: "#fb923c" }
                : {}
            }
          >
            {item.done && <Check className="w-3 h-3 inline mr-1" />}
            {item.label}
          </span>
        </span>
      ))}
    </div>
  );

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
            <Wrench className="w-3.5 h-3.5" />
            REPAIR BOOKING
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Book a{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)" }}
            >
              Repair
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Select your device and preferred repair service, then book your appointment in minutes.
          </p>
        </motion.div>
      </div>

      {/* Selector */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <Breadcrumb />

        {/* STEP: SELECT MAKE */}
        {step === "make" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-white text-2xl font-bold mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Select Device Brand
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {DEVICE_MAKES.map((make) => (
                <motion.button
                  key={make.name}
                  className="p-5 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                  style={{
                    background: "rgba(249,115,22,0.03)",
                    border: "1px solid rgba(249,115,22,0.08)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => { setSelectedMake(make.name); setStep("model"); }}
                  whileHover={{ borderColor: "rgba(249,115,22,0.5)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 transition-all group-hover:scale-110"
                    style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.2)" }}
                  >
                    <span className="text-2xl">
                      {make.name === "Apple" ? "🍎" : make.name === "Samsung" ? "📱" : make.name === "Google" ? "🔍" :
                       make.name === "OnePlus" ? "⚡" : make.name === "Huawei" ? "🌸" : make.name === "Xiaomi" ? "🔴" : "📱"}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{make.name}</p>
                  <p className="text-white/40 text-xs mt-1">{make.models.length} models</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP: SELECT MODEL */}
        {step === "model" && currentMake && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <button
                className="text-sm flex items-center gap-1 transition-colors hover:text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
                onClick={() => { setStep("make"); setSelectedMake(""); }}
              >
                ← Back
              </button>
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Select {selectedMake} Model
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentMake.models.map((model) => (
                <motion.button
                  key={model.name}
                  className="p-4 rounded-xl text-left transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{
                    background: "rgba(249,115,22,0.03)",
                    border: "1px solid rgba(249,115,22,0.08)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => { setSelectedModel(model.name); setStep("variant"); }}
                  whileHover={{ borderColor: "rgba(249,115,22,0.45)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <p className="text-white font-medium transition-colors" style={{}} onMouseEnter={e => (e.currentTarget.style.color = "#fb923c")} onMouseLeave={e => (e.currentTarget.style.color = "white")}>{model.name}</p>
                  <p className="text-white/30 text-xs mt-1">{model.variants.length} variants</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP: SELECT VARIANT */}
        {step === "variant" && currentModel && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <button
                className="text-sm flex items-center gap-1 transition-colors hover:text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
                onClick={() => { setStep("model"); setSelectedModel(""); }}
              >
                ← Back
              </button>
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Select Variant
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {currentModel.variants.map((variant) => (
                <motion.button
                  key={variant}
                  className="p-4 rounded-xl text-center transition-all duration-300 font-semibold"
                  style={{
                    background: "rgba(249,115,22,0.03)",
                    border: "1px solid rgba(249,115,22,0.08)",
                    color: "white",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => { setSelectedVariant(variant); setStep("service"); }}
                  whileHover={{ borderColor: "rgba(249,115,22,0.5)", background: "rgba(249,115,22,0.08)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  {variant}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP: SELECT SERVICE */}
        {step === "service" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center gap-4 mb-6">
              <button
                className="text-sm flex items-center gap-1 transition-colors hover:text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
                onClick={() => { setStep("variant"); setSelectedVariant(""); }}
              >
                ← Back
              </button>
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                Select Repair Service
              </h2>
            </div>

            {/* Selected device summary */}
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-xl mb-6 text-sm"
              style={{
                background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              <span style={{ color: "#fb923c" }} className="font-semibold">{selectedMake}</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <span className="text-white">{selectedModel}</span>
              <ChevronRight className="w-4 h-4 text-white/30" />
              <span className="text-white/60">{selectedVariant}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {REPAIR_SERVICES.map((service) => (
                <motion.button
                  key={service.name}
                  className="p-5 rounded-xl text-left flex items-center justify-between group transition-all"
                  style={{
                    background: selectedService === service.name ? "rgba(249,115,22,0.15)" : "rgba(249,115,22,0.03)",
                    border: selectedService === service.name
                      ? "1px solid rgba(249,115,22,0.55)"
                      : "1px solid rgba(249,115,22,0.08)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                  onClick={() => setSelectedService(service.name)}
                  whileHover={{ borderColor: "rgba(249,115,22,0.45)" }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div>
                    <p className="text-white font-semibold">{service.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-bold" style={{ color: "#fb923c" }}>{service.price}</span>
                      <span className="text-white/30 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {service.duration}
                      </span>
                    </div>
                  </div>
                  {selectedService === service.name && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg, #f97316, #c2410c)" }}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {selectedService && (
              <motion.button
                className="w-full sm:w-auto flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #f97316, #c2410c)",
                  boxShadow: "0 0 30px rgba(249,115,22,0.45)",
                  fontFamily: "Space Grotesk, sans-serif",
                }}
                onClick={() => setShowBooking(true)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Calendar className="w-5 h-5" />
                Book Appointment
              </motion.button>
            )}
          </motion.div>
        )}
      </div>

      {/* ===== BOOKING MODAL ===== */}
      <AnimatePresence>
        {showBooking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8"
              style={{
                background: "linear-gradient(135deg, #120800, #0a0500)",
                border: "1px solid rgba(249,115,22,0.25)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.7)",
              }}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="absolute top-5 right-5 p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                onClick={() => setShowBooking(false)}
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
                    Appointment Booked!
                  </h3>
                  <p className="text-white/50 mb-6" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    We'll confirm your appointment shortly. See you at our {form.branch} branch on {form.date} at {form.time}.
                  </p>
                  <button
                    className="px-6 py-3 rounded-xl text-white font-semibold"
                    style={{ background: "rgba(249,115,22,0.2)", border: "1px solid rgba(249,115,22,0.4)", fontFamily: "Space Grotesk, sans-serif" }}
                    onClick={resetAll}
                  >
                    Book Another Repair
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white text-2xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Book Your Appointment
                  </h3>
                  <div
                    className="flex flex-wrap items-center gap-2 text-sm mb-6 pb-6"
                    style={{ borderBottom: "1px solid rgba(249,115,22,0.1)", fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    <span style={{ color: "#fb923c" }} className="font-semibold">{selectedMake} {selectedModel}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-white/60">{selectedVariant}</span>
                    <span className="text-white/30">·</span>
                    <span style={{ color: "#f97316" }}>{selectedService}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none transition-all"
                              style={{
                                background: "rgba(249,115,22,0.04)",
                                border: "1px solid rgba(249,115,22,0.12)",
                                fontFamily: "Space Grotesk, sans-serif",
                              }}
                            />
                          </div>
                        </div>
                      ))}

                      <div>
                        <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                          Appointment Date <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="date"
                            required
                            min={getMinDate()}
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                            style={{
                              background: "rgba(249,115,22,0.04)",
                              border: "1px solid rgba(249,115,22,0.12)",
                              fontFamily: "Space Grotesk, sans-serif",
                              colorScheme: "dark",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <label className="text-white/60 text-sm mb-2 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Preferred Time <span className="text-red-400">*</span>
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setForm({ ...form, time: slot })}
                            className="py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{
                              background: form.time === slot ? "rgba(249,115,22,0.3)" : "rgba(249,115,22,0.04)",
                              border: form.time === slot ? "1px solid rgba(249,115,22,0.65)" : "1px solid rgba(249,115,22,0.1)",
                              color: form.time === slot ? "white" : "rgba(255,255,255,0.4)",
                              fontFamily: "Space Grotesk, sans-serif",
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Branch */}
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Preferred Branch <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                          required
                          value={form.branch}
                          onChange={(e) => setForm({ ...form, branch: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                          style={{
                            background: "rgba(249,115,22,0.04)",
                            border: "1px solid rgba(249,115,22,0.12)",
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
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any additional information about the issue..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none resize-none"
                        style={{
                          background: "rgba(249,115,22,0.04)",
                          border: "1px solid rgba(249,115,22,0.12)",
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
                      disabled={submitting || !form.time || !form.branch}
                      className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #f97316, #c2410c)",
                        boxShadow: "0 0 25px rgba(249,115,22,0.4)",
                        fontFamily: "Space Grotesk, sans-serif",
                      }}
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calendar className="w-5 h-5" />}
                      {submitting ? "Booking..." : "Confirm Appointment"}
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