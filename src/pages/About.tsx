import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Heart, Sparkles, Users, Target } from 'lucide-react';
import Footer from '@/components/landing/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 mb-6">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-medium text-violet-700">About FabHab</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 mb-4 sm:mb-6">
            Built by <span className="font-medium">Chaos Craft Labs</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            FabHab is part of the Chaos Craft Labs ecosystem - AI-powered health and wellness tools 
            designed to help you live better, one habit at a time.
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-semibold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              We believe lasting behavior change shouldn't be guesswork. FabHab uses predictive AI, 
              emotion-aware tracking, and adaptive protocols to help you build habits that actually stick. 
              No more broken streaks, no more motivation crashes - just intelligent, personalized guidance 
              that works with your life, not against it.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-semibold text-slate-900">What Makes FabHab Different</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="font-semibold text-slate-900 mb-2">Predictive Intelligence</h3>
                <p className="text-slate-600 text-sm">
                  Our AI forecasts when you're likely to break streaks before it happens, 
                  giving you time to intervene and stay on track.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="font-semibold text-slate-900 mb-2">Emotion-Aware</h3>
                <p className="text-slate-600 text-sm">
                  We track how you feel before and after habits to understand what truly drives 
                  your behavior and what blocks it.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="font-semibold text-slate-900 mb-2">Auto-Detection</h3>
                <p className="text-slate-600 text-sm">
                  FabHab automatically discovers patterns in your behavior and suggests new habits 
                  based on what you're already doing naturally.
                </p>
              </div>
              <div className="bg-violet-50 rounded-2xl p-6 border border-violet-100">
                <h3 className="font-semibold text-slate-900 mb-2">Adaptive Protocols</h3>
                <p className="text-slate-600 text-sm">
                  Your habit plans adjust in real-time based on your performance, energy levels, 
                  and progress trends.
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-semibold text-slate-900">The Chaos Craft Labs Family</h2>
            </div>
            <p className="text-slate-600 mb-6">
              FabHab is one of several AI-powered health tools we've built to help you thrive:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Medisuite.fit', desc: 'Comprehensive health management platform' },
                { name: 'MediPal.fit', desc: 'AI health companion and advisor' },
                { name: 'Glucovital.fit', desc: 'Diabetes management and tracking' },
                { name: 'Dietpal.fit', desc: 'Personalized nutrition guidance' },
                { name: 'Mediscribe.fit', desc: 'Medical documentation assistant' }
              ].map((product, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h3 className="font-medium text-slate-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-slate-600">{product.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-violet-600" />
              <h2 className="text-2xl font-semibold text-slate-900">Made with ❤️ in India</h2>
            </div>
            <p className="text-slate-600 mb-4">
              Created by Vishal Ojha and the team at Chaos Craft Labs. We're on a mission to make 
              AI-powered health tools accessible, intelligent, and actually helpful.
            </p>
            <a 
              href="https://chaoscraftlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"
            >
              Learn more about Chaos Craft Labs →
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
