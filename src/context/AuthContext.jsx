import { useState } from 'react';
import { AuthContext } from './auth-context';

// Demo/seed accounts for role-based access demonstration
const DEMO_USERS = [
  { email: 'student@roomigo.gh', password: 'student123', name: 'Kofi Student', role: 'student', studentId: '22512172' },
  { email: 'manager@roomigo.gh', password: 'manager123', name: 'Kwame Asare', role: 'manager' },
  { email: 'admin@roomigo.gh', password: 'admin123', name: 'System Admin', role: 'admin' }
];

export const AuthProvider = ({ children }) => {
  // Restore the stored session synchronously as initial state so we
  // don't need to setState() inside an effect (avoids cascading renders).
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('roomigo_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (email, password) => {
    // Check demo accounts first (role-based login)
    const demo = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (demo) {
      const demoUser = {
        id: Date.now(),
        email: demo.email,
        name: demo.name,
        role: demo.role,
        studentId: demo.studentId || '',
        createdAt: new Date().toISOString()
      };
      setUser(demoUser);
      localStorage.setItem('roomigo_user', JSON.stringify(demoUser));
      return { success: true, user: demoUser };
    }

    // Fallback: accept any credentials as a student (mock)
    const mockUser = {
      id: Date.now(),
      email,
      name: email.split('@')[0],
      role: 'student',
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    localStorage.setItem('roomigo_user', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const register = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      role: 'student',
      createdAt: new Date().toISOString()
    };
    delete newUser.confirmPassword;
    setUser(newUser);
    localStorage.setItem('roomigo_user', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roomigo_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('roomigo_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading: false,
    login,
    register,
    logout,
    updateProfile,
    demoUsers: DEMO_USERS,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isStudent: user?.role === 'student'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

