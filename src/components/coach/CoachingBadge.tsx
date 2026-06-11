import React from 'react';
import { motion } from 'framer-motion';
import { Heart, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/lib/base44Stub';

export default function CoachingBadge({ onClick }: { onClick?: () => void }) {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['coaching-unread-count'],
    queryFn: async () => {
      const notifications = await base44.entities.CoachingNotification.filter({ is_read: false });
      return notifications.length;
    },
    refetchInterval: 30000
  });

  const { data: urgentNotification } = useQuery({
    queryKey: ['coaching-urgent'],
    queryFn: async () => {
      const notifications = await base44.entities.CoachingNotification.filter(
        { is_read: false, priority: 'high' },
        '-created_date',
        1
      );
      return notifications[0];
    },
    refetchInterval: 30000
  });

  if (unreadCount === 0) return null;

  const isUrgent = urgentNotification?.priority === 'high';

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative p-3 rounded-full ${
        isUrgent 
          ? 'bg-red-100 hover:bg-red-200' 
          : 'bg-violet-100 hover:bg-violet-200'
      } transition-colors`}
    >
      {isUrgent ? (
        <AlertCircle className="w-5 h-5 text-red-600" />
      ) : (
        <Heart className="w-5 h-5 text-violet-600" />
      )}

      {unreadCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {Math.min(unreadCount, 9)}
        </motion.div>
      )}

      {isUrgent && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 border-2 border-red-500 rounded-full opacity-30"
        />
      )}
    </motion.button>
  );
}
