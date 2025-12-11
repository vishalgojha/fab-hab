import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all habit logs to analyze patterns
    const logs = await base44.entities.HabitLog.list('-created_date', 100);
    const existingHabits = await base44.entities.Habit.list();
    
    // Analyze time-based patterns
    const timePatterns = {};
    const emotionPatterns = {};
    const weekdayPatterns = {};
    
    logs.forEach(log => {
      const date = new Date(log.completed_at || log.date);
      const hour = date.getHours();
      const dayOfWeek = date.getDay();
      const timeSlot = hour < 6 ? 'early_morning' : 
                       hour < 12 ? 'morning' : 
                       hour < 18 ? 'afternoon' : 'evening';
      
      timePatterns[timeSlot] = (timePatterns[timeSlot] || 0) + 1;
      weekdayPatterns[dayOfWeek] = (weekdayPatterns[dayOfWeek] || 0) + 1;
      
      if (log.emotional_state_before) {
        emotionPatterns[log.emotional_state_before] = (emotionPatterns[log.emotional_state_before] || 0) + 1;
      }
    });
    
    const detectedHabits = [];
    
    // Use AI to analyze patterns and suggest habits
    const promptData = {
      totalLogs: logs.length,
      timePatterns,
      emotionPatterns,
      weekdayPatterns,
      existingHabits: existingHabits.map(h => h.name),
      recentSkips: logs.filter(l => !l.completed && l.skip_reason).map(l => ({
        reason: l.skip_reason,
        emotion: l.emotional_state_before
      }))
    };
    
    const aiResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a habit formation AI. Analyze this user's behavior data and detect 2-3 new habits they should start based on patterns. Consider:

User Data:
${JSON.stringify(promptData, null, 2)}

Detect habits that:
1. Fill gaps in their routine (underutilized time slots)
2. Address emotional patterns (e.g., if they're often stressed, suggest mindfulness)
3. Build on existing momentum
4. Are realistic (not too ambitious)

For each detected habit, provide:
- name: Clear, actionable habit name
- description: Why this habit based on their patterns
- category: health/productivity/mindfulness/fitness/learning/social/creativity
- confidence: 0-100 score
- target_frequency: daily/3x_week/5x_week/weekly
- initial_protocol: {duration_minutes, intensity: "light/moderate/intense"}
- reasoning: Why this habit for this user

Return max 3 habits.`,
      response_json_schema: {
        type: "object",
        properties: {
          detected_habits: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                category: { type: "string" },
                confidence: { type: "number" },
                target_frequency: { type: "string" },
                initial_protocol: {
                  type: "object",
                  properties: {
                    duration_minutes: { type: "number" },
                    intensity: { type: "string" }
                  }
                },
                reasoning: { type: "string" }
              }
            }
          }
        }
      }
    });
    
    // Create suggested habits
    if (aiResponse.detected_habits) {
      for (const habit of aiResponse.detected_habits) {
        const created = await base44.entities.Habit.create({
          name: habit.name,
          description: habit.description,
          category: habit.category,
          is_auto_detected: true,
          detection_confidence: habit.confidence,
          target_frequency: habit.target_frequency,
          adaptive_difficulty: 'adaptive',
          current_protocol: habit.initial_protocol,
          performance_trend: 'unknown',
          status: 'suggested',
          is_active: false,
          current_streak: 0,
          best_streak: 0
        });
        
        detectedHabits.push({
          ...created,
          reasoning: habit.reasoning
        });
        
        // Create behavior pattern record
        await base44.entities.BehaviorPattern.create({
          pattern_type: 'time_based',
          pattern_name: `Gap detection for ${habit.name}`,
          description: habit.reasoning,
          confidence_score: habit.confidence,
          related_habit_id: created.id,
          trigger_factors: ['time_availability', 'routine_gap'],
          suggested_intervention: `Start ${habit.name} to fill routine gap`,
          data_points: logs.length,
          last_observed: new Date().toISOString(),
          is_active: true
        });
      }
    }
    
    return Response.json({ 
      detected: detectedHabits,
      patterns_analyzed: {
        total_logs: logs.length,
        time_patterns: timePatterns,
        emotion_patterns: emotionPatterns
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});