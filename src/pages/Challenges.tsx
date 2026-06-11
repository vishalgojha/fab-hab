import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';
import { ArrowLeft, Plus, Trophy, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import ChallengeCard from '@/components/challenges/ChallengeCard';
import CreateChallengeDialog from '@/components/challenges/CreateChallengeDialog';
import ChallengeDetailModal from '@/components/challenges/ChallengeDetailModal';
import Footer from '@/components/landing/Footer';
import { toast } from 'sonner';

export default function Challenges() {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ['challenges'],
    queryFn: () => base44.entities.Challenge.list()
  });

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['my-participations'],
    queryFn: () => base44.entities.ChallengeParticipant.filter({ user_email: user?.email }),
    enabled: !!user
  });

  const handleJoinChallenge = async (challenge: any, teamName: string | null = null) => {
    try {
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challenge.id,
        user_email: user.email,
        user_name: user.full_name,
        team_name: teamName,
        joined_date: new Date().toISOString(),
        current_progress: 0
      });

      await base44.entities.Challenge.update(challenge.id, {
        participant_count: challenge.participant_count + 1
      });

      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['my-participations'] });
      toast.success('Joined challenge successfully!');
      setSelectedChallenge(null);
    } catch (error) {
      console.error('Failed to join challenge:', error);
      toast.error('Failed to join challenge');
    }
  };

  const filteredChallenges = challenges.filter((challenge: any) => {
    const statusMatch = filterStatus === 'all' || challenge.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || challenge.habit_category === filterCategory;
    const searchMatch = !searchQuery || 
      challenge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return statusMatch && categoryMatch && searchMatch;
  });

  const myChallenges = filteredChallenges.filter((c: any) => 
    myParticipations.some((p: any) => p.challenge_id === c.id)
  );

  const availableChallenges = filteredChallenges.filter((c: any) => 
    !myParticipations.some((p: any) => p.challenge_id === c.id)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl('Dashboard')} className="text-slate-600 hover:text-slate-900">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900">Challenges</h1>
                  <p className="text-sm text-slate-500">Compete and achieve together</p>
                </div>
              </div>
            </div>
            
            <Button
              onClick={() => setShowCreate(true)}
              className="bg-violet-600 hover:bg-violet-700 rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="mindfulness">Mindfulness</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {myChallenges.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">My Challenges</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {myChallenges.map((challenge: any) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onView={setSelectedChallenge}
                    isParticipant={true}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {myChallenges.length > 0 ? 'Discover More' : 'All Challenges'}
          </h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-80 bg-white rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : availableChallenges.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {availableChallenges.map((challenge: any) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={handleJoinChallenge}
                    onView={setSelectedChallenge}
                    isParticipant={false}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200"
            >
              <Trophy className="w-16 h-16 mx-auto mb-4 text-slate-300" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No challenges found</h3>
              <p className="text-slate-500 mb-4">Be the first to create one!</p>
              <Button onClick={() => setShowCreate(true)} className="bg-violet-600 hover:bg-violet-700">
                Create Challenge
              </Button>
            </motion.div>
          )}
        </section>
      </main>

      <CreateChallengeDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => queryClient.invalidateQueries({ queryKey: ['challenges'] })}
      />

      <ChallengeDetailModal
        challenge={selectedChallenge}
        open={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        onJoin={handleJoinChallenge}
        isParticipant={myParticipations.some((p: any) => p.challenge_id === selectedChallenge?.id)}
      />

      <Footer />
    </div>
  );
}
