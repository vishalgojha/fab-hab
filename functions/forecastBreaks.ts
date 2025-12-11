import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await base44.entities.Habit.filter({ is_active: true, status: 'active' });
    const forecasts = [];
    
    for (const habit of habits) {
      // Get recent logs for this habit
      const logs = await base44.entities.HabitLog.filter({ habit_id: habit.id }, '-date', 30);
      
      if (logs.length < 5) continue; // Need minimum data
      
      // Calculate metrics
      const last7Days = logs.slice(0, 7);
      const completionRate = last7Days.filter(l => l.completed).length / 7;
      const avgIntensity = last7Days.reduce((sum, l) => sum + (l.intensity_rating || 5), 0) / last7Days.length;
      
      // Emotion patterns
      const emotionCounts = {};
      const skipReasons = {};
      
      logs.forEach(log => {
        if (log.emotional_state_before) {
          emotionCounts[log.emotional_state_before] = (emotionCounts[log.emotional_state_before] || 0) + 1;
        }
        if (!log.completed && log.skip_reason) {
          skipReasons[log.skip_reason] = (skipReasons[log.skip_reason] || 0) + 1;
        }
      });
      
      const dominantEmotion = Object.keys(emotionCounts).sort((a, b) => 
        emotionCounts[b] - emotionCounts[a]
      )[0];
      
      const dominantSkipReason = Object.keys(skipReasons).sort((a, b) => 
        skipReasons[b] - skipReasons[a]
      )[0];
      
      // Get AI analysis
      const analysis = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a behavioral psychology AI analyzing habit streak risk.

Habit: ${habit.name}
Current Streak: ${habit.current_streak} days
Completion Rate (7 days): ${(completionRate * 100).toFixed(0)}%
Average Intensity: ${avgIntensity.toFixed(1)}/10
Dominant Emotion: ${dominantEmotion || 'unknown'}
Main Skip Reason: ${dominantSkipReason || 'none'}
Recent Skip Count: ${logs.filter(l => !l.completed).length}

Analyze:
1. Will this streak break in the next 7 days?
2. What's the probability (0-100)?
3. What's the PRIMARY emotional/psychological reason?
4. What's the risk level: low/medium/high/critical?
5. Suggest 3 interventions with timing and expected effectiveness (0-100)

Be insightful about the WHY, not just the what.`,
        response_json_schema: {
          type: "object",
          properties: {
            will_break: { type: "boolean" },
            probability: { type: "number" },
            risk_level: { type: "string" },
            primary_factor: { type: "string" },
            emotional_insight: { type: "string" },
            interventions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  timing: { type: "string" },
                  effectiveness: { type: "number" }
                }
              }
            }
          }
        }
      });
      
      if (analysis.probability > 30) { // Only create forecasts with meaningful risk
        const forecast = await base44.entities.BreakForecast.create({
          habit_id: habit.id,
          forecast_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          break_probability: analysis.probability,
          risk_level: analysis.risk_level,
          primary_risk_factor: mapToPrimaryFactor(analysis.primary_factor),
          contributing_factors: [dominantEmotion, dominantSkipReason].filter(Boolean),
          recommended_interventions: analysis.interventions,
          emotional_insight: analysis.emotional_insight,
          is_addressed: false,
          created_at: new Date().toISOString()
        });
        
        forecasts.push({
          ...forecast,
          habit_name: habit.name
        });
      }
    }
    
    return Response.json({ forecasts, analyzed_habits: habits.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function mapToPrimaryFactor(factor) {
  const mapping = {
    'burnout': 'emotional_burnout',
    'time': 'time_pressure',
    'motivation': 'motivation_decline',
    'external': 'external_disruption',
    'tired': 'fatigue',
    'fatigue': 'fatigue'
  };
  
  for (const [key, value] of Object.entries(mapping)) {
    if (factor.toLowerCase().includes(key)) return value;
  }
  return 'motivation_decline';
}