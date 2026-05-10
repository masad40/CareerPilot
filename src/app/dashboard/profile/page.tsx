"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/firebase/firebase.config";
import { updatePassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import {
  Camera, Mail, User, Lock, Save, Loader2,
  ShieldCheck, Check, BadgeCheck, UserCog, AtSign,
} from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const [profilePic, setProfilePic] = useState("");
  const [coverPic, setCoverPic] = useState(
    "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070",
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user?.email) {
      user.getIdToken().then((token) => {
        fetch(`/api/users?email=${user.email}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data) {
              setDbUser(data);
              setName(data?.name || user?.displayName || "");
              setUsername(data?.username || "");
              setRole(data?.role || "user");
              setProfilePic(data?.photo || user?.photoURL);
              if (data?.cover) setCoverPic(data.cover);
            }
          });
      });
    }
  }, [user]);

  const syncProfileWithDB = async (
    updatedName: string, updatedUsername: string,
    updatedPhoto: string, updatedRole: string, updatedCover: string,
  ) => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken(true);
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({
          email: user.email, name: updatedName, username: updatedUsername,
          photo: updatedPhoto, role: updatedRole, cover: updatedCover, userId: user.uid,
        }),
      });
      if (response.ok) {
        await updateProfile(user, { displayName: updatedName, photoURL: updatedPhoto });
        router.refresh();
      } else throw new Error("Failed to sync");
    } catch (error) {
      console.error(error);
      alert("Sync failed!");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const resImg = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, { method: "POST", body: formData });
      const imgData = await resImg.json();
      const uploadedUrl = imgData.data.display_url;
      if (type === "profile") {
        setProfilePic(uploadedUrl);
        await syncProfileWithDB(name, username, uploadedUrl, role, coverPic);
      } else {
        setCoverPic(uploadedUrl);
        await syncProfileWithDB(name, username, profilePic, role, uploadedUrl);
      }
      alert(`${type === "profile" ? "Profile" : "Cover"} picture updated!`);
    } catch { alert("Image update failed!"); }
    finally { setLoading(false); }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await syncProfileWithDB(name, username, profilePic, role, coverPic);
      alert("Profile updated successfully!");
    } catch { alert("Update failed!"); }
    finally { setLoading(false); }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword !== confirmPassword) { alert("Passwords do not match!"); return; }
    setLoading(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated successfully!");
        setNewPassword(""); setConfirmPassword("");
      }
    } catch (error: any) { alert("Error: " + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-background backdrop-blur-2xl rounded-[32px] overflow-hidden border border-card-border shadow-2xl">

        {/* Cover Photo */}
        <div className="relative h-48 md:h-64 group">
          <img src={coverPic} alt="Cover" className="w-full h-full object-cover" />
          <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
            <Camera className="w-8 h-8 text-white/70" />
            <input type="file" className="hidden" onChange={(e) => handleImageChange(e, "cover")} />
          </label>
        </div>

        <div className="relative px-6 md:px-8 pb-8 bg-background">
          {/* Profile Header */}
          <div className="relative -top-16 flex flex-col md:flex-row items-end gap-6">
            <div className="relative group">
              <img
                src={profilePic || "https://i.ibb.co.com/jPMxs6FS/icon.jpg"}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-background object-cover shadow-xl bg-background"
              />
              <label className="absolute bottom-2 right-2 p-2 bg-primary rounded-lg cursor-pointer hover:bg-primary/80 shadow-lg transition-all">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" className="hidden" onChange={(e) => handleImageChange(e, "profile")} />
              </label>
            </div>

            <div className="flex-1 pb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                  {name || "User Name"}
                  {role === "admin" && <BadgeCheck className="w-6 h-6 text-blue-400" />}
                </h2>
                <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3" /> {role}
                </div>
              </div>
              <p className="text-muted mt-1 flex items-center gap-2 text-sm italic">
                @{username || "username_not_set"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 -mt-8">
            {/* Identity Settings */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <UserCog className="w-5 h-5" /> Identity Settings
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-input-bg border border-input-border text-foreground rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary/50 transition-all placeholder:text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Unique Username</label>
                  <div className="relative">
                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))}
                      placeholder="choose_username"
                      className="w-full bg-input-bg border border-input-border text-foreground rounded-xl pl-12 pr-4 py-3 outline-none focus:border-primary/50 transition-all font-medium placeholder:text-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-input-bg border border-input-border text-foreground rounded-xl px-4 py-3 outline-none focus:border-primary/50 appearance-none cursor-pointer"
                  >
                    {role === "user" && <option value="user">User</option>}
                    {role === "admin" && <option value="admin">Administrator</option>}
                    {role === "moderator" && <option value="moderator">Moderator</option>}
                  </select>
                </div>

                <button
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white px-6 py-3.5 rounded-xl font-bold w-full justify-center shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Identity Changes
                </button>
              </div>
            </div>

            {/* Security */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                <Lock className="w-5 h-5" /> Security
              </h3>
              <div className="space-y-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-input-bg border border-input-border text-foreground rounded-xl px-4 py-3 outline-none focus:border-primary/50 placeholder:text-muted"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full bg-input-bg border border-input-border text-foreground rounded-xl px-4 py-3 outline-none focus:border-primary/50 placeholder:text-muted"
                />
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="flex items-center gap-2 bg-card-bg hover:bg-primary/10 text-primary border border-primary/20 px-6 py-3.5 rounded-xl font-bold w-full justify-center active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
