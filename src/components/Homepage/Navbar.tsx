"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Zap, ArrowRight, Sun, Moon } from "lucide-react";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Theme Logic
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  if (loading) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Roadmaps", href: "/dashboard/roadmap" },
    { name: "Mock Interview", href: "/dashboard/interview" },
    { name: "About", href: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4 md:py-6"
    >
      {/* Main Glass Container - Adjusted bg and border for light/dark visibility */}
      <div
        className="max-w-7xl mx-auto flex items-center justify-between 
backdrop-blur-xl 
bg-gradient-to-b from-background/95 to-background/70 
dark:from-background/90 dark:to-background/60 
rounded-2xl px-4 md:px-8 py-3 
border border-foreground/10 
shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
      >
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2 transition-all duration-300"
        >
          <img
            src="/Gemini_Generated_Image_kk8hwqkk8hwqkk8h.png"
            alt="CareerPilot"
            className="h-8 w-8 rounded-lg object-cover"
          />
          <span className="font-bold text-base tracking-tight text-foreground">CareerPilot</span>
        </Link>

        {/* Navigation: Hidden on Mobile */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 group"
              >
                <span
                  className={`relative z-10 text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-foreground/60 group-hover:text-foreground"
                  }`}
                >
                  {link.name}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-foreground/[0.03] rounded-lg border border-foreground/5"
                  />
                )}
                <div className="absolute bottom-1 left-4 right-4 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-foreground/5 transition-all outline-none"
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://i.ibb.co.com/b57rQ40d/profile.png"
                    }
                    alt="Profile"
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-foreground/10 group-hover:border-primary/50 transition-colors object-cover"
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-[-1]"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <motion.div
                        initial={{
                          opacity: 0,
                          scale: 0.9,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          y: 10,
                        }}
                        className="absolute right-0 mt-4 w-56 md:w-60 bg-background/95 backdrop-blur-2xl border border-foreground/10 rounded-2xl overflow-hidden shadow-2xl py-2 origin-top-right"
                      >
                        <div className="px-4 py-3 border-b border-foreground/5 bg-foreground/[0.02]">
                          <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-black mb-1">
                            Authenticated
                          </p>
                          <p className="text-xs text-foreground/50 truncate font-mono">
                            {user.email}
                          </p>
                        </div>
                        <DropdownItem
                          href="/dashboard"
                          label="Dashboard"
                          icon="dashboard"
                          onClick={() => setIsDropdownOpen(false)}
                        />
                        <DropdownItem
                          href="/dashboard/profile"
                          label="Profile Settings"
                          icon="person"
                          onClick={() => setIsDropdownOpen(false)}
                        />

                        <hr className="border-foreground/5 my-1" />

                        {/* Theme Toggle */}
                        <button
                          onClick={toggleTheme}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 hover:bg-foreground/[0.03] transition-all font-semibold"
                        >
                          {theme === "dark" ? (
                            <Sun size={18} className="text-primary" />
                          ) : (
                            <Moon size={18} className="text-primary" />
                          )}
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </button>

                        <hr className="border-foreground/5 my-1" />

                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-all font-bold group"
                        >
                          <span className="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">
                            logout
                          </span>
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1 md:gap-2">
              {/* Theme Toggle for Guest View */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10 transition-all"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                href="/login"
                className="group relative px-3 md:px-5 py-2 flex items-center justify-center transition-all duration-300"
              >
                <div className="absolute inset-0 bg-foreground/[0.03] rounded-full scale-75 opacity-0 blur-sm group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 border border-foreground/5" />
                <span className="relative z-10 text-xs md:text-sm font-bold text-foreground/50 group-hover:text-foreground transition-colors duration-300 flex items-center gap-1">
                  Login
                </span>
              </Link>

              <Link
                href="/signup"
                className="group relative px-4 md:px-6 py-2 md:py-2.5 rounded-xl transition-all active:scale-95 overflow-hidden border border-foreground/10 flex items-center justify-center"
              >
                <div className="absolute inset-0 bg-foreground/[0.05] backdrop-blur-md group-hover:bg-foreground/[0.1] transition-colors duration-300" />
                <span className="relative z-10 flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-[0.15em] text-foreground">
                  Get Started
                  <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function DropdownItem({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon?: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="block group">
      <span className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-foreground/70 hover:bg-foreground/[0.03] hover:text-primary transition-all">
        {icon && (
          <span className="material-symbols-outlined text-lg opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
            {icon}
          </span>
        )}
        {label}
      </span>
    </Link>
  );
}