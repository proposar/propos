"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  total_proposals: number;
  won_proposals: number;
  total_value: number;
  updated_at: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("updated_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", website: "", industry: "", country: "", notes: "" });

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ sort, order });
    if (search) params.set("search", search);
    fetch(`/api/clients?${params}`)
      .then((r) => r.json())
      .then((d) => { setClients(Array.isArray(d) ? d : []); })
      .finally(() => setLoading(false));
  }, [sort, order, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setAddOpen(false);
      setForm({ name: "", company: "", email: "", phone: "", website: "", industry: "", country: "", notes: "" });
      load();
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editId) return;
    const res = await fetch(`/api/clients/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setEditId(null);
      load();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/clients/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      setDeleteId(null);
      load();
    }
  }

  function openEdit(c: Client) {
    setEditId(c.id);
    setForm({
      name: c.name,
      company: c.company ?? "",
      email: c.email ?? "",
      phone: (c as { phone?: string }).phone ?? "",
      website: (c as { website?: string }).website ?? "",
      industry: (c as { industry?: string }).industry ?? "",
      country: (c as { country?: string }).country ?? "",
      notes: (c as { notes?: string }).notes ?? "",
    });
  }

  const winRate = (c: Client) => c.total_proposals > 0 ? Math.round((c.won_proposals / c.total_proposals) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-2xl font-bold text-[#faf8f4]">Clients</h1>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a]"
        >
          Add client
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <input
          type="search"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-2 text-[#faf8f4] w-64 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
        <select
          value={`${sort}-${order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split("-") as [string, "asc" | "desc"];
            setSort(s);
            setOrder(o);
          }}
          className="rounded-lg border border-[#1e1e2e] bg-[#12121e] px-4 py-2 text-[#faf8f4] text-sm"
        >
          <option value="updated_at-desc">Last activity</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="total_proposals-desc">Proposals (high)</option>
          <option value="total_value-desc">Value (high)</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#1e1e2e] bg-[#12121e] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[#888890]">Loading...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-[#888890]">No clients yet. Add your first client.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#888890] border-b border-[#1e1e2e]">
                  <th className="p-4">Name</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Proposals</th>
                  <th className="p-4">Win rate</th>
                  <th className="p-4">Total value</th>
                  <th className="p-4">Last activity</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a14]/30">
                    <td className="p-4">
                      <Link href={`/clients/${c.id}`} className="font-medium text-[#faf8f4] hover:text-gold">
                        {c.name}
                      </Link>
                    </td>
                    <td className="p-4 text-[#888890]">{c.company ?? "—"}</td>
                    <td className="p-4 text-[#888890]">{c.email ?? "—"}</td>
                    <td className="p-4 text-[#888890]">{c.total_proposals}</td>
                    <td className="p-4 text-[#888890]">{winRate(c)}%</td>
                    <td className="p-4 text-[#888890]">${Number(c.total_value).toLocaleString()}</td>
                    <td className="p-4 text-[#888890]">{new Date(c.updated_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <button type="button" onClick={() => openEdit(c)} className="text-gold hover:underline mr-2">Edit</button>
                      <button type="button" onClick={() => setDeleteId(c.id)} className="text-red-400 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add modal */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
            onClick={() => setAddOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <h2 className="font-semibold text-[#faf8f4] mb-4">Add client</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                <div>
                  <label className="block text-sm text-[#888890] mb-1">Name *</label>
                  <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
                </div>
                <div>
                  <label className="block text-sm text-[#888890] mb-1">Company</label>
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
                </div>
                <div>
                  <label className="block text-sm text-[#888890] mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14]">Save</button>
                  <button type="button" onClick={() => setAddOpen(false)} className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890]">Cancel</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit slide-over */}
      <AnimatePresence>
        {editId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#12121e] border-l border-[#1e1e2e] shadow-xl flex flex-col"
          >
            <div className="p-6 border-b border-[#1e1e2e] flex justify-between items-center">
              <h2 className="font-semibold text-[#faf8f4]">Edit client</h2>
              <button type="button" onClick={() => setEditId(null)} className="text-[#888890] hover:text-[#faf8f4]">✕</button>
            </div>
            <form onSubmit={handleEdit} className="p-6 space-y-3 flex-1 overflow-y-auto">
              <div><label className="block text-sm text-[#888890] mb-1">Name *</label><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" /></div>
              <div><label className="block text-sm text-[#888890] mb-1">Company</label><input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" /></div>
              <div><label className="block text-sm text-[#888890] mb-1">Email</label><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" /></div>
              <div><label className="block text-sm text-[#888890] mb-1">Notes</label><textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={3} className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4]" /></div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-[#0a0a14]">Save</button>
                <button type="button" onClick={() => setEditId(null)} className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890]">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="rounded-xl border border-[#1e1e2e] bg-[#12121e] p-6 max-w-sm w-full">
              <p className="text-[#faf8f4] mb-4">Delete this client? Proposals linked to them will remain.</p>
              <div className="flex gap-2">
                <button type="button" onClick={handleDelete} className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white">Delete</button>
                <button type="button" onClick={() => setDeleteId(null)} className="rounded-lg border border-[#1e1e2e] px-4 py-2 text-sm text-[#888890]">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
