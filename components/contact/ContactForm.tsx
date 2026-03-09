"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (res.ok && data.sent) {
        setSent(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setError(data.error ?? "Failed to send. Email support@proposar.com directly.");
      }
    } catch {
      setError("Failed to send. Email support@proposar.com directly.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-gold/30 bg-gold/10 p-6 text-center">
        <p className="text-gold font-medium">Message sent!</p>
        <p className="text-sm text-[#888890] mt-2">We typically respond within 24–48 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium text-[#faf8f4] mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#faf8f4] mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#faf8f4] mb-1">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50"
          placeholder="How can we help?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#faf8f4] mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          rows={4}
          className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a14] px-3 py-2 text-[#faf8f4] focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          placeholder="Tell us what you need..."
        />
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-gold px-6 py-2 text-sm font-medium text-[#0a0a14] hover:bg-[#e8c76a] disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
