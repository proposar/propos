"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { trackOnboardingCompleted } from "@/lib/analytics";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CURRENCIES } from "@/lib/constants";

// 60+ countries covering all major global freelancer markets
const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Germany",
  "Netherlands",
  "France",
  "Spain",
  "Italy",
  "Portugal",
  "Brazil",
  "Mexico",
  "Argentina",
  "Colombia",
  "Chile",
  "Peru",
  "Philippines",
  "Indonesia",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Nigeria",
  "Kenya",
  "Ghana",
  "South Africa",
  "Egypt",
  "Morocco",
  "Poland",
  "Ukraine",
  "Romania",
  "Czech Republic",
  "Hungary",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Ireland",
  "New Zealand",
  "Singapore",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "Japan",
  "South Korea",
  "China",
  "Taiwan",
  "Hong Kong",
  "United Arab Emirates",
  "Saudi Arabia",
  "Israel",
  "Turkey",
  "Russia",
  "Serbia",
  "Croatia",
  "Bulgaria",
  "Greece",
  "Other",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [businessName, setBusinessName] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("United States");
  const [currency, setCurrency] = useState("USD");

  // Step 2
  const [brandColor, setBrandColor] = useState("#c9a84c");
  const [tagline, setTagline] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");

  // Guard ref: welcome email must fire exactly once per mount
  const welcomeEmailSent = useRef(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
    });
  }, [router]);

  useEffect(() => {
    // Only fire once — prevents duplicate emails on re-render or React Strict Mode double-invoke
    if (welcomeEmailSent.current) return;
    welcomeEmailSent.current = true;
    fetch("/api/emails/welcome", { method: "POST" }).catch(() => {});
  }, []);

  async function saveStep1() {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("profiles")
        .update({
          business_name: businessName || null,
          business_type: role || null,
          country: country || null,
          currency: currency || "USD",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    } catch {
      // Profile might not exist yet; upsert is done on first signup via trigger
    } finally {
      setSaving(false);
    }
  }

  async function saveStep2() {
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      let logoUrl: string | null = null;
      if (logoFile) {
        const fd = new FormData();
        fd.append("file", logoFile);
        fd.append("type", "logo");
        const res = await fetch("/api/profile/upload", { method: "POST", body: fd });
        if (res.ok) {
          const { url } = await res.json();
          logoUrl = url;
        }
      }
      await supabase
        .from("profiles")
        .update({
          website: website || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          brand_color: brandColor || null,
          bio: tagline || null,
          logo_url: logoUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function completeOnboarding() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      await supabase
        .from("profiles")
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      trackOnboardingCompleted();
      router.push("/proposals/new");
    } catch {
      router.push("/proposals");
    } finally {
      setLoading(false);
    }
  }

  // Skip saves current step data so brand/profile data is never lost
  async function handleSkip() {
    if (step === 1) {
      await saveStep1();
      setStep(2);
    } else if (step === 2) {
      await saveStep2();
      setStep(3);
    }
  }

  async function handleNext() {
    if (step === 1) {
      await saveStep1();
      setStep(2);
    } else if (step === 2) {
      await saveStep2();
      setStep(3);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] text-foreground flex flex-col">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold text-foreground">
          Proposar
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-colors ${
                  s <= step ? "bg-gold" : "bg-surface"
                }`}
              />
            ))}
          </div>
          {step < 3 && (
            <button
              type="button"
              onClick={() => void handleSkip()}
              disabled={saving}
              className="text-sm text-muted hover:text-foreground disabled:opacity-50"
            >
              Skip
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  Tell us about you
                </h1>
                <p className="text-muted">
                  We&apos;ll use this in your proposals.
                </p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business name
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="Acme Studio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your role / title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="Freelance Designer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country
                  </label>
                  <select
                    aria-label="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency preference
                  </label>
                  <select
                    aria-label="Currency preference"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  Set up your brand
                </h1>
                <p className="text-muted">
                  Logo and colors appear on your proposals.
                </p>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Logo
                  </label>
                  <div
                    className="rounded-lg border border-dashed border-border bg-surface p-8 text-center text-muted text-sm cursor-pointer hover:border-gold/50 transition-colors"
                    onClick={() => document.getElementById("logo-input")?.click()}
                  >
                    <input
                      id="logo-input"
                      type="file"
                      aria-label="Upload logo"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setLogoFile(f);
                          setLogoPreview(URL.createObjectURL(f));
                        }
                      }}
                    />
                    {logoPreview ? (
                      <Image src={logoPreview} alt="Logo" className="mx-auto h-20 object-contain" width={100} height={80} />
                    ) : (
                      <>
                        Drag and drop your logo here, or click to upload.
                        <br />
                        <span className="text-xs">PNG, JPG up to 5MB</span>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Brand color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      aria-label="Brand color picker"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="h-10 w-14 rounded border border-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      aria-label="Brand color hex"
                      placeholder="#c9a84c"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="flex-1 rounded-lg border border-border bg-surface px-4 py-3 text-foreground font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Business tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="We help brands stand out."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Work Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="New York, NY"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Business Address (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="123 Creator Lane, Suite 100"
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-center"
              >
                <div className="rounded-full w-16 h-16 mx-auto bg-gold/20 flex items-center justify-center">
                  <span className="text-3xl">✨</span>
                </div>
                <h1 className="font-serif text-3xl font-bold text-foreground">
                  Ready to create your first proposal
                </h1>
                <p className="text-muted max-w-sm mx-auto">
                  Enter client name, project type, and a few details. Proposar will generate a professional, persuasive proposal in about 60 seconds.
                </p>
                <ul className="text-left text-sm text-muted space-y-2 max-w-xs mx-auto">
                  <li className="flex items-center gap-2">✓ AI writes executive summary &amp; deliverables</li>
                  <li className="flex items-center gap-2">✓ Share link &amp; track when client opens it</li>
                  <li className="flex items-center gap-2">✓ One-click accept or PDF export</li>
                </ul>
                <button
                  type="button"
                  onClick={completeOnboarding}
                  disabled={loading}
                  className="w-full rounded-lg bg-gold py-4 font-medium text-background hover:bg-gold-light transition-colors disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create my first proposal →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 3 && (
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => void handleNext()}
                disabled={saving}
                className="rounded-lg bg-gold px-6 py-3 font-medium text-background hover:bg-gold-light disabled:opacity-50"
              >
                {saving ? "Saving..." : "Next"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
