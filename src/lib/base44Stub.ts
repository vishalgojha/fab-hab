type EntityStore = Record<string, any[]>;

const store: EntityStore = {};

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
    return Promise.resolve(created);
  };
  const update = (id: string, data: any) => {
    store[name] = (store[name] || []).map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    return Promise.resolve(store[name]?.find((item) => item.id === id));
  };
  const del = (id: string) => {
    store[name] = (store[name] || []).filter((item) => item.id !== id);
    return Promise.resolve();
  };
  return { list, filter, create, update, delete: del };
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
  },
  functions: {
    invoke: (name: string) => {
      console.warn(`[base44 stub] function invoked: ${name} (no-op)`);
      return Promise.resolve({ data: {} });
    },
  },
  agents: {
    getWhatsAppConnectURL: (agentName: string) => {
      return `https://wa.me/1234567890?text=${encodeURIComponent(`Hi, I want to connect with ${agentName}`)}`;
    },
  },
  appLogs: {
    logUserInApp: (pageName: string) => Promise.resolve(),
  },
};
