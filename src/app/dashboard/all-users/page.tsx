"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Trash2,
  ShieldCheck,
  Mail,
  Search,
  Loader2,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AllUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (currentUser) fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await currentUser?.getIdToken();
      const res = await fetch("/api/users?all=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAction = async (targetEmail: string, updateData: any) => {
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEmail, ...updateData }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user?")) return;
    try {
      const token = await currentUser?.getIdToken();
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 md:p-10 space-y-8 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black flex items-center gap-3 text-foreground">
          <Users className="text-primary" /> User Directory
        </h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-input-bg border border-input-border text-foreground rounded-2xl pl-12 pr-6 py-3 w-80 outline-none focus:border-primary/50 transition-all placeholder:text-muted"
          />
        </div>
      </div>

      <div className="bg-card-bg backdrop-blur-xl rounded-[32px] border border-card-border overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-primary" />
            <p className="text-muted">Loading user database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-body-bg border-b border-card-border text-[10px] uppercase tracking-widest font-black text-muted">
                  <th className="px-8 py-6">User Details</th>
                  <th className="px-8 py-6">Role</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-card-border">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-body-bg transition-colors group"
                  >
                    <td className="px-8 py-5 flex items-center gap-4">
                      <img
                        src={
                          user.photo ||
                          `https://ui-avatars.com/api/?name=${user.name}&background=ED8936&color=fff`
                        }
                        className="w-10 h-10 rounded-xl border border-card-border"
                        alt="avatar"
                      />
                      <div>
                        <p className="font-bold text-sm text-foreground">{user.name}</p>
                        <p className="text-xs text-muted">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${user.role === "admin" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"}`}
                      >
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs text-foreground">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${user.isSuspended ? "bg-red-500 shadow-[0_0_8px_red]" : "bg-green-500 shadow-[0_0_8px_green]"}`}
                        />
                        {user.isSuspended ? "Suspended" : "Active"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleAdminAction(user.email, { isSuspended: !user.isSuspended })}
                          className={`p-2 rounded-lg ${user.isSuspended ? "hover:bg-green-500/10 text-green-400" : "hover:bg-red-500/10 text-red-400"}`}
                          title={user.isSuspended ? "Activate" : "Suspend"}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAdminAction(user.email, { role: user.role === "admin" ? "user" : "admin" })}
                          className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg"
                          title="Change Role"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
