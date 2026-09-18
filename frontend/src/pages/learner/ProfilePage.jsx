import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const ROLE_LABELS = { learner:'Learner', instructor:'Instructor', admin:'Admin', superAdmin:'Super Admin' };

const DEMO_CREDS = [
  { role:'Super Admin', email:'super@upskillr.com',      pass:'super123'      },
  { role:'Admin',       email:'admin@upskillr.com',      pass:'admin123'      },
  { role:'Instructor',  email:'instructor@upskillr.com', pass:'instructor123' },
  { role:'Learner',     email:'learner@upskillr.com',    pass:'learner123'    },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    toast.success('Profile updated (demo mode)');
    setEditing(false);
  };

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Profile</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Profile card */}
        <div className="bg-pg-surface border border-ui-border rounded-lg p-6">
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center
                            text-white text-xl font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <input className="field text-base font-semibold mb-2" value={name}
                  onChange={e => setName(e.target.value)} autoFocus />
              ) : (
                <h2 className="text-base font-semibold text-ink">{user?.name}</h2>
              )}
              <p className="text-sm text-ink-secondary flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5" /> {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Shield className="w-3.5 h-3.5 text-ink-muted" />
                <span className="badge badge-blue">{ROLE_LABELS[user?.role] || user?.role}</span>
              </div>
            </div>
            <div>
              {editing ? (
                <div className="flex gap-2">
                  <button onClick={handleSave} className="btn-primary btn-sm">Save</button>
                  <button onClick={() => setEditing(false)} className="btn-secondary btn-sm">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-secondary btn-sm">Edit</button>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-ui-border">
            <div>
              <p className="field-label">User ID</p>
              <p className="text-xs font-mono text-ink-secondary bg-pg-canvas border border-ui-border
                            rounded px-2 py-1.5 truncate">{user?._id}</p>
            </div>
            <div>
              <p className="field-label">Account Type</p>
              <p className="text-sm text-ink capitalize">{ROLE_LABELS[user?.role] || user?.role}</p>
            </div>
          </div>
        </div>

        {/* Demo credentials reference */}
        <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ui-border">
            <h3 className="text-sm font-semibold text-ink">Demo Credentials</h3>
            <p className="text-xs text-ink-muted mt-0.5">For testing different roles</p>
          </div>
          <table className="data-table">
            <thead><tr><th>Role</th><th>Email</th><th>Password</th></tr></thead>
            <tbody>
              {DEMO_CREDS.map(c => (
                <tr key={c.role}>
                  <td className="font-medium">{c.role}</td>
                  <td className="font-mono text-xs text-ink-secondary">{c.email}</td>
                  <td className="font-mono text-xs text-ink-secondary">{c.pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
