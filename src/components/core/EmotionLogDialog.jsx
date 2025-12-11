import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';

const emotions = [
  { value: 'energized', emoji: '⚡', label: 'Energized' },
  { value: 'motivated', emoji: '🔥', label: 'Motivated' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'stressed', emoji: '😰', label: 'Stressed' },
  { value: 'anxious', emoji: '😨', label: 'Anxious' },
  { value: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed' }
];

const skipReasons = [
  { value: 'time_constraint', label: 'No Time' },
  { value: 'low_energy', label: 'Low Energy' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'procrastination', label: 'Procrastinated' },
  { value: 'external_event', label: 'Something Came Up' },
  { value: 'forgot', label: 'Forgot' },
  { value: 'other', label: 'Other' }
];

export default function EmotionLogDialog({ open, onClose, habit, completed, onSave }) {
  const [form, setForm] = useState({
    emotional_state_before: '',
    emotional_state_after: '',
    skip_reason: '',
    intensity_rating: 5,
    duration_minutes: habit?.current_protocol?.duration_minutes || 30,
    notes: ''
  });

  const handleSave = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    await base44.entities.HabitLog.create({
      habit_id: habit.id,
      date: today,
      completed_at: completed ? new Date().toISOString() : null,
      completed,
      ...form,
      context: {
        time_of_day: new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening',
        day_of_week: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()]
      }
    });
    
    if (completed) {
      const newStreak = (habit.current_streak || 0) + 1;
      await base44.entities.Habit.update(habit.id, {
        current_streak: newStreak,
        best_streak: Math.max(newStreak, habit.best_streak || 0)
      });
    }
    
    onSave?.();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[5%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-rose-500" />
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {completed ? 'Log Completion' : 'Log Skip'}
                    </h2>
                    <p className="text-sm text-slate-500">{habit.name}</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Emotion before */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <span>How did you feel before?</span>
                  <span className="text-xs text-slate-400">(Important for AI learning)</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.value}
                      onClick={() => setForm({ ...form, emotional_state_before: emotion.value })}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        form.emotional_state_before === emotion.value
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{emotion.emoji}</div>
                      <div className="text-xs font-medium text-slate-700">{emotion.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              {completed ? (
                <>
                  {/* Emotion after */}
                  <div className="space-y-3">
                    <Label>How do you feel now?</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {emotions.concat([
                        { value: 'accomplished', emoji: '✨', label: 'Accomplished' },
                        { value: 'peaceful', emoji: '🧘', label: 'Peaceful' }
                      ]).map((emotion) => (
                        <button
                          key={emotion.value}
                          onClick={() => setForm({ ...form, emotional_state_after: emotion.value })}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            form.emotional_state_after === emotion.value
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">{emotion.emoji}</div>
                          <div className="text-xs font-medium text-slate-700">{emotion.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Intensity */}
                  <div className="space-y-3">
                    <Label>Intensity (1-10)</Label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={form.intensity_rating}
                      onChange={(e) => setForm({ ...form, intensity_rating: parseInt(e.target.value) })}
                      className="w-full"
                    />
                    <div className="text-center text-2xl font-bold text-violet-600">
                      {form.intensity_rating}
                    </div>
                  </div>
                </>
              ) : (
                /* Skip reason */
                <div className="space-y-3">
                  <Label>Why did you skip?</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {skipReasons.map((reason) => (
                      <button
                        key={reason.value}
                        onClick={() => setForm({ ...form, skip_reason: reason.value })}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          form.skip_reason === reason.value
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-medium text-slate-700">{reason.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Notes */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Notes (optional)
                </Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional thoughts..."
                  className="h-20 resize-none"
                />
              </div>
              
              <Button
                onClick={handleSave}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800"
                disabled={!form.emotional_state_before}
              >
                Save Log
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}