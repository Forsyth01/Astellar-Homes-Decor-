// ===== components/FeaturedSection.jsx =====
import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FadeInSection } from "./FadeInSection";
import { FeaturedCard } from "./FeaturedCard";
import { Star, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export const FeaturedSection = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured posts from Firebase
  const fetchFeaturedPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const q = query(
        collection(db, "blogs"),
        where("isFavorite", "==", true),
        limit(3)
      );

      const querySnapshot = await getDocs(q);

      const posts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data,
          publishedAt: data.publishedAt?.toDate?.() || new Date(),
        });
      });

      // Sort manually by publishedAt on the client side (newest first)
      posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

      setFeaturedPosts(posts);
    } catch (error) {
      console.error("Error fetching featured posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="h-12 bg-gray-300 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="h-64 bg-gray-300 rounded-2xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mb-3"></div>
                <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-4">
              <Star className="w-4 h-4 text-amber-600 fill-current" />
              <span className="text-amber-700 font-semibold text-sm">
                Editor's Choice
              </span>
            </div>
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Featured Inspiration
              </span>
            </h2>

            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {featuredPosts.length > 0
                ? "Handpicked favorite stories and design inspirations from our collection"
                : "No featured posts found in database"}
            </p>

            {/* View All Favorites Button - Only show if we have actual favorites */}
            {featuredPosts.length > 0 && (
              <div className="mt-8">
                <Link
                  href="/blog/favorites"
                  className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  View All Featured Stories
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </FadeInSection>

        {/* Show posts if we have real favorites from database */}
        {featuredPosts.length > 0 ? (
          // In FeaturedSection.jsx - ensure the grid container has proper classes
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {featuredPosts.map((post, index) => (
              <FeaturedCard
                key={post.id}
                post={{
                  ...post,
                  description: post.excerpt || post.description,
                  color: getColorByIndex(index),
                  image: post.image,
                }}
                index={index}
              />
            ))}
          </div>
        ) : (
          /* Show admin prompt if no favorites exist */
          <FadeInSection delay={500}>
            <div className="text-center mt-16 p-8 bg-amber-50 rounded-2xl border border-amber-200 max-w-4xl mx-auto">
              <Star className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                No Featured Posts Yet
              </h3>

              <div className="text-left bg-white p-6 rounded-lg border border-gray-200 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  To add featured posts:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-gray-600">
                  <li>Go to Admin Panel and create/edit a blog post</li>
                  <li>
                    Click the <strong>star icon</strong> in the top-right to
                    mark as favorite
                  </li>
                  <li>
                    Make sure to <strong>publish/update</strong> the post
                  </li>
                  <li>Click the "Refresh Data" button below to reload</li>
                </ol>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={fetchFeaturedPosts}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>

                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold"
                >
                  Go to Admin Panel
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeInSection>
        )}

        {/* Show error message if there was an error */}
        {error && (
          <FadeInSection delay={300}>
            <div className="text-center mt-8 p-6 bg-red-50 rounded-2xl border border-red-200 max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold text-red-900 mb-2">
                Error Loading Posts
              </h4>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={fetchFeaturedPosts}
                className="mt-4 inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors font-semibold text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </FadeInSection>
        )}
      </div>
    </section>
  );
};

// Helper function to assign colors based on index
function getColorByIndex(index) {
  const colors = [
    "from-amber-500 to-orange-600",
    "from-emerald-500 to-teal-600",
    "from-blue-500 to-indigo-600",
  ];
  return colors[index % colors.length];
}
