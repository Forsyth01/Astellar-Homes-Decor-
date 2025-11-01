// ===== app/not-found.jsx =====
"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          {/* Animated 404 */}
          <div className="relative mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="text-9xl font-bold text-gray-900 mb-4"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-4 -right-4"
            >
              {/* <Sparkles className="w-12 h-12 text-amber-500 animate-pulse" /> */}
            </motion.div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into the design cosmos. 
            Let's get you back to beautiful spaces.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/"
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-amber-200/50 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Home
          </Link>
          
          <Link
            href="/blog"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:border-amber-500 hover:text-amber-700 transition-all duration-300 flex items-center gap-2 group"
          >
            <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Explore Blog
          </Link>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 max-w-md mx-auto"
        >
          <h3 className="font-semibold text-gray-900 mb-2">Looking for something specific?</h3>
          <p className="text-gray-600 text-sm mb-4">
            Check out our popular sections or use the search to find what you need.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/categories" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              Categories
            </Link>
            <Link href="/about" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-amber-600 hover:text-amber-700 text-sm font-medium">
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}