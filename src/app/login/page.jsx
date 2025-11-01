// ===== src/app/login/page.jsx =====
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Fixed import path
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, Home, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Failed to sign in');
    }
    
    setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-gray-900 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            Astellar Homes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-200/50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-600 hover:text-amber-700 transition-colors text-sm font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        </div>
      </div>
    </div>
    </>
  );
}