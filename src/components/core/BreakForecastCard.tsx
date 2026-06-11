import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Heart, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/lib/base44Stub';

const riskColors: Record<string, string> = {
  low: 'from-blue-50 to-cyan-50 border-blue-200 text-blue-900',
  medium: 'from-amber-50 to-yellow-50 border-amber-200 text-amber-900',
  high: 'from-orange-50 to-red-50 border-orange-200 text-orange-900',
  critical: 'from-red-100 to-rose-100 border-red-300 text-red-900'
};

const riskIcons: Record<string, string> = {
  low: '\ud83d\udfe2',
  medium: '\ud83d\udfe1',
  high: '\ud83d\udfe0',
  critical: '\ud83d\udd34'
};

export default function BreakForecastCard({ forecast, habitName, onIntervention }: { forecast: any; habitName: string; onIntervention?: (intervention: any) => void }) {
  const [expanded, setExpanded] = useState(false);
  const colorClass = riskColors[forecast.risk_level] || riskColors.medium;

  const handleIntervention = async (intervention: any) => {
    await base44.entities.BreakForecast.update(forecast.id, {
      is_addressed: true
    });
    onIntervention?.(intervention);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorClass} rounded-2xl p-5 border shadow-sm`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{riskIcons[forecast.risk_level]}</div>
          <div>
            <h4 className="font-semibold text-base">{habitName}</h4>
            <p className="text-xs opacity-70 mt-0.5">
              {forecast.break_probability}% chance of breaking
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-7 w-7 p-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
      
      <Progress value={forecast.break_probability} className="h-2 mb-4" />
      
      <div className="mb-4 p-3 bg-white/60 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-4 h-4 opacity-60" />
          <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
            Emotional Root Cause
          </span>
        </div>
        <p className="text-sm leading-relaxed">
          {forecast.emotional_insight}
        </p>
      </div>
      
      {expanded && forecast.recommended_interventions && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="space-y-2"
        >
          <div className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-2">
            Recommended Actions
          </div>
          {forecast.recommended_interventions.map((intervention: any, idx: number) => (
            <button
              key={idx}
              onClick={() => handleIntervention(intervention)}
              className="w-full text-left p-3 bg-white/70 hover:bg-white rounded-lg transition-colors group"
            >
              <div className="flex justify-between items-start mb-1">
                <p className="text-sm font-medium pr-2">{intervention.action}</p>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                  {intervention.effectiveness}% effective
                </span>
              </div>
              <p className="text-xs opacity-60">{intervention.timing}</p>
            </button>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
