import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, TrendingUp, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/lib/base44Stub';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function HabitCard({ habit, onComplete, onSkip, onDelete }: { habit: any; onComplete?: () => void; onSkip?: () => void; onDelete?: (id: string) => void }) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = () => {
    onComplete?.();
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const categoryColors: Record<string, string> = {
    health: 'from-emerald-500 to-teal-500',
    productivity: 'from-blue-500 to-cyan-500',
    mindfulness: 'from-violet-500 to-purple-500',
    fitness: 'from-orange-500 to-red-500',
    learning: 'from-amber-500 to-yellow-500',
    social: 'from-pink-500 to-rose-500',
    creativity: 'from-indigo-500 to-violet-500'
  };

  const gradient = categoryColors[habit.category] || categoryColors.health;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div 
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
            style={{ boxShadow: `0 4px 14px ${habit.color}30` }}
          >
            <span className="text-white text-lg font-medium">
              {habit.name.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-slate-900 truncate">{habit.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{habit.category}</p>
            
            {habit.current_streak > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-xs font-medium text-orange-500">
                  {habit.current_streak} day streak
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all"
            onClick={handleComplete}
          >
            <Check className="w-5 h-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <MoreVertical className="w-4 h-4 text-slate-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSkip}>
                Log Skip
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete?.(habit.id)} className="text-red-600">
                Delete habit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {habit.ar_visualization && (
        <div className="mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AR: {habit.ar_visualization} visualization
          </div>
        </div>
      )}
    </motion.div>
  );
}
