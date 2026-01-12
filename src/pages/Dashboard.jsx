import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, Brain, Shield, Glasses, MessageCircle, 
  ChevronRight, Sparkles, Menu, X, Zap, Activity, TrendingUp, Trophy, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoachingBadge from '@/components/coach/CoachingBadge';
import CoachingNotificationCenter from '@/components/coach/CoachingNotificationCenter';

import HabitCard from '@/components/dashboard/HabitCard';
import AutoDetectedHabitCard from '@/components/core/AutoDetectedHabitCard';
import BreakForecastCard from '@/components/core/BreakForecastCard';
import EmotionLogDialog from '@/components/core/EmotionLogDialog';
import AdaptiveProtocolCard from '@/components/core/AdaptiveProtocolCard';
import NeuroFeedbackCard from '@/components/dashboard/NeuroFeedbackCard';
import CreateHabitDialog from '@/components/dashboard/CreateHabitDialog';
import AchievementUnlockModal from '@/components/gamification/AchievementUnlockModal';
import PointsLevelCard from '@/components/gamification/PointsLevelCard';
import BadgesGrid from '@/components/gamification/BadgesGrid';
import BadgeDetailModal from '@/components/gamification/BadgeDetailModal';
import Footer from '@/components/landing/Footer';

export default function Dashboard() {
  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [emotionLogHabit, setEmotionLogHabit] = useState(null);
  const [emotionLogCompleted, setEmotionLogCompleted] = useState(true);
  const [autoDetecting, setAutoDetecting] = useState(false);
  const [forecasting, setForecasting] = useState(false);
  const [achievementToShow, setAchievementToShow] = useState(null);
  const [badgeDetailModal, setBadgeDetailModal] = useState({ open: false, badge: null, unlocked: false });
  const [coachingCenterOpen, setCoachingCenterOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: () => base44.entities.Habit.filter({ is_active: true, status: 'active' })
  });

  const { data: suggestedHabits = [] } = useQuery({
    queryKey: ['suggested-habits'],
    queryFn: () => base44.entities.Habit.filter({ status: 'suggested' })
  });

  const { data: forecasts = [] } = useQuery({
    queryKey: ['forecasts'],
    queryFn: () => base44.entities.BreakForecast.filter({ is_addressed: false }, '-break_probability', 5)
  });

  const { data: adjustments = [] } = useQuery({
    queryKey: ['adjustments'],
    queryFn: () => base44.entities.ProtocolAdjustment.filter({ user_notified: false }, '-created_date', 3)
  });

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      const stats = await base44.entities.UserStats.list();
      if (stats.length === 0) {
        return await base44.entities.UserStats.create({
          total_points: 0,
          level: 1,
          total_completions: 0,
          longest_streak: 0,
          perfect_weeks: 0,
          badges_unlocked: 0
        });
      }
      return stats[0];
    }
  });

  const { data: badges = [] } = useQuery({
    queryKey: ['badges'],
    queryFn: () => base44.entities.Badge.list()
  });

  const { data: userAchievements = [] } = useQuery({
    queryKey: ['user-achievements'],
    queryFn: () => base44.entities.UserAchievement.list()
  });

  const handleAutoDetect = async () => {
    setAutoDetecting(true);
    try {
      await base44.functions.invoke('autoDetectHabits');
      queryClient.invalidateQueries(['suggested-habits']);
    } catch (error) {
      console.error('Failed to auto-detect:', error);
    } finally {
      setAutoDetecting(false);
    }
  };

  const handleForecast = async () => {
    setForecasting(true);
    try {
      await base44.functions.invoke('forecastBreaks');
      queryClient.invalidateQueries(['forecasts']);
    } catch (error) {
      console.error('Failed to forecast:', error);
    } finally {
      setForecasting(false);
    }
  };

  const handleDeleteHabit = async (id) => {
    await base44.entities.Habit.delete(id);
    queryClient.invalidateQueries(['habits']);
  };

  const refreshData = async () => {
    queryClient.invalidateQueries(['habits']);
    queryClient.invalidateQueries(['suggested-habits']);
    queryClient.invalidateQueries(['forecasts']);
    queryClient.invalidateQueries(['adjustments']);
    queryClient.invalidateQueries(['user-stats']);
    
    // Check for new achievements
    try {
      const result = await base44.functions.invoke('checkAchievements');
      if (result.data.new_achievements?.length > 0) {
        setAchievementToShow(result.data.new_achievements[0]);
        queryClient.invalidateQueries(['user-achievements']);
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    }
  };

  const handleHabitComplete = (habit) => {
    setEmotionLogHabit(habit);
    setEmotionLogCompleted(true);
  };

  const handleHabitSkip = (habit) => {
    setEmotionLogHabit(habit);
    setEmotionLogCompleted(false);
  };

  const handleAdjustmentAcknowledge = async (adjustmentId) => {
    await base44.entities.ProtocolAdjustment.update(adjustmentId, { user_notified: true });
    queryClient.invalidateQueries(['adjustments']);
  };

  const handleShareAchievement = (achievement) => {
    const badge = achievement.badge || achievement;
    const text = `🎉 I just unlocked "${badge.name}" in FabHab! ${badge.icon}`;
    const url = window.location.origin;
    
    if (navigator.share) {
      navigator.share({
        title: 'FabHab Achievement',
        text: text,
        url: url
      });
    } else {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, '_blank');
    }
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
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-semibold text-slate-900 hidden sm:block">FabHab</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <CoachingBadge onClick={() => setCoachingCenterOpen(true)} />

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
        {/* Core 4 Features Banner */}
        <div className="grid gap-3 mb-8">
          {/* Auto-detected Habits */}
          {suggestedHabits.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Auto-Detected Habits</h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {suggestedHabits.slice(0, 2).map((habit) => (
                  <AutoDetectedHabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onAction={refreshData}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Break Forecasts */}
          {forecasts.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Streak Risk Forecasts</h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {forecasts.slice(0, 2).map((forecast) => {
                  const habit = habits.find(h => h.id === forecast.habit_id);
                  return (
                    <BreakForecastCard 
                      key={forecast.id} 
                      forecast={forecast}
                      habitName={habit?.name || 'Habit'}
                      onIntervention={refreshData}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Protocol Adjustments */}
          {adjustments.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <h2 className="text-sm font-semibold text-slate-700">Adaptive Protocol Changes</h2>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {adjustments.map((adj) => {
                  const habit = habits.find(h => h.id === adj.habit_id);
                  return (
                    <AdaptiveProtocolCard 
                      key={adj.id} 
                      adjustment={adj}
                      habitName={habit?.name || 'Habit'}
                      onApply={() => handleAdjustmentAcknowledge(adj.id)}
                    />
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

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
                        onComplete={() => handleHabitComplete(habit)}
                        onSkip={() => handleHabitSkip(habit)}
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

            {/* AI Actions */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">AI Intelligence</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAutoDetect}
                  disabled={autoDetecting}
                  className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Sparkles className="w-5 h-5 text-violet-600" />
                    {autoDetecting && <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Auto-Detect Habits</h3>
                  <p className="text-xs text-slate-600">AI analyzes your patterns to suggest new habits</p>
                </button>

                <button
                  onClick={handleForecast}
                  disabled={forecasting || habits.length === 0}
                  className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl hover:shadow-md transition-all text-left group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-5 h-5 text-orange-600" />
                    {forecasting && <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />}
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Forecast Breaks</h3>
                  <p className="text-xs text-slate-600">Predict when streaks might break before it happens</p>
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Points & Level */}
            {userStats && <PointsLevelCard stats={userStats} />}
            
            {/* Badges Preview */}
            {badges.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="font-medium text-slate-900 mb-4 flex items-center justify-between">
                  <span>Achievements</span>
                  <span className="text-xs text-slate-400">
                    {userAchievements.length}/{badges.length}
                  </span>
                </h3>
                <BadgesGrid 
                  badges={badges.slice(0, 6)} 
                  userAchievements={userAchievements}
                  onBadgeClick={(badge, unlocked) => setBadgeDetailModal({ open: true, badge, unlocked })}
                />
              </div>
            )}
            
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
                    <span className="text-sm font-medium text-green-700">Chat with FabHab AI</span>
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

                <Link
                  to={createPageUrl('Challenges')}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">Join Challenges</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Core 4 Status */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
              <h3 className="font-medium mb-4 text-sm uppercase tracking-wide opacity-70">Core 4 Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Auto-Detection</span>
                  <span className="text-emerald-400">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Emotion-Aware</span>
                  <span className="text-emerald-400">✓ Learning</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Break Forecasting</span>
                  <span className="text-emerald-400">✓ Predicting</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Adaptive Protocols</span>
                  <span className="text-emerald-400">✓ Adjusting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CreateHabitDialog 
        open={showCreateHabit} 
        onClose={() => setShowCreateHabit(false)}
        onCreated={refreshData}
      />
      
      <EmotionLogDialog
        open={!!emotionLogHabit}
        onClose={() => setEmotionLogHabit(null)}
        habit={emotionLogHabit}
        completed={emotionLogCompleted}
        onSave={refreshData}
      />
      
      <AchievementUnlockModal
        achievement={achievementToShow}
        open={!!achievementToShow}
        onClose={() => setAchievementToShow(null)}
        onShare={handleShareAchievement}
      />
      
      <BadgeDetailModal
        badge={badgeDetailModal.badge}
        isUnlocked={badgeDetailModal.unlocked}
        open={badgeDetailModal.open}
        onClose={() => setBadgeDetailModal({ open: false, badge: null, unlocked: false })}
        onShare={handleShareAchievement}
      />

      <CoachingNotificationCenter 
        isOpen={coachingCenterOpen}
        onClose={() => setCoachingCenterOpen(false)}
      />

      <Footer />
      </div>
      );
      }