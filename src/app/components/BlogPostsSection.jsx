// ===== components/BlogPostsSection.jsx =====
"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';
import { BlogPostCard } from './BlogPostCard';
import Link from 'next/link';

export const BlogPostsSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const q = query(
          collection(db, "blogs"), 
          orderBy("createdAt", "desc"), 
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(posts);
      } catch (err) {
        console.error("Error fetching latest blogs:", err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  if (loading) {
    return (
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-amber-50/30 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-5xl font-bold mb-4">Latest Stories</h2>
              <p className="text-gray-600 text-lg">Fresh ideas and inspiration for your home</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded w-24 mb-3"></div>
                <div className="bg-gray-200 h-6 rounded w-full mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-amber-50/30 relative">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-4">Latest Stories</h2>
          <p className="text-gray-600 text-lg mb-8">Fresh ideas and inspiration for your home</p>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto">
            <p className="text-red-600">Unable to load blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-amber-50/30 relative">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-5xl font-bold mb-4">Latest Stories</h2>
              <p className="text-gray-600 text-lg">
                {blogPosts.length > 0 
                  ? "Fresh ideas and inspiration for your home" 
                  : "Stay tuned for upcoming stories"
                }
              </p>
            </div>
            <Link 
              href="/blog"
              className="hidden md:flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all group"
            >
              View All Posts
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeInSection>

        {blogPosts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working on some amazing content to inspire your home journey. Check back soon!
            </p>
          </div>
        )}

        {/* Mobile View All Button */}
        <div className="flex md:hidden justify-center mt-12">
          <Link 
            href="/blog"
            className="flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all group"
          >
            View All Posts
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};