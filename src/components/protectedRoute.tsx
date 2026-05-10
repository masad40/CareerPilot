"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login"); //USER NOT LOGGED IN, REDIRECT TO LOGIN PAGE
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0C1B]">
        <Loader2 className="animate-spin text-primary w-10 h-10" />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
