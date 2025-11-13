// const BASE = '';

// function getToken() {
//   return localStorage.getItem('token');
// }

// function getHeaders(includeAuth = true) {
//   const headers = { 'Content-Type': 'application/json' };
//   if (includeAuth) {
//     const token = getToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
//   }
//   return headers;
// }

// async function handleResponse(res) {
//   const data = await res.json();
//   if (!res.ok) {
//     if (res.status === 401) {
//       // Unauthorized - clear token and redirect to login
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       window.location.href = '/login';
//     }
//     throw new Error(data.message || data.error || `Request failed with status ${res.status}`);
//   }
//   return data;
// }

// export async function apiGet(path, requireAuth = true) {
//   const res = await fetch(`${BASE}${path}`, {
//     headers: getHeaders(requireAuth),
//   });
//   return handleResponse(res);
// }

// export async function apiPost(path, body, requireAuth = true) {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'POST',
//     headers: getHeaders(requireAuth),
//     body: JSON.stringify(body),
//   });
//   return handleResponse(res);
// }

// export async function apiPut(path, body, requireAuth = true) {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'PUT',
//     headers: getHeaders(requireAuth),
//     body: JSON.stringify(body),
//   });
//   return handleResponse(res);
// }

// export async function apiPatch(path, body, requireAuth = true) {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'PATCH',
//     headers: getHeaders(requireAuth),
//     body: JSON.stringify(body),
//   });
//   return handleResponse(res);
// }

// export async function apiDelete(path, requireAuth = true) {
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'DELETE',
//     headers: getHeaders(requireAuth),
//   });
//   return handleResponse(res);
// }

// // Auth specific functions
// export async function login(email, password) {
//   const res = await fetch(`${BASE}/api/auth/login`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ email, password }),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error(data.message || 'Login failed');
//   }
//   if (data.data && data.data.token) {
//     localStorage.setItem('token', data.data.token);
//     localStorage.setItem('user', JSON.stringify(data.data.user));
//   }
//   return data.data || data;
// }

// export async function register(userData) {
//   const res = await fetch(`${BASE}/api/auth/register`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(userData),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     throw new Error(data.message || 'Registration failed');
//   }
//   if (data.data && data.data.token) {
//     localStorage.setItem('token', data.data.token);
//     localStorage.setItem('user', JSON.stringify(data.data.user));
//   }
//   return data.data || data;
// }

// export function logout() {
//   localStorage.removeItem('token');
//   localStorage.removeItem('user');
// }

// export function getCurrentUser() {
//   const userStr = localStorage.getItem('user');
//   return userStr ? JSON.parse(userStr) : null;
// }

// export function isAuthenticated() {
//   return !!getToken();
// }

