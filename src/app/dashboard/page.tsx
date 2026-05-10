"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import {
  User,
  Shield,
  Mail,
  Calendar,
  Activity,
  Compass,
  Mic2,
  Clock,
  Zap,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Users,
  ShieldAlert,
  LayoutDashboard,
  MessageSquare,
  Database,
} from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const { user } = useAuth();
  const [dbUser, setDbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAdmin = dbUser?.role === "admin";

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.email) return;
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`/api/users?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 404) {
          console.warn("User data syncing...");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch");
        setDbUser(await res.json());
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card-bg border border-card-border p-8 rounded-[32px] shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -z-10" />
        <div className="flex items-center gap-6">
          <img
            src={
              user?.photoURL ||
              dbUser?.photo ||
              `https://ui-avatars.com/api/?name=${dbUser?.name || "User"}`
            }
            className="w-24 h-24 rounded-2xl border border-card-border object-cover"
            alt="Profile"
          />
          <div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              {isAdmin
                ? "Admin Control Center"
                : `Welcome back, ${dbUser?.name ? dbUser.name.split(" ")[0] : user?.displayName?.split(" ")[0] || "User"}!`}
            </h2>
            <p className="text-muted mt-1 flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-primary" />
              {isAdmin
                ? "System is stable. Monitor global activities below."
                : "Your AI career growth is on track."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-card-bg px-5 py-3 rounded-2xl border border-card-border">
          <div
            className={`w-2 h-2 rounded-full animate-pulse ${isAdmin ? "bg-accent" : "bg-primary"}`}
          />
          <span className="text-foreground text-xs font-bold uppercase tracking-widest">
            {isAdmin ? "Administrator" : "Active Learner"}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard
              icon={<Users />}
              color="accent"
              label="Total Users"
              value={dbUser?.totalUsers || "0"}
              desc="Registered members"
            />
            <StatCard
              icon={<Activity />}
              color="accent"
              label="System Load"
              value={dbUser?.adminStats?.systemLoad || "0ms"}
              desc="DB Response latency"
            />
            <StatCard
              icon={<ShieldAlert />}
              color="primary"
              label="Security"
              value={dbUser?.adminStats?.security || "Secure"}
              desc={
                dbUser?.adminStats?.security === "Secure"
                  ? "No threats detected"
                  : "Check logs"
              }
            />
            <StatCard
              icon={<TrendingUp />}
              color="primary"
              label="Growth"
              value={dbUser?.adminStats?.growth || "0%"}
              desc="New users last 30 days"
            />
          </>
        ) : (
          <>
            <StatCard
              icon={<Compass />}
              color="accent"
              label="Roadmaps"
              value={dbUser?.stats?.roadmapsCount || "0"}
              desc="Paths generated"
            />
            <StatCard
              icon={<Mic2 />}
              color="accent"
              label="Interviews"
              value={dbUser?.stats?.interviewsCount || "0"}
              desc="Mock sessions"
            />
            <StatCard
              icon={<Clock />}
              color="primary"
              label="Focus Time"
              value={`${dbUser?.stats?.focusTime || 0}h`}
              desc="Deep work hours"
            />
            <StatCard
              icon={<Zap />}
              color="primary"
              label="Skills"
              value={dbUser?.stats?.skillsMastered || "0"}
              desc="Verified skills"
            />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-bg border border-card-border rounded-[32px] p-8">
          <h3 className="text-foreground font-bold text-xl mb-6 flex items-center gap-3">
            {isAdmin ? (
              <Shield className="text-accent" />
            ) : (
              <LayoutDashboard className="text-primary" />
            )}
            {isAdmin ? "System Management" : "Quick Access Tools"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isAdmin ? (
              <>
                <QuickLink
                  href="/dashboard/all-users"
                  title="User Management"
                  desc="Control all system users"
                  icon={<Users />}
                />
                <QuickLink
                  href="/dashboard/logs"
                  title="System Logs"
                  desc="View server activities"
                  icon={<Activity />}
                />
              </>
            ) : (
              <>
                <QuickLink
                  href="/dashboard/mentor"
                  title="AI Mentor"
                  desc="Chat with Gemini"
                  icon={<MessageSquare />}
                />
                <QuickLink
                  href="/dashboard/interview-bank"
                  title="Question Bank"
                  desc="Browse topics"
                  icon={<Database />}
                />
              </>
            )}
          </div>
        </div>

        <Link
          href={isAdmin ? "/dashboard/settings" : "/dashboard/roadmap"}
          className="bg-primary rounded-[32px] p-8 flex flex-col justify-between group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px]" />
          <div className="relative z-10">
            <h3 className="text-white text-3xl font-black leading-tight">
              {isAdmin ? "System\nSettings" : "New AI\nRoadmap"}
            </h3>
            <p className="text-white/80 text-sm mt-2">
              {isAdmin ? "Configure platform rules." : "Plot your career move."}
            </p>
          </div>
          <div className="bg-white text-secondary py-4 rounded-2xl font-bold text-center mt-6 group-hover:bg-white/90 transition-colors">
            {isAdmin ? "Open Settings" : "Start Generation"}
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

function StatCard({ icon, label, value, desc, color }: any) {
  const styles: any = {
    primary: { color: "#ED8936", bg: "rgba(237,137,54,0.10)" },
    accent: { color: "#38BDF8", bg: "rgba(56,189,248,0.10)" },
  };
  const s = styles[color] ?? styles.primary;
  return (
    <div className="bg-card-bg border border-card-border p-6 rounded-[32px] hover:border-primary/40 transition-all">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
        style={{ color: s.color, backgroundColor: s.bg }}
      >
        {icon}
      </div>
      <p className="text-muted text-[10px] font-black uppercase tracking-widest">
        {label}
      </p>
      <h4 className="text-3xl font-bold text-foreground my-1">{value}</h4>
      <p className="text-[10px] text-muted">{desc}</p>
    </div>
  );
}

function QuickLink({ href, title, desc, icon }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 bg-card-bg hover:bg-primary/5 border border-card-border hover:border-primary/30 rounded-2xl transition-all"
    >
      <div className="p-3 bg-primary/10 rounded-xl text-primary">{icon}</div>
      <div>
        <p className="text-foreground text-sm font-bold">{title}</p>
        <p className="text-muted text-[10px]">{desc}</p>
      </div>
    </Link>
  );
}
