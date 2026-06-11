import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Trophy, Calendar, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';
import Leaderboard from './Leaderboard';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ChallengeDetailModal({ challenge, open, onClose, onJoin, isParticipant }: { challenge: any; open: boolean; onClose: () => void; onJoin?: (challenge: any, teamName: string) => void; isParticipant: boolean }) {
  const [teamName, setTeamName] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { data: participants = [] } = useQuery({
    queryKey: ['challenge-participants', challenge?.id],
    queryFn: () => base44.entities.ChallengeParticipant.filter({ challenge_id: challenge.id }),
    enabled: !!challenge
  });

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const handleJoinWithTeam = async () => {
    if (challenge.is_team_based && !teamName) {
      toast.error('Please enter a team name');
      return;
    }
    await onJoin?.(challenge, teamName);
  };

  const handleShare = (platform: string) => {
    const text = `Join me in the "${challenge.name}" challenge on FabHab! ${challenge.description}`;
    const url = window.location.origin;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  const copyInviteCode = () => {
    if (challenge.invite_code) {
      navigator.clipboard.writeText(challenge.invite_code);
      toast.success('Invite code copied!');
    }
  };

  if (!challenge) return null;

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
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-3xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-slate-900 mb-2">{challenge.name}</h2>
                    <p className="text-slate-600">{challenge.description}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-slate-900">{format(new Date(challenge.start_date), 'MMM d')}</div>
                      <div className="text-xs">Start Date</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-slate-900">{format(new Date(challenge.end_date), 'MMM d')}</div>
                      <div className="text-xs">End Date</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    <div>
                      <div className="font-medium text-slate-900">{participants.length}</div>
                      <div className="text-xs">Participants</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium text-amber-600">{challenge.reward_points} pts</div>
                      <div className="text-xs">Reward</div>
                    </div>
                  </div>
                </div>

                {challenge.visibility === 'private' && challenge.invite_code && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Invite Code</div>
                      <div className="font-mono font-bold text-slate-900">{challenge.invite_code}</div>
                    </div>
                    <Button variant="outline" size="sm" onClick={copyInviteCode}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Leaderboard</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </div>

                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-4 p-4 bg-slate-50 rounded-xl"
                  >
                    <div className="text-sm text-slate-600 mb-3">Share this challenge:</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>Twitter</Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>Facebook</Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare('linkedin')}>LinkedIn</Button>
                      <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}>WhatsApp</Button>
                    </div>
                  </motion.div>
                )}

                <Leaderboard 
                  participants={participants} 
                  challenge={challenge}
                  currentUserEmail={user?.email}
                />
              </div>

              {!isParticipant && challenge.status === 'active' && (
                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  {challenge.is_team_based && (
                    <Input
                      placeholder="Enter your team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="mb-3"
                    />
                  )}
                  <Button
                    onClick={handleJoinWithTeam}
                    className="w-full bg-violet-600 hover:bg-violet-700"
                  >
                    Join Challenge
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
