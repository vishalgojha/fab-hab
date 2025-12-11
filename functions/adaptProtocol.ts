import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habit_id } = await req.json();
    
    if (!habit_id) {
      return Response.json({ error: 'habit_id required' }, { status: 400 });
    }
    
    const habits = await base44.entities.Habit.filter({ id: habit_id });
    const habit = habits[0];
    
    if (!habit) {
      return Response.json({ error: 'Habit not found' }, { status: 404 });
    }
    
    // Get performance data
    const logs = await base44.entities.HabitLog.filter({ habit_id }, '-date', 21);
    
    if (logs.length < 7) {
      return Response.json({ message: 'Not enough data for adaptation' });
    }
    
    // Calculate performance metrics
    const completionRate = logs.filter(l => l.completed).length / logs.length;
    const avgIntensity = logs.reduce((sum, l) => sum + (l.intensity_rating || 5), 0) / logs.length;
    const recentWeek = logs.slice(0, 7);
    const recentCompletionRate = recentWeek.filter(l => l.completed).length / 7;
    
    // Trend detection
    const firstHalf = logs.slice(Math.floor(logs.length / 2));
    const secondHalf = logs.slice(0, Math.floor(logs.length / 2));
    const firstHalfRate = firstHalf.filter(l => l.completed).length / firstHalf.length;
    const secondHalfRate = secondHalf.filter(l => l.completed).length / secondHalf.length;
    
    let trend = 'stable';
    if (secondHalfRate > firstHalfRate + 0.15) trend = 'improving';
    else if (secondHalfRate < firstHalfRate - 0.15) trend = 'declining';
    
    // Get AI recommendation for protocol adjustment
    const aiAdaptation = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an adaptive habit protocol AI, like a personal trainer that adjusts workout plans.

Habit: ${habit.name}
Current Protocol: ${JSON.stringify(habit.current_protocol || {duration_minutes: 30, intensity: 'moderate'})}
Current Streak: ${habit.current_streak}
Performance Trend: ${trend}
21-day Completion Rate: ${(completionRate * 100).toFixed(0)}%
Recent 7-day Rate: ${(recentCompletionRate * 100).toFixed(0)}%
Average Intensity: ${avgIntensity.toFixed(1)}/10

ADAPTIVE RULES:
- If improving and >85% completion: Increase difficulty/duration by 10-20%
- If stable 70-85%: Minor adjustments, optimize timing
- If declining or <70%: Reduce difficulty by 20-30%, add rest days
- If burnout signs: Significant reduction, focus on consistency over intensity

Suggest:
1. Should we adjust? (yes/no)
2. Adjustment type: difficulty_increase/difficulty_decrease/schedule_shift/duration_change/intensity_change/rest_addition
3. New protocol with specific numbers
4. Reason why this adjustment
5. Expected improvement
6. Trigger metric that caused this`,
      response_json_schema: {
        type: "object",
        properties: {
          should_adjust: { type: "boolean" },
          adjustment_type: { type: "string" },
          new_protocol: {
            type: "object",
            properties: {
              duration_minutes: { type: "number" },
              intensity: { type: "string" },
              rest_days: { 
                type: "array", 
                items: { type: "number" } 
              }
            }
          },
          reason: { type: "string" },
          expected_improvement: { type: "string" },
          trigger_metric: { type: "string" }
        }
      }
    });
    
    if (!aiAdaptation.should_adjust) {
      return Response.json({ 
        adjusted: false, 
        message: 'No adjustment needed - protocol is optimal' 
      });
    }
    
    // Apply the adjustment
    const previousProtocol = habit.current_protocol || {duration_minutes: 30, intensity: 'moderate'};
    
    await base44.entities.Habit.update(habit_id, {
      current_protocol: aiAdaptation.new_protocol,
      performance_trend: trend,
      last_adjustment_date: new Date().toISOString().split('T')[0],
      adaptive_difficulty: 'adaptive'
    });
    
    // Log the adjustment
    const adjustment = await base44.entities.ProtocolAdjustment.create({
      habit_id,
      adjustment_type: aiAdaptation.adjustment_type,
      previous_protocol: previousProtocol,
      new_protocol: aiAdaptation.new_protocol,
      reason: aiAdaptation.reason,
      trigger_metric: aiAdaptation.trigger_metric,
      applied_date: new Date().toISOString().split('T')[0],
      expected_improvement: aiAdaptation.expected_improvement,
      user_notified: false
    });
    
    return Response.json({
      adjusted: true,
      adjustment,
      previous: previousProtocol,
      new: aiAdaptation.new_protocol,
      reason: aiAdaptation.reason
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});