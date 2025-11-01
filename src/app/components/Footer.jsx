// ===== components/Footer.jsx =====
import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Sparkles, Sofa, Lamp, Home } from 'lucide-react';

export const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "categories"),
          orderBy("name", "asc")
        );
        
        const categoriesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categoriesData.push({
            id: doc.id,
            name: data.name,
            postCount: data.postCount || 0
          });
        });
        
        // Sort alphabetically and take top 4 categories
        const sortedCategories = categoriesData
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 4);
        
        setCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback categories if fetch fails
        setCategories([
          { id: '1', name: 'Interior Design', postCount: 0 },
          { id: '2', name: 'DIY Projects', postCount: 0 },
          { id: '3', name: 'Eco-Friendly', postCount: 0 },
          { id: '4', name: 'Home Office', postCount: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <footer className="py-16 px-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              {/* <Sparkles className="text-amber-500" size={32} /> */}
              <span className="text-2xl font-bold">Astellar</span>
              {/* <span className="">Homes & Decor</span> */}
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Creating beautiful, comfortable spaces that feel like home. Design meets everyday life with warmth and inspiration.
            </p>
            <div className="flex gap-4">
              <Sofa className="text-amber-500" />
              <Lamp className="text-amber-500" />
              <Home className="text-amber-500" />
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-amber-500 transition-colors">Home</a></li>
              <li><a href="/blog" className="hover:text-amber-500 transition-colors">Blog</a></li>
              <li><a href="/about" className="hover:text-amber-500 transition-colors">About</a></li>
              <li><a href="/#contact" className="hover:text-amber-500 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Categories</h4>
            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-4 bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 text-gray-400">
                {categories.map((category) => (
                  <li key={category.id}>
                    <a 
                      href={`/blog?category=${encodeURIComponent(category.name)}`}
                      className="hover:text-amber-500 transition-colors flex items-center gap-2"
                    >
                      {category.name}
                      {category.postCount > 0 && (
                        <span className="text-xs bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                          {category.postCount}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Astellar Homes & Decor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};