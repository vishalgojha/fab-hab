import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, Brain, Shield, Glasses, MessageCircle, 
  ChevronRight, Sparkles, Menu, X, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import HabitCard from '@/components/dashboard/HabitCard';
import PredictionCard from '@/components/dashboard/PredictionCard';
import NeuroFeedbackCard from '@/components/dashboard/NeuroFeedbackCard';
import StakeCard from '@/components/dashboard/StakeCard';
import ARVisualization from '@/components/dashboard/ARVisualization';
import CreateHabitDialog from '@/components/dashboard/CreateHabitDialog';
import CreateStakeDialog from '@/components/dashboard/CreateStakeDialog';

export default function Dashboard() {
  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [showCreateStake, setShowCreateStake] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.filter({ is_active: true })
  });

  const { data: predictions = [] } = useQuery({
    queryKey: ['predictions'],
    queryFn: () => base44.entities.Prediction.filter({ is_read: false }, '-created_date', 5)
  });

  const { data: stakes = [] } = useQuery({
    queryKey: ['stakes'],
    queryFn: () => base44.entities.Stake.filter({ status: 'active' })
  });

  // Generate predictions on load
  useEffect(() => {
    const generatePredictions = async () => {
      try {
        await base44.functions.invoke('generatePrediction');
        queryClient.invalidateQueries(['predictions']);
      } catch (error) {
        console.error('Failed to generate predictions:', error);
      }
    };
    if (habits.length > 0) {
      generatePredictions();
    }
  }, [habits.length]);

  const handleDeleteHabit = async (id) => {
    await base44.entities.Habit.delete(id);
    queryClient.invalidateQueries(['habits']);
  };

  const refreshData = () => {
    queryClient.invalidateQueries(['habits']);
    queryClient.invalidateQueries(['predictions']);
    queryClient.invalidateQueries(['stakes']);
  };

  const whatsappUrl = base44.agents.getWhatsAppConnectURL('habit_coach');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Home')} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 hidden sm:block">Nexus</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                AI Coach
              </a>
              
              <Button
                onClick={() => setShowCreateHabit(true)}
                className="bg-slate-900 hover:bg-slate-800 rounded-full px-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Habit</span>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                onClick={() => setMobileMenu(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-white"
          >
            <div className="p-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenu(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <a 
                href={whatsappUrl}
                target="_blank"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium">WhatsApp AI Coach</span>
              </a>
              <button
                onClick={() => { setShowCreateStake(true); setMobileMenu(false); }}
                className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl w-full"
              >
                <Shield className="w-5 h-5 text-amber-600" />
                <span className="font-medium">Create Stake</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Predictions Banner */}
        {predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-medium text-slate-600">AI Insights</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {predictions.slice(0, 3).map((pred) => (
                <PredictionCard 
                  key={pred.id} 
                  prediction={pred} 
                  onDismiss={() => queryClient.invalidateQueries(['predictions'])}
                />
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Habits Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Your Habits</h2>
                <span className="text-sm text-slate-400">{habits.length} active</span>
              </div>
              
              {habitsLoading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-white rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : habits.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {habits.map((habit) => (
                      <HabitCard 
                        key={habit.id} 
                        habit={habit} 
                        onComplete={refreshData}
                        onDelete={handleDeleteHabit}
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
                  <div className="w-16 h-16 mx-auto mb-4 bg-violet-50 rounded-2xl flex items-center justify-center">
                    <Plus className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No habits yet</h3>
                  <p className="text-slate-500 mb-4">Start building your first habit</p>
                  <Button onClick={() => setShowCreateHabit(true)} className="bg-violet-600 hover:bg-violet-700">
                    Create First Habit
                  </Button>
                </motion.div>
              )}
            </section>

            {/* AR Visualization */}
            {habits.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Glasses className="w-4 h-4 text-slate-400" />
                  <h2 className="text-lg font-semibold text-slate-900">AR Preview</h2>
                </div>
                <ARVisualization habits={habits} />
              </section>
            )}

            {/* Stakes Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <h2 className="text-lg font-semibold text-slate-900">Your Stakes</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowCreateStake(true)}
                  className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Stake
                </Button>
              </div>
              
              {stakes.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {stakes.map((stake) => (
                    <StakeCard key={stake.id} stake={stake} />
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 text-center">
                  <p className="text-sm text-amber-700 mb-3">
                    No active stakes. Put skin in the game to boost commitment.
                  </p>
                  <Button 
                    size="sm"
                    onClick={() => setShowCreateStake(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    Create Your First Stake
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <NeuroFeedbackCard />
            
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5">
              <h3 className="font-medium text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Chat with Nexus AI</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <button
                  onClick={() => setShowCreateHabit(true)}
                  className="flex items-center justify-between p-3 bg-violet-50 rounded-xl hover:bg-violet-100 transition-colors w-full group"
                >
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5 text-violet-600" />
                    <span className="text-sm font-medium text-violet-700">New Habit</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-violet-400 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowCreateStake(true)}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors w-full group"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Create Stake</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Feature Teaser */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400 uppercase tracking-wide">Coming Soon</span>
              </div>
              <h3 className="font-medium mb-2">BCI Integration</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect your Neuralink or other BCIs for real-time neural optimization of habit timing.
              </p>
            </div>
          </div>
        </div>
      </main>

      <CreateHabitDialog 
        open={showCreateHabit} 
        onClose={() => setShowCreateHabit(false)}
        onCreated={refreshData}
      />
      
      <CreateStakeDialog 
        open={showCreateStake} 
        onClose={() => setShowCreateStake(false)}
        onCreated={refreshData}
        habits={habits}
      />
    </div>
  );
}