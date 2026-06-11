import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Lightbulb, AlertCircle, Trophy, CheckCircle2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';
import { format } from 'date-fns';

const notificationIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  insight: Lightbulb,
  nudge: Heart,
  motivation: Trophy,
  warning: AlertCircle,
  achievement: CheckCircle2,
  adjustment_suggestion: MessageSquare
};

const priorityColors: Record<string, string> = {
  low: 'border-blue-200 bg-blue-50',
  medium: 'border-amber-200 bg-amber-50',
  high: 'border-red-200 bg-red-50'
};

export default function CoachingNotificationCenter({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['coaching-notifications'],
    queryFn: () => base44.entities.CoachingNotification.filter(
      { is_read: false },
      '-created_date',
      20
    ),
    enabled: isOpen
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => base44.entities.CoachingNotification.update(id, { is_read: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coaching-notifications'] })
  });

  const markAsActedMutation = useMutation({
    mutationFn: (id: string) => base44.entities.CoachingNotification.update(id, { is_acted_upon: true }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coaching-notifications'] })
  });

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Coach Insights</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-3">
          {notifications.length > 0 ? (
            <AnimatePresence>
              {notifications.map((notification: any) => {
                const Icon = notificationIcons[notification.notification_type];
                const isExpanded = expandedId === notification.id;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all ${priorityColors[notification.priority]}`}
                  >
                    <div onClick={() => setExpandedId(isExpanded ? null : notification.id)}>
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-slate-700 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">
                            {notification.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              notification.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                              notification.sentiment === 'concerning' ? 'bg-red-100 text-red-700' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {notification.sentiment}
                            </span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(notification.created_date), 'MMM d, h:mm a')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-slate-300/30"
                        >
                          <p className="text-sm text-slate-700 mb-2">{notification.message}</p>
                          
                          {notification.suggested_action && (
                            <div className="bg-white/50 rounded p-2 mb-3">
                              <p className="text-xs font-medium text-slate-700 mb-1">Suggested Action:</p>
                              <p className="text-xs text-slate-600">{notification.suggested_action}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsReadMutation.mutate(notification.id)}
                              className="flex-1 text-xs"
                            >
                              Got It
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => markAsActedMutation.mutate(notification.id)}
                              className="flex-1 bg-slate-900 hover:bg-slate-800 text-xs"
                            >
                              I'll Try This
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <Heart className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No new coaching insights yet. Keep building!</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
