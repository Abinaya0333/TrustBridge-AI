/**
 * TrustBridge AI Centralized REST API Client
 */

const getHeaders = (userId?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('trustbridge_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const currentUserId = userId || localStorage.getItem('trustbridge_user_id') || 'freelancer-a';
  headers['x-user-id'] = currentUserId;
  return headers;
};

export const api = {
  // Auth
  auth: {
    me: async (userId?: string) => {
      const res = await fetch('/api/auth/me', { headers: getHeaders(userId) });
      return res.json();
    },
    login: async (email: string, password?: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      return res.json();
    },
    register: async (data: { email: string; password?: string; full_name: string; role: string }) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    logout: async () => {
      const res = await fetch('/api/auth/logout', { method: 'POST', headers: getHeaders() });
      return res.json();
    },
    getUsers: async () => {
      const res = await fetch('/api/auth/users');
      return res.json();
    },
  },

  // Projects
  projects: {
    list: async (userId?: string) => {
      const res = await fetch('/api/projects', { headers: getHeaders(userId) });
      return res.json();
    },
    get: async (id: string, userId?: string) => {
      const res = await fetch(`/api/projects/${id}`, { headers: getHeaders(userId) });
      return res.json();
    },
    create: async (data: any, userId?: string) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    update: async (id: string, updates: any, userId?: string) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(userId),
        body: JSON.stringify(updates),
      });
      return res.json();
    },
  },

  // Agreements
  agreements: {
    list: async (projectId?: string, userId?: string) => {
      const url = projectId ? `/api/agreements?projectId=${projectId}` : '/api/agreements';
      const res = await fetch(url, { headers: getHeaders(userId) });
      return res.json();
    },
    get: async (id: string, userId?: string) => {
      const res = await fetch(`/api/agreements/${id}`, { headers: getHeaders(userId) });
      return res.json();
    },
    create: async (data: any, userId?: string) => {
      const res = await fetch('/api/agreements', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    updateStatus: async (id: string, status: string, userId?: string) => {
      const res = await fetch(`/api/agreements/${id}/status`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
  },

  // Milestones
  milestones: {
    get: async (id: string, userId?: string) => {
      const res = await fetch(`/api/milestones/${id}`, { headers: getHeaders(userId) });
      return res.json();
    },
    create: async (data: any, userId?: string) => {
      const res = await fetch('/api/milestones', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(data),
      });
      return res.json();
    },
    submit: async (id: string, notes?: string, userId?: string) => {
      const res = await fetch(`/api/milestones/${id}/submit`, {
        method: 'PATCH',
        headers: getHeaders(userId),
        body: JSON.stringify({ notes }),
      });
      return res.json();
    },
    approve: async (id: string, userId?: string) => {
      const res = await fetch(`/api/milestones/${id}/approve`, {
        method: 'PATCH',
        headers: getHeaders(userId),
      });
      return res.json();
    },
  },

  // Escrow Sandbox Payments
  payments: {
    initialize: async (projectId: string, milestoneId: string, userId?: string) => {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify({ projectId, milestoneId }),
      });
      return res.json();
    },
    lock: async (transactionId: string, userId?: string) => {
      const res = await fetch(`/api/payments/${transactionId}/lock`, {
        method: 'POST',
        headers: getHeaders(userId),
      });
      return res.json();
    },
    release: async (transactionId: string, userId?: string) => {
      const res = await fetch(`/api/payments/${transactionId}/release`, {
        method: 'POST',
        headers: getHeaders(userId),
      });
      return res.json();
    },
    getHistory: async (projectId?: string, userId?: string) => {
      const url = projectId ? `/api/payments/history?projectId=${projectId}` : '/api/payments/history';
      const res = await fetch(url, { headers: getHeaders(userId) });
      return res.json();
    },
    getBalance: async (userId?: string) => {
      const res = await fetch('/api/payments/balance', { headers: getHeaders(userId) });
      return res.json();
    },
    getReceipt: async (id: string, userId?: string) => {
      const res = await fetch(`/api/payments/${id}`, { headers: getHeaders(userId) });
      return res.json();
    },
  },

  // Messages
  messages: {
    list: async (userId?: string) => {
      const res = await fetch('/api/messages', { headers: getHeaders(userId) });
      return res.json();
    },
    getForProject: async (projectId: string, userId?: string) => {
      const res = await fetch(`/api/messages/project/${projectId}`, { headers: getHeaders(userId) });
      return res.json();
    },
    send: async (data: { projectId?: string; messageContent: string; platform?: string; recipientId?: string }, userId?: string) => {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },

  // Social Integrations & Webhooks
  integrations: {
    getStatus: async () => {
      const res = await fetch('/api/integrations/status');
      return res.json();
    },
    simulateWebhook: async (data: {
      platform: 'whatsapp' | 'instagram';
      sender?: string;
      text: string;
      externalMessageId?: string;
      projectId?: string;
    }) => {
      const res = await fetch('/api/integrations/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
  },

  // Gemini AI
  ai: {
    analyzeMessage: async (text: string) => {
      const res = await fetch('/api/ai/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      return res.json();
    },
    getInsights: async (projectId: string, userId?: string) => {
      const res = await fetch(`/api/ai/insights/${projectId}`, { headers: getHeaders(userId) });
      return res.json();
    },
    convertInsightToAgreement: async (insightId: string, projectId: string, userId?: string) => {
      const res = await fetch('/api/ai/convert-insight-to-agreement', {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify({ insightId, projectId }),
      });
      return res.json();
    },
    analyzeScope: async (params: any) => {
      const res = await fetch('/api/ai/analyze-scope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      return res.json();
    },
  },
};
