// ===== app/about/page.jsx =====
"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  Home, 
  Sparkles, 
  Palette, 
  Leaf, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Quote
} from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const values = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Comfort First",
      description: "Creating spaces that feel like a warm embrace, where every corner invites you to relax and be yourself.",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Everyday Magic",
      description: "Finding the extraordinary in ordinary spaces through thoughtful details and personal touches.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainable Beauty",
      description: "Embracing eco-friendly choices that are kind to our planet while creating beautiful living spaces.",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Real Life Inspired",
      description: "Design solutions that work for real families, real schedules, and real everyday moments.",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const stats = [
    { number: "100+", label: "Homes Transformed" },
    { number: "5K+", label: "Community Members" },
    { number: "200+", label: "DIY Projects" },
    { number: "50+", label: "Design Guides" }
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200 mb-8"
          >
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
            <span className="text-amber-700 font-medium text-sm">Our Story</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tighter"
          >
            Welcome to
            <span className="block text-amber-600">Astellar Homes & Decor</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Where design meets everyday life, with a little bit of warmth and inspiration in every detail.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-200 rounded-full opacity-50"></div>
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-200 rounded-full opacity-50"></div>
                <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-sm">
                  <Quote className="w-12 h-12 text-amber-400 mb-6" />
                  <p className="text-2xl md:text-3xl font-light text-gray-800 leading-relaxed mb-6">
                    Astellar Homes & Decor is all about creating beautiful, comfortable spaces that feel like home.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    I share amazing, real-life ideas for decorating, organizing, and adding those personal touches that make a space feel warm and lived in, from cozy interiors and DIY projects to eco-friendly living and stylish home offices.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Creative Design</h3>
                  <p className="text-sm text-gray-600">Unique, personalized solutions for every space</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Eco-Friendly</h3>
                  <p className="text-sm text-gray-600">Sustainable choices for beautiful living</p>
                </div>
              </div>
              
              <div className="space-y-6 mt-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">DIY Projects</h3>
                  <p className="text-sm text-gray-600">Achievable projects for real homes</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Touch</h3>
                  <p className="text-sm text-gray-600">Spaces that tell your unique story</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide every project, every idea, and every story we share.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-amber-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-12 text-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Space?</h2>
              <p className="text-amber-100 text-xl mb-8 max-w-2xl mx-auto">
                Join our community and discover how to create a home that truly reflects your personality and lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/blog"
                  className="bg-white text-amber-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
                >
                  Explore Our Stories
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Get In Touch
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}
