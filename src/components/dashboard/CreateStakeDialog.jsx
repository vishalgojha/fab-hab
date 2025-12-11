import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Calendar, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { Slider } from '@/components/ui/slider';
import { format, addDays } from 'date-fns';

export default function CreateStakeDialog({ open, onClose, onCreated, habits }) {
  const [form, setForm] = useState({
    goal_description: '',
    stake_amount: 50,
    deadline: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    habit_id: '',
    proof_required: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.goal_description.trim()) return;
    
    setLoading(true);
    try {
      await base44.entities.Stake.create({
        ...form,
        status: 'active',
        completion_percentage: 0
      });
      onCreated?.();
      onClose();
      setForm({
        goal_description: '',
        stake_amount: 50,
        deadline: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        habit_id: '',
        proof_required: false
      });
    } catch (error) {
      console.error('Failed to create stake:', error);
    } finally {
      setLoading(false);
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <Shield className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Create Stake</h2>
                    <p className="text-sm text-slate-500">Put skin in the game</p>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Your Commitment</Label>
                <Textarea
                  placeholder="e.g., Complete 30 days of morning meditation without missing"
                  value={form.goal_description}
                  onChange={(e) => setForm({ ...form, goal_description: e.target.value })}
                  className="resize-none h-20"
                />
              </div>
              
              {habits.length > 0 && (
                <div className="space-y-2">
                  <Label>Link to Habit (optional)</Label>
                  <select
                    value={form.habit_id}
                    onChange={(e) => setForm({ ...form, habit_id: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm"
                  >
                    <option value="">No linked habit</option>
                    {habits.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Stake Amount</Label>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-amber-500" />
                    <span className="text-lg font-semibold text-slate-900">{form.stake_amount}</span>
                    <span className="text-sm text-slate-400">tokens</span>
                  </div>
                </div>
                <Slider
                  value={[form.stake_amount]}
                  onValueChange={(v) => setForm({ ...form, stake_amount: v[0] })}
                  min={10}
                  max={500}
                  step={10}
                  className="py-2"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>10</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Deadline
                </Label>
                <Input
                  type="date"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  min={format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                  className="h-11"
                />
              </div>
              
              {/* Reward preview */}
              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-emerald-700">If you succeed</span>
                  <span className="font-semibold text-emerald-700">
                    +{Math.round(form.stake_amount * 0.2)} tokens
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">If you fail</span>
                  <span className="font-semibold text-red-600">
                    -{form.stake_amount} tokens
                  </span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                disabled={loading || !form.goal_description.trim()}
              >
                {loading ? 'Creating...' : 'Lock Stake'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}