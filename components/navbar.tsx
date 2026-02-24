"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 border-b border-slate-200 print:hidden">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 max-w-7xl">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group">
            <img
              src="/logo.png"
              alt="ATScV Logo"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/builder"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700 relative group"
            >
              Resume Builder
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/optimizer"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-teal-700 relative group"
            >
              Optimizer
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link
              href="/ats-checker"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700 relative group"
            >
              ATS Checker
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full"></span>
            </Link>
          </nav>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-3">
            <Button
              variant="ghost"
              asChild
              className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-none px-5"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-none px-6 font-semibold shadow-md shadow-emerald-500/10 transition-all border-0"
            >
              <Link href="/register">Sign up</Link>
            </Button>
          </nav>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-600 hover:text-emerald-700 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl flex flex-col transition-all duration-300 ease-in-out origin-top",
          mobileMenuOpen
            ? "opacity-100 scale-y-100 py-4"
            : "opacity-0 scale-y-0 h-0 py-0 overflow-hidden pointer-events-none",
        )}
      >
        <div className="px-6 flex flex-col space-y-4">
          <Link
            href="/builder"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-emerald-700 transition-colors py-2 border-b border-slate-100"
          >
            Resume Builder
          </Link>
          <Link
            href="/optimizer"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-teal-700 transition-colors py-2 border-b border-slate-100"
          >
            Optimizer
          </Link>
          <Link
            href="/ats-checker"
            onClick={() => setMobileMenuOpen(false)}
            className="text-base font-medium text-slate-600 hover:text-cyan-700 transition-colors py-2 border-b border-slate-100"
          >
            ATS Checker
          </Link>

          <div className="flex flex-col gap-3 pt-2 pb-2">
            <Button
              variant="outline"
              asChild
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-none"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              onClick={() => setMobileMenuOpen(false)}
              className="w-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 active:scale-[0.98] border-0 rounded-none shadow-md"
            >
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
