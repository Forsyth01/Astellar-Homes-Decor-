// ===== components/BlogPage.jsx =====
"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, Clock, ArrowRight, Search, X, Filter, Sparkles } from "lucide-react";

// Create a client component that uses useSearchParams
function BlogContent() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const blogsPerPage = 9;

  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchFromUrl = searchParams.get('search');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogs(posts);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [categoryFromUrl, searchFromUrl]);

  // Extract unique categories from ALL blogs (not filtered ones)
  const categories = useMemo(() => {
    const categorySet = new Set();
    
    blogs.forEach(blog => {
      if (blog.category && typeof blog.category === 'string') {
        const cleanCategory = blog.category.trim();
        if (cleanCategory) {
          categorySet.add(cleanCategory);
        }
      }
    });
    
    const uniqueCategories = Array.from(categorySet).sort();
    return ["all", ...uniqueCategories];
  }, [blogs]);

  // Filter blogs based on search query and category
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesSearch = blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blog.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || blog.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [blogs, searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  // Dynamic header content based on filters
  const getHeaderContent = () => {
    if (searchQuery && selectedCategory !== "all") {
      return {
        badge: "Filtered Results",
        title: `"${searchQuery}" in ${selectedCategory}`,
        subtitle: `Discover ${filteredBlogs.length} stories matching your search in ${selectedCategory} category`
      };
    }
    
    if (searchQuery) {
      return {
        badge: "Search Results",
        title: `Results for "${searchQuery}"`,
        subtitle: `Found ${filteredBlogs.length} inspiring stories matching your search`
      };
    }
    
    if (selectedCategory !== "all") {
      return {
        badge: selectedCategory,
        title: `${selectedCategory} Stories`,
        subtitle: `Explore ${filteredBlogs.length} curated stories about ${selectedCategory.toLowerCase()}`
      };
    }
    
    // Default header
    return {
      badge: "Latest Inspiration",
      title: "Design Chronicles",
      highlight: "Redefining Space",
      subtitle: "Explore the art of intentional living through design stories, practical tips, and visual journeys that transform houses into homes."
    };
  };

  const headerContent = getHeaderContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 font-light">Curating beautiful stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Dynamic Enhanced Header */}
      <div className="relative overflow-hidden bg-white border-b border-gray-100">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-48 h-48 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-20" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 pt-20 text-center">
          {/* Dynamic Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-amber-200 mb-8">
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></div>
            <span className="text-amber-700 font-medium text-sm">{headerContent.badge}</span>
          </div>
          
          {/* Dynamic Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tighter">
            {headerContent.title}
            {headerContent.highlight && (
              <span className="block text-amber-600">{headerContent.highlight}</span>
            )}
          </h1>
          
          {/* Dynamic Subtitle */}
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
            {headerContent.subtitle}
          </p>

          {/* Quick Stats */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'}
              </div>
              {selectedCategory !== "all" && (
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200">
                  <Filter className="w-4 h-4 text-amber-600" />
                  {selectedCategory}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-72 h-72 bg-amber-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
        </div>

        {/* Search and Filter Section */}
        <div className="relative mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Input */}
              <div className="flex-1 w-full lg:max-w-md">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={selectedCategory !== "all" ? 
                      `Search in ${selectedCategory}...` : 
                      "Search stories, tips, inspiration..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex items-center gap-2 text-gray-600 font-medium">
                  <Filter className="w-4 h-4" />
                  Filter by:
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 text-gray-900 appearance-none cursor-pointer pr-10"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Results Count */}
              <div className="text-sm text-gray-600 font-medium bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                {filteredBlogs.length} {filteredBlogs.length === 1 ? 'story' : 'stories'} found
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || selectedCategory !== "all") && (
              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                {searchQuery && (
                  <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                {selectedCategory !== "all" && (
                  <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm border border-green-200">
                    Category: {selectedCategory}
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <button
                  onClick={clearSearch}
                  className="ml-auto text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {blogs.length === 0 ? (
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
            <div className="text-6xl mb-6">🏡</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              We're working on some beautiful content to inspire your next home project.
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-20 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No stories found</h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-8">
              We couldn't find any stories matching your search. Try different keywords or clear your filters.
            </p>
            <button
              onClick={clearSearch}
              className="bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-amber-200/50 flex items-center gap-2 mx-auto"
            >
              <X className="w-4 h-4" />
              Clear Search
            </button>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {currentBlogs.map((blog, index) => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <article 
                    className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 transition-all duration-500 flex flex-col h-full hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                  >
                    {/* Image Container */}
                    <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                            ✨
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Date Badge */}
                      {blog.createdAt?.toDate && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium text-gray-700">
                          <Calendar className="w-3 h-3 text-amber-600" />
                          {blog.createdAt.toDate().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Category Tag */}
                      <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium mb-4 self-start border border-amber-200">
                        <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                        {blog.category || "Design Tips"}
                      </div>

                      {/* Blog Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-amber-700 transition-colors">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {blog.excerpt || "Discover how to transform your space with practical design ideas and inspiration..."}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            5 min read
                          </div>
                        </div>
                        <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                          Read Story
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-200/50 transition-all duration-300 pointer-events-none"></div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="relative">
                {/* Page Info */}
                <div className="text-center mb-8">
                  <p className="text-gray-600 font-light">
                    Showing <span className="font-semibold text-gray-900">{indexOfFirstBlog + 1}-{Math.min(indexOfLastBlog, filteredBlogs.length)}</span> of{" "}
                    <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> inspiring stories
                    {searchQuery && (
                      <span className="text-amber-600"> for "{searchQuery}"</span>
                    )}
                    {selectedCategory !== "all" && !searchQuery && (
                      <span className="text-amber-600"> in {selectedCategory}</span>
                    )}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-amber-600 hover:text-white shadow-lg hover:shadow-amber-200/50 border border-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? "bg-amber-600 text-white shadow-lg scale-105"
                            : "text-gray-700 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-amber-600 hover:text-white shadow-lg hover:shadow-amber-200/50 border border-gray-200"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Main BlogPage component with Suspense boundary
export default function BlogPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 font-light">Loading blog...</p>
        </div>
      </div>
    }>
      <BlogContent />
    </Suspense>
  );
}