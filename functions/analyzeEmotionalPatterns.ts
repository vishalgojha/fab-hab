import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const logs = await base44.entities.HabitLog.list('-created_date', 50);
    
    // Group by emotional states
    const emotionToOutcomes = {};
    const emotionToSkipReasons = {};
    
    logs.forEach(log => {
      const emotion = log.emotional_state_before;
      if (!emotion) return;
      
      if (!emotionToOutcomes[emotion]) {
        emotionToOutcomes[emotion] = { completed: 0, skipped: 0 };
      }
      
      if (log.completed) {
        emotionToOutcomes[emotion].completed++;
      } else {
        emotionToOutcomes[emotion].skipped++;
        if (log.skip_reason) {
          if (!emotionToSkipReasons[emotion]) {
            emotionToSkipReasons[emotion] = {};
          }
          emotionToSkipReasons[emotion][log.skip_reason] = 
            (emotionToSkipReasons[emotion][log.skip_reason] || 0) + 1;
        }
      }
    });
    
    // Calculate success rates per emotion
    const emotionAnalysis = Object.entries(emotionToOutcomes).map(([emotion, outcomes]) => ({
      emotion,
      success_rate: outcomes.completed / (outcomes.completed + outcomes.skipped),
      total_occurrences: outcomes.completed + outcomes.skipped,
      skip_patterns: emotionToSkipReasons[emotion] || {}
    }));
    
    // Get AI insights
    const insights = await base44.integrations.Core.InvokeLLM({
      prompt: `You are an emotional intelligence AI analyzing habit formation psychology.

Data:
${JSON.stringify(emotionAnalysis, null, 2)}

Provide deep insights:
1. Which emotional states are most destructive to habits? Why psychologically?
2. Which emotions surprisingly lead to success?
3. What are the real underlying needs when people skip? (e.g., "time_constraint" might actually be anxiety avoidance)
4. Give 3 emotion-specific interventions that address root causes
5. Pattern name for each major emotional pattern discovered

Be a therapist who understands behavior, not just a data reporter.`,
      response_json_schema: {
        type: "object",
        properties: {
          destructive_emotions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                emotion: { type: "string" },
                psychological_reason: { type: "string" }
              }
            }
          },
          success_emotions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                emotion: { type: "string" },
                insight: { type: "string" }
              }
            }
          },
          skip_reason_deep_analysis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                stated_reason: { type: "string" },
                underlying_need: { type: "string" }
              }
            }
          },
          interventions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                emotion: { type: "string" },
                intervention: { type: "string" },
                timing: { type: "string" }
              }
            }
          }
        }
      }
    });
    
    // Create behavior patterns for emotional insights
    for (const destructive of insights.destructive_emotions || []) {
      await base44.entities.BehaviorPattern.create({
        pattern_type: 'emotion_based',
        pattern_name: `${destructive.emotion} → habit disruption`,
        description: destructive.psychological_reason,
        confidence_score: 75,
        trigger_factors: [destructive.emotion, 'emotional_state'],
        suggested_intervention: insights.interventions.find(i => i.emotion === destructive.emotion)?.intervention || 'Emotional awareness practice',
        data_points: logs.length,
        last_observed: new Date().toISOString(),
        is_active: true
      });
    }
    
    return Response.json({
      emotion_analysis: emotionAnalysis,
      ai_insights: insights,
      total_logs_analyzed: logs.length
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});