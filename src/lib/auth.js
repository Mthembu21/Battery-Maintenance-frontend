export function getStoredAuth() {
  const token = localStorage.getItem('auth_token');
  const userRaw = localStorage.getItem('auth_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

export function storeAuth({ token, user }) {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_user', JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
