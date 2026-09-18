import { createContext, useContext, useState, useEffect } from 'react';

// Demo accounts — since backend has no auth endpoints, role-based auth is handled client-side.
// Each account carries a role; courses/videos still use the real backend API.
const DEMO_ACCOUNTS = [
  {
    _id: 'superadmin-001',
    name: 'Super Admin',
    email: 'super@upskillr.com',
    password: 'super123',
    role: 'superAdmin',
    profileImage: '',
  },
  {
    _id: 'admin-001',
    name: 'Institute Admin',
    email: 'admin@upskillr.com',
    password: 'admin123',
    role: 'admin',
    profileImage: '',
  },
  {
    _id: 'instructor-001',
    name: 'Alex Instructor',
    email: 'instructor@upskillr.com',
    password: 'instructor123',
    role: 'instructor',
    profileImage: '',
  },
  {
    _id: 'learner-001',
    name: 'Jamie Learner',
    email: 'learner@upskillr.com',
    password: 'learner123',
    role: 'learner',
    profileImage: '',
  },
];

const AuthContext = createContext(null);

const STORAGE_KEY = 'upskillr_user';

// localStorage-backed enrollment and progress (since backend has no such endpoints)
const ENROLLMENTS_KEY = 'upskillr_enrollments';
const PROGRESS_KEY = 'upskillr_progress';
const RATINGS_KEY = 'upskillr_ratings';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [enrollments, setEnrollments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || '{}');
    } catch { return {}; }
  });

  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    } catch { return {}; }
  });

  const [ratings, setRatings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(RATINGS_KEY) || '{}');
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  }, [ratings]);

  const login = (email, password) => {
    const found = DEMO_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!found) return { success: false, message: 'Invalid email or password' };
    const { password: _pw, ...safe } = found;
    safe.token = `demo-token-${safe._id}`;
    setUser(safe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
    return { success: true, user: safe };
  };

  const register = (name, email, password, role = 'learner') => {
    const existing = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (existing) return { success: false, message: 'Email already registered' };
    const allowedRoles = ['learner', 'instructor'];
    const assignedRole = allowedRoles.includes(role) ? role : 'learner';
    const newUser = {
      _id: `user-${Date.now()}`,
      name,
      email,
      role: assignedRole,
      profileImage: '',
      token: `demo-token-${Date.now()}`,
    };
    DEMO_ACCOUNTS.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Enrollment helpers
  const isEnrolled = (courseId) => {
    if (!user) return false;
    const key = `${user._id}_${courseId}`;
    return !!enrollments[key];
  };

  const enroll = (courseId) => {
    if (!user) return;
    const key = `${user._id}_${courseId}`;
    setEnrollments((prev) => ({ ...prev, [key]: { enrolledAt: new Date().toISOString(), status: 'active' } }));
  };

  const getMyEnrollments = () => {
    if (!user) return [];
    return Object.entries(enrollments)
      .filter(([k]) => k.startsWith(user._id + '_'))
      .map(([k, v]) => ({ courseId: k.replace(user._id + '_', ''), ...v }));
  };

  // Progress helpers
  const isVideoCompleted = (courseId, videoId) => {
    if (!user) return false;
    const key = `${user._id}_${courseId}_${videoId}`;
    return !!progress[key];
  };

  const markVideoComplete = (courseId, videoId) => {
    if (!user) return;
    const key = `${user._id}_${courseId}_${videoId}`;
    setProgress((prev) => ({ ...prev, [key]: { completedAt: new Date().toISOString() } }));
  };

  const getCourseProgress = (courseId, totalVideos) => {
    if (!user || totalVideos === 0) return 0;
    const completed = Object.keys(progress).filter(
      (k) => k.startsWith(`${user._id}_${courseId}_`)
    ).length;
    return Math.round((completed / totalVideos) * 100);
  };

  // Rating helpers
  const getRating = (courseId) => {
    if (!user) return null;
    return ratings[`${user._id}_${courseId}`] || null;
  };

  const submitRating = (courseId, rating, review) => {
    if (!user) return;
    const key = `${user._id}_${courseId}`;
    setRatings((prev) => ({ ...prev, [key]: { rating, review, createdAt: new Date().toISOString() } }));
  };

  const getCourseRatings = (courseId) => {
    return Object.entries(ratings)
      .filter(([k]) => k.endsWith(`_${courseId}`))
      .map(([, v]) => v);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isEnrolled,
        enroll,
        getMyEnrollments,
        isVideoCompleted,
        markVideoComplete,
        getCourseProgress,
        getRating,
        submitRating,
        getCourseRatings,
        demoAccounts: DEMO_ACCOUNTS.map(({ password: _, ...rest }) => rest),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
