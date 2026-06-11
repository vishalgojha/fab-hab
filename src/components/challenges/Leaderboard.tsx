import React from 'react';
import { Trophy, Medal, TrendingUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Leaderboard({ participants, challenge, currentUserEmail }: { participants: any[]; challenge: any; currentUserEmail?: string }) {
  const sortedParticipants = [...participants].sort((a, b) => b.current_progress - a.current_progress);
  
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-medium text-slate-500">#{rank}</span>;
  };

  const getProgressPercentage = (progress: number) => {
    return Math.min((progress / challenge.goal_value) * 100, 100);
  };

  return (
    <div className="space-y-3">
      {sortedParticipants.map((participant, index) => {
        const rank = index + 1;
        const isCurrentUser = participant.user_email === currentUserEmail;
        const progressPercentage = getProgressPercentage(participant.current_progress);

        return (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border-2 transition-all ${
              isCurrentUser 
                ? 'bg-violet-50 border-violet-200' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8">
                  {getRankIcon(rank)}
                </div>
                <div>
                  <div className="font-medium text-slate-900">
                    {participant.user_name || participant.user_email}
                    {isCurrentUser && <span className="ml-2 text-xs text-violet-600">(You)</span>}
                  </div>
                  {participant.team_name && (
                    <div className="text-xs text-slate-500">Team: {participant.team_name}</div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-bold text-slate-900">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  {participant.current_progress}
                  <span className="text-sm font-normal text-slate-400">/ {challenge.goal_value}</span>
                </div>
                {participant.completed && (
                  <div className="text-xs text-green-600 font-medium">Completed!</div>
                )}
              </div>
            </div>

            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`h-full rounded-full ${
                  progressPercentage === 100 ? 'bg-green-500' : 'bg-violet-500'
                }`}
              />
            </div>
          </motion.div>
        );
      })}

      {sortedParticipants.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>No participants yet. Be the first to join!</p>
        </div>
      )}
    </div>
  );
}
