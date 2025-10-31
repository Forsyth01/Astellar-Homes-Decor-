// ===== components/FeaturedSection.jsx =====
import React from 'react';
import { FadeInSection } from './FadeInSection';
import { FeaturedCard } from './FeaturedCard';

export const FeaturedSection = () => {
  const featuredPosts = [
    {
      title: "Minimalist Living Room Setup",
      category: "Interior Design",
      description: "Discover the art of combining wooden textures with neutral tones for a timeless aesthetic.",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Cozy Bedroom Retreat",
      category: "DIY Projects",
      description: "Transform your bedroom into a peaceful sanctuary with these simple, budget-friendly tips.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      title: "Eco-Friendly Home Office",
      category: "Sustainable Living",
      description: "Create a productive workspace using sustainable materials and natural light.",
      color: "from-blue-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <FadeInSection>
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Featured Inspiration
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Handpicked ideas to transform your living spaces</p>
          </div>
        </FadeInSection>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <FeaturedCard key={index} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
