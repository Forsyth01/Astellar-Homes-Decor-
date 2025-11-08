// app/admin/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from "firebase/firestore";
import { 
  PlusCircle, 
  Edit2, 
  Trash2, 
  Calendar, 
  Eye, 
  Search, 
  LayoutGrid, 
  List,
  TrendingUp,
  FileText,
  ArrowUpRight,
  BarChart3,
  Clock,
  Tag,
  FileEdit,
  Upload,
  CheckCircle
} from "lucide-react";
import CategoriesManager from "@/app/components/CategoriesManager";
import AdminRoute from "../components/AdminRoute";

export default function AdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = [];
      querySnapshot.forEach((doc) => {
        categoriesData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      categoriesData.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      setDeleting(id);
      await deleteDoc(doc(db, "blogs", id));
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id) => {
    if (!confirm("Are you sure you want to publish this draft?")) return;

    try {
      setPublishing(id);
      await updateDoc(doc(db, "blogs", id), {
        status: "published",
        publishedAt: new Date()
      });
      
      setBlogs((prev) => 
        prev.map((blog) => 
          blog.id === id 
            ? { ...blog, status: "published", publishedAt: new Date() }
            : blog
        )
      );
      
      alert("✅ Draft published successfully!");
    } catch (error) {
      console.error("Error publishing draft:", error);
      alert("Failed to publish draft. Please try again.");
    } finally {
      setPublishing(null);
    }
  };

  const filteredBlogs = blogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((blog) => 
      selectedCategory === "all" || blog.category === selectedCategory
    )
    .filter((blog) => {
      if (statusFilter === "all") return true;
      return blog.status === statusFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (b.createdAt?.toDate?.() || 0) - (a.createdAt?.toDate?.() || 0);
      } else if (sortBy === "oldest") {
        return (a.createdAt?.toDate?.() || 0) - (b.createdAt?.toDate?.() || 0);
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  const stats = {
    totalPosts: blogs.length,
    published: blogs.filter(b => b.status === "published").length,
    drafts: blogs.filter(b => b.status === "draft").length,
    totalCategories: categories.length
  };

  return (
    <AdminRoute>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Content Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Manage and analyze your blog content
              </p>
            </div>

            <Link
              href="/admin/create"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all hover:shadow-lg transform hover:-translate-y-0.5 shadow-lg shadow-blue-500/30 text-sm sm:text-base"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>New Article</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Total</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                <p className="text-green-600 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  All posts
                </p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-2.5 lg:p-3 rounded-lg self-start sm:self-auto">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Published</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.published}</p>
                <p className="text-green-600 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  Live
                </p>
              </div>
              <div className="bg-green-100 p-2 sm:p-2.5 lg:p-3 rounded-lg self-start sm:self-auto">
                <Upload className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Drafts</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.drafts}</p>
                <p className="text-orange-600 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1">
                  <FileEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                  Pending
                </p>
              </div>
              <div className="bg-orange-100 p-2 sm:p-2.5 lg:p-3 rounded-lg self-start sm:self-auto">
                <FileEdit className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-3 sm:p-4 lg:p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <p className="text-gray-600 text-xs sm:text-sm font-medium mb-1">Categories</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalCategories}</p>
                <p className="text-purple-600 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 sm:w-4 sm:h-4" />
                  Active
                </p>
              </div>
              <div className="bg-purple-100 p-2 sm:p-2.5 lg:p-3 rounded-lg self-start sm:self-auto">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            {/* Controls */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
                  />
                </div>

                {/* Filters Row */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3 flex-1">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-xs sm:text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Drafts</option>
                    </select>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-xs sm:text-sm"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-xs sm:text-sm col-span-2 sm:col-span-1"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="title">Title A-Z</option>
                    </select>
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg sm:rounded-xl self-start sm:self-auto">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md sm:rounded-lg transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md sm:rounded-lg transition-all ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      <List className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Showing <span className="font-semibold text-gray-900">{filteredBlogs.length}</span> of{" "}
                  <span className="font-semibold text-gray-900">{blogs.length}</span> articles
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium self-start sm:self-auto"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm sm:text-base">Loading your content...</p>
                </div>
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm p-8 sm:p-12 lg:p-16 text-center border border-gray-100">
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">📊</div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {searchTerm || statusFilter !== "all" ? "No articles found" : "Ready to create?"}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter !== "all"
                    ? "No articles match your search criteria. Try adjusting your filters."
                    : "Start building your audience with engaging content. Create your first article to get started."
                  }
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link
                    href="/admin/create"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all hover:shadow-lg shadow-lg shadow-blue-500/30 text-sm sm:text-base"
                  >
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    Create Your First Article
                  </Link>
                )}
              </div>
            ) : viewMode === "grid" ? (
              // Grid View
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                  >
                    {/* Image */}
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-500/10 to-purple-600/10 overflow-hidden">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-lg sm:rounded-2xl flex items-center justify-center text-blue-600">
                            <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
                          </div>
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                          blog.status === "published" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-orange-100 text-orange-700"
                        }`}>
                          {blog.status === "published" ? <CheckCircle className="w-3 h-3" /> : <FileEdit className="w-3 h-3" />}
                          <span className="hidden sm:inline">{blog.status === "published" ? "Published" : "Draft"}</span>
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {blog.views || 0}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 lg:p-6">
                      <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                        {blog.category && (
                          <span className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {blog.category}
                          </span>
                        )}
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.ceil((blog.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0) / 200)}m
                        </span>
                      </div>

                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                        {blog.title}
                      </h3>

                      {blog.excerpt && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                          {blog.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-gray-500 text-xs mb-3 sm:mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {blog.createdAt?.toDate
                            ? blog.createdAt.toDate().toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "—"}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        {blog.status === "draft" && (
                          <button
                            onClick={() => handlePublish(blog.id)}
                            disabled={publishing === blog.id}
                            className={`flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                              publishing === blog.id ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                            {publishing === blog.id ? "..." : <span className="hidden sm:inline">Publish</span>}
                          </button>
                        )}
                        
                        <Link
                          href={`/admin/edit/${blog.id}`}
                          className={`${blog.status === "draft" ? "flex-1" : "flex-1"} flex items-center justify-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm`}
                        >
                          <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={deleting === blog.id}
                          className={`flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 sm:px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
                            deleting === blog.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          {deleting === blog.id ? "..." : <span className="hidden sm:inline">Delete</span>}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // List View
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-3 sm:px-4 lg:px-6 font-semibold text-gray-700 text-xs sm:text-sm">ARTICLE</th>
                        <th className="text-left py-3 px-3 sm:px-4 lg:px-6 font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">STATUS</th>
                        <th className="text-left py-3 px-3 sm:px-4 lg:px-6 font-semibold text-gray-700 text-xs sm:text-sm hidden lg:table-cell">CATEGORY</th>
                        <th className="text-left py-3 px-3 sm:px-4 lg:px-6 font-semibold text-gray-700 text-xs sm:text-sm hidden xl:table-cell">CREATED</th>
                        <th className="text-right py-3 px-3 sm:px-4 lg:px-6 font-semibold text-gray-700 text-xs sm:text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBlogs.map((blog, index) => (
                        <tr
                          key={blog.id}
                          className={`border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${
                            index === filteredBlogs.length - 1 ? "border-b-0" : ""
                          }`}
                        >
                          <td className="py-3 px-3 sm:px-4 lg:px-6">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex-shrink-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 overflow-hidden">
                                {blog.image ? (
                                  <Image
                                    src={blog.image}
                                    alt={blog.title}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-blue-600">
                                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900 line-clamp-1 mb-1 text-xs sm:text-sm lg:text-base">
                                  {blog.title}
                                </p>
                                {blog.excerpt && (
                                  <p className="text-gray-600 text-xs line-clamp-1 hidden sm:block">
                                    {blog.excerpt}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 sm:px-4 lg:px-6 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              blog.status === "published" 
                                ? "bg-green-100 text-green-700" 
                                : "bg-orange-100 text-orange-700"
                            }`}>
                              {blog.status === "published" ? <CheckCircle className="w-3 h-3" /> : <FileEdit className="w-3 h-3" />}
                              {blog.status === "published" ? "Published" : "Draft"}
                            </span>
                          </td>

                          <td className="py-3 px-3 sm:px-4 lg:px-6 text-gray-600 text-xs sm:text-sm hidden lg:table-cell">
                            {blog.category ? (
                              <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {blog.category}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>

                          <td className="py-3 px-3 sm:px-4 lg:px-6 text-gray-600 text-xs sm:text-sm hidden xl:table-cell">
                            {blog.createdAt?.toDate
                              ? blog.createdAt.toDate().toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </td>

                          <td className="py-3 px-3 sm:px-4 lg:px-6">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              {blog.status === "draft" && (
                                <button
                                  onClick={() => handlePublish(blog.id)}
                                  disabled={publishing === blog.id}
                                  className={`inline-flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors text-xs ${
                                    publishing === blog.id ? "opacity-50 cursor-not-allowed" : ""
                                  }`}
                                  title="Publish"
                                >
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span className="hidden lg:inline">{publishing === blog.id ? "..." : "Publish"}</span>
                                </button>
                              )}

                              {blog.status === "published" && (
                                <Link
                                  href={`/blog/${blog.id}`}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-1 sm:p-2 rounded-lg transition-colors"
                                  title="View live"
                                >
                                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                </Link>
                              )}
                              
                              <Link
                                href={`/admin/edit/${blog.id}`}
                                className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors text-xs"
                                title="Edit"
                              >
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden lg:inline">Edit</span>
                              </Link>

                              <button
                                onClick={() => handleDelete(blog.id)}
                                disabled={deleting === blog.id}
                                className={`inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg font-medium transition-colors text-xs ${
                                  deleting === blog.id ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden lg:inline">{deleting === blog.id ? "..." : "Delete"}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <CategoriesManager onCategoryUpdate={fetchCategories} />
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminRoute>
  );
}