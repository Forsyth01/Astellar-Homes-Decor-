// ===== components/BlogPostCard.jsx =====
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const BlogPostCard = ({ post, index }) => {
  // Format the post data to match the expected structure
  const formattedPost = {
    title: post.title || 'Untitled Post',
    category: post.category || 'Design Tips',
    excerpt: post.excerpt || 'Discover inspiring ideas for your home...',
    image: post.image,
    createdAt: post.createdAt,
    id: post.id,
    readTime: post.readTime || '5 min read'
  };

  return (
    <FadeInSection delay={index * 100}>
      <Link href={`/blog/${formattedPost.id}`}>
        <article className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 transition-all duration-500 h-full hover:-translate-y-2 shadow-sm hover:shadow-2xl">
          {/* Image Container */}
          <div className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            {formattedPost.image ? (
              <Image
                src={formattedPost.image}
                alt={formattedPost.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                  ✨
                </div>
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium mb-4 border border-amber-200">
              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
              {formattedPost.category}
            </div>

            {/* Blog Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-amber-700 transition-colors">
              {formattedPost.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {formattedPost.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {formattedPost.createdAt?.toDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedPost.createdAt.toDate().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric"
                    })}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formattedPost.readTime}
                </div>
              </div>
              <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                Read More
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </FadeInSection>
  );
};