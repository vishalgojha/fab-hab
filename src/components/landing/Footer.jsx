import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-semibold text-white">fabhab</span>
            </Link>
            <p className="text-slate-400 text-sm mb-3">AI-powered habit intelligence for lasting behavior change.</p>
            <a 
              href="https://chaoscarftlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 text-xs transition-colors"
            >
              A chaoscarftlabs.com product
            </a>
          </div>
          
          {/* Product Family */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Our Products</h3>
            <div className="space-y-2">
              {[
                { name: 'Medisuite.fit', url: 'https://medisuite.fit' },
                { name: 'MediPal.fit', url: 'https://medipal.fit' },
                { name: 'Glucovital.fit', url: 'https://glucovital.fit' },
                { name: 'Dietpal.fit', url: 'https://dietpal.fit' },
                { name: 'Mediscribe.fit', url: 'https://mediscribe.fit' }
              ].map(product => (
                <a 
                  key={product.name}
                  href={product.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-slate-400 hover:text-white text-sm transition-colors"
                >
                  {product.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
            <div className="space-y-2">
              <a href="#features" className="block text-slate-400 hover:text-white text-sm transition-colors">Features</a>
              <a href="#whatsapp" className="block text-slate-400 hover:text-white text-sm transition-colors">AI Coach</a>
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">About</a>
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Contact</a>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Legal</h3>
            <div className="space-y-2">
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Disclaimer</a>
              <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-slate-500">
              © 2025 fabhab. All rights reserved.
            </p>
            <p className="text-slate-500 text-xs">
              This app uses AI for predictive insights. Results may vary. Consult professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}