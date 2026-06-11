import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const rarityColors: Record<string, string> = {
  common: 'border-slate-300 bg-slate-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-amber-300 bg-amber-50'
};

export default function BadgesGrid({ badges, userAchievements, onBadgeClick }: { badges: any[]; userAchievements: any[]; onBadgeClick?: (badge: any, isUnlocked: boolean) => void }) {
  const unlockedBadgeIds = new Set(userAchievements.map(a => a.badge_id));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {badges.map((badge, idx) => {
        const isUnlocked = unlockedBadgeIds.has(badge.id);
        const colorClass = rarityColors[badge.rarity] || rarityColors.common;
        
        return (
          <motion.button
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onBadgeClick?.(badge, isUnlocked)}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              isUnlocked 
                ? `${colorClass} hover:scale-105` 
                : 'border-slate-200 bg-slate-100 opacity-50'
            }`}
          >
            {isUnlocked ? (
              <div className="text-4xl mb-2">{badge.icon}</div>
            ) : (
              <div className="flex items-center justify-center h-12 mb-2">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
            )}
            
            <div className="text-xs font-medium text-slate-700 line-clamp-2">
              {badge.name}
            </div>
            
            {isUnlocked && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
