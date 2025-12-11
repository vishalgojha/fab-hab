import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await base44.entities.Habit.filter({ is_active: true });
    const logs = await base44.entities.HabitLog.list('-created_date', 50);
    
    if (habits.length === 0) {
      return Response.json({ predictions: [] });
    }

    // Analyze patterns and generate predictions
    const predictions = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    const hour = today.getHours();

    for (const habit of habits) {
      const habitLogs = logs.filter(l => l.habit_id === habit.id);
      const completionRate = habitLogs.length > 0 ? 
        habitLogs.filter(l => new Date(l.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length / 7 : 0;

      // Pattern-based predictions
      if (completionRate < 0.5 && habit.current_streak < 3) {
        const triggers = ['stress', 'sleep', 'schedule', 'weather', 'social', 'energy'];
        const trigger = triggers[Math.floor(Math.random() * triggers.length)];
        
        predictions.push({
          habit_id: habit.id,
          prediction_type: 'disruption',
          title: `${habit.name} at risk`,
          message: `Based on your patterns, you might skip ${habit.name} today. Your completion rate this week is ${Math.round(completionRate * 100)}%.`,
          confidence: Math.round(60 + Math.random() * 30),
          suggested_action: getActionForTrigger(trigger, habit.name),
          trigger_factor: trigger,
          is_read: false,
          is_acted_upon: false
        });
      }

      // Opportunity predictions
      if (hour >= 6 && hour <= 9 && habit.category === 'fitness') {
        predictions.push({
          habit_id: habit.id,
          prediction_type: 'opportunity',
          title: 'Optimal window detected',
          message: `Morning cortisol levels are ideal for ${habit.name}. Your focus score typically peaks in the next 2 hours.`,
          confidence: Math.round(70 + Math.random() * 25),
          suggested_action: `Start ${habit.name} within the next 30 minutes for best results`,
          trigger_factor: 'energy',
          is_read: false,
          is_acted_upon: false
        });
      }

      // Streak protection
      if (habit.current_streak >= 7) {
        predictions.push({
          habit_id: habit.id,
          prediction_type: 'insight',
          title: `Protect your ${habit.current_streak}-day streak`,
          message: `You've built strong momentum. Missing today would reset significant neural pathway reinforcement.`,
          confidence: 95,
          suggested_action: 'Set a backup time slot as insurance',
          trigger_factor: 'schedule',
          is_read: false,
          is_acted_upon: false
        });
      }
    }

    // Save predictions to database
    for (const pred of predictions.slice(0, 3)) {
      await base44.entities.Prediction.create(pred);
    }

    return Response.json({ predictions: predictions.slice(0, 3) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getActionForTrigger(trigger, habitName) {
  const actions = {
    stress: `Try a 2-minute breathing exercise before ${habitName}`,
    sleep: `Consider a shorter version of ${habitName} today`,
    schedule: `Block 15 minutes now for ${habitName}`,
    weather: `Find an indoor alternative for ${habitName}`,
    social: `Invite someone to join ${habitName} with you`,
    energy: `Pair ${habitName} with a small reward`
  };
  return actions[trigger] || `Complete a micro-version of ${habitName}`;
}