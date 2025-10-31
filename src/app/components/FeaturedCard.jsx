// ===== components/FeaturedCard.jsx =====
import React from 'react';
import { ArrowRight, Heart, Home, Leaf } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const FeaturedCard = ({ post, index }) => {
  return (
    <FadeInSection delay={index * 200}>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className={`h-64 bg-gradient-to-br ${post.color} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
          <div className="absolute inset-0 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-4 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-gray-800 mb-3">
              {post.category}
            </span>
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-bold mb-3 group-hover:text-amber-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {post.description}
          </p>
          <button className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-3 transition-all">
            Read More
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </FadeInSection>
  );
};