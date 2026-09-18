import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_HOME = {
  learner: '/dashboard/learner',
  instructor: '/dashboard/instructor',
  admin: '/dashboard/admin',
  superAdmin: '/dashboard/superadmin',
};

export default function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={ROLE_HOME[user.role] || '/dashboard/learner'} replace />;
}
