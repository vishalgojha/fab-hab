import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const habits = await base44.entities.Habit.filter({ is_active: true });
    const logs = await base44.entities.HabitLog.filter({ completed: true });
    const badges = await base44.entities.Badge.list();
    const userAchievements = await base44.entities.UserAchievement.list();
    const unlockedBadgeIds = new Set(userAchievements.map(a => a.badge_id));
    
    let stats = await base44.entities.UserStats.list();
    if (stats.length === 0) {
      stats = [await base44.entities.UserStats.create({
        total_points: 0,
        level: 1,
        total_completions: 0,
        longest_streak: 0,
        perfect_weeks: 0,
        badges_unlocked: 0
      })];
    }
    const userStats = stats[0];
    
    // Calculate current stats
    const maxStreak = Math.max(...habits.map(h => h.current_streak || 0), 0);
    const totalCompletions = logs.length;
    const activeHabitsCount = habits.length;
    
    // Check early bird (completed before 8am)
    const earlyBirdLogs = logs.filter(log => {
      const hour = new Date(log.completed_at || log.date).getHours();
      return hour < 8;
    });
    
    // Check night owl (completed after 10pm)
    const nightOwlLogs = logs.filter(log => {
      const hour = new Date(log.completed_at || log.date).getHours();
      return hour >= 22;
    });
    
    const newAchievements = [];
    let pointsEarned = 0;
    
    for (const badge of badges) {
      if (unlockedBadgeIds.has(badge.id)) continue;
      
      let unlocked = false;
      
      switch (badge.requirement_type) {
        case 'streak_days':
          unlocked = maxStreak >= badge.requirement_value;
          break;
        case 'total_completions':
          unlocked = totalCompletions >= badge.requirement_value;
          break;
        case 'habits_count':
          unlocked = activeHabitsCount >= badge.requirement_value;
          break;
        case 'early_bird':
          unlocked = earlyBirdLogs.length >= badge.requirement_value;
          break;
        case 'night_owl':
          unlocked = nightOwlLogs.length >= badge.requirement_value;
          break;
      }
      
      if (unlocked) {
        const achievement = await base44.entities.UserAchievement.create({
          badge_id: badge.id,
          unlocked_at: new Date().toISOString(),
          is_new: true,
          shared: false
        });
        
        newAchievements.push({
          ...achievement,
          badge
        });
        
        pointsEarned += badge.points_reward || 100;
      }
    }
    
    // Update user stats
    const newTotalPoints = (userStats.total_points || 0) + pointsEarned;
    const newLevel = Math.floor(newTotalPoints / 1000) + 1;
    
    await base44.entities.UserStats.update(userStats.id, {
      total_points: newTotalPoints,
      level: newLevel,
      total_completions: totalCompletions,
      longest_streak: Math.max(maxStreak, userStats.longest_streak || 0),
      badges_unlocked: userAchievements.length + newAchievements.length
    });
    
    return Response.json({ 
      new_achievements: newAchievements,
      points_earned: pointsEarned,
      new_level: newLevel !== userStats.level ? newLevel : null
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});