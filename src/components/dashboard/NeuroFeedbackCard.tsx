import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Activity, Wifi, WifiOff } from 'lucide-react';
import { base44 } from '@/lib/base44Stub';
import { Progress } from '@/components/ui/progress';

export default function NeuroFeedbackCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNeuroData();
    const interval = setInterval(loadNeuroData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNeuroData = async () => {
    try {
      const response = await base44.functions.invoke('getNeuroFeedback');
      setData(response.data);
    } catch (error) {
      console.error('Failed to load neurofeedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 animate-pulse">
        <div className="h-40" />
      </div>
    );
  }

  const waveColors: Record<string, string> = {
    alpha: 'from-blue-400 to-cyan-400',
    beta: 'from-violet-400 to-purple-400',
    theta: 'from-amber-400 to-orange-400',
    gamma: 'from-emerald-400 to-teal-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-violet-500/10 rounded-2xl"
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/20 rounded-xl">
              <Brain className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="font-medium">Neurofeedback</h3>
              <p className="text-xs text-slate-400">Real-time brain state</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data?.deviceStatus === 'simulated' ? (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                <WifiOff className="w-3 h-3" />
                Simulated
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <Wifi className="w-3 h-3" />
                Connected
              </span>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-300">Focus Level</span>
            <span className="text-2xl font-bold">{data?.focusLevel}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${data?.focusLevel}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {data?.brainWaves && Object.entries(data.brainWaves).map(([wave, value]) => (
            <div key={wave} className="bg-slate-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 capitalize">{wave}</span>
                <span className="text-sm font-medium">{value as number}%</span>
              </div>
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${waveColors[wave]} rounded-full`}
                  style={{ width: `${value as number}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm">Flow Probability</span>
          </div>
          <span className="text-lg font-semibold text-amber-400">{data?.flowProbability}%</span>
        </div>
        
        <p className="mt-4 text-xs text-slate-400 leading-relaxed">
          {data?.recommendation}
        </p>
      </div>
    </motion.div>
  );
}
