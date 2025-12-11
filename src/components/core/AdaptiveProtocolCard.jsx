import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const trendConfig = {
  improving: {
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200'
  },
  stable: {
    icon: Zap,
    color: 'text-blue-600',
    bg: 'from-blue-50 to-cyan-50',
    border: 'border-blue-200'
  },
  declining: {
    icon: TrendingDown,
    color: 'text-orange-600',
    bg: 'from-orange-50 to-amber-50',
    border: 'border-orange-200'
  },
  unknown: {
    icon: Zap,
    color: 'text-slate-600',
    bg: 'from-slate-50 to-gray-50',
    border: 'border-slate-200'
  }
};

export default function AdaptiveProtocolCard({ adjustment, habitName, onApply }) {
  const config = trendConfig.stable;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-gradient-to-br ${config.bg} rounded-2xl p-5 border ${config.border} shadow-sm`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 bg-white rounded-xl shadow-sm ${config.color}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-900 mb-1">{habitName}</h4>
          <p className="text-xs font-medium uppercase tracking-wide opacity-60 mb-3">
            Protocol Adjusted
          </p>
          
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 mb-0.5">Previous</div>
                <div className="text-sm font-medium">
                  {adjustment.previous_protocol?.duration_minutes || 30} min • {adjustment.previous_protocol?.intensity || 'moderate'}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500 mb-0.5">New</div>
                <div className="text-sm font-semibold text-violet-600">
                  {adjustment.new_protocol?.duration_minutes || 30} min • {adjustment.new_protocol?.intensity || 'moderate'}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-xs font-medium text-slate-600 mb-1">Why this change?</div>
              <p className="text-sm leading-relaxed text-slate-700">
                {adjustment.reason}
              </p>
            </div>
            
            <div className="p-3 bg-white/70 rounded-lg">
              <div className="text-xs font-medium text-slate-600 mb-1">Expected Result</div>
              <p className="text-sm leading-relaxed text-slate-700">
                {adjustment.expected_improvement}
              </p>
            </div>
          </div>
          
          {!adjustment.user_notified && (
            <Button
              size="sm"
              onClick={onApply}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              Got it! Apply Changes
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}