import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  Plus, Brain, Flame, Activity, TrendingUp, Sparkles,
  MessageCircle, Trophy, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Sample demo data
const demoHabits = [
  { id: '1', name: 'Morning Meditation', category: 'mindfulness', current_streak: 15, best_streak: 15 },
  { id: '2', name: 'Evening Run', category: 'fitness', current_streak: 8, best_streak: 12 },
  { id: '3', name: 'Read for 30min', category: 'learning', current_streak: 22, best_streak: 22 }
];

const demoStats = {
  total_points: 3450,
  level: 4,
  total_completions: 87,
  longest_streak: 22,
  badges_unlocked: 5
};

const demoBadges = [
  { icon: '👣', name: 'First Steps', unlocked: true },
  { icon: '🔥', name: 'Week Warrior', unlocked: true },
  { icon: '💪', name: 'Month Master', unlocked: false },
  { icon: '🎯', name: 'Habit Collector', unlocked: true }
];

const demoForecast = {
  habit_name: 'Evening Run',
  break_probability: 65,
  risk_level: 'medium',
  emotional_insight: 'Recent logs show increased fatigue after work meetings'
};

export default function Demo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const categoryColors = {
    health: 'from-emerald-500 to-teal-500',
    productivity: 'from-blue-500 to-cyan-500',
    mindfulness: 'from-violet-500 to-purple-500',
    fitness: 'from-orange-500 to-red-500',
    learning: 'from-amber-500 to-yellow-500'
  };

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
              <span className="text-xl font-semibold text-slate-900">fabhab</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                Demo Mode
              </span>
              <Link to={createPageUrl('Dashboard')}>
                <Button className="bg-slate-900 hover:bg-slate-800 rounded-full">
                  Start Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Demo Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity },
            { id: 'ai', label: 'AI Features', icon: Brain },
            { id: 'gamification', label: 'Gamification', icon: Trophy },
            { id: 'whatsapp', label: 'WhatsApp AI', icon: MessageCircle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Habits</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {demoHabits.map((habit, idx) => (
                      <motion.div
                        key={habit.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[habit.category]} flex items-center justify-center shadow-lg`}>
                            <span className="text-white text-lg font-medium">
                              {habit.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-900">{habit.name}</h3>
                            <p className="text-xs text-slate-400 capitalize">{habit.category}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Flame className="w-3.5 h-3.5 text-orange-500" />
                              <span className="text-xs font-medium text-orange-500">
                                {habit.current_streak} day streak
                              </span>
                            </div>
                          </div>
                          <Button size="icon" className="h-10 w-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600">
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Zap className="w-5 h-5 text-amber-600" />
                        <span className="text-2xl font-bold text-slate-900">Level {demoStats.level}</span>
                      </div>
                      <p className="text-sm text-slate-600">550 points to Level 5</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-600 mb-1">
                        <Trophy className="w-4 h-4" />
                        <span className="font-bold text-lg">{demoStats.total_points.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-500">Total Points</p>
                    </div>
                  </div>
                  <Progress value={45} className="h-3 mb-3" />
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-slate-900">{demoStats.total_completions}</div>
                      <div className="text-xs text-slate-500">Completions</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-slate-900">{demoStats.longest_streak}</div>
                      <div className="text-xs text-slate-500">Best Streak</div>
                    </div>
                    <div className="bg-white/60 rounded-lg p-2">
                      <div className="text-lg font-bold text-slate-900">{demoStats.badges_unlocked}</div>
                      <div className="text-xs text-slate-500">Badges</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-5">
                  <h3 className="font-medium text-slate-900 mb-4">Achievements</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {demoBadges.map((badge, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border-2 text-center ${
                          badge.unlocked
                            ? 'border-violet-300 bg-violet-50'
                            : 'border-slate-200 bg-slate-100 opacity-50'
                        }`}
                      >
                        <div className="text-3xl mb-1">{badge.icon}</div>
                        <div className="text-xs font-medium text-slate-700 line-clamp-2">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Features View */}
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-slate-900 mb-2">
                  AI-Powered <span className="font-medium">Intelligence</span>
                </h2>
                <p className="text-slate-600">Predictive insights that keep you on track</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                  <Sparkles className="w-8 h-8 text-violet-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Auto-Detection</h3>
                  <p className="text-slate-600 mb-4">AI analyzes your patterns and automatically suggests new habits based on your behavior.</p>
                  <div className="bg-white rounded-xl p-4 text-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                      <span className="font-medium text-slate-900">Detected: "Morning Stretching"</span>
                    </div>
                    <p className="text-slate-600 text-xs">95% confidence • Based on 14 days of pattern data</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-200">
                  <Activity className="w-8 h-8 text-orange-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Break Forecasting</h3>
                  <p className="text-slate-600 mb-4">Predicts when your streaks might break before it happens, so you can take action.</p>
                  <div className="bg-white rounded-xl p-4 text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{demoForecast.habit_name}</span>
                      <span className="text-orange-600 font-bold">{demoForecast.break_probability}% risk</span>
                    </div>
                    <p className="text-slate-600 text-xs">{demoForecast.emotional_insight}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                  <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Adaptive Protocols</h3>
                  <p className="text-slate-600 mb-4">Automatically adjusts difficulty and timing based on your performance trends.</p>
                  <div className="bg-white rounded-xl p-4 text-sm">
                    <span className="font-medium text-slate-900">Protocol adjusted for "Evening Run"</span>
                    <p className="text-slate-600 text-xs mt-1">Duration: 30min → 20min (recovery period)</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200">
                  <Brain className="w-8 h-8 text-pink-600 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Emotion-Aware</h3>
                  <p className="text-slate-600 mb-4">Tracks emotional states to understand what drives your habits and what blocks them.</p>
                  <div className="bg-white rounded-xl p-4 text-sm">
                    <span className="font-medium text-slate-900">Pattern identified</span>
                    <p className="text-slate-600 text-xs mt-1">You're 3x more likely to complete when energized vs. stressed</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Gamification View */}
          {activeTab === 'gamification' && (
            <motion.div
              key="gamification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-slate-900 mb-2">
                  Earn <span className="font-medium">Rewards</span>
                </h2>
                <p className="text-slate-600">Level up and unlock achievements as you build habits</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <Trophy className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Points & Levels</h3>
                  <p className="text-slate-600 mb-4">Earn points for every habit completion and level up to unlock exclusive features.</p>
                  <div className="space-y-3">
                    {[
                      { action: 'Complete habit', points: 10 },
                      { action: 'Maintain 7-day streak', points: 50 },
                      { action: 'Unlock badge', points: 100 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{item.action}</span>
                        <span className="font-bold text-amber-600">+{item.points}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-6">
                  <div className="text-6xl mb-4">🏆</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Achievement Badges</h3>
                  <p className="text-slate-600 mb-4">Unlock special badges by reaching milestones and completing challenges.</p>
                  <div className="grid grid-cols-4 gap-2">
                    {['👣', '🔥', '💪', '👑', '🎯', '💯', '🌅', '🦉'].map((emoji, idx) => (
                      <div
                        key={idx}
                        className="aspect-square flex items-center justify-center text-3xl bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-semibold mb-4">Social Sharing</h3>
                  <p className="text-slate-300 mb-6">Share your achievements with friends and inspire others to build better habits.</p>
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-sm mb-3">🎉 I just unlocked "100 Day Legend" in fabhab! 👑</p>
                    <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Achievement
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* WhatsApp View */}
          {activeTab === 'whatsapp' && (
            <motion.div
              key="whatsapp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-light text-slate-900 mb-2">
                  Your AI coach, <span className="font-medium">in your pocket</span>
                </h2>
                <p className="text-slate-600">Log habits, get insights, and receive interventions via WhatsApp</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="space-y-4 mb-6">
                    {[
                      '💬 Log habits with natural language',
                      '🎯 Receive predictive alerts',
                      '💡 Get personalized interventions',
                      '📊 Track streaks and progress'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        {item}
                      </div>
                    ))}
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect WhatsApp
                  </Button>
                </div>

                <div className="relative mx-auto w-72">
                  <div className="bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                      <div className="bg-green-600 px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <span className="text-white text-lg">F</span>
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">fabhab AI</div>
                          <div className="text-green-100 text-xs">online</div>
                        </div>
                      </div>
                      
                      <div className="p-4 space-y-3 h-80 bg-[#e5ddd5]">
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm text-slate-700">Hey! Ready for your meditation? 🧘</p>
                            <p className="text-xs text-slate-400 mt-1">9:00 AM</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <div className="bg-green-100 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm text-slate-700">Done! 10 minutes ✓</p>
                            <p className="text-xs text-slate-400 mt-1">9:11 AM</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-start">
                          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] shadow-sm">
                            <p className="text-sm text-slate-700">Amazing! 15-day streak 🔥 +10 points</p>
                            <p className="text-xs text-slate-400 mt-1">9:11 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to build lasting habits?</h2>
            <p className="text-violet-100 mb-8 max-w-2xl mx-auto">
              Join fabhab and experience AI-powered habit intelligence that actually works.
            </p>
            <Link to={createPageUrl('Dashboard')}>
              <Button size="lg" className="bg-white text-violet-600 hover:bg-slate-50 px-8 rounded-full shadow-xl">
                Start Free
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}