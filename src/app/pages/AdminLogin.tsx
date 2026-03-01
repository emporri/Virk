import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Loader2, Lock, User, ShieldCheck } from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

export function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("vt_admin_token", data.token);
      localStorage.setItem("vt_admin_user", JSON.stringify({
        username: data.username, role: data.role, branch: data.branch, displayName: data.displayName
      }));
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #060300 0%, #0c0700 50%, #060200 100%)" }}
    >
      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{ width: 500, height: 500, background: "radial-gradient(circle, #f97316, transparent)", top: "10%", left: "5%" }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-15"
          style={{ width: 400, height: 400, background: "radial-gradient(circle, #ea580c, transparent)", bottom: "10%", right: "5%" }}
        />
      </div>

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
              boxShadow: "0 0 40px rgba(124,58,237,0.5)",
            }}
          >
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-white text-3xl font-bold mb-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Admin Portal
          </h1>
          <p
            className="text-white/40 text-sm"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Virk Tech Solutions — Staff Access Only
          </p>
        </div>

        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(124,58,237,0.25)",
            backdropFilter: "blur(20px)",
          }}
        >
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="text-white/60 text-sm mb-2 block"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/30" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                className="text-white/60 text-sm mb-2 block"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl text-white text-sm outline-none"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontFamily: "Space Grotesk, sans-serif",
                  }}
                />
                <button
                  type="button"
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-xl text-sm text-red-300"
                style={{ background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.25)", fontFamily: "Space Grotesk, sans-serif" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-white transition-all disabled:opacity-50 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #f97316, #c2410c)",
                boxShadow: "0 0 25px rgba(249,115,22,0.4)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
              {loading ? "Logging in..." : "Access Admin Panel"}
            </button>
          </form>
        </div>

        <p
          className="text-center text-white/20 text-xs mt-6"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}
        >
          Unauthorised access is prohibited. All activity is logged.
        </p>
      </motion.div>
    </div>
  );
}