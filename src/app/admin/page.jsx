"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { PlusCircle, Edit2, Trash2, Calendar, Eye, Search, LayoutGrid, List } from "lucide-react";

export default function AdminPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
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
    fetchBlogs();
  }, []);

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

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your blog posts</p>
            </div>

            <Link
              href="/admin/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-5 h-5" />
              Create New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{blogs.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <LayoutGrid className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{blogs.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Latest Post</p>
                <p className="text-sm font-semibold text-gray-900 mt-1 truncate">
                  {blogs[0]?.createdAt?.toDate
                    ? blogs[0].createdAt.toDate().toLocaleDateString()
                    : "No posts yet"}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and View Toggle */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search blog posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blogs...</p>
            </div>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-600 text-lg mb-2">
              {searchTerm ? "No posts found" : "No blog posts yet"}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              {searchTerm ? "Try a different search term" : "Start by creating your first post"}
            </p>
            {!searchTerm && (
              <Link
                href="/admin/create"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
                Create First Post
              </Link>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-4xl opacity-50">📝</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {blog.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {blog.createdAt?.toDate
                        ? blog.createdAt.toDate().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unknown date"}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/edit/${blog.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(blog.id)}
                      disabled={deleting === blog.id}
                      className={`flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors ${
                        deleting === blog.id ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      {deleting === blog.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm">
                    TITLE
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm hidden md:table-cell">
                    DATE CREATED
                  </th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-700 text-sm">
                    ACTIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <tr
                    key={blog.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === filteredBlogs.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
                          {blog.image ? (
                            <Image
                              src={blog.image}
                              alt={blog.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-xl">
                              📝
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">
                            {blog.title}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-600 text-sm hidden md:table-cell">
                      {blog.createdAt?.toDate
                        ? blog.createdAt.toDate().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/edit/${blog.id}`}
                          className="inline-flex items-center gap-1 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </Link>

                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={deleting === blog.id}
                          className={`inline-flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm ${
                            deleting === blog.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleting === blog.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}