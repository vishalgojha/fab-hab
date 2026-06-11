import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/lib/base44Stub';

export default function WhatsAppSection() {
  const whatsappUrl = base44.agents.getWhatsAppConnectURL('habit_coach');

  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
              <MessageCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">WhatsApp Integration</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 mb-4 sm:mb-6">
              Your AI coach,
              <br />
              <span className="font-medium">in your pocket</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8 leading-relaxed">
              FabHab, your personal habit AI, lives in WhatsApp. Log completions with a message, 
              get predictive insights, and receive interventions exactly when you need them.
            </p>
            
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                'Log habits with natural language',
                'Receive predictive alerts',
                'Get personalized micro-actions',
                'Track streaks and patterns'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button 
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 rounded-full shadow-lg shadow-green-600/20 w-full sm:w-auto"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect WhatsApp
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => base44.auth.redirectToLogin()}
                className="px-6 sm:px-8 rounded-full w-full sm:w-auto"
              >
                Login
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-72">
              <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-slate-900/30">
                <div className="bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="bg-green-600 px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white text-lg">F</span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">FabHab AI</div>
                      <div className="text-green-100 text-xs">online</div>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-3 h-80 bg-[#e5ddd5]">
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                        <p className="text-sm text-slate-700">Hey! I noticed it&apos;s been 2 hours since your usual meditation time 🧘</p>
                        <p className="text-xs text-slate-400 mt-1">9:32 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-green-100 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                        <p className="text-sm text-slate-700">Thanks! I&apos;ll do 5 mins now</p>
                        <p className="text-xs text-slate-400 mt-1">9:33 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                        <p className="text-sm text-slate-700">Perfect! Your focus score is at 78% right now - ideal for mindfulness. Logged ✓</p>
                        <p className="text-xs text-slate-400 mt-1">9:33 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -z-10 top-1/2 -translate-y-1/2 -left-20 w-40 h-40 bg-green-200/50 rounded-full blur-3xl" />
              <div className="absolute -z-10 top-1/4 -right-16 w-32 h-32 bg-violet-200/50 rounded-full blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
