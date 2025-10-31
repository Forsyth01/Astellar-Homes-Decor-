"use client";

import { Menu, Search } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#faf8f6]/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Astellar Homes & <span className="text-amber-700">Decor</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="hover:text-amber-700 text-black transition">Home</Link>
          <Link href="/categories" className="hover:text-amber-700 text-black transition">Categories</Link>
          <Link href="/about" className="hover:text-amber-700 text-black transition">About</Link>
          <Link href="/contact" className="hover:text-amber-700 text-black transition">Contact</Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 text-gray-700 hover:text-amber-700 cursor-pointer" />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-1 border rounded-md border-gray-300 hover:border-amber-700 transition"
          >
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="flex flex-col items-start px-6 py-4 space-y-3">
            <Link href="/" className="hover:text-amber-700 text-black transition" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/categories" className="hover:text-amber-700 text-black transition" onClick={() => setOpen(false)}>Categories</Link>
            <Link href="/about" className="hover:text-amber-700 text-black transition" onClick={() => setOpen(false)}>About</Link>
            <Link href="/contact" className="hover:text-amber-700 text-black transition" onClick={() => setOpen(false)}>Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
