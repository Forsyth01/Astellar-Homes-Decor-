// ===== components/CTASection.jsx =====
import React from 'react';
import { Sparkles } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const CTASection = () => {
  return (
    <section className="py-32 px-6">
      <FadeInSection>
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-amber-600 to-orange-600 rounded-3xl p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
          <div className="relative z-10">
            <Sparkles className="mx-auto mb-6 text-white" size={48} />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get Weekly Inspiration
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Join our community and receive curated home decor ideas, DIY tutorials, and exclusive tips directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-amber-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
};