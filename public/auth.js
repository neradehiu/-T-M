// public/auth.js
const API_URL = 'http://localhost:3000/api/auth'; // backend auth routes

// Đăng ký
export async function register(username, password) {
  try {
    const res = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
  } catch (err) {
    throw err;
  }
}

// Đăng nhập
export async function login(username, password) {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    throw err;
  }
}

// Kiểm tra đăng nhập
export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

// Đăng xuất
export function logout() {
  localStorage.removeItem('token');
}
