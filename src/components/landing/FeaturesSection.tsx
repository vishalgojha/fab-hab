import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Glasses, MessageCircle, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Desi Diet Tracker',
    description: 'Log meals like Roti-Dal, Poha, and Biryani with estimated calories & protein to match traditional Indian eating patterns.',
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    icon: Zap,
    title: 'Chai Limiter & Hydration',
    description: 'Limit daily Chai cups, log water in traditional Matkas, and get Ayurvedic recommendations to keep digestion optimal.',
    gradient: 'from-amber-500 to-yellow-600'
  },
  {
    icon: Shield,
    title: 'Ayurvedic & Yoga Routines',
    description: 'Track Surya Namaskar rounds, Kapalbhati, Ushapan, and Haldi Doodh to build long-term immunity and physical vitality.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Glasses,
    title: 'Vitals Monitoring',
    description: 'Log Steps, Sleep hours, Heart rate, and Weight to gain insights on your daily energy levels and physical health.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MessageCircle,
    title: 'AI Health Coach',
    description: 'An interactive chatbot helping you replace junk food with roasted makhana, suggesting herbal teas, and tracking custom goals.',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    icon: TrendingUp,
    title: 'Desi Challenges & Badges',
    description: 'Join 21-Day Yoga challenges or Step Yatras, and unlock rewards like Yogi Master, Chai Restrainer, and more.',
    gradient: 'from-rose-500 to-pink-500'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-900 mb-3 sm:mb-4">
            Technology that <span className="font-medium">understands</span> you
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Six breakthrough features working in harmony to transform how you build lasting habits.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-lg hover:shadow-slate-100/50 h-full">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
                
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${feature.gradient}" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
