// ===== components/BlogPostCard.jsx =====
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const BlogPostCard = ({ post, index }) => {
  return (
    <FadeInSection delay={index * 150}>
      <div className="group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-6">
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold mb-3">
            {post.category}
          </span>
          <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
          <button className="flex items-center gap-2 text-amber-600 font-medium group-hover:gap-3 transition-all">
            Continue Reading
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </FadeInSection>
  );
};