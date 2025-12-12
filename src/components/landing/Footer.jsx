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
              <span className="text-xl font-semibold text-white">FabHab</span>
            </Link>
            <p className="text-slate-400 text-sm">AI-powered habit intelligence for lasting behavior change.</p>
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
                  className="group block text-slate-400 hover:text-white text-sm transition-colors relative"
                  onMouseEnter={(e) => {
                    const preview = e.currentTarget.querySelector('.preview-tooltip');
                    if (preview) preview.style.display = 'block';
                  }}
                  onMouseLeave={(e) => {
                    const preview = e.currentTarget.querySelector('.preview-tooltip');
                    if (preview) preview.style.display = 'none';
                  }}
                >
                  {product.name}
                  <div className="preview-tooltip hidden absolute left-0 bottom-full mb-2 bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden z-10" style={{width: '320px', height: '180px'}}>
                    <iframe src={product.url} className="w-full h-full border-0 pointer-events-none" title={product.name} />
                  </div>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
              <p className="text-slate-500">
                © 2025 FabHab. All rights reserved.
              </p>
              <a 
                href="https://chaoscraftlabs.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
              >
                A chaoscraftlabs.com product
              </a>
            </div>
            <p className="text-slate-500 text-xs">
              This app uses AI for predictive insights. Results may vary. Consult professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}