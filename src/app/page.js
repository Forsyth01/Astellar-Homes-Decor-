// ===== App.jsx or ModernFurnitureBlog.jsx (Main Component) =====
"use client"

import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { FloatingOrbs } from './components/FloatingOrbs';
import { HeroSection } from './components/HeroSection';
import { FeaturedSection } from './components/FeaturedSection';
import { BlogPostsSection } from './components/BlogPostsSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import Navbar from './components/Navbar';

const ModernFurnitureBlog = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 text-gray-900 overflow-hidden">
      <FloatingOrbs mousePosition={mousePosition} />
      {/* <Navigation /> */}
      <Navbar/>
      <HeroSection scrollY={scrollY} />
      <FeaturedSection />
      <BlogPostsSection />
      <Contact />
      <Footer />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernFurnitureBlog;