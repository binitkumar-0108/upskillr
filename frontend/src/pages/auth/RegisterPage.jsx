import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const res = register(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (res.success) { toast.success(`Welcome, ${res.user.name}`); navigate('/dashboard', { replace: true }); }
    else toast.error(res.message);
  };

  return (
    <div className="min-h-screen bg-pg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-accent mb-4">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-ink">Create an account</h1>
          <p className="text-sm text-ink-secondary mt-1">Join UpSkillr today</p>
        </div>

        <div className="bg-pg-surface border border-ui-border rounded-lg shadow-surface p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="field-group">
              <label className="field-label">Full name</label>
              <input name="name" type="text" className="field" placeholder="Jane Smith"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label className="field-label">Email address</label>
              <input name="email" type="email" className="field" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="relative">
                <input name="password" type={showPw ? 'text' : 'password'} className="field pr-9"
                  placeholder="Minimum 6 characters" value={form.password} onChange={handleChange} required />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="field-group">
              <label className="field-label">I am a…</label>
              <select name="role" className="field" value={form.role} onChange={handleChange}>
                <option value="learner">Learner</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-xs text-ink-secondary text-center mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
