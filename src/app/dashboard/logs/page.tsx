"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  History,
  Search,
  Terminal,
  Clock,
  Loader2,
  Users,
  UserPlus,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = await user?.getIdToken();
      const res = await fetch("/api/logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- Stats Calculation ---
  const totalLogs = logs.length;

  const getStatusStyle = (action: string) => {
    if (
      action.includes("SUSPEND") ||
      action.includes("DELETE") ||
      action.includes("ERROR")
    )
      return "bg-red-500/10 text-red-400 border-red-500/20";
    if (
      action.includes("REGISTERED") ||
      action.includes("LOGIN") ||
      action.includes("SUCCESS")
    )
      return "bg-green-500/10 text-green-400 border-green-500/20";
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  const filteredLogs = logs.filter(
    (log) =>
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.performedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#0A0C1B] min-h-screen text-white">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black flex items-center gap-3 text-white">
            <Terminal className="text-primary w-8 h-8" /> System Audit Logs
          </h1>
          <p className="text-slate-500 text-sm">
            Monitoring system activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Filter logs or emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#161B22] border border-white/10 rounded-2xl pl-12 pr-6 py-3 w-64 md:w-80 outline-none focus:border-primary/50 transition-all text-sm"
            />
          </div>
          <button
            onClick={fetchLogs}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors group"
            title="Refresh Logs"
          >
            <History
              className={`w-5 h-5 text-slate-400 group-active:rotate-180 transition-transform duration-500`}
            />
          </button>
        </div>
      </div>

      {/* LOGS TABLE */}
      <div className="bg-[#161B22]/40 backdrop-blur-xl rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-32 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary w-10 h-10" />
            <p className="text-slate-500 font-medium animate-pulse">
              Syncing system records...
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[10px] uppercase tracking-widest font-black text-slate-500">
                  <th className="px-8 py-6">Timestamp</th>
                  <th className="px-8 py-6">Action Type</th>
                  <th className="px-8 py-6">Operator / User</th>
                  <th className="px-8 py-6">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, index) => (
                    <motion.tr
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      key={log._id}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-600" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-tighter ${getStatusStyle(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="text-sm font-semibold text-slate-200 group-hover:text-primary transition-colors">
                          {log.performedBy}
                        </div>
                        <div className="text-[10px] text-slate-600 uppercase tracking-tighter mt-0.5">
                          ID: {log._id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-slate-400 leading-relaxed max-w-xs md:max-w-md">
                        {log.details}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-32 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Activity className="w-10 h-10 text-slate-800" />
                        <p className="text-slate-600 font-medium">
                          No logs found for your search.
                        </p>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="text-primary text-xs font-bold underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
