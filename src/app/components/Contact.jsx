// ===== components/CTASection.jsx =====
import React from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { FadeInSection } from './FadeInSection';

export const Contact = () => {
  return (
    <section id="contact" className="py-32 px-6">
      <FadeInSection>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 font-semibold text-sm">Let's Connect</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get In Touch
            </h2>
            <p className="text-gray-600 text-lg max-w-xl mx-auto">
              Ready to transform your space? Reach out and let's create something beautiful together.
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Email Card */}
            <div className="group bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Send us an Email</h3>
                <p className="text-amber-100 mb-4 text-sm">Perfect for detailed inquiries and project discussions</p>
                <a 
                  href="mailto:astellarhomes@gmail.com" 
                  className="inline-flex items-center gap-2 bg-white text-amber-600 px-4 py-2 rounded-full font-semibold hover:scale-105 transition-all text-sm"
                >
                  astellarhomes@gmail.com
                </a>
              </div>
            </div>

            {/* Phone Card */}
            <div className="group bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Phone Consultation</h3>
                <p className="text-emerald-100 mb-4 text-sm">Available for initial consultations and quick questions</p>
                <div className="inline-flex items-center gap-2 bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold text-sm">
                  Contact for number
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="group bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Service Area</h3>
                <p className="text-blue-100 mb-4 text-sm">Serving clients nationwide with virtual consultations</p>
                <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold text-sm">
                  Nationwide
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="group bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-all" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Quick Response</h3>
                <p className="text-purple-100 mb-4 text-sm">We typically respond within 24-48 hours</p>
                <div className="inline-flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-full font-semibold text-sm">
                  24-48 Hours
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4">
              <MessageCircle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-700 font-medium">
                Don't hesitate to reach out - we're excited to hear about your project!
              </p>
            </div>
          </div>
        </div>
      </FadeInSection>
    </section>
  );
};