import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 pt-20 sm:pt-0">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-violet-50/30 to-amber-50/20" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl"
        animate={{ 
          x: [0, -20, 0], 
          y: [0, 30, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-slate-200/60 shadow-sm mb-8">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-slate-600">AI-Powered Habit Intelligence</span>
          </div>
        </motion.div>
        
        <motion.h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-slate-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Build habits
          <br />
          <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-amber-500 bg-clip-text text-transparent font-medium">
            that stick
          </span>
        </motion.h1>
        
        <motion.p
          className="text-base sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 sm:mb-10 font-light leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Predictive AI that anticipates your challenges. Neurofeedback that optimizes your timing. 
          Community stakes that keep you accountable.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto sm:max-w-none sm:w-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button 
            size="lg" 
            onClick={() => base44.auth.redirectToLogin(createPageUrl('Dashboard'))}
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full shadow-lg shadow-slate-900/20 transition-all hover:shadow-xl hover:shadow-slate-900/30 w-full sm:w-auto"
          >
            Start Your Journey
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Link to={createPageUrl('Demo')} className="w-full sm:w-auto">
            <Button 
              variant="ghost" 
              size="lg"
              className="text-slate-600 hover:text-slate-900 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-full w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}