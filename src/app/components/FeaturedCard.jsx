// ===== components/FeaturedCard.jsx =====
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Home, Leaf } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const FeaturedCard = ({ post, index }) => {
  // Function to truncate text to 3 lines maximum
  const truncateToLines = (text, maxLines = 3) => {
    if (!text) return '';
    const words = text.split(' ');
    const maxChars = maxLines * 60; // Approximate characters per line
    if (text.length <= maxChars) return text;
    
    // Truncate and add ellipsis
    return words.reduce((acc, word) => {
      if (acc.length + word.length + 1 <= maxChars) {
        return acc + (acc ? ' ' : '') + word;
      }
      return acc;
    }, '') + '...';
  };

  return (
    <FadeInSection delay={index * 200}>
      <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
        {/* Image Section */}
        <div className="h-48 relative overflow-hidden flex-shrink-0">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            /* Fallback gradient if no image exists */
            <div className={`h-full w-full bg-gradient-to-br ${post.color}`} />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur rounded-full text-sm font-semibold text-gray-800">
              {post.category}
            </span>
          </div>
        </div>
        
        {/* Content Section - Flex column to push button to bottom */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Title - Limited to 2 lines */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[3rem]">
            {post.title}
          </h3>
          
          {/* Description - Limited to 3 lines */}
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3 flex-grow">
            {truncateToLines(post.description)}
          </p>
          
          {/* Read More Link - ACTIVE LINK */}
          <Link 
            href={`/blog/${post.id}`}
            className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-3 transition-all mt-auto w-fit"
          >
            Read More
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </FadeInSection>
  );
};