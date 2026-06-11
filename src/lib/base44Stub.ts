type EntityStore = Record<string, any>;

const store: EntityStore = (() => {
  try {
    const saved = localStorage.getItem('fabhab_store');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load local storage store:', e);
  }
  return {};
})();

function saveStore() {
  try {
    localStorage.setItem('fabhab_store', JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save to local storage:', e);
  }
}

function entity(name: string) {
  const list = () => Promise.resolve(store[name] || []);
  const filter = (...args: any[]) => {
    const filters = args[0] || {};
    const result = (store[name] || []).filter((item) =>
      Object.entries(filters).every(([k, v]) => item[k] === v)
    );
    return Promise.resolve(result);
  };
  const create = (data: any) => {
    const id = crypto.randomUUID();
    const created = { ...data, id, created_date: new Date().toISOString() };
    store[name] = [...(store[name] || []), created];
    saveStore();
    return Promise.resolve(created);
  };
  const update = (id: string, data: any) => {
    store[name] = (store[name] || []).map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    saveStore();
    return Promise.resolve(store[name]?.find((item) => item.id === id));
  };
  const del = (id: string) => {
    store[name] = (store[name] || []).filter((item) => item.id !== id);
    saveStore();
    return Promise.resolve();
  };
  return { list, filter, create, update, delete: del };
}

// Seed Initial Data for Indian Wellness
if (!store['seeded']) {
  store['Habit'] = [
    {
      id: 'h1',
      name: 'Surya Namaskar (Sun Salutation)',
      description: '12 rounds of Sun Salutation for flexibility and energy',
      category: 'fitness',
      frequency: 'daily',
      streak: 3,
      is_active: true,
      status: 'active',
      created_date: new Date().toISOString()
    },
    {
      id: 'h2',
      name: 'Anulom Vilom Pranayama',
      description: '10 mins of alternate nostril breathing for mental clarity',
      category: 'mindfulness',
      frequency: 'daily',
      streak: 5,
      is_active: true,
      status: 'active',
      created_date: new Date().toISOString()
    },
    {
      id: 'h3',
      name: 'Warm Water (Ushapan)',
      description: 'Drink warm water with lemon in the morning',
      category: 'health',
      frequency: 'daily',
      streak: 2,
      is_active: true,
      status: 'active',
      created_date: new Date().toISOString()
    },
    {
      id: 'h4',
      name: 'Haldi Doodh (Turmeric Milk)',
      description: 'Drink warm turmeric milk before sleeping to build immunity',
      category: 'health',
      frequency: 'daily',
      streak: 0,
      is_active: true,
      status: 'active',
      created_date: new Date().toISOString()
    }
  ];

  store['Badge'] = [
    { id: 'b1', name: 'Yogi Master', description: 'Complete Surya Namaskar or Pranayama 5 times', icon: '🧘', category: 'mindfulness' },
    { id: 'b2', name: 'Chai Restrainer', description: 'Keep daily Chai cups under the limit (<= 2 cups) for 3 consecutive days', icon: '☕', category: 'health' },
    { id: 'b3', name: 'Matka Hydration Pro', description: 'Log 8+ glasses of water in a day', icon: '🏺', category: 'health' },
    { id: 'b4', name: 'Ayush Wellness Pro', description: 'Log Haldi Doodh or warm water 5 times', icon: '🌿', category: 'health' }
  ];

  store['UserAchievement'] = [
    { id: 'ua1', badge_id: 'b1', unlocked_date: new Date().toISOString() }
  ];

  store['Challenge'] = [
    {
      id: 'c1',
      name: '21-Day Yoga & Pranayama Challenge',
      description: 'Participate in daily Yoga and Pranayama to align mind, body, and breath.',
      habit_category: 'mindfulness',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      participant_count: 142,
      status: 'active'
    },
    {
      id: 'c2',
      name: 'Desi Diet Cleanse',
      description: 'No junk foods, samosas, or aerated drinks. Clean home-cooked Indian meals only.',
      habit_category: 'health',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      participant_count: 89,
      status: 'active'
    },
    {
      id: 'c3',
      name: '10k Daily Steps Yatra',
      description: 'Walk 10,000 steps daily to improve cardiovascular health.',
      habit_category: 'fitness',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      participant_count: 235,
      status: 'active'
    }
  ];

  store['UserStats'] = [{
    id: 'stats1',
    total_points: 150,
    level: 2,
    total_completions: 12,
    longest_streak: 5,
    perfect_weeks: 1,
    badges_unlocked: 1,
    created_date: new Date().toISOString()
  }];

  store['HealthLogs'] = [
    { id: 'hl1', date: new Date().toISOString().split('T')[0], water: 5, chai: 2, steps: 6000, sleep: 7, heartRate: 72, weight: 70 }
  ];

  store['MealLogs'] = [
    { id: 'ml1', date: new Date().toISOString().split('T')[0], mealType: 'Breakfast', name: 'Poha', calories: 250, protein: 5 }
  ];

  store['seeded'] = true;
  saveStore();
}

export const base44 = {
  auth: {
    me: () => Promise.resolve({ email: 'demo@fabhab.app', full_name: 'Demo User', role: 'user' }),
    logout: (redirectUrl?: string) => {
      if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin: (redirectUrl?: string) => {
      window.location.href = '/Demo';
    },
  },
  entities: {
    Query: { filter: (...args: any[]) => Promise.resolve([]) },
    Habit: entity('Habit'),
    BreakForecast: entity('BreakForecast'),
    ProtocolAdjustment: entity('ProtocolAdjustment'),
    UserStats: entity('UserStats'),
    Badge: entity('Badge'),
    UserAchievement: entity('UserAchievement'),
    CoachingNotification: entity('CoachingNotification'),
    Challenge: entity('Challenge'),
    ChallengeParticipant: entity('ChallengeParticipant'),
    Stake: entity('Stake'),
    HabitLog: entity('HabitLog'),
    Prediction: entity('Prediction'),
    HealthLog: entity('HealthLogs'),
    MealLog: entity('MealLogs'),
  },
  functions: {
    invoke: (name: string) => {
      console.warn(`[base44 stub] function invoked: ${name} (no-op)`);
      if (name === 'checkAchievements') {
        return Promise.resolve({ data: { new_achievements: [] } });
      }
      return Promise.resolve({ data: {} });
    },
  },
  agents: {
    getWhatsAppConnectURL: (agentName: string) => {
      return `https://wa.me/919999999999?text=${encodeURIComponent(`Namaste! I want to start my Desi Health Journey with ${agentName}`)}`;
    },
  },
  appLogs: {
    logUserInApp: (pageName: string) => Promise.resolve(),
  },
};
