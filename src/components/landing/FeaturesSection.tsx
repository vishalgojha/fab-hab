import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Glasses, MessageCircle, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Predictive AI',
    description: 'ML algorithms forecast habit disruptions before they happen, suggesting preemptive micro-actions.',
    gradient: 'from-violet-500 to-purple-600'
  },
  {
    icon: Zap,
    title: 'Neurofeedback',
    description: 'Real-time brainwave monitoring optimizes when and how you build habits for maximum neural impact.',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Stake & Commit',
    description: 'Blockchain-verified commitments with smart contract rewards. Put skin in the game.',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    icon: Glasses,
    title: 'AR Visualization',
    description: 'See your progress in augmented reality. Watch habits grow as living visualizations.',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: MessageCircle,
    title: 'AI Coach on WhatsApp',
    description: 'Your personal habit coach available 24/7. Log, track, and get insights via chat.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: TrendingUp,
    title: 'Pattern Intelligence',
    description: 'Deep analytics reveal hidden patterns in your behavior, unlocking breakthrough insights.',
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
