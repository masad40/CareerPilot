"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Settings, Save, ShieldCheck, Globe, Database, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function SystemSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    siteName: "CareerPilot AI",
    supportEmail: "support@careerpilot.com",
    maintenanceMode: false,
    allowRegistration: true,
    stripeLiveMode: false,
    maxUploadSize: 5,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.type) setConfig(data);
      } finally { setLoading(false); }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await user?.getIdToken();
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...config, type: "global" }),
      });
      alert("Settings updated successfully!");
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-background">
      <Loader2 className="animate-spin text-primary w-10 h-10" />
    </div>
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-card-border pb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Settings className="text-primary" /> System Settings
          </h1>
          <p className="text-muted text-sm">Configure your platform&apos;s core engine.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-card-bg p-8 rounded-[32px] border border-card-border space-y-6">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Globe className="text-accent w-5 h-5" /> General Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Site Title", name: "siteName", type: "text", value: config.siteName, onChange: (v: string) => setConfig({ ...config, siteName: v }) },
                { label: "Support Email", name: "supportEmail", type: "email", value: config.supportEmail, onChange: (v: string) => setConfig({ ...config, supportEmail: v }) },
              ].map((f) => (
                <div key={f.name} className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase ml-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    className="w-full bg-input-bg border border-input-border rounded-xl px-4 py-3 text-sm text-foreground focus:border-primary/50 outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card-bg p-8 rounded-[32px] border border-card-border">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
              <ShieldCheck className="text-primary w-5 h-5" /> Feature Access Control
            </h2>
            <div className="space-y-4">
              <ToggleRow
                label="Allow New Registrations"
                desc="Enable or disable new users to join."
                value={config.allowRegistration}
                onToggle={() => setConfig({ ...config, allowRegistration: !config.allowRegistration })}
                activeColor="bg-primary"
              />
              <ToggleRow
                label="Maintenance Mode"
                desc="Offline mode for entire platform."
                value={config.maintenanceMode}
                onToggle={() => setConfig({ ...config, maintenanceMode: !config.maintenanceMode })}
                activeColor="bg-accent"
                warning
              />
            </div>
          </section>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <section className="bg-primary/5 p-8 rounded-[32px] border border-primary/20">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-primary">
              <Database className="w-5 h-5" /> Storage & API
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-card-border pb-2 text-muted">
                <span>Database Status</span>
                <span className="text-primary font-mono text-xs flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Connected
                </span>
              </div>
              <div className="flex justify-between border-b border-card-border pb-2 text-muted">
                <span>Stripe Live Mode</span>
                <span className={config.stripeLiveMode ? "text-primary" : "text-accent"}>
                  {config.stripeLiveMode ? "LIVE" : "TEST"}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-card-bg p-8 rounded-[32px] border border-card-border">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-4 text-foreground">
              <AlertTriangle className="w-5 h-5 text-primary" /> Danger Zone
            </h2>
            <button className="w-full py-3 bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 rounded-xl text-xs font-bold transition-all">
              Flush All Logs
            </button>
            <p className="text-[10px] text-muted mt-3 text-center uppercase tracking-widest font-bold">
              Action is irreversible
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onToggle, activeColor, warning }: any) {
  return (
    <div className={`flex items-center justify-between p-4 bg-card-bg rounded-2xl border ${warning ? "border-primary/20" : "border-card-border"}`}>
      <div>
        <p className={`font-bold text-sm ${warning ? "text-primary" : "text-foreground"}`}>{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative ${value ? activeColor : "bg-card-border"}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? "right-1" : "left-1"}`} />
      </button>
    </div>
  );
}
