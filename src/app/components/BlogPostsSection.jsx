// ===== components/BlogPostsSection.jsx =====
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FadeInSection } from './FadeInSection';
import { BlogPostCard } from './BlogPostCard';

export const BlogPostsSection = () => {
  const blogPosts = [
    {
      title: "The Perfect Sofa Guide",
      category: "Buying Guide",
      excerpt: "Everything you need to know about choosing the right sofa for your space and lifestyle."
    },
    {
      title: "Warm Lighting Ideas",
      category: "Ambiance",
      excerpt: "Create the perfect mood in every room with strategic lighting placement and design."
    },
    {
      title: "Personal Touch Decor",
      category: "Styling Tips",
      excerpt: "Add personality to your home with these creative decorating techniques and ideas."
    }
  ];

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 to-amber-50/30 relative">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-5xl font-bold mb-4">Latest Stories</h2>
              <p className="text-gray-600 text-lg">Fresh ideas and inspiration for your home</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-amber-600 font-semibold hover:gap-3 transition-all">
              View All Posts
              <ArrowRight size={20} />
            </button>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogPostCard key={index} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};