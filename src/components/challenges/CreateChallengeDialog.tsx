import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { base44 } from '@/lib/base44Stub';
import { format } from 'date-fns';

export default function CreateChallengeDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    habit_category: 'any',
    visibility: 'public',
    goal_type: 'streak_days',
    goal_value: 30,
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    is_team_based: false,
    max_participants: null as number | null,
    reward_points: 500
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const challenge = await base44.entities.Challenge.create({
        ...formData,
        status: new Date(formData.start_date) > new Date() ? 'upcoming' : 'active',
        participant_count: 0,
        invite_code: formData.visibility === 'private' ? Math.random().toString(36).substring(7).toUpperCase() : null
      });
      
      const user = await base44.auth.me();
      await base44.entities.ChallengeParticipant.create({
        challenge_id: challenge.id,
        user_email: user.email,
        user_name: user.full_name,
        joined_date: new Date().toISOString()
      });
      
      await base44.entities.Challenge.update(challenge.id, { participant_count: 1 });
      
      onCreated?.();
      onClose();
    } catch (error) {
      console.error('Failed to create challenge:', error);
    }
  };

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
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-violet-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">Create Challenge</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Challenge Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 30-Day Meditation Challenge"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the challenge..."
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                    <Select value={formData.habit_category} onValueChange={(value) => setFormData({ ...formData, habit_category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Habit</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="productivity">Productivity</SelectItem>
                        <SelectItem value="learning">Learning</SelectItem>
                        <SelectItem value="creativity">Creativity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
                    <Select value={formData.visibility} onValueChange={(value) => setFormData({ ...formData, visibility: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private (Invite Only)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Goal Type</label>
                    <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="streak_days">Streak Days</SelectItem>
                        <SelectItem value="total_completions">Total Completions</SelectItem>
                        <SelectItem value="consistency_percentage">Consistency %</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Goal Value</label>
                    <Input
                      type="number"
                      value={formData.goal_value}
                      onChange={(e) => setFormData({ ...formData, goal_value: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Max Participants</label>
                    <Input
                      type="number"
                      value={formData.max_participants || ''}
                      onChange={(e) => setFormData({ ...formData, max_participants: e.target.value ? parseInt(e.target.value) : null })}
                      placeholder="Unlimited"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Reward Points</label>
                    <Input
                      type="number"
                      value={formData.reward_points}
                      onChange={(e) => setFormData({ ...formData, reward_points: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <div className="font-medium text-slate-900">Team-Based Challenge</div>
                    <div className="text-sm text-slate-500">Participants compete in teams</div>
                  </div>
                  <Switch
                    checked={formData.is_team_based}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_team_based: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                    Create Challenge
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
