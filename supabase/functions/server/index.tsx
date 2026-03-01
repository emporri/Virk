import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ----- Admin Credentials -----
const ADMIN_ACCOUNTS: Record<string, { password: string; role: string; branch: string; displayName: string }> = {
  "superadmin": { password: "VirkSuper2025!", role: "superadmin", branch: "all", displayName: "Super Admin" },
  "ilford_admin": { password: "Ilford2025!", role: "admin", branch: "Ilford", displayName: "Ilford Branch" },
  "eastham_admin": { password: "EastHam2025!", role: "admin", branch: "East Ham", displayName: "East Ham Branch" },
  "barking_admin": { password: "Barking2025!", role: "admin", branch: "Barking", displayName: "Barking Branch" },
  "whitechapel_admin": { password: "Whitechapel2025!", role: "admin", branch: "Whitechapel", displayName: "Whitechapel Branch" },
  "walthamstow_admin": { password: "Walthamstow2025!", role: "admin", branch: "Walthamstow", displayName: "Walthamstow Branch" },
};

// ----- Auth Middleware Helper -----
async function verifyToken(authHeader: string | null): Promise<{ username: string; role: string; branch: string; displayName: string } | null> {
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "").trim();
  try {
    const session = await kv.get(`session:${token}`);
    if (!session) return null;
    if (session.expires < Date.now()) {
      await kv.del(`session:${token}`);
      return null;
    }
    return { username: session.username, role: session.role, branch: session.branch, displayName: session.displayName };
  } catch (e) {
    console.log("Token verification error:", e);
    return null;
  }
}

// ----- Health Check -----
app.get("/make-server-6a320fbc/health", (c) => {
  return c.json({ status: "ok" });
});

// ----- Admin Login -----
app.post("/make-server-6a320fbc/admin/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const account = ADMIN_ACCOUNTS[username];
    if (!account || account.password !== password) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
    const token = crypto.randomUUID();
    const session = {
      username,
      role: account.role,
      branch: account.branch,
      displayName: account.displayName,
      expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    await kv.set(`session:${token}`, session);
    return c.json({ success: true, token, ...session });
  } catch (e) {
    console.log("Admin login error:", e);
    return c.json({ error: `Login failed: ${e}` }, 500);
  }
});

// ----- Admin Logout -----
app.post("/make-server-6a320fbc/admin/logout", async (c) => {
  try {
    const authHeader = c.req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();
    if (token) await kv.del(`session:${token}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `Logout error: ${e}` }, 500);
  }
});

// ----- Admin Verify Session -----
app.get("/make-server-6a320fbc/admin/verify", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ success: true, ...user });
});

// ----- Create Appointment -----
app.post("/make-server-6a320fbc/appointments", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    const appointment = {
      id,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
      timestamp,
    };
    await kv.set(`appointment:${timestamp}:${id}`, appointment);
    return c.json({ success: true, id });
  } catch (e) {
    console.log("Create appointment error:", e);
    return c.json({ error: `Failed to create appointment: ${e}` }, 500);
  }
});

// ----- Get Appointments -----
app.get("/make-server-6a320fbc/appointments", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const all = await kv.getByPrefix("appointment:");
    let filtered = all;
    if (user.role !== "superadmin") {
      filtered = all.filter((a: any) => a.branch === user.branch);
    }
    filtered.sort((a: any, b: any) => b.timestamp - a.timestamp);
    return c.json({ success: true, appointments: filtered });
  } catch (e) {
    console.log("Get appointments error:", e);
    return c.json({ error: `Failed to fetch appointments: ${e}` }, 500);
  }
});

// ----- Update Appointment Status -----
app.put("/make-server-6a320fbc/appointments/:id", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const all = await kv.getByPrefix("appointment:");
    const appt = all.find((a: any) => a.id === id);
    if (!appt) return c.json({ error: "Appointment not found" }, 404);
    const updated = { ...appt, status };
    await kv.set(`appointment:${appt.timestamp}:${id}`, updated);
    return c.json({ success: true });
  } catch (e) {
    console.log("Update appointment error:", e);
    return c.json({ error: `Failed to update appointment: ${e}` }, 500);
  }
});

// ----- Delete Appointment -----
app.delete("/make-server-6a320fbc/appointments/:id", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { id } = c.req.param();
    const all = await kv.getByPrefix("appointment:");
    const appt = all.find((a: any) => a.id === id);
    if (!appt) return c.json({ error: "Appointment not found" }, 404);
    await kv.del(`appointment:${appt.timestamp}:${id}`);
    return c.json({ success: true });
  } catch (e) {
    console.log("Delete appointment error:", e);
    return c.json({ error: `Failed to delete appointment: ${e}` }, 500);
  }
});

// ----- Create Buy/Sell Request -----
app.post("/make-server-6a320fbc/buysell", async (c) => {
  try {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const timestamp = Date.now();
    const request = {
      id,
      ...body,
      status: "new",
      createdAt: new Date().toISOString(),
      timestamp,
    };
    await kv.set(`buysell:${timestamp}:${id}`, request);
    return c.json({ success: true, id });
  } catch (e) {
    console.log("Create buy/sell error:", e);
    return c.json({ error: `Failed to submit request: ${e}` }, 500);
  }
});

// ----- Get Buy/Sell Requests -----
app.get("/make-server-6a320fbc/buysell", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const all = await kv.getByPrefix("buysell:");
    let filtered = all;
    if (user.role !== "superadmin") {
      filtered = all.filter((r: any) => r.branch === user.branch);
    }
    filtered.sort((a: any, b: any) => b.timestamp - a.timestamp);
    return c.json({ success: true, requests: filtered });
  } catch (e) {
    console.log("Get buy/sell error:", e);
    return c.json({ error: `Failed to fetch requests: ${e}` }, 500);
  }
});

// ----- Update Buy/Sell Status -----
app.put("/make-server-6a320fbc/buysell/:id", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();
    const all = await kv.getByPrefix("buysell:");
    const req = all.find((r: any) => r.id === id);
    if (!req) return c.json({ error: "Request not found" }, 404);
    const updated = { ...req, status };
    await kv.set(`buysell:${req.timestamp}:${id}`, updated);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `Failed to update: ${e}` }, 500);
  }
});

// ----- Delete Buy/Sell Request -----
app.delete("/make-server-6a320fbc/buysell/:id", async (c) => {
  const user = await verifyToken(c.req.header("Authorization") ?? null);
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  try {
    const { id } = c.req.param();
    const all = await kv.getByPrefix("buysell:");
    const req = all.find((r: any) => r.id === id);
    if (!req) return c.json({ error: "Request not found" }, 404);
    await kv.del(`buysell:${req.timestamp}:${id}`);
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: `Failed to delete: ${e}` }, 500);
  }
});

Deno.serve(app.fetch);
