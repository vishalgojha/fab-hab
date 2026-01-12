import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
              {/* About */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">About</h3>
                <div className="space-y-2">
                  <Link to={createPageUrl('About')} className="block text-slate-400 hover:text-white text-sm transition-colors">About FabHab</Link>
                  <Link to={createPageUrl('Demo')} className="block text-slate-400 hover:text-white text-sm transition-colors">How It Works</Link>
                  <a href="https://chaoscraftlabs.com" target="_blank" rel="noopener noreferrer" className="block text-slate-400 hover:text-white text-sm transition-colors">Chaos Craft Labs</a>
                </div>
              </div>

              {/* Product */}
              <div>
                <h3 className="text-white font-semibold mb-4 text-sm">Product</h3>
                <div className="space-y-2">
                  <Link to={createPageUrl('About')} className="block text-slate-400 hover:text-white text-sm transition-colors">About</Link>
                  <a href="#features" className="block text-slate-400 hover:text-white text-sm transition-colors">Features</a>
                  <a href="#whatsapp" className="block text-slate-400 hover:text-white text-sm transition-colors">AI Coach</a>
                  <Link to={createPageUrl('Demo')} className="block text-slate-400 hover:text-white text-sm transition-colors">Demo</Link>
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
                  <Link to={createPageUrl('Privacy')} className="block text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link>
                  <Link to={createPageUrl('Terms')} className="block text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link>
                  <Link to={createPageUrl('Disclaimer')} className="block text-slate-400 hover:text-white text-sm transition-colors">Disclaimer</Link>

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