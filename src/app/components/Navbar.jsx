"use client";

import { Menu, X, ChevronDown, Sparkles, Home, User, Phone, BookOpen } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const navLinks = [
    { href: "/", label: "Home", icon: <Home className="w-4 h-4" /> },
    { href: "/about", label: "About", icon: <User className="w-4 h-4" /> },
    { href: "/blog", label: "Blog", icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Extract unique categories
        const categorySet = new Set();
        posts.forEach((blog) => {
          if (blog.category && typeof blog.category === "string") {
            const cleanCategory = blog.category.trim();
            if (cleanCategory) {
              categorySet.add(cleanCategory);
            }
          }
        });

        const uniqueCategories = Array.from(categorySet).sort();
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleCategoryClick = (category) => {
    setCategoriesOpen(false);
    setMobileOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100/50 shadow-lg" 
          : "bg-white/70 backdrop-blur-xl border-b border-gray-100/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 p relative z-10"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="relative"
            >
              <img
                src="/Astellar_Homes_Logo.png"
                alt="Astellar Homes & Decor"
                className="h-30 md:h-35 transition-all duration-300"
              />
              <div className="" />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${
                    isActive(link.href)
                      ? "text-amber-700 bg-amber-50/80"
                      : "text-gray-600 hover:text-amber-700 hover:bg-white/50"
                  }`}
              >
                <span className={`transition-colors duration-300 ${
                  isActive(link.href) ? "text-amber-600" : "text-gray-400 group-hover:text-amber-500"
                }`}>
                  {link.icon}
                </span>
                {link.label}
                
                {isActive(link.href) && (
                  <motion.div
                    layoutId="desktop-active-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-100/50 to-orange-100/30 border border-amber-200/50 -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setCategoriesOpen(true)}
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${
                    categoriesOpen || pathname.startsWith("/blog")
                      ? "text-amber-700 bg-amber-50/80"
                      : "text-gray-600 hover:text-amber-700 hover:bg-white/50"
                  }`}
              >
                <Sparkles className={`w-4 h-4 transition-colors duration-300 ${
                  categoriesOpen ? "text-amber-600" : "text-gray-400 group-hover:text-amber-500"
                }`} />
                Categories
                <motion.div
                  animate={{ rotate: categoriesOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>

                {(categoriesOpen || pathname.startsWith("/blog")) && (
                  <motion.div
                    layoutId="categories-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-100/50 to-orange-100/30 border border-amber-200/50 -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
                    onMouseLeave={() => setCategoriesOpen(false)}
                  >
                    <div className="p-3">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100/50">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Explore Categories</p>
                          <p className="text-xs text-gray-500">Find your inspiration</p>
                        </div>
                        {loading && (
                          <div className="ml-auto w-4 h-4 border-2 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                        )}
                      </div>

                      {/* Categories List */}
                      <div className="space-y-1 max-h-64 overflow-y-auto">
                        {loading ? (
                          Array.from({ length: 5 }).map((_, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg animate-pulse"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-xl" />
                              <div className="space-y-1 flex-1">
                                <div className="h-3 bg-gray-200 rounded w-20" />
                                <div className="h-2 bg-gray-200 rounded w-16" />
                              </div>
                            </div>
                          ))
                        ) : categories.length > 0 ? (
                          categories.map((category, index) => (
                            <motion.div
                              key={category}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={`/blog?category=${encodeURIComponent(category)}`}
                                onClick={() => handleCategoryClick(category)}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-amber-50/50 hover:text-amber-700 transition-all duration-200 group"
                              >
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center group-hover:from-amber-200 group-hover:to-orange-200 transition-colors">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                                </div>
                                <div>
                                  <p className="font-medium">{category}</p>
                                  <p className="text-xs text-gray-500">Explore stories</p>
                                </div>
                              </Link>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No categories yet</p>
                          </div>
                        )}
                      </div>

                      {/* View All Link */}
                      <div className="pt-3 mt-3 border-t border-gray-100/50">
                        <Link
                          href="/blog"
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50/50 rounded-lg transition-all duration-200 group"
                        >
                          <BookOpen className="w-4 h-4" />
                          View All Posts
                          <ChevronDown className="w-4 h-4 rotate-270" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Contact Link */}
            <Link
              href="/#contact"
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group
                ${
                  isActive("/#contact")
                    ? "text-amber-700 bg-amber-50/80"
                    : "text-gray-600 hover:text-amber-700 hover:bg-white/50"
                }`}
            >
              <span className={`transition-colors duration-300 ${
                isActive("/#contact") ? "text-amber-600" : "text-gray-400 group-hover:text-amber-500"
              }`}>
                <Phone className="w-4 h-4" />
              </span>
              Contact
              
              {isActive("/#contact") && (
                <motion.div
                  layoutId="desktop-active-indicator-contact"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-100/50 to-orange-100/30 border border-amber-200/50 -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-amber-700 hover:bg-white/50 transition-colors relative"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                    ${
                      isActive(link.href)
                        ? "text-amber-700 bg-amber-50/50"
                        : "text-gray-600 hover:text-amber-700 hover:bg-gray-50/50"
                    }`}
                >
                  <span className={`transition-colors duration-200 ${
                    isActive(link.href) ? "text-amber-600" : "text-gray-400"
                  }`}>
                    {link.icon}
                  </span>
                  {link.label}
                </Link>
              ))}

              {/* Mobile Categories */}
              <div className="border-t border-gray-100/50 pt-4">
                <div className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Categories
                </div>
                
                <div className="pl-4 space-y-1 max-h-48 overflow-y-auto">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="h-10 bg-gray-200 rounded-xl animate-pulse" />
                    ))
                  ) : categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category}
                        href={`/blog?category=${encodeURIComponent(category)}`}
                        onClick={() => handleCategoryClick(category)}
                        className="block px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-amber-700 hover:bg-amber-50/50 transition-all duration-200"
                      >
                        {category}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500 text-center">
                      No categories yet
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Contact Link */}
              <div className="border-t border-gray-100/50 pt-2">
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200
                    ${
                      isActive("/contact")
                        ? "text-amber-700 bg-amber-50/50"
                        : "text-gray-600 hover:text-amber-700 hover:bg-gray-50/50"
                    }`}
                >
                  <span className={`transition-colors duration-200 ${
                    isActive("/contact") ? "text-amber-600" : "text-gray-400"
                  }`}>
                    <Phone className="w-4 h-4" />
                  </span>
                  Contact
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}