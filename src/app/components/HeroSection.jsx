// ===== components/HeroSection.jsx =====
import React from 'react';
import { ArrowRight, Home, Heart, Leaf } from 'lucide-react';

export const HeroSection = ({ scrollY }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div 
          style={{
            opacity: Math.max(0, 1 - scrollY / 500),
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        >
          <div className="hidden md:absolute -top-16 left-10 animate-float">
            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-2xl shadow-xl">
              <Home className="text-amber-600" size={32} />
            </div>
          </div>
          <div className="hidden md:absolute -top-10 right-20 animate-float-delayed">
            <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-4 rounded-2xl shadow-xl">
              <Leaf className="text-emerald-600" size={32} />
            </div>
          </div>
          <div className="hidden md:absolute top-40 -right-10 animate-float">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl shadow-xl">
              <Heart className="text-blue-600" size={32} />
            </div>
          </div>

          <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
            <span className="text-amber-700 font-semibold text-sm">✨ Where Design Meets Everyday Life</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tighter tracking-tight">
            <span className="bg-gradient-to-r from-gray-900 via-amber-900 to-orange-900 bg-clip-text text-transparent">
              Beautiful Spaces
            </span>
            <br />
            <span className="text-gray-800">That Feel Like Home</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Creating comfortable spaces with real-life ideas for decorating, organizing, and adding personal touches. 
            From cozy interiors and DIY projects to eco-friendly living and stylish home offices.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16">
            <button className="group bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
              Explore Ideas
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="bg-white/80 backdrop-blur text-gray-800 px-8 py-4 rounded-full border-2 border-gray-200 hover:border-amber-600 hover:shadow-xl transition-all">
              Latest Posts
            </button>
          </div>
        </div>
      </div>

      {/* Bouncy scroll indicator - now below buttons */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-2 bg-amber-600 rounded-full" />
        </div>
      </div>
    </section>
  );
};