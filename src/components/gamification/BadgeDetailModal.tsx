import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Lock, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const rarityColors: Record<string, string> = {
  common: 'from-slate-400 to-slate-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500'
};

export default function BadgeDetailModal({ badge, isUnlocked, open, onClose, onShare }: { badge: any; isUnlocked: boolean; open: boolean; onClose: () => void; onShare?: (badge: any) => void }) {
  if (!badge) return null;
  
  const colorClass = rarityColors[badge.rarity] || rarityColors.common;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className={`bg-gradient-to-br ${colorClass} p-6 relative`}>
              <Button
                size="icon"
                variant="ghost"
                onClick={onClose}
                className="absolute top-2 right-2 h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
              
              <div className="text-center">
                {isUnlocked ? (
                  <div className="text-7xl mb-3">{badge.icon}</div>
                ) : (
                  <div className="flex items-center justify-center h-20 mb-3">
                    <Lock className="w-12 h-12 text-white/60" />
                  </div>
                )}
                
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium uppercase tracking-wide mb-2">
                  {badge.rarity}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {badge.name}
              </h3>
              
              <p className="text-slate-600 mb-4">
                {badge.description}
              </p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <div className="text-xs text-slate-500 mb-1">Requirement</div>
                <div className="text-sm font-medium text-slate-700">
                  {badge.requirement_type.replace(/_/g, ' ')}: {badge.requirement_value}
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-amber-600">
                  {badge.points_reward} points
                </span>
              </div>
              
              {isUnlocked ? (
                <div className="flex gap-2">
                  <Button
                    onClick={() => onShare?.(badge)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    onClick={onClose}
                    className="flex-1 bg-slate-900 hover:bg-slate-800"
                  >
                    Close
                  </Button>
                </div>
              ) : (
                <Button onClick={onClose} variant="outline" className="w-full">
                  Close
                </Button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
