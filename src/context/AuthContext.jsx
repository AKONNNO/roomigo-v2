// AuthContext — developed by Prince Korankye Akonno
import { useState, useEffect } from 'react';
import { AuthContext } from './auth-context';

const USERS_KEY = 'roomigo_managed_users';

// Seed account for role-based access demonstration. This is also
// the fallback registry entry so the demo login keeps working.
const DEMO_USERS = [
  { id: 'demo-student', password: 'student123', email: 'student@roomigo.gh', name: 'Kofi Student', role: 'student', studentId: '22512172', phone: '', gender: '' },
  { id: 'demo-admin', password: 'admin123', email: 'admin@roomigo.gh', name: 'Site Admin', role: 'admin', studentId: '', phone: '', gender: '' }
];

// Legacy demo accounts removed from the app. Still filtered out of the
// persisted registry so any browser that stored them earlier can't
// log in with them anymore.
const LEGACY_DEMO_IDS = ['demo-manager'];

const toSessionUser = (account) => ({
  id: account.id,
  email: account.email,
  name: account.name,
  role: account.role,
  studentId: account.studentId || '',
  phone: account.phone || '',
  gender: account.gender || ''
});

export const AuthProvider = ({ children }) => {
  // Restore the stored session synchronously as initial state (no
  // setState inside an effect, avoids cascading renders).
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('roomigo_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Registry of all managed accounts (students + hostel managers + admin),
  // seeded with the demo accounts on first load. Demo accounts are always
  // merged back in (deduped by id) so the demo logins keep working even for
  // browsers that already persisted a registry. Legacy demo entries left over
  // in localStorage are filtered out.
  const [users, setUsers] = useState(() => {
    const stored = localStorage.getItem(USERS_KEY);
    let storedUsers = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        storedUsers = Array.isArray(parsed) ? parsed : [];
      } catch { /* fall through */ }
    }
    const filtered = storedUsers.filter(u => !LEGACY_DEMO_IDS.includes(u.id));
    const demoIds = DEMO_USERS.map(d => d.id);
    return [...DEMO_USERS, ...filtered.filter(u => !demoIds.includes(u.id))];
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const persistSession = (sessionUser) => {
    localStorage.setItem('roomigo_user', JSON.stringify(sessionUser));
  };

  const login = (email, password) => {
    const account = users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());
    if (!account || account.password !== password) {
      return {
        success: false,
        message: 'Invalid email or password. Please check your details, or sign up if you have no account yet.'
      };
    }
    const sessionUser = toSessionUser(account);
    setUser(sessionUser);
    persistSession(sessionUser);
    return { success: true, user: sessionUser };
  };

  const register = (userData) => {
    const email = (userData.email || '').trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === email)) {
      return {
        success: false,
        message: 'An account with this email already exists. Please sign in instead.'
      };
    }

    const isManager = userData.role === 'manager';
    const newUser = {
      id: 'user_' + Date.now(),
      password: userData.password,
      email,
      name: userData.name,
      role: isManager ? 'manager' : 'student',
      studentId: isManager ? '' : (userData.studentId || ''),
      phone: userData.phone || '',
      gender: isManager ? (userData.hostelGender || '') : (userData.gender || ''),
      hostel: isManager ? {
        name: userData.hostelName || '',
        address: userData.hostelAddress || ''
      } : undefined,
      createdAt: new Date().toISOString()
    };

    const nextUsers = [...users, newUser];
    setUsers(nextUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

    const sessionUser = toSessionUser(newUser);
    setUser(sessionUser);
    persistSession(sessionUser);
    return { success: true, user: sessionUser };
  };

  // Change a registered account's role (used by the Admin "Users" tab).
  // Admins themselves are never changed.
  const updateUserRole = (id, role) => {
    const nextUsers = users.map(u => u.id === id && u.role !== 'admin' ? { ...u, role } : u);
    setUsers(nextUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    if (user && user.id === id && user.role !== 'admin') {
      const updatedSession = { ...user, role };
      setUser(updatedSession);
      persistSession(updatedSession);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('roomigo_user');
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    persistSession(updatedUser);
    const nextUsers = users.map(u => u.id === user?.id ? { ...u, ...updates } : u);
    setUsers(nextUsers);
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
  };

  const roleLabel = user?.role === 'admin' ? 'Admin'
    : user?.role === 'manager' ? 'Hostel Manager'
    : user?.role === 'student' ? 'Student'
    : '';

  const value = {
    user,
    users,
    loading: false,
    login,
    register,
    logout,
    updateProfile,
    updateUserRole,
    demoUsers: DEMO_USERS,
    roleLabel,
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

