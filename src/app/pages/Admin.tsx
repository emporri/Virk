import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, ShoppingBag, LogOut, Trash2, RefreshCw, CheckCircle, Clock,
  XCircle, Shield, User, MapPin, Mail, Phone, Search, Filter, ChevronDown,
  BarChart3, TrendingUp, AlertCircle, Eye
} from "lucide-react";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type Tab = "overview" | "appointments" | "buysell";
type AdminUser = { username: string; role: string; branch: string; displayName: string };

interface Appointment {
  id: string; name: string; email: string; phone: string;
  deviceMake: string; deviceModel: string; deviceVariant: string;
  repairService: string; date: string; time: string; branch: string;
  notes: string; status: string; createdAt: string;
}

interface BuySellRequest {
  id: string; type: "sell" | "buy"; name: string; email: string; phone: string;
  deviceMake: string; deviceModel: string; condition: string;
  branch: string; additionalInfo: string; status: string; createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string; color: string; icon: React.ElementType }> = {
    pending: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24", icon: Clock },
    confirmed: { bg: "rgba(16,185,129,0.15)", color: "#34d399", icon: CheckCircle },
    completed: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa", icon: CheckCircle },
    cancelled: { bg: "rgba(239,68,68,0.15)", color: "#f87171", icon: XCircle },
    new: { bg: "rgba(168,85,247,0.15)", color: "#c4b5fd", icon: AlertCircle },
    contacted: { bg: "rgba(6,182,212,0.15)", color: "#67e8f9", icon: Eye },
    resolved: { bg: "rgba(16,185,129,0.15)", color: "#34d399", icon: CheckCircle },
  };
  const cfg = configs[status] || configs.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
      style={{ background: cfg.bg, color: cfg.color, fontFamily: "Space Grotesk, sans-serif" }}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

export function Admin() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [buySellRequests, setBuySellRequests] = useState<BuySellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewDetail, setViewDetail] = useState<Appointment | BuySellRequest | null>(null);

  const token = localStorage.getItem("vt_admin_token") || "";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const userData = localStorage.getItem("vt_admin_user");
    if (!userData || !token) { navigate("/admin"); return; }
    setAdminUser(JSON.parse(userData));
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [apptRes, bsRes] = await Promise.all([
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/appointments`, { headers: authHeaders }),
        fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/buysell`, { headers: authHeaders }),
      ]);
      if (apptRes.status === 401 || bsRes.status === 401) {
        localStorage.removeItem("vt_admin_token");
        localStorage.removeItem("vt_admin_user");
        navigate("/admin");
        return;
      }
      const apptData = await apptRes.json();
      const bsData = await bsRes.json();
      if (apptData.appointments) setAppointments(apptData.appointments);
      if (bsData.requests) setBuySellRequests(bsData.requests);
    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/appointments/${id}`, {
      method: "PUT", headers: authHeaders, body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/appointments/${id}`, {
      method: "DELETE", headers: authHeaders
    });
    fetchAll();
  };

  const updateBuySellStatus = async (id: string, status: string) => {
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/buysell/${id}`, {
      method: "PUT", headers: authHeaders, body: JSON.stringify({ status })
    });
    fetchAll();
  };

  const deleteBuySell = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/buysell/${id}`, {
      method: "DELETE", headers: authHeaders
    });
    fetchAll();
  };

  const logout = async () => {
    await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-6a320fbc/admin/logout`, {
      method: "POST", headers: authHeaders
    });
    localStorage.removeItem("vt_admin_token");
    localStorage.removeItem("vt_admin_user");
    navigate("/admin");
  };

  const filteredAppts = appointments.filter((a) => {
    const matchSearch = !searchTerm || a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase()) || a.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredBS = buySellRequests.filter((r) => {
    const matchSearch = !searchTerm || r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    totalAppointments: appointments.length,
    pendingAppointments: appointments.filter((a) => a.status === "pending").length,
    totalRequests: buySellRequests.length,
    newRequests: buySellRequests.filter((r) => r.status === "new").length,
  };

  if (!adminUser) return null;

  return (
    <div
      className="min-h-screen"
      style={{ background: "#080500", fontFamily: "Space Grotesk, sans-serif" }}
    >
      {/* Sidebar + Main Layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div
          className="hidden lg:flex flex-col w-64 shrink-0 sticky top-0 h-screen"
          style={{
            background: "rgba(10,10,25,0.95)",
            borderRight: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          {/* Logo */}
          <div className="p-6 border-b" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #f97316, #c2410c)" }}
              >
                <span className="text-white font-black text-lg" style={{ fontFamily: "Orbitron, monospace" }}>V</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm" style={{ fontFamily: "Orbitron, monospace" }}>VIRK TECH</p>
                <p className="text-white/40 text-xs">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "appointments", label: "Appointments", icon: Calendar, badge: stats.pendingAppointments },
              { key: "buysell", label: "Buy & Sell", icon: ShoppingBag, badge: stats.newRequests },
            ].map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: tab === key ? "rgba(124,58,237,0.2)" : "transparent",
                  color: tab === key ? "white" : "rgba(255,255,255,0.45)",
                  borderLeft: tab === key ? "2px solid #f97316" : "2px solid transparent",
                }}
              >
                <Icon className="w-4.5 h-4.5" />
                {label}
                {(badge ?? 0) > 0 && (
                  <span
                    className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "#7c3aed", color: "white" }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User + Logout */}
          <div className="p-4 border-t" style={{ borderColor: "rgba(124,58,237,0.15)" }}>
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-3"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(124,58,237,0.3)" }}
              >
                <User className="w-4 h-4" style={{ color: "#fb923c" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{adminUser.displayName}</p>
                <p className="text-white/40 text-xs capitalize">{adminUser.role === "superadmin" ? "Super Admin" : adminUser.branch}</p>
              </div>
              {adminUser.role === "superadmin" && (
                <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: "#fb923c" }} />
              )}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div
            className="lg:hidden flex items-center justify-between p-4 sticky top-0 z-30"
            style={{
              background: "rgba(6,6,15,0.95)",
              borderBottom: "1px solid rgba(124,58,237,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
              >
                <span className="text-white font-black text-sm" style={{ fontFamily: "Orbitron, monospace" }}>V</span>
              </div>
              <span className="text-white font-bold text-sm">Admin Panel</span>
            </div>
            <button onClick={logout} className="text-white/40 hover:text-white p-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Nav Tabs */}
          <div className="lg:hidden flex gap-1 p-3" style={{ borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
            {[
              { key: "overview", label: "Overview", icon: BarChart3 },
              { key: "appointments", label: "Bookings", icon: Calendar },
              { key: "buysell", label: "Buy/Sell", icon: ShoppingBag },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key as Tab)}
                className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: tab === key ? "rgba(124,58,237,0.2)" : "transparent",
                  color: tab === key ? "white" : "rgba(255,255,255,0.4)",
                }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 lg:p-8 overflow-auto">
            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-white text-2xl font-bold mb-1">
                  Welcome, {adminUser.displayName}
                </h1>
                <p className="text-white/40 text-sm mb-8">
                  {adminUser.role === "superadmin" ? "All branches" : `${adminUser.branch} branch`} · {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Appointments", value: stats.totalAppointments, icon: Calendar, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
                    { label: "Pending Appointments", value: stats.pendingAppointments, icon: Clock, color: "#fbbf24", bg: "rgba(245,158,11,0.1)" },
                    { label: "Total B&S Requests", value: stats.totalRequests, icon: ShoppingBag, color: "#fb923c", bg: "rgba(251,146,60,0.1)" },
                    { label: "New B&S Requests", value: stats.newRequests, icon: TrendingUp, color: "#fdba74", bg: "rgba(253,186,116,0.1)" },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <div
                      key={label}
                      className="p-5 rounded-2xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: bg }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <p className="text-white text-2xl font-bold">{value}</p>
                      <p className="text-white/40 text-xs mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Appointments */}
                <div
                  className="rounded-2xl p-6"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <h2 className="text-white font-bold text-lg mb-4">Recent Appointments</h2>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <RefreshCw className="w-6 h-6 animate-spin" style={{ color: "#fb923c" }} />
                    </div>
                  ) : appointments.length === 0 ? (
                    <p className="text-white/30 text-sm text-center py-8">No appointments yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {appointments.slice(0, 5).map((appt) => (
                        <div
                          key={appt.id}
                          className="flex items-center gap-4 p-4 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "rgba(124,58,237,0.15)" }}
                          >
                            <User className="w-5 h-5 text-violet-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{appt.name}</p>
                            <p className="text-white/40 text-xs">{appt.deviceMake} {appt.deviceModel} · {appt.repairService}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <StatusBadge status={appt.status} />
                            <p className="text-white/30 text-xs mt-1">{appt.branch}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* APPOINTMENTS TAB */}
            {tab === "appointments" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-white text-2xl font-bold">Appointments</h1>
                  <button
                    onClick={fetchAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text" placeholder="Search by name, email, branch..."
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                  <select
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", colorScheme: "dark" }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
                  </div>
                ) : filteredAppts.length === 0 ? (
                  <div className="text-center py-20">
                    <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/30 text-base">No appointments found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredAppts.map((appt) => (
                      <div
                        key={appt.id}
                        className="rounded-2xl p-5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <p className="text-white/40 text-xs mb-1">CUSTOMER</p>
                              <p className="text-white font-semibold text-sm">{appt.name}</p>
                              <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {appt.email}
                              </p>
                              <p className="text-white/40 text-xs flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {appt.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/40 text-xs mb-1">DEVICE & REPAIR</p>
                              <p className="text-white text-sm font-medium">{appt.deviceMake} {appt.deviceModel}</p>
                              <p className="text-white/50 text-xs">{appt.deviceVariant}</p>
                              <p className="text-violet-400 text-xs font-medium mt-0.5" style={{ color: "#fb923c" }}>{appt.repairService}</p>
                            </div>
                            <div>
                              <p className="text-white/40 text-xs mb-1">APPOINTMENT</p>
                              <p className="text-white text-sm font-medium">{appt.date} at {appt.time}</p>
                              <p className="text-white/50 text-xs flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" /> {appt.branch}
                              </p>
                              <div className="mt-1"><StatusBadge status={appt.status} /></div>
                            </div>
                          </div>
                          {/* Actions */}
                          <div className="flex sm:flex-col gap-2 shrink-0">
                            <select
                              value={appt.status}
                              onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                              className="px-3 py-2 rounded-lg text-xs text-white outline-none appearance-none cursor-pointer"
                              style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", colorScheme: "dark" }}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => deleteAppointment(appt.id)}
                              className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                              style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {appt.notes && (
                          <div
                            className="mt-3 px-4 py-2.5 rounded-xl text-xs text-white/50"
                            style={{ background: "rgba(255,255,255,0.03)", borderLeft: "2px solid rgba(124,58,237,0.4)" }}
                          >
                            📝 {appt.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* BUY/SELL TAB */}
            {tab === "buysell" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-white text-2xl font-bold">Buy & Sell Requests</h1>
                  <button
                    onClick={fetchAll}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text" placeholder="Search..."
                      value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    />
                  </div>
                  <select
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 rounded-xl text-white text-sm outline-none appearance-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", colorScheme: "dark" }}
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                  </div>
                ) : filteredBS.length === 0 ? (
                  <div className="text-center py-20">
                    <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/30 text-base">No requests found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBS.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-2xl p-5"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-white/40 text-xs">CUSTOMER</p>
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                  style={{
                                    background: req.type === "sell" ? "rgba(245,158,11,0.15)" : "rgba(6,182,212,0.15)",
                                    color: req.type === "sell" ? "#fbbf24" : "#67e8f9",
                                  }}
                                >
                                  {req.type === "sell" ? "SELLING" : "BUYING"}
                                </span>
                              </div>
                              <p className="text-white font-semibold text-sm">{req.name}</p>
                              <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3" /> {req.email}
                              </p>
                              <p className="text-white/40 text-xs flex items-center gap-1">
                                <Phone className="w-3 h-3" /> {req.phone}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/40 text-xs mb-1">DEVICE</p>
                              <p className="text-white text-sm font-medium">{req.deviceMake} {req.deviceModel}</p>
                              {req.condition && (
                                <p className="text-white/50 text-xs mt-0.5">Condition: {req.condition}</p>
                              )}
                            </div>
                            <div>
                              <p className="text-white/40 text-xs mb-1">BRANCH & STATUS</p>
                              <p className="text-white text-sm">{req.branch}</p>
                              <div className="mt-1"><StatusBadge status={req.status} /></div>
                            </div>
                          </div>
                          <div className="flex sm:flex-col gap-2 shrink-0">
                            <select
                              value={req.status}
                              onChange={(e) => updateBuySellStatus(req.id, e.target.value)}
                              className="px-3 py-2 rounded-lg text-xs text-white outline-none appearance-none cursor-pointer"
                              style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.25)", colorScheme: "dark" }}
                            >
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="resolved">Resolved</option>
                            </select>
                            <button
                              onClick={() => deleteBuySell(req.id)}
                              className="p-2 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 transition-all"
                              style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {req.additionalInfo && (
                          <div
                            className="mt-3 px-4 py-2.5 rounded-xl text-xs text-white/50"
                            style={{ background: "rgba(255,255,255,0.03)", borderLeft: "2px solid rgba(6,182,212,0.4)" }}
                          >
                            📝 {req.additionalInfo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}