// ===== components/Footer.jsx =====
import React from 'react';
import { Sparkles, Sofa, Lamp, Home } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-amber-500" size={32} />
              <span className="text-2xl font-bold">Astellar</span>
              <span className="">Homes & Decor</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Creating beautiful, comfortable spaces that feel like home. Design meets everyday life with warmth and inspiration.
            </p>
            <div className="flex gap-4">
              <Sofa className="text-amber-500" />
              <Lamp className="text-amber-500" />
              <Home className="text-amber-500" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-amber-500 transition-colors">Interior Design</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">DIY Projects</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Eco-Friendly</a></li>
              <li><a href="#" className="hover:text-amber-500 transition-colors">Home Office</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Astellar Homes & Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};