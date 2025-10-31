"use client";

import { ArrowRight, Sofa, Lamp, PenLine } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#faf8f6] text-gray-900">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-[#f2ede7]">
        <div className="absolute inset-0 bg-[url('/furniture-bg.jpg')] bg-cover bg-center opacity-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
          Discover Beautiful Furniture Ideas 
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
         Astellar Homes & Decor is all about creating beautiful, comfortable spaces that feel like home. I share amazing, real-life ideas for decorating, organizing, and adding those personal touches that make a space feel warm and lived in, from cozy interiors and DIY projects to eco-friendly living and stylish home offices. It’s where design meets everyday life, with a little bit of warmth and inspiration in every detail.
        </p>
        <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition">
          Read Latest Articles <ArrowRight size={18} />
        </button>
      </section>

      {/* FEATURED SECTION */}
      <section className="py-20 px-6 md:px-16">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <Sofa className="text-amber-600" /> Featured Furniture Picks
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:-translate-y-1 transition-transform"
            >
              <Image
                src={`/furniture-${item}.jpg`}
                alt={`Furniture ${item}`}
                width={500}
                height={350}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  Minimalist Living Room Setup
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how to combine wooden textures and neutral tones for a timeless home aesthetic.
                </p>
                <a
                  href="#"
                  className="text-amber-700 font-medium flex items-center gap-1 hover:underline"
                >
                  Read more <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT POSTS */}
      <section className="py-20 px-6 md:px-16 bg-[#f8f6f3]">
        <h2 className="text-3xl font-bold mb-10 flex items-center gap-2">
          <PenLine className="text-amber-600" /> Latest Blog Posts
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            >
              <Image
                src={`/furniture-${item}.jpg`}
                alt={`Post ${item}`}
                width={500}
                height={350}
                className="w-full h-60 object-cover"
              />
              <div className="p-5">
                <p className="text-sm uppercase text-gray-500 mb-2">Design Tips</p>
                <h3 className="text-lg font-semibold mb-3">
                  How to Pick the Perfect Sofa for Your Space
                </h3>
                <p className="text-gray-600 mb-4">
                  A short guide to choosing materials, shapes, and colors that suit your home’s vibe.
                </p>
                <a
                  href="#"
                  className="text-amber-700 flex items-center gap-1 font-medium hover:underline"
                >
                  Continue reading <ArrowRight size={16} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 bg-[#eee8e3] text-center text-gray-700">
        <div className="flex justify-center gap-3 mb-3">
          <Sofa className="text-gray-700" />
          <Lamp className="text-gray-700" />
        </div>
        <p>&copy; {new Date().getFullYear()} FurniBlog. All rights reserved.</p>
      </footer>
    </main>
  );
}
