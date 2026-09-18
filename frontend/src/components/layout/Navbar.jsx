import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Bell, LogOut, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const ROLE_LABELS = {
  learner: { label: 'Learner', color: 'badge-blue' },
  instructor: { label: 'Instructor', color: 'badge-primary' },
  admin: { label: 'Admin', color: 'badge-yellow' },
  superAdmin: { label: 'Super Admin', color: 'badge-red' },
};

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleInfo = user ? ROLE_LABELS[user.role] : null;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass border-b border-dark-700/50 h-16">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-dark-400 hover:text-dark-100 hover:bg-dark-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="flex items-center gap-2.5 select-none">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-lg shadow-primary-900/40">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-dark-50 hidden sm:block">
              Up<span className="text-primary-400">Skillr</span>
            </span>
          </Link>
        </div>

        {/* Right: user menu */}
        {user && (
          <div className="flex items-center gap-2">
            {roleInfo && (
              <span className={`${roleInfo.color} hidden sm:inline-flex text-xs`}>
                {roleInfo.label}
              </span>
            )}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 p-2 rounded-xl hover:bg-dark-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden md:block text-sm font-medium text-dark-200">
                  {user.name}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 glass-card py-1 shadow-xl shadow-black/40 animate-slide-up">
                  <div className="px-4 py-2 border-b border-dark-700/50">
                    <p className="text-xs text-dark-500">Signed in as</p>
                    <p className="text-sm font-medium text-dark-200 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate('/profile'); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-300 hover:text-dark-100 hover:bg-dark-800 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
