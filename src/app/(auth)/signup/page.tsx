"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Rocket,
  Zap,
  Briefcase,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
// Firebase & Context
import { auth, googleProvider } from "@/firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // default profile picture for new users
  const defaultPhoto = "https://i.ibb.co.com/b57rQ40d/profile.png";

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  // user signup or google login call these function to sync with DB
  const saveUserToMongo = async (
    user: any,
    firebaseUser: any,
    name: string,
  ) => {
    const userInfo = {
      userId: user.uid || firebaseUser.uid,
      name: name || user.displayName || firebaseUser.displayName,
      email: user.email || firebaseUser.email,
      photo: user.photoURL || firebaseUser.photoURL || defaultPhoto,
      role: "user",
    };

    try {
      await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });
    } catch (err) {
      console.error("MongoDB Sync Error:", err);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      //  user make in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      //  user profile update (name & photo)
      await updateProfile(userCredential.user, {
        displayName: fullName,
        photoURL: defaultPhoto || "https://i.ibb.co.com/b57rQ40d/profile.png",
      });

      // data save in MongoDB
      await saveUserToMongo(userCredential.user, userCredential.user, fullName);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // PUT method will update if user exists, otherwise create new
      await saveUserToMongo(
        result.user,
        result.user,
        result.user.displayName || "",
      );

      router.push("/dashboard");
    } catch (err: any) {
      setError("Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-[#0A0C1B] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0C1B] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Radial Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, #4F46E533 0%, #0F172A 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, #4F46E533 0%, #0F172A 70%)",
          }}
        />
      </div>

      {/* Decorative Elements (Desktop Only) */}
      <div className="hidden lg:flex absolute left-[5%] top-1/2 -translate-y-1/2 flex-col items-center opacity-20 select-none pointer-events-none">
        <div className="w-32 h-44 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-xl flex items-center justify-center mb-4">
          <Briefcase className="w-12 h-12 text-orange-600" />
        </div>
        <span className="text-[10px] text-white font-bold uppercase tracking-[0.3em]">
          Smart Resume Analysis
        </span>
      </div>

      <div className="hidden lg:flex absolute right-[5%] top-1/2 -translate-y-1/2 flex-col items-center opacity-20 select-none pointer-events-none">
        <div className="w-40 h-40 bg-white/5 rounded-full border border-white/5 flex items-center justify-center mb-4 relative">
          <Sparkles className="w-12 h-12 text-orange-500" />
          <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-spin-slow" />
        </div>
        <span className="text-[10px] text-white font-bold uppercase tracking-[0.3em]">
          Career GPS
        </span>
      </div>

      {/* Signup Card */}
      <div className="w-full max-w-[480px] z-10">
        <div className="bg-[#161B22]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <Link href="/">
              <img
                src="/Gemini_Generated_Image_kk8hwqkk8hwqkk8h.png"
                alt="CareerPilot"
                className="h-12 w-auto object-contain mb-3"
              />
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Join CareerPilot
            </h1>
            <p className="text-gray-400 text-xs mt-2 font-medium">
              Professional Profile Creation
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-[10px] text-center mb-4 bg-red-500/10 py-2 rounded-lg border border-red-500/20 font-bold uppercase tracking-widest">
              {error}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#1C2128]/60 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/5 focus:border-primary focus:bg-[#1C2128] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full bg-[#1C2128]/60 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/5 focus:border-primary focus:bg-[#1C2128] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1C2128]/60 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/5 focus:border-primary focus:bg-[#1C2128] transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">
                  Confirm
                </label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                  <input
                    required
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1C2128]/60 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/5 focus:border-primary focus:bg-[#1C2128] transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 group disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Create My Account</span>
                  <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
              <span className="bg-[#0A0C1B] px-4 text-gray-600">
                Fast-track with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full bg-[#1C2128] hover:bg-[#252B33] text-white py-3.5 rounded-xl border border-white/5 flex items-center justify-center space-x-3 transition-all disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-4 h-4"
              alt="G"
            />
            <span className="text-sm font-semibold">Sign up with Google</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary font-bold hover:text-primary/90"
            >
              Login here
            </a>
          </p>
        </div>

        {/* Footer Badges */}
        <div className="flex justify-between px-4 mt-8 opacity-40">
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Secure</span>
            </div>
            <span className="text-[8px] text-gray-600 mt-1 uppercase">
              AES-256 Encryption
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              <Zap className="w-4 h-4 text-primary fill-current" />
              <span>AI Optimized</span>
            </div>
            <span className="text-[8px] text-gray-600 mt-1 uppercase">
              Neural Acceleration
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
