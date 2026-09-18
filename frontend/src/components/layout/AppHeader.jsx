import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';
import {
  GraduationCap, ChevronDown, LogOut, User,
  LayoutGrid, BookOpen, Users, BarChart2,
  Building2, Shield, PlaySquare, PlusCircle
} from 'lucide-react';

/* ── Per-role navigation ──────────────────────────────────── */
const NAV = {
  learner: [
    { to: '/dashboard/learner', label: 'Overview' },
    { to: '/courses',           label: 'Courses'  },
    { to: '/my-courses',        label: 'My Learning' },
  ],
  instructor: [
    { to: '/dashboard/instructor', label: 'Overview' },
    { to: '/instructor/courses',   label: 'My Courses' },
    { to: '/instructor/students',  label: 'Students'  },
  ],
  admin: [
    { to: '/dashboard/admin', label: 'Overview'  },
    { to: '/admin/users',     label: 'Users'     },
    { to: '/admin/courses',   label: 'Courses'   },
    { to: '/admin/activity',  label: 'Analytics' },
  ],
  superAdmin: [
    { to: '/dashboard/superadmin',   label: 'Overview'       },
    { to: '/superadmin/institutes',  label: 'Institutes'     },
    { to: '/superadmin/admins',      label: 'Administrators' },
    { to: '/superadmin/courses',     label: 'All Courses'    },
  ],
};

const ROLE_LABELS = {
  learner:    'Learner',
  instructor: 'Instructor',
  admin:      'Admin',
  superAdmin: 'Super Admin',
};

export default function AppHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef(null);

  const navItems = user ? (NAV[user.role] || []) : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header animate-fade-in">
      <div className="flex items-center h-full px-4 lg:px-6 gap-4">

        {/* ── Logo ── */}
        <NavLink to="/dashboard" className="flex items-center gap-2 flex-shrink-0 mr-2">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-header-text font-semibold text-base tracking-tight select-none">
            UpSkillr
          </span>
        </NavLink>

        {/* ── Primary navigation (desktop) ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right controls ── */}
        <div className="flex items-center gap-1 ml-auto">

          {/* Quick action button per role */}
          {user?.role === 'instructor' && (
            <NavLink to="/instructor/courses/new"
              className="btn-primary btn-sm hidden sm:inline-flex">
              <PlusCircle className="w-3.5 h-3.5" /> New Course
            </NavLink>
          )}

          {/* User menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-header-hover transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center
                                text-white text-2xs font-bold flex-shrink-0">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-header-text leading-none">{user.name}</p>
                  <p className="text-2xs text-header-muted mt-0.5">{ROLE_LABELS[user.role]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-header-muted hidden sm:block" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-pg-surface border border-ui-border
                                shadow-elevated rounded-lg py-1 z-50 animate-slide-down">
                  <div className="px-3 py-2 border-b border-ui-border">
                    <p className="text-xs font-medium text-ink">{user.name}</p>
                    <p className="text-2xs text-ink-muted mt-0.5 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink
                               hover:bg-pg-canvas transition-colors"
                  >
                    <User className="w-4 h-4 text-ink-secondary" /> Profile & Settings
                  </button>
                  <div className="border-t border-ui-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-st-danger
                                 hover:bg-st-danger-b transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile nav toggle */}
          <button
            className="md:hidden btn-icon ml-1"
            onClick={() => setMobileNavOpen(v => !v)}
          >
            <LayoutGrid className="w-4 h-4 text-header-text" />
          </button>
        </div>
      </div>

      {/* ── Mobile navigation ── */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-white/10 bg-header-bg px-4 py-2 flex flex-col gap-0.5">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => `nav-item w-full ${isActive ? 'active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
