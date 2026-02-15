const BASE = '/api';

function getToken() {
  return localStorage.getItem('finance_token');
}

export async function api(url, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${url}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText || 'Request failed');
  return data;
}

export const auth = {
  login: (email, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email, password) => api('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }),
};

export const transactions = {
  list: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/transactions${q ? `?${q}` : ''}`);
  },
  get: (id) => api(`/transactions/${id}`),
  create: (body) => api('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/transactions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id) => api(`/transactions/${id}`, { method: 'DELETE' }),
  summary: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/transactions/summary${q ? `?${q}` : ''}`);
  },
};
