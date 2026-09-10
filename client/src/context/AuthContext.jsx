import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session
    const savedToken = localStorage.getItem('qa_token') || sessionStorage.getItem('qa_token');
    const savedUser = localStorage.getItem('qa_user') || sessionStorage.getItem('qa_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('qa_token');
        localStorage.removeItem('qa_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed. Please check credentials.');
      }

      setUser(data.user);
      setToken(data.token);

      if (rememberMe) {
        localStorage.setItem('qa_token', data.token);
        localStorage.setItem('qa_user', JSON.stringify(data.user));
        localStorage.setItem('qa_remembered_email', email);
      } else {
        sessionStorage.setItem('qa_token', data.token);
        sessionStorage.setItem('qa_user', JSON.stringify(data.user));
        localStorage.removeItem('qa_remembered_email');
      }

      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('qa_token', data.token);
      localStorage.setItem('qa_user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qa_token');
    localStorage.removeItem('qa_user');
    // Notice: sessionStorage remains untouched on logout
  };

  const updateProfile = async (updatedFields) => {
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer_${token}` : ''
        },
        body: JSON.stringify({ userId: user?.id, ...updatedFields })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile.');
      }

      setUser(data.user);
      if (localStorage.getItem('qa_user')) {
        localStorage.setItem('qa_user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('qa_user', JSON.stringify(data.user));
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer_${token}` : ''
        },
        body: JSON.stringify({ userId: user?.id, currentPassword, newPassword })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to change password.');
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
