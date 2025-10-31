"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = { id: docSnap.id, ...docSnap.data() };
          setBlog(blogData);
          
          const words = blogData.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
          setReadingTime(Math.ceil(words / 200));
        } else {
          console.warn("No such blog found!");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading article...</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-900 text-xl mb-6 font-semibold">Blog not found.</p>
          <button
            onClick={() => router.push("/blog")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-medium"
          >
            Return to Blogs
          </button>
        </div>
      </div>
    );

  const formattedDate = blog.createdAt?.toDate
    ? blog.createdAt.toDate().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <main className="min-h-screen bg-white">
      {/* Header Navigation */}
      <nav className="border-b border-gray-200 sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Blogs</span>
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div>
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formattedDate}</span>
              </div>
              {readingTime > 0 && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-12 leading-tight break-words">
              {blog.title}
            </h1>

            {/* Content */}
            <div
              className="prose prose-base sm:prose-lg max-w-none
                [&>*]:text-gray-900
                [&_h2]:text-gray-900 [&_h2]:font-bold [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:leading-tight [&_h2]:break-words
                [&_h3]:text-gray-900 [&_h3]:font-bold [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:leading-snug [&_h3]:break-words
                [&_p]:text-gray-900 [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-base sm:[&_p]:text-lg [&_p]:break-words [&_p]:whitespace-pre-wrap
                [&_a]:text-blue-600 [&_a]:no-underline [&_a]:font-medium hover:[&_a]:underline [&_a]:break-all
                [&_strong]:text-gray-900 [&_strong]:font-semibold
                [&_em]:text-gray-900 [&_em]:italic
                [&_ul]:my-6 [&_ul]:space-y-2
                [&_ol]:my-6 [&_ol]:space-y-2
                [&_li]:text-gray-900 [&_li]:leading-relaxed [&_li]:break-words
                [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-900 [&_blockquote]:rounded-r-lg
                [&_code]:text-blue-700 [&_code]:bg-blue-50 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:break-all
                [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 sm:[&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words
                [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words
                [&_img]:rounded-xl [&_img]:my-8 [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto
                [&_figure]:my-8 [&_figure]:max-w-full
                [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-gray-600 [&_figcaption]:mt-3 [&_figcaption]:italic [&_figcaption]:break-words
                [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
                [&_th]:bg-gray-100 [&_th]:text-gray-900 [&_th]:font-semibold [&_th]:p-3 [&_th]:text-left [&_th]:border [&_th]:border-gray-300
                [&_td]:text-gray-900 [&_td]:p-3 [&_td]:border [&_td]:border-gray-300 [&_td]:break-words
                [&_hr]:my-10 [&_hr]:border-gray-300"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
      </article>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-gray-600 mb-6">
            Discover more insights and stories
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Articles
          </button>
        </div>
      </div>
    </main>
  );
}