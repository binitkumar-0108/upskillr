import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const QUICK = [
  { label: 'Super Admin', email: 'super@upskillr.com',      password: 'super123'      },
  { label: 'Admin',       email: 'admin@upskillr.com',      password: 'admin123'      },
  { label: 'Instructor',  email: 'instructor@upskillr.com', password: 'instructor123' },
  { label: 'Learner',     email: 'learner@upskillr.com',    password: 'learner123'    },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (res.success) { toast.success(`Welcome, ${res.user.name}`); navigate(from, { replace: true }); }
    else toast.error(res.message);
  };

  const quickLogin = (acc) => {
    const res = login(acc.email, acc.password);
    if (res.success) { navigate('/dashboard', { replace: true }); }
  };

  return (
    <div className="min-h-screen bg-pg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent mb-4">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-ink">Sign in to UpSkillr</h1>
          <p className="text-sm text-ink-secondary mt-1">Institutional learning management</p>
        </div>

        {/* Card */}
        <div className="bg-pg-surface border border-ui-border rounded-lg shadow-surface">

          {/* Quick login */}
          <div className="px-6 pt-5 pb-4 border-b border-ui-border">
            <p className="text-2xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
              Quick demo login
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK.map(acc => (
                <button
                  key={acc.label}
                  type="button"
                  onClick={() => quickLogin(acc)}
                  className="text-left px-3 py-2.5 rounded border border-ui-border bg-pg-canvas
                             hover:border-accent/40 hover:bg-accent-light transition-all group"
                >
                  <span className="block text-xs font-semibold text-ink group-hover:text-accent">
                    {acc.label}
                  </span>
                  <span className="block text-2xs text-ink-muted mt-0.5 truncate">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div className="field-group">
              <label className="field-label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input type="email" className="field pl-9" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input type={showPw ? 'text' : 'password'} className="field pl-9 pr-9"
                  placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="px-6 pb-5 text-center">
            <p className="text-xs text-ink-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent font-medium hover:underline">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
