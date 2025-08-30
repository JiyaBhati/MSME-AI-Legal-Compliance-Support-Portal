import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

/**
 * MSME Compliance & Insights — Frontend Only Demo
 * ------------------------------------------------
 * This single-file React app gives you a polished frontend you can drop into any project.
 * It’s wired to call a backend at `/api/updates` (Discovery feed), `/api/profile`, `/api/alerts` etc.
 * For now, it uses mocked data + timeouts to simulate those endpoints.
 *
 * How to integrate with your real backend later:
 * - Replace the mock fetchers (fetchComplianceUpdates, fetchAlerts, saveProfile)
 *   with real `fetch("/api/...")` calls.
 * - Endpoint ideas:
 *   GET  /api/updates?sector=food&since=2025-08-01
 *   GET  /api/alerts?msmeId=...
 *   POST /api/profile  (body: { name, sector, state, employees })
 *   GET  /api/checklist?sector=...
 */

// ---------------------------- Mock Data & Fetchers ----------------------------
const MOCK_UPDATES = [
  {
    id: "gst-001",
    title: "GST rate update for fabric processing (example)",
    url: "https://www.example.gov/gst/fabric-aug-update",
    updatedAt: "2025-08-20",
    tags: ["GST", "Textile"],
    summary:
      "GST on certain fabric processing services revised. Effective Sept 01, 2025. Compliance window: 30 days.",
    sector: "textile",
  },
  {
    id: "labour-017",
    title: "Monthly wage register rule for >10 workers (example)",
    url: "https://www.example.gov/labour/wage-register",
    updatedAt: "2025-08-18",
    tags: ["Labour", "HR"],
    summary:
      "Establishments with more than 10 workers must maintain Form X wage register and digital attendance logs.",
    sector: "all",
  },
  {
    id: "safety-009",
    title: "Fire & Safety drill reporting for kitchens (example)",
    url: "https://www.example.gov/safety/kitchen-drill",
    updatedAt: "2025-08-15",
    tags: ["Safety", "Processed Food"],
    summary:
      "Commercial kitchens must record monthly safety drills and keep extinguisher service certificates updated.",
    sector: "food",
  },
  {
    id: "env-103",
    title: "E-waste disposal norms for IT hardware (example)",
    url: "https://www.example.gov/pollution/e-waste",
    updatedAt: "2025-08-12",
    tags: ["Environment", "IT"],
    summary:
      "Updated e-waste collection and vendor certification requirements for MSMEs handling electronics.",
    sector: "it",
  },
];

const MOCK_ALERTS = [
  {
    id: "a1",
    title: "GST Filing — GSTR-3B",
    due: "2025-09-20",
    severity: "high",
    action: "Prepare & file via portal",
  },
  {
    id: "a2",
    title: "Labour — PF Contribution",
    due: "2025-09-15",
    severity: "medium",
    action: "Generate challan & pay",
  },
  {
    id: "a3",
    title: "Safety — Fire Drill Log",
    due: "2025-09-05",
    severity: "low",
    action: "Upload drill report",
  },
];

const MOCK_CHECKLISTS = {
  food: [
    { id: "c1", item: "FSSAI License valid/renewal date", done: false },
    { id: "c2", item: "Kitchen hygiene SOPs documented", done: true },
    { id: "c3", item: "Fire drill conducted this month", done: false },
  ],
  textile: [
    { id: "c4", item: "GST category mapping verified", done: true },
    { id: "c5", item: "Worker safety training log", done: false },
  ],
  it: [
    { id: "c6", item: "Data protection policy updated", done: true },
    { id: "c7", item: "E-waste vendor certification", done: false },
  ],
  general: [
    { id: "c8", item: "Udyam registration synced", done: true },
    { id: "c9", item: "Bank KYC & PAN validated", done: true },
  ],
};

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchComplianceUpdates({ sector, since }) {
  // Replace with: return fetch(`/api/updates?sector=${sector}&since=${since}`).then(r=>r.json())
  await delay(500);
  // Simple filtering to simulate sector scoping
  const sectorKey = (sector || "all").toLowerCase();
  return MOCK_UPDATES.filter((u) => u.sector === sectorKey || u.sector === "all");
}

async function fetchAlerts(/* msmeId */) {
  // Replace with: return fetch(`/api/alerts?msmeId=${id}`).then(r=>r.json())
  await delay(300);
  return MOCK_ALERTS;
}

async function saveProfile(profile) {
  // Replace with: return fetch('/api/profile', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(profile)}).then(r=>r.json())
  await delay(300);
  return { ok: true, profile };
}

// ---------------------------- UI Helpers ----------------------------
const sectors = [
  { key: "food", label: "Processed Food / Restaurants" },
  { key: "textile", label: "Textile / Apparel" },
  { key: "it", label: "IT / Services" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "all", label: "All Sectors" },
];

function severityBadge(s) {
  const map = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  return map[s] || "bg-slate-100 text-slate-700 border-slate-200";
}

function Tag({ children }) {
  return (
    <span className="px-2 py-1 text-xs rounded-full border bg-slate-50 text-slate-700">{children}</span>
  );
}

// ---------------------------- Components ----------------------------
function Navbar({ sector, setSector }) {
  return (
    <div className="sticky top-0 z-20 backdrop-blur bg-white/80 border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧾</span>
          <h1 className="text-lg sm:text-2xl font-semibold">MSME Compliance & Insights</h1>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <select
            className="px-3 py-2 rounded-xl border shadow-sm text-sm"
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            aria-label="Select Sector"
          >
            {sectors.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
          <a
            className="px-3 py-2 rounded-xl border bg-slate-50 text-sm hover:bg-slate-100"
            href="#"
          >
            Docs
          </a>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ profile, onSave }) {
  const [form, setForm] = useState(profile);
  const [saving, setSaving] = useState(false);
  return (
    <motion.div layout className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Your MSME Profile</h2>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="Business Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="State / UT"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
        <input
          className="px-3 py-2 rounded-xl border"
          placeholder="Employees"
          type="number"
          value={form.employees}
          onChange={(e) => setForm({ ...form, employees: e.target.value })}
        />
        <select
          className="px-3 py-2 rounded-xl border"
          value={form.sector}
          onChange={(e) => setForm({ ...form, sector: e.target.value })}
        >
          {sectors.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          className="px-4 py-2 rounded-xl bg-black text-white text-sm"
          onClick={async () => {
            setSaving(true);
            await onSave(form);
            setSaving(false);
          }}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
        <div className="text-sm text-slate-500 self-center">Used to personalize rules & alerts</div>
      </div>
    </motion.div>
  );
}

function UpdatesCard({ sector }) {
  const [since, setSince] = useState("2025-08-01");
  const [loading, setLoading] = useState(false);
  const [updates, setUpdates] = useState([]);

  const load = async () => {
    setLoading(true);
    const data = await fetchComplianceUpdates({ sector, since });
    setUpdates(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sector]);

  return (
    <motion.div layout className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Latest Compliance Updates</h2>
        <div className="flex items-center gap-2 text-sm">
          <input
            className="px-3 py-2 rounded-xl border"
            type="date"
            value={since}
            onChange={(e) => setSince(e.target.value)}
          />
          <button
            className="px-3 py-2 rounded-xl border bg-slate-50 hover:bg-slate-100"
            onClick={load}
          >
            Refresh
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-sm text-slate-500">Loading updates…</div>
      ) : updates.length === 0 ? (
        <div className="text-sm text-slate-500">No updates found for the selected sector/date.</div>
      ) : (
        <ul className="space-y-3">
          {updates.map((u) => (
            <li key={u.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <a
                  href={u.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium hover:underline"
                >
                  {u.title}
                </a>
                <div className="text-xs text-slate-500">Updated: {u.updatedAt}</div>
              </div>
              <p className="text-sm text-slate-600 mt-1">{u.summary}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {u.tags?.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function AlertsCard() {
  const [loading, setLoading] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const load = async () => {
    setLoading(true);
    const data = await fetchAlerts();
    setAlerts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <motion.div layout className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Upcoming Deadlines & Alerts</h2>
        <button className="px-3 py-2 rounded-xl border bg-slate-50 hover:bg-slate-100" onClick={load}>
          Refresh
        </button>
      </div>
      {loading ? (
        <div className="text-sm text-slate-500">Loading alerts…</div>
      ) : alerts.length === 0 ? (
        <div className="text-sm text-slate-500">No alerts right now.</div>
      ) : (
        <ul className="space-y-3">
          {alerts.map((a) => (
            <li key={a.id} className={`rounded-xl border p-3 ${severityBadge(a.severity)}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs">Due: {a.due}</div>
              </div>
              <div className="text-sm mt-1">Action: {a.action}</div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function ChecklistCard({ sector }) {
  const items = useMemo(() => {
    const base = MOCK_CHECKLISTS.general || [];
    const sectorItems = MOCK_CHECKLISTS[sector] || [];
    return [...sectorItems, ...base];
  }, [sector]);

  const [list, setList] = useState(items);
  useEffect(() => setList(items), [items]);

  const toggle = (id) => setList((prev) => prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  return (
    <motion.div layout className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">Compliance Checklist</h2>
      <ul className="space-y-2">
        {list.map((c) => (
          <li key={c.id} className="flex items-center gap-3">
            <input type="checkbox" checked={c.done} onChange={() => toggle(c.id)} />
            <span className={`text-sm ${c.done ? "line-through text-slate-400" : ""}`}>{c.item}</span>
          </li>
        ))}
      </ul>
      <div className="text-xs text-slate-500 mt-3">Tip: This list should come from /api/checklist?sector=...</div>
    </motion.div>
  );
}

function AssistantCard() {
  const [q, setQ] = useState("");
  const [chat, setChat] = useState([
    { role: "assistant", text: "Hi! Ask me any compliance question for your MSME." },
  ]);

  const ask = async () => {
    if (!q.trim()) return;
    const userMsg = { role: "user", text: q };
    setChat((c) => [...c, userMsg]);
    setQ("");
    // Replace with real call to your LLM/Assistant backend
    await delay(400);
    setChat((c) => [
      ...c,
      {
        role: "assistant",
        text:
          "(Demo) I’d analyze latest rules (GST/Labour/Safety) for your sector and summarize what applies to you.",
      },
    ]);
  };

  return (
    <motion.div layout className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-3">AI Assistant</h2>
      <div className="h-48 overflow-y-auto rounded-xl border p-3 bg-slate-50">
        {chat.map((m, i) => (
          <div key={i} className={`mb-2 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                m.role === "user" ? "bg-black text-white" : "bg-white border"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border"
          placeholder="e.g., What licenses for a textile unit in Delhi?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <button className="px-4 py-2 rounded-xl bg-black text-white text-sm" onClick={ask}>
          Ask
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------- Main App ----------------------------
export default function App() {
  const [sector, setSector] = useState("all");
  const [profile, setProfile] = useState({ name: "Acme MSME", state: "Gujarat", employees: 18, sector: "all" });
  const [savedToast, setSavedToast] = useState("");

  const handleSave = async (form) => {
    const res = await saveProfile(form);
    if (res.ok) {
      setProfile(res.profile);
      setSavedToast("Profile saved ✔");
      setTimeout(() => setSavedToast(""), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar sector={sector} setSector={setSector} />

      <main className="max-w-6xl mx-auto px-4 py-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
          <ProfileCard profile={profile} onSave={handleSave} />
          <UpdatesCard sector={sector === "all" ? profile.sector : sector} />
        </div>
        <div className="grid gap-6">
          <AlertsCard />
          <ChecklistCard sector={sector === "all" ? profile.sector : sector} />
          <AssistantCard />
        </div>
      </main>

      {/* Toast */}
      {savedToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2">
          <div className="px-4 py-2 rounded-xl shadow bg-emerald-600 text-white text-sm">{savedToast}</div>
        </div>
      )}

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-500 flex flex-wrap items-center gap-3">
          <span>© {new Date().getFullYear()} MSME Compliance Assistant</span>
          <span>•</span>
          <span>Frontend demo — replace mock fetchers with your API endpoints.</span>
        </div>
      </footer>
    </div>
  );
}
