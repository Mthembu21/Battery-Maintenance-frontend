export function getStoredAuth() {
  const token = localStorage.getItem('auth_token');
  const userRaw = localStorage.getItem('auth_user');
  let user = null;
  
  if (userRaw && userRaw !== 'undefined' && userRaw !== null) {
    try {
      user = JSON.parse(userRaw);
    } catch (error) {
      console.error('Failed to parse stored user data:', error);
      // Clear invalid data
      localStorage.removeItem('auth_user');
      localStorage.removeItem('auth_token');
    }
  }
  
  return { token, user };
}

export function storeAuth({ token, user }) {
  try {
    localStorage.setItem('auth_token', token || '');
    localStorage.setItem('auth_user', JSON.stringify(user || null));
  } catch (error) {
    console.error('Failed to store auth data:', error);
  }
}

export function clearAuth() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
}
