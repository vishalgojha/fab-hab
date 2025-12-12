import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to={createPageUrl('Home')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-semibold text-white">fabhab</span>
          </Link>
          
          <div className="flex items-center gap-8 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">About</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a>
          </div>
          
          <p className="text-slate-500 text-sm">
            © 2024 fabhab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}