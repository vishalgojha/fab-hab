import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays } from 'date-fns';

export default function StakeCard({ stake }) {
  const daysRemaining = differenceInDays(new Date(stake.deadline), new Date());
  const isExpired = daysRemaining < 0;
  
  const statusConfig = {
    active: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Clock },
    completed: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle },
    failed: { color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
    withdrawn: { color: 'text-slate-600', bg: 'bg-slate-50', icon: Shield }
  };
  
  const config = statusConfig[stake.status] || statusConfig.active;
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-medium text-slate-900 text-sm">{stake.goal_description}</h4>
            <p className="text-xs text-slate-400">
              Due {format(new Date(stake.deadline), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.bg} ${config.color}`}>
          <StatusIcon className="w-3 h-3" />
          {stake.status}
        </span>
      </div>
      
      {/* Stake amount */}
      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mb-4">
        <span className="text-xs text-slate-500">Staked</span>
        <span className="font-semibold text-slate-900">{stake.stake_amount} tokens</span>
      </div>
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-500">Completion</span>
          <span className="font-medium text-slate-700">{stake.completion_percentage || 0}%</span>
        </div>
        <Progress value={stake.completion_percentage || 0} className="h-2" />
      </div>
      
      {/* Days remaining */}
      {stake.status === 'active' && (
        <div className={`flex items-center justify-between text-xs ${
          daysRemaining <= 3 ? 'text-red-600' : 'text-slate-500'
        }`}>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isExpired ? 'Expired' : `${daysRemaining} days remaining`}
          </span>
          {stake.witnesses?.length > 0 && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {stake.witnesses.length} witnesses
            </span>
          )}
        </div>
      )}
      
      {/* Payout info for completed */}
      {stake.status === 'completed' && (
        <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg text-xs">
          <span className="text-emerald-600">Reward earned</span>
          <span className="font-semibold text-emerald-700">
            +{Math.round(stake.stake_amount * 0.2)} tokens
          </span>
        </div>
      )}
    </motion.div>
  );
}