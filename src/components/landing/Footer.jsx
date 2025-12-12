import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* Company */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">Company</h3>
                <div className="space-y-2">
                  <a href="https://chaoscraftlabs.com/about" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white text-sm transition-colors">About Chaos Craft Labs</a>
                  <a href="https://chaoscraftlabs.com/vision" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white text-sm transition-colors">Our Vision</a>
                  <a href="https://chaoscraftlabs.com/creator" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white text-sm transition-colors">Meet the Creator</a>
                  <a href="https://chaoscraftlabs.com/careers" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white text-sm transition-colors">Careers</a>
                </div>
              </div>

              {/* AI Pages */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">AI Pages</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">AI-Generated Help Center</a>
                  <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">AI Terms Glossary</a>
                  <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Getting Started Guide</a>
                  <a href="#" className="block text-slate-400 hover:text-white text-sm transition-colors">Smart Troubleshooter</a>
                </div>
              </div>

              {/* Our Products */}
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
        
        {/* Brand Stamp */}
        <div className="pt-8 border-t border-slate-800">
          <div className="text-center space-y-2">
            <p className="text-slate-400 text-sm font-medium">A Chaos Craft Labs Creation</p>
            <p className="text-slate-500 text-sm">Made with ❤️ in India</p>
            <a 
              href="https://chaoscraftlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 text-sm transition-colors inline-block"
            >
              www.chaoscraftlabs.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}