import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

const rarityColors: Record<string, string> = {
  common: 'from-slate-400 to-slate-500',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-amber-400 to-orange-500'
};

export default function AchievementUnlockModal({ achievement, open, onClose, onShare }: { achievement: any; open: boolean; onClose: () => void; onShare?: (achievement: any) => void }) {
  React.useEffect(() => {
    if (open && achievement) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [open, achievement]);

  if (!achievement) return null;

  const badge = achievement.badge;
  const colorClass = rarityColors[badge.rarity] || rarityColors.common;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md z-50"
          >
            <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className={`bg-gradient-to-br ${colorClass} p-8 text-center relative overflow-hidden`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-8xl mb-4"
                >
                  {badge.icon}
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Achievement Unlocked!
                </motion.h2>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium uppercase tracking-wide"
                >
                  {badge.rarity}
                </motion.div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2 text-center">
                  {badge.name}
                </h3>
                <p className="text-slate-600 text-center mb-4">
                  {badge.description}
                </p>
                
                <div className="flex items-center justify-center gap-2 mb-6">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="text-lg font-bold text-amber-600">
                    +{badge.points_reward} points
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => onShare?.(achievement)}
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
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
