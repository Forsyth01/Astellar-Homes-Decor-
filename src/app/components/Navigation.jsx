// ===== components/Navigation.jsx =====
import React from 'react';
import { Sparkles } from 'lucide-react';

export const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-600" size={28} />
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Astellar
          </span>
        </div>
        <div className="flex gap-8 items-center">
          <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a>
          <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">Blog</a>
          <a href="#" className="text-gray-700 hover:text-amber-600 transition-colors">About</a>
          <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full hover:shadow-lg hover:scale-105 transition-all">
            Subscribe
          </button>
        </div>
      </div>
    </nav>
  );
};