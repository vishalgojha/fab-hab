import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, Target, Lock, Globe, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const categoryColors: Record<string, string> = {
  health: 'from-emerald-500 to-teal-500',
  productivity: 'from-blue-500 to-cyan-500',
  mindfulness: 'from-violet-500 to-purple-500',
  fitness: 'from-orange-500 to-red-500',
  learning: 'from-amber-500 to-yellow-500',
  social: 'from-pink-500 to-rose-500',
  creativity: 'from-indigo-500 to-blue-500',
  any: 'from-slate-500 to-slate-600'
};

export default function ChallengeCard({ challenge, onJoin, onView, isParticipant }: { challenge: any; onJoin?: (challenge: any) => void; onView?: (challenge: any) => void; isParticipant: boolean }) {
  const isActive = challenge.status === 'active';
  const isUpcoming = challenge.status === 'upcoming';
  const isFull = challenge.max_participants && challenge.participant_count >= challenge.max_participants;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className={`h-2 bg-gradient-to-r ${categoryColors[challenge.habit_category]}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 text-lg">{challenge.name}</h3>
              {challenge.visibility === 'private' ? (
                <Lock className="w-4 h-4 text-slate-400" />
              ) : (
                <Globe className="w-4 h-4 text-slate-400" />
              )}
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{challenge.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(challenge.start_date), 'MMM d')} - {format(new Date(challenge.end_date), 'MMM d')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{challenge.participant_count} {challenge.max_participants ? `/ ${challenge.max_participants}` : ''} joined</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Target className="w-4 h-4" />
            <span className="capitalize">{challenge.goal_type.replace('_', ' ')}: {challenge.goal_value}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-medium text-amber-600">+{challenge.reward_points} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-100 text-green-700' : ''}>
            {challenge.status}
          </Badge>
          {challenge.is_team_based && <Badge variant="outline">Team Challenge</Badge>}
          <Badge variant="outline" className="capitalize">{challenge.habit_category}</Badge>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onView?.(challenge)}
            variant="outline"
            className="flex-1"
          >
            View Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          {!isParticipant && (isActive || isUpcoming) && (
            <Button
              onClick={() => onJoin?.(challenge)}
              disabled={isFull}
              className="flex-1 bg-violet-600 hover:bg-violet-700"
            >
              {isFull ? 'Full' : 'Join Challenge'}
            </Button>
          )}
          {isParticipant && (
            <Badge className="px-4 py-2 bg-green-600">Joined ✓</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
