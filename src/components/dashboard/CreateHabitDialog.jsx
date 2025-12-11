import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Brain, Glasses } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export default function CreateHabitDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'health',
    frequency: 'daily',
    target_count: 1,
    neurofeedback_enabled: false,
    ar_visualization: 'orb'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    setLoading(true);
    try {
      await base44.entities.Habit.create({
        ...form,
        current_streak: 0,
        best_streak: 0,
        is_active: true
      });
      onCreated?.();
      onClose();
      setForm({
        name: '',
        description: '',
        category: 'health',
        frequency: 'daily',
        target_count: 1,
        neurofeedback_enabled: false,
        ar_visualization: 'orb'
      });
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'health', label: 'Health' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'learning', label: 'Learning' },
    { value: 'social', label: 'Social' },
    { value: 'creativity', label: 'Creativity' }
  ];

  const arTypes = [
    { value: 'orb', label: 'Floating Orb' },
    { value: 'plant', label: 'Growing Plant' },
    { value: 'flame', label: 'Living Flame' },
    { value: 'wave', label: 'Energy Wave' },
    { value: 'crystal', label: 'Crystal Formation' }
  ];

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
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">New Habit</h2>
                <Button size="icon" variant="ghost" onClick={onClose} className="h-8 w-8">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Habit Name</Label>
                <Input
                  placeholder="e.g., Morning meditation"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="Why is this habit important to you?"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="resize-none h-20"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Futuristic Features */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Advanced Features</p>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-100 rounded-lg">
                      <Brain className="w-4 h-4 text-violet-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Neurofeedback</p>
                      <p className="text-xs text-slate-400">Optimize timing with brain state</p>
                    </div>
                  </div>
                  <Switch
                    checked={form.neurofeedback_enabled}
                    onCheckedChange={(v) => setForm({ ...form, neurofeedback_enabled: v })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Glasses className="w-4 h-4 text-slate-400" />
                    <Label>AR Visualization</Label>
                  </div>
                  <Select value={form.ar_visualization} onValueChange={(v) => setForm({ ...form, ar_visualization: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {arTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 bg-slate-900 hover:bg-slate-800"
                disabled={loading || !form.name.trim()}
              >
                {loading ? 'Creating...' : 'Create Habit'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}