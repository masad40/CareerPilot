"use client";
import React, { useState } from "react";
import { auth } from "@/firebase/firebase.config";
import { sendPasswordResetEmail } from "firebase/auth";
import {
  Mail,
  ArrowLeft,
  Loader2,
  Send,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "A password reset link has been sent to your email. Please check your inbox or spam folder.",
      );
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("No account found with this email address.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C1B] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{
            background: "radial-gradient(circle, #4F46E522 0%, #0F172A 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-[#161B22]/40 backdrop-blur-2xl border border-white/10 rounded-[32px] p-10 shadow-2xl text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <p className="text-green-500 text-xs font-medium leading-relaxed">
                {message}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-[10px] text-center mb-6 bg-red-500/10 py-2 rounded-lg border border-red-500/20 font-bold uppercase tracking-widest">
              {error}
            </p>
          )}

          {!message ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2 text-left">
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
                    placeholder="example@gmail.com"
                    className="w-full bg-[#1C2128]/60 text-white rounded-xl py-3.5 pl-12 pr-4 outline-none border border-white/5 focus:border-primary/50 transition-all"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/80 text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/30 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" /> <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="inline-block mt-4 text-orange-500 font-bold hover:text-orange-400 transition-colors text-sm"
            >
              Back to Login
            </Link>
          )}

          <div className="mt-8 pt-6 border-t border-white/5">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
