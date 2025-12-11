import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Check, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AutoDetectedHabitCard({ habit, onAction }) {
  const handleAccept = async () => {
    await base44.entities.Habit.update(habit.id, {
      status: 'active',
      is_active: true
    });
    onAction?.();
  };

  const handleReject = async () => {
    await base44.entities.Habit.update(habit.id, {
      status: 'archived',
      is_active: false
    });
    onAction?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl p-6 border border-violet-200 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm">
          <Sparkles className="w-6 h-6 text-violet-500" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">{habit.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Auto-detected
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white text-slate-600">
                  {habit.detection_confidence}% confidence
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-slate-600 leading-relaxed mb-4">
            {habit.description}
          </p>
          
          {/* Protocol preview */}
          {habit.current_protocol && (
            <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {habit.current_protocol.duration_minutes} min
              </span>
              <span className="capitalize">{habit.current_protocol.intensity} intensity</span>
              <span className="capitalize">{habit.target_frequency}</span>
            </div>
          )}
          
          {/* Reasoning from AI */}
          {habit.reasoning && (
            <div className="p-3 bg-white/70 rounded-lg border border-violet-100 mb-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                <span className="font-medium text-violet-700">Why this habit: </span>
                {habit.reasoning}
              </p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Check className="w-4 h-4 mr-1" />
              Start This Habit
            </Button>
            <Button
              onClick={handleReject}
              size="sm"
              variant="ghost"
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4 mr-1" />
              Not Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}