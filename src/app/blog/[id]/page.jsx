"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams, useRouter } from "next/navigation";
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Share2,
  User
} from "lucide-react";

export default function BlogDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;

      try {
        const docRef = doc(db, "blogs", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const blogData = { id: docSnap.id, ...docSnap.data() };
          setBlog(blogData);
          
          // Calculate reading time
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

  const handleShare = async (platform = null) => {
    const url = window.location.href;
    const title = blog.title;

    if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: blog.excerpt || 'Check out this amazing article!',
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled:", err);
      }
    } else {
      setShowShareModal(true);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-amber-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 text-lg mt-4 font-light">Loading your inspiration...</p>
        </div>
      </div>
    );

  if (!blog)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="text-center p-12 max-w-md mx-4">
          <div className="text-6xl mb-6">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Story Not Found</h2>
          <p className="text-gray-600 mb-8">
            The design story you're looking for seems to have wandered off. Let's find you some new inspiration.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="w-full bg-amber-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-amber-200/50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Explore More Stories
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
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push("/blog")}
            className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-300 font-medium group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Stories</span>
          </button>
          
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-xl transition-all duration-300"
          >
            <Share2 className="w-5 h-5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </nav>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Article Header */}
        <div className="mb-12">
          {/* Category */}
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-sm font-medium border border-amber-200 mb-6">
            <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
            {blog.category || "Design Inspiration"}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Excerpt */}
          {blog.excerpt && (
            <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">
              {blog.excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-200">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              
              {readingTime > 0 && (
                <>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{readingTime} min read</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div
  className="prose prose-lg max-w-none
    [&>*]:text-gray-900
    [&_h2]:text-gray-900 [&_h2]:font-bold [&_h2]:text-2xl sm:[&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:leading-tight [&_h2]:break-words
    [&_h3]:text-gray-900 [&_h3]:font-bold [&_h3]:text-xl sm:[&_h3]:text-2xl [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:leading-snug [&_h3]:break-words
    [&_h4]:text-gray-900 [&_h4]:font-semibold [&_h4]:text-lg sm:[&_h4]:text-xl [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:leading-normal
    [&_p]:text-gray-900 [&_p]:leading-[1.5] sm:[&_p]:leading-[1.7] [&_p]:mb-5 [&_p]:text-base sm:[&_p]:text-lg [&_p]:break-words [&_p]:whitespace-pre-wrap
    [&_a]:text-amber-600 [&_a]:no-underline [&_a]:font-medium hover:[&_a]:underline [&_a]:break-all
    [&_strong]:text-gray-900 [&_strong]:font-semibold
    [&_em]:text-gray-900 [&_em]:italic
    [&_ul]:my-6 [&_ul]:space-y-2
    [&_ol]:my-6 [&_ol]:space-y-2
    [&_li]:text-gray-900 [&_li]:leading-[1.5] sm:[&_li]:leading-[1.7] [&_li]:break-words
    [&_blockquote]:border-l-4 [&_blockquote]:border-amber-500 [&_blockquote]:pl-6 [&_blockquote]:py-3 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-gray-900 [&_blockquote]:bg-amber-50 [&_blockquote]:rounded-r-lg [&_blockquote]:leading-[1.5] sm:[&_blockquote]:leading-[1.7]
    [&_code]:text-amber-700 [&_code]:bg-amber-50 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:break-all
    [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-6 [&_pre]:rounded-xl [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words
    [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:whitespace-pre-wrap [&_pre_code]:break-words
    [&_img]:rounded-xl [&_img]:my-6 [&_img]:shadow-md [&_img]:max-w-full [&_img]:h-auto
    [&_figure]:my-6 [&_figure]:max-w-full
    [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:text-gray-600 [&_figcaption]:mt-3 [&_figcaption]:italic [&_figcaption]:break-words
    [&_table]:w-full [&_table]:my-6 [&_table]:border-collapse
    [&_th]:bg-gray-100 [&_th]:text-gray-900 [&_th]:font-semibold [&_th]:p-3 [&_th]:text-left [&_th]:border [&_th]:border-gray-300
    [&_td]:text-gray-900 [&_td]:p-3 [&_td]:border [&_td]:border-gray-300 [&_td]:break-words
    [&_hr]:my-10 [&_hr]:border-gray-300"
  dangerouslySetInnerHTML={{ __html: blog.content }}
/>

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Enjoyed this story?
          </h3>
          <p className="text-gray-600 mb-6">
            Share it with fellow design enthusiasts
          </p>
          <button
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white hover:bg-amber-700 rounded-lg transition-all duration-300 font-semibold"
          >
            <Share2 className="w-5 h-5" />
            Share This Story
          </button>
        </div>
      </article>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 bg-white/50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Discover More Stories
          </h3>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Explore our collection of design journeys, practical tips, and inspiring transformations.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-all shadow-lg hover:shadow-amber-200/50 text-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to All Stories
          </button>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Share this story</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <span className="text-lg">𝕏</span>
                Twitter
              </button>
              
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <span className="text-lg">f</span>
                Facebook
              </button>
              
              <button
                onClick={() => handleShare('linkedin')}
                className="flex items-center justify-center gap-2 p-4 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <span className="text-lg">in</span>
                LinkedIn
              </button>
              
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 p-4 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors font-medium"
              >
                <span className="text-lg">📋</span>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors border-t border-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}