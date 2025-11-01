// ===== app/favorites/page.jsx =====
"use client";

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Star, Home } from 'lucide-react';

export default function FavoritesPage() {
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all favorite posts from Firebase (NO INDEX REQUIRED)
  const fetchFavoritePosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simple query without ordering to avoid index requirement
      const q = query(
        collection(db, "blogs"),
        where("isFavorite", "==", true)
      );
      
      const querySnapshot = await getDocs(q);
      
      const posts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        posts.push({ 
          id: doc.id, 
          ...data,
          publishedAt: data.publishedAt?.toDate?.() || new Date()
        });
      });
      
      // Sort manually by publishedAt on the client side (newest first)
      posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
      
      setFavoritePosts(posts);
      
    } catch (error) {
      console.error("Error fetching favorite posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavoritePosts();
  }, []);

  // Format date function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate excerpt function
  const truncateExcerpt = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading Skeleton */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-300 rounded w-80 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-20 mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-3 rounded-full mb-6">
            <Star className="w-5 h-5 text-amber-600 fill-current" />
            <span className="text-amber-700 font-semibold">Featured Collection</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Favorite Stories
            </span>
          </h1>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            {favoritePosts.length > 0 
              ? `Discover all ${favoritePosts.length} handpicked design inspirations and home stories`
              : "No favorite stories yet. Mark posts as favorites to see them here."
            }
          </p>

          {/* Stats */}
          {favoritePosts.length > 0 && (
            <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{favoritePosts.length}</div>
                <div className="text-sm text-gray-600">Total Favorites</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {new Set(favoritePosts.filter(post => post.category).map(post => post.category)).size}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-12 p-8 bg-red-50 rounded-2xl border border-red-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-red-900 mb-2">Error Loading Posts</h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchFavoritePosts}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Favorites Grid */}
        {favoritePosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoritePosts.map((post) => (
              <article 
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Home className="w-12 h-12 text-white opacity-80" />
                    </div>
                  )}
                  
                  {/* Favorite Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-amber-500 text-white px-3 py-1 rounded-full flex items-center gap-1 text-sm font-semibold shadow-lg">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  </div>
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  {post.category && (
                    <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {truncateExcerpt(post.excerpt)}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.publishedAt)}
                  </div>

                  {/* Read More */}
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm group/readmore"
                  >
                    Read Full Story
                    <ArrowLeft className="w-4 h-4 transform rotate-180 group-hover/readmore:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Star className="w-24 h-24 text-amber-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No Favorite Stories Yet</h3>
              <p className="text-gray-600 mb-8">
                Start building your collection of favorite design stories by marking posts as favorites in the admin panel.
              </p>
              <div className="flex gap-4 justify-center">
                <Link 
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full hover:bg-amber-700 transition-colors font-semibold"
                >
                  Go to Admin Panel
                </Link>
                <Link 
                  href="/"
                  className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}