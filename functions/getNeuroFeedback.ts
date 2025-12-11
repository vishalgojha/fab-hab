import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Simulated neurofeedback data (future: integrate with actual BCI/wearables)
    const hour = new Date().getHours();
    const dayProgress = (hour - 6) / 16; // Normalized day progress
    
    // Circadian-based focus simulation
    let baseFocus = 50;
    if (hour >= 9 && hour <= 11) baseFocus = 85; // Morning peak
    else if (hour >= 14 && hour <= 16) baseFocus = 60; // Afternoon dip
    else if (hour >= 17 && hour <= 19) baseFocus = 75; // Evening secondary peak
    else if (hour >= 22 || hour <= 6) baseFocus = 30; // Night low
    
    const variance = (Math.random() - 0.5) * 20;
    const focusLevel = Math.max(0, Math.min(100, baseFocus + variance));
    
    // Brain wave states
    const states = {
      alpha: Math.round(20 + Math.random() * 30), // Relaxed alertness
      beta: Math.round(focusLevel * 0.8), // Active concentration
      theta: Math.round(30 + Math.random() * 20), // Creativity/meditation
      gamma: Math.round(focusLevel * 0.5), // Peak performance
    };
    
    // Recommendations based on current state
    let recommendation = '';
    let optimalHabits = [];
    
    if (focusLevel >= 70) {
      recommendation = 'Your brain is in peak state. Ideal for challenging habits.';
      optimalHabits = ['learning', 'productivity', 'creativity'];
    } else if (focusLevel >= 50) {
      recommendation = 'Moderate focus detected. Good for routine habits.';
      optimalHabits = ['health', 'fitness', 'social'];
    } else {
      recommendation = 'Low energy state. Consider mindfulness or rest.';
      optimalHabits = ['mindfulness'];
    }
    
    // Flow state probability
    const flowProbability = Math.round(
      (states.alpha * 0.3 + states.beta * 0.4 + states.gamma * 0.3)
    );

    return Response.json({
      focusLevel: Math.round(focusLevel),
      brainWaves: states,
      flowProbability,
      recommendation,
      optimalHabits,
      timestamp: new Date().toISOString(),
      deviceStatus: 'simulated' // Future: 'connected' when real device
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});