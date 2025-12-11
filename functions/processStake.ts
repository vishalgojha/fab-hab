import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, stake_id } = body;

    if (action === 'check_deadlines') {
      // Check all active stakes for deadline processing
      const stakes = await base44.entities.Stake.filter({ status: 'active' });
      const today = new Date().toISOString().split('T')[0];
      const results = [];

      for (const stake of stakes) {
        if (stake.deadline <= today) {
          // Process stake completion/failure
          const habit = stake.habit_id ? 
            await base44.entities.Habit.filter({ id: stake.habit_id }) : null;
          
          const status = stake.completion_percentage >= 80 ? 'completed' : 'failed';
          await base44.entities.Stake.update(stake.id, { status });
          
          results.push({
            stake_id: stake.id,
            goal: stake.goal_description,
            status,
            payout: status === 'completed' ? stake.stake_amount * 1.2 : 0
          });
        }
      }

      return Response.json({ processed: results });
    }

    if (action === 'verify_completion' && stake_id) {
      const stakes = await base44.entities.Stake.filter({ id: stake_id });
      const stake = stakes[0];
      
      if (!stake) {
        return Response.json({ error: 'Stake not found' }, { status: 404 });
      }

      // Calculate completion based on habit logs if linked
      if (stake.habit_id) {
        const logs = await base44.entities.HabitLog.filter({ habit_id: stake.habit_id });
        const startDate = new Date(stake.created_date);
        const endDate = new Date(stake.deadline);
        const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const completedDays = logs.filter(l => 
          new Date(l.date) >= startDate && new Date(l.date) <= endDate
        ).length;
        
        const completion = Math.round((completedDays / totalDays) * 100);
        await base44.entities.Stake.update(stake.id, { completion_percentage: completion });
        
        return Response.json({
          stake_id: stake.id,
          completion_percentage: completion,
          days_completed: completedDays,
          days_total: totalDays,
          on_track: completion >= (completedDays / totalDays) * 100
        });
      }

      return Response.json({ stake_id: stake.id, status: stake.status });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});