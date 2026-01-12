import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { habit_id } = await req.json();

    // Fetch habit data
    const habit = await base44.entities.Habit.list();
    const currentHabit = habit.find(h => h.id === habit_id);

    if (!currentHabit) {
      return Response.json({ error: 'Habit not found' }, { status: 404 });
    }

    // Fetch recent logs for emotion and performance analysis
    const logs = await base44.entities.HabitLog.filter({
      habit_id: habit_id
    }, '-completed_at', 30);

    // Fetch forecasts to understand risk
    const forecasts = await base44.entities.BreakForecast.filter({
      habit_id: habit_id,
      is_addressed: false
    }, '-break_probability', 1);

    // Calculate metrics
    const completedLogs = logs.filter(l => l.completed);
    const completionRate = logs.length > 0 ? (completedLogs.length / logs.length) * 100 : 0;
    const emotionalStates = completedLogs.map(l => l.emotional_state_after).filter(Boolean);
    const emotionalTrend = emotionalStates.length > 0 ? emotionalStates[emotionalStates.length - 1] : 'neutral';
    const streakTrend = currentHabit.current_streak > currentHabit.best_streak ? 'improving' : currentHabit.current_streak === 0 ? 'broken' : 'stable';

    // Generate AI coaching insight
    const analysisPrompt = `
You are FabHab's AI Habit Coach. Analyze this user's habit data and generate a personalized, empathetic coaching message.

Habit: ${currentHabit.name}
Current Streak: ${currentHabit.current_streak} days
Best Streak: ${currentHabit.best_streak} days
Completion Rate (last 30 days): ${completionRate.toFixed(0)}%
Emotional Trend: ${emotionalTrend}
Streak Trend: ${streakTrend}
${forecasts.length > 0 ? `Risk of Breaking Streak: ${forecasts[0].break_probability}% (Primary risk: ${forecasts[0].primary_risk_factor})` : 'No immediate risk detected'}

Recent Emotions: ${emotionalStates.slice(-5).join(', ') || 'No data'}

Generate a JSON response with:
{
  "notification_type": "insight|nudge|motivation|warning|achievement",
  "title": "Short engaging title",
  "message": "Personalized, warm, empathetic message (2-3 sentences)",
  "suggested_action": "Specific, actionable advice",
  "sentiment": "positive|neutral|concerning",
  "priority": "low|medium|high"
}

Guidelines:
- Be warm, encouraging, and specific to their data
- If streak is strong, celebrate and reinforce
- If completion rate is low, offer gentle support and problem-solving
- Reference their emotional states to show understanding
- For warnings, be compassionate while being clear about risks
- Make suggestions achievable and specific
`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      response_json_schema: {
        type: 'object',
        properties: {
          notification_type: { type: 'string', enum: ['insight', 'nudge', 'motivation', 'warning', 'achievement'] },
          title: { type: 'string' },
          message: { type: 'string' },
          suggested_action: { type: 'string' },
          sentiment: { type: 'string', enum: ['positive', 'neutral', 'concerning'] },
          priority: { type: 'string', enum: ['low', 'medium', 'high'] }
        },
        required: ['notification_type', 'title', 'message', 'suggested_action', 'sentiment', 'priority']
      }
    });

    // Create coaching notification
    const notification = await base44.entities.CoachingNotification.create({
      habit_id: habit_id,
      notification_type: response.notification_type,
      title: response.title,
      message: response.message,
      suggested_action: response.suggested_action,
      sentiment: response.sentiment,
      priority: response.priority,
      analysis: {
        metric: 'completion_rate',
        current_value: completionRate,
        trend: streakTrend,
        confidence: 85
      },
      sent_via: 'in_app'
    });

    return Response.json({
      success: true,
      notification: notification,
      analysis: {
        completionRate,
        streakTrend,
        emotionalTrend,
        forecastRisk: forecasts.length > 0 ? forecasts[0].break_probability : null
      }
    });

  } catch (error) {
    console.error('Coaching insight generation error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});