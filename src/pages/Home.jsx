import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import WhatsAppSection from '@/components/landing/WhatsAppSection';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">fabhab</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#whatsapp" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">AI Coach</a>
            <Link 
              to={createPageUrl('Dashboard')} 
              className="text-sm bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </nav>
      
      <main>
        <HeroSection />
        <div id="features">
          <FeaturesSection />
        </div>
        <div id="whatsapp">
          <WhatsAppSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}