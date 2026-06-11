import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/lib/base44Stub';

const typeConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; border: string }> = {
  disruption: {
    icon: AlertTriangle,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  opportunity: {
    icon: Zap,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  insight: {
    icon: Lightbulb,
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200'
  }
};

export default function PredictionCard({ prediction, onDismiss }: { prediction: any; onDismiss?: (id: string) => void }) {
  const config = typeConfig[prediction.prediction_type] || typeConfig.insight;
  const Icon = config.icon;

  const handleAction = async () => {
    await base44.entities.Prediction.update(prediction.id, { is_acted_upon: true });
    onDismiss?.(prediction.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`${config.bg} ${config.border} border rounded-xl p-4`}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 p-2 rounded-lg bg-white ${config.color}`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-slate-900 text-sm">{prediction.title}</h4>
            <span className="flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-white text-slate-600">
              {prediction.confidence}% confident
            </span>
          </div>
          
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {prediction.message}
          </p>
          
          {prediction.suggested_action && (
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 text-xs bg-white hover:bg-slate-50"
                onClick={handleAction}
              >
                {prediction.suggested_action}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
