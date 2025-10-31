"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

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

  // Pagination logic
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Blog
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insights, stories, and updates from our team
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {blogs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</h2>
            <p className="text-gray-600">Check back soon for new content!</p>
          </div>
        ) : (
          <>
            {/* Blog Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentBlogs.map((blog) => (
                <Link key={blog.id} href={`/blog/${blog.id}`}>
                  <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full group hover:-translate-y-2 shadow-sm hover:shadow-xl">
                    {/* Cover Image */}
                    <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                      {blog.image ? (
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-3xl">
                            📝
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Date Badge */}
                      {blog.createdAt?.toDate && (
                        <div className="text-xs text-blue-600 font-semibold mb-3 uppercase tracking-wide">
                          {blog.createdAt.toDate().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}

                      {/* Blog Title */}
                      <h2 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 leading-snug">
                        {blog.title}
                      </h2>

                      {/* Read More Link */}
                      <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all">
                        Read Article
                        <span className="inline-block transform group-hover:translate-x-1 transition-transform ml-1">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white shadow-md"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-600 text-white shadow-lg scale-110"
                          : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
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
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-blue-600 hover:text-white shadow-md"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <p className="text-center text-gray-600 text-sm mt-6">
                Showing {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, blogs.length)} of {blogs.length} posts
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}