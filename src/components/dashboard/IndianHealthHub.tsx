import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';
import { 
  Coffee, Droplet, Plus, Minus, Utensils, Activity, 
  TrendingUp, Moon, Flame, HeartHandshake, HelpCircle, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const INDIAN_FOODS_DIRECTORY = [
  { name: 'Poha (1 plate)', calories: 250, protein: 4, type: 'Veg' },
  { name: 'Idli Sambar (2 idlis)', calories: 180, protein: 6, type: 'Veg' },
  { name: 'Masala Dosa (1)', calories: 350, protein: 7, type: 'Veg' },
  { name: 'Dal Roti (1 bowl dal, 2 rotis)', calories: 380, protein: 14, type: 'Veg' },
  { name: 'Rice & Rajma (1 bowl)', calories: 420, protein: 12, type: 'Veg' },
  { name: 'Paneer Butter Masala + Roti (2)', calories: 550, protein: 18, type: 'Veg' },
  { name: 'Moong Dal Khichdi (1 bowl)', calories: 290, protein: 9, type: 'Veg' },
  { name: 'Chicken Tikka (6 pcs)', calories: 280, protein: 30, type: 'Non-Veg' },
  { name: 'Samosa (1 pc)', calories: 260, protein: 3, type: 'Junk' },
  { name: 'Gulab Jamun (1 pc)', calories: 150, protein: 2, type: 'Junk' }
];

export default function IndianHealthHub() {
  const queryClient = useQueryClient();
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedFood, setSelectedFood] = useState(INDIAN_FOODS_DIRECTORY[0].name);
  const [customFood, setCustomFood] = useState('');
  const [customCals, setCustomCals] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  // Vitals State
  const [stepsInput, setStepsInput] = useState('');
  const [sleepInput, setSleepInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [hrInput, setHrInput] = useState('');

  // Fetch today's health logs
  const { data: healthLogs = [] } = useQuery({
    queryKey: ['health-logs'],
    queryFn: async () => {
      const logs = await base44.entities.HealthLog.list();
      let todayLog = logs.find((l: any) => l.date === todayStr);
      if (!todayLog) {
        todayLog = await base44.entities.HealthLog.create({
          date: todayStr,
          water: 0,
          chai: 0,
          steps: 0,
          sleep: 0,
          heartRate: 0,
          weight: 0
        });
      }
      return logs;
    }
  });

  const todayLog = healthLogs.find((l: any) => l.date === todayStr) || {
    date: todayStr,
    water: 0,
    chai: 0,
    steps: 0,
    sleep: 0,
    heartRate: 0,
    weight: 0
  };

  // Fetch today's meal logs
  const { data: mealLogs = [] } = useQuery({
    queryKey: ['meal-logs'],
    queryFn: () => base44.entities.MealLog.list()
  });

  const todayMeals = mealLogs.filter((m: any) => m.date === todayStr);
  const totalCals = todayMeals.reduce((acc: number, curr: any) => acc + (curr.calories || 0), 0);
  const totalProtein = todayMeals.reduce((acc: number, curr: any) => acc + (curr.protein || 0), 0);

  // Mutations
  const updateHealthLogMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      return await base44.entities.HealthLog.update(todayLog.id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-logs'] });
    }
  });

  const logMealMutation = useMutation({
    mutationFn: async (mealData: any) => {
      return await base44.entities.MealLog.create({
        date: todayStr,
        ...mealData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-logs'] });
      // Award points for logging meals
      base44.entities.UserStats.list().then((stats) => {
        if (stats.length > 0) {
          base44.entities.UserStats.update(stats[0].id, {
            total_points: stats[0].total_points + 10,
            total_completions: stats[0].total_completions + 1
          });
          queryClient.invalidateQueries({ queryKey: ['user-stats'] });
        }
      });
      toast.success('Meal logged successfully! (+10 pts)');
    }
  });

  const handleWaterChange = (change: number) => {
    const newVal = Math.max(0, todayLog.water + change);
    updateHealthLogMutation.mutate({ water: newVal });
    if (newVal >= 8 && todayLog.water < 8) {
      toast.success('🎉 Goal Achieved: 8 glasses of Matka Water logged! Hydration Pro Badge progress updated!');
    }
  };

  const handleChaiChange = (change: number) => {
    const newVal = Math.max(0, todayLog.chai + change);
    updateHealthLogMutation.mutate({ chai: newVal });
    if (newVal > 2) {
      toast.warning('⚠️ Chai Limit Crossed! Excess caffeine might impact digestion and sleep. Try Herbal Kahwa next!');
    }
  };

  const handleLogPresetMeal = () => {
    const preset = INDIAN_FOODS_DIRECTORY.find(f => f.name === selectedFood);
    if (preset) {
      logMealMutation.mutate({
        name: preset.name,
        calories: preset.calories,
        protein: preset.protein
      });
    }
  };

  const handleLogCustomMeal = () => {
    if (!customFood) return;
    logMealMutation.mutate({
      name: customFood,
      calories: parseInt(customCals) || 0,
      protein: parseInt(customProtein) || 0
    });
    setCustomFood('');
    setCustomCals('');
    setCustomProtein('');
  };

  const handleLogVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: any = {};
    if (stepsInput) updateData.steps = parseInt(stepsInput);
    if (sleepInput) updateData.sleep = parseFloat(sleepInput);
    if (weightInput) updateData.weight = parseFloat(weightInput);
    if (hrInput) updateData.heartRate = parseInt(hrInput);

    updateHealthLogMutation.mutate(updateData);
    setStepsInput('');
    setSleepInput('');
    setWeightInput('');
    setHrInput('');
    toast.success('Vitals logged successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase font-semibold tracking-wider opacity-80">Desi Wellness Hub</span>
            <h2 className="text-2xl font-bold">Indian Health Summary</h2>
          </div>
          <Activity className="w-8 h-8 opacity-80 animate-pulse" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs opacity-80 block">Chai Cups</span>
            <span className="text-2xl font-bold block">{todayLog.chai} / 2</span>
            <span className="text-xs mt-1 block opacity-70">
              {todayLog.chai <= 2 ? 'Limit Ke Sath 👍' : 'Exceeded ⚠️'}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs opacity-80 block">Matka Hydration</span>
            <span className="text-2xl font-bold block">{todayLog.water} / 8</span>
            <span className="text-xs mt-1 block opacity-70">Glasses</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs opacity-80 block">Daily Steps</span>
            <span className="text-2xl font-bold block">{todayLog.steps || 0}</span>
            <span className="text-xs mt-1 block opacity-70">Goal: 10,000</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
            <span className="text-xs opacity-80 block">Total Calories</span>
            <span className="text-2xl font-bold block">{totalCals} kcal</span>
            <span className="text-xs mt-1 block opacity-70">Goal: 2000</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Hydration & Chai Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Beverages & Hydration</h3>
            <p className="text-sm text-slate-500">Track your daily water and chai consumption</p>
          </div>

          {/* Matka Water Tracker */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <span className="text-xl">🏺</span>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">Matka Water</h4>
                <p className="text-xs text-blue-700">Traditional clay pot cooled hydration</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-700" onClick={() => handleWaterChange(-1)}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-lg font-bold text-blue-900">{todayLog.water} gl</span>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-700" onClick={() => handleWaterChange(1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chai Limiter */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-100 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-600/20">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">Chai / Coffee</h4>
                  <p className="text-xs text-amber-700">Maintain daily limit under 2 cups</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-700" onClick={() => handleChaiChange(-1)}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-bold text-amber-900">{todayLog.chai} cups</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-amber-700" onClick={() => handleChaiChange(1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {todayLog.chai > 2 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-100 flex items-start gap-2"
              >
                <span>☕</span>
                <span><strong>Chai Limit Crossed!</strong> You logged {todayLog.chai} cups today. Swapping excess cups with ginger tea, tulsi decoction, or hot water builds high gut immunity.</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Desi Meal Logger Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Desi Diet Tracker</h3>
            <p className="text-sm text-slate-500">Log Indian foods, track calories & protein</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <select
                className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                value={selectedFood}
                onChange={(e) => setSelectedFood(e.target.value)}
              >
                {INDIAN_FOODS_DIRECTORY.map((food) => (
                  <option key={food.name} value={food.name}>
                    {food.name} ({food.calories} kcal, {food.protein}g P)
                  </option>
                ))}
              </select>
              <Button onClick={handleLogPresetMeal} className="bg-violet-600 hover:bg-violet-700 rounded-xl px-4">
                Log Meal
              </Button>
            </div>

            {/* Custom food logger */}
            <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
              <h4 className="text-xs font-semibold text-slate-500 uppercase">Log Custom Food</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="Food Name (Roti, Dal)" 
                  value={customFood} 
                  onChange={(e) => setCustomFood(e.target.value)}
                  className="col-span-3 text-xs bg-white rounded-xl"
                />
                <Input 
                  placeholder="Calories (kcal)" 
                  type="number"
                  value={customCals} 
                  onChange={(e) => setCustomCals(e.target.value)}
                  className="text-xs bg-white rounded-xl"
                />
                <Input 
                  placeholder="Protein (g)" 
                  type="number"
                  value={customProtein} 
                  onChange={(e) => setCustomProtein(e.target.value)}
                  className="text-xs bg-white rounded-xl"
                />
                <Button onClick={handleLogCustomMeal} size="sm" className="bg-slate-900 hover:bg-slate-800 rounded-xl text-xs">
                  Add custom
                </Button>
              </div>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Daily Calories: {totalCals} / 2000 kcal</span>
                  <span>{Math.round((totalCals / 2000) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalCals / 2000) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Protein Intake: {totalProtein} / 60g</span>
                  <span>{Math.round((totalProtein / 60) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalProtein / 60) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vitals Form & Progress Graphs */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Vitals & Activity Log</h3>
            <p className="text-sm text-slate-500">Record daily health vitals to analyze habits</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-violet-50 text-violet-700 rounded-full text-xs font-semibold">
              Today: {todayLog.steps || 0} Steps
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
              Today: {todayLog.sleep || 0}h Sleep
            </span>
          </div>
        </div>

        <form onSubmit={handleLogVitals} className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Steps Count</label>
            <Input 
              type="number" 
              placeholder="e.g. 8500" 
              value={stepsInput} 
              onChange={(e) => setStepsInput(e.target.value)}
              className="rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Sleep (Hours)</label>
            <Input 
              type="number" 
              step="0.5"
              placeholder="e.g. 7.5" 
              value={sleepInput} 
              onChange={(e) => setSleepInput(e.target.value)}
              className="rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Weight (kg)</label>
            <Input 
              type="number" 
              step="0.1"
              placeholder="e.g. 72.5" 
              value={weightInput} 
              onChange={(e) => setWeightInput(e.target.value)}
              className="rounded-xl bg-slate-50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Heart Rate (bpm)</label>
            <Input 
              type="number" 
              placeholder="e.g. 72" 
              value={hrInput} 
              onChange={(e) => setHrInput(e.target.value)}
              className="rounded-xl bg-slate-50"
            />
          </div>
          <div className="col-span-2 md:col-span-1 flex items-end">
            <Button type="submit" className="w-full bg-slate-950 hover:bg-slate-900 rounded-xl">
              Save Vitals
            </Button>
          </div>
        </form>

        {/* Display logged foods */}
        {todayMeals.length > 0 && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Logged Meals Today</h4>
            <div className="flex flex-wrap gap-2">
              {todayMeals.map((meal: any) => (
                <span key={meal.id} className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-medium">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {meal.name} ({meal.calories} kcal / {meal.protein}g protein)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
