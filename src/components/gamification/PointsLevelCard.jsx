import React from 'react';
import { Trophy, Zap, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function PointsLevelCard({ stats }) {
  const pointsToNextLevel = (stats.level * 1000) - stats.total_points;
  const progress = ((stats.total_points % 1000) / 1000) * 100;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-600" />
            <span className="text-2xl font-bold text-slate-900">Level {stats.level}</span>
          </div>
          <p className="text-sm text-slate-600">
            {pointsToNextLevel.toLocaleString()} points to Level {stats.level + 1}
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-amber-600 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="font-bold text-lg">{stats.total_points.toLocaleString()}</span>
          </div>
          <p className="text-xs text-slate-500">Total Points</p>
        </div>
      </div>
      
      <Progress value={progress} className="h-3 mb-3" />
      
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-white/60 rounded-lg p-2">
          <div className="text-lg font-bold text-slate-900">{stats.total_completions}</div>
          <div className="text-xs text-slate-500">Completions</div>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <div className="text-lg font-bold text-slate-900">{stats.longest_streak}</div>
          <div className="text-xs text-slate-500">Best Streak</div>
        </div>
        <div className="bg-white/60 rounded-lg p-2">
          <div className="text-lg font-bold text-slate-900">{stats.badges_unlocked}</div>
          <div className="text-xs text-slate-500">Badges</div>
        </div>
      </div>
    </div>
  );
}