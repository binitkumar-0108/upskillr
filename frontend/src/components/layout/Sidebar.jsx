import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, PlaySquare, Users, Settings,
  GraduationCap, PlusCircle, BarChart2, Building2, ShieldCheck,
  Layers, LogOut, X
} from 'lucide-react';

const NAV_BY_ROLE = {
  learner: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/courses', icon: BookOpen, label: 'Browse Courses' },
    { to: '/my-courses', icon: PlaySquare, label: 'My Courses' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
  instructor: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/instructor/courses', icon: BookOpen, label: 'My Courses' },
    { to: '/instructor/courses/new', icon: PlusCircle, label: 'Create Course' },
    { to: '/instructor/students', icon: Users, label: 'Students' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { to: '/admin/activity', icon: BarChart2, label: 'Activity' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
  superAdmin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/superadmin/institutes', icon: Building2, label: 'Institutes' },
    { to: '/superadmin/admins', icon: ShieldCheck, label: 'Admins' },
    { to: '/superadmin/courses', icon: BookOpen, label: 'All Courses' },
    { to: '/profile', icon: Settings, label: 'Profile' },
  ],
};

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user ? (NAV_BY_ROLE[user.role] || []) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-dark-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-0 z-30 w-64 glass border-r border-dark-700/50
          flex flex-col transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Close on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-1.5 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-700"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-dark-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark-100 truncate">{user.name}</p>
                <p className="text-xs text-dark-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-dark-700/50">
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
