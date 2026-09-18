import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';

const INSTITUTES = [
  { _id: 'i1', name: 'Tech Academy Mumbai',   domain: 'techacademy.in',  active: true,  users: 145, courses: 12, enrollments: 289, lastActive: '2h ago'  },
  { _id: 'i2', name: 'CodeCraft Delhi',        domain: 'codecraft.edu',   active: true,  users: 320, courses: 28, enrollments: 741, lastActive: '15m ago' },
  { _id: 'i3', name: 'DataSci Bangalore',      domain: 'datasci.org',     active: false, users: 33,  courses: 8,  enrollments: 60,  lastActive: '3d ago'  },
  { _id: 'i4', name: 'AI Institute Pune',      domain: 'aiinstitute.in',  active: true,  users: 167, courses: 15, enrollments: 312, lastActive: '1h ago'  },
  { _id: 'i5', name: 'WebDev College Chennai', domain: 'webdevcol.ac.in', active: true,  users: 98,  courses: 9,  enrollments: 154, lastActive: '6h ago'  },
];

const ACTIVITY = [
  { text: 'CodeCraft Delhi added 3 new courses', time: '12 min ago', type: 'info' },
  { text: 'DataSci Bangalore subscription expires in 7 days', time: '1 hour ago', type: 'warning' },
  { text: 'New admin assigned to AI Institute Pune', time: '3 hours ago', type: 'info' },
  { text: 'Tech Academy Mumbai reached 100 active learners', time: 'Yesterday', type: 'success' },
];

const MONTHLY = [42, 61, 58, 79, 74, 93, 110, 98, 122, 108, 131, 145];
const MONTHS  = ['J','F','M','A','M','J','J','A','S','O','N','D'];

export default function SuperAdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then(setCourses).finally(() => setLoading(false));
  }, []);

  const totalUsers    = INSTITUTES.reduce((s,i) => s + i.users, 0);
  const totalEnroll   = INSTITUTES.reduce((s,i) => s + i.enrollments, 0);
  const activeInst    = INSTITUTES.filter(i => i.active).length;
  const maxVal        = Math.max(...MONTHLY);

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">

      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Platform Overview</h1>
          <p className="text-sm text-ink-secondary mt-0.5">UpSkillr · Super Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/superadmin/institutes" className="btn-secondary btn-sm">Manage Institutes</Link>
          <Link to="/superadmin/admins" className="btn-primary btn-sm">+ Add Admin</Link>
        </div>
      </div>

      {/* ── Top summary bar (not 4-equal-cards) ─────────────── */}
      <div className="bg-pg-surface border border-ui-border rounded-lg p-5 mb-6 flex flex-wrap gap-8">
        <div>
          <p className="text-3xl font-bold text-ink">{INSTITUTES.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Institutes <span className="text-st-success font-medium">({activeInst} active)</span></p>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <p className="text-3xl font-bold text-ink">{totalUsers.toLocaleString()}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Total users across platform</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">{courses.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Courses on platform</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">{totalEnroll.toLocaleString()}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Total enrollments</p>
        </div>
        <div className="ml-auto self-center hidden lg:flex items-center gap-1.5 text-xs text-st-success font-medium">
          <TrendingUp className="w-3.5 h-3.5" />
          +18% enrollments this month
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Institute table ────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
              <h2 className="text-sm font-semibold text-ink">Institutes</h2>
              <Link to="/superadmin/institutes"
                className="text-xs text-accent hover:underline flex items-center gap-1">
                Manage all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Institute</th>
                  <th className="hidden sm:table-cell">Users</th>
                  <th className="hidden md:table-cell">Courses</th>
                  <th>Status</th>
                  <th className="hidden lg:table-cell">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {INSTITUTES.map(inst => (
                  <tr key={inst._id}>
                    <td>
                      <p className="font-medium text-ink text-sm">{inst.name}</p>
                      <p className="text-2xs text-ink-muted">{inst.domain}</p>
                    </td>
                    <td className="hidden sm:table-cell text-ink-secondary">{inst.users}</td>
                    <td className="hidden md:table-cell text-ink-secondary">{inst.courses}</td>
                    <td>
                      <span className={inst.active ? 'badge badge-green' : 'badge badge-red'}>
                        {inst.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell text-ink-muted text-xs">{inst.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right column ────────────────────────────── */}
        <div className="space-y-6">
          {/* Monthly enrollment chart */}
          <div className="bg-pg-surface border border-ui-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Enrollment Trend</h2>
            <div className="flex items-end gap-1 h-28">
              {MONTHLY.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-accent/20 relative overflow-hidden"
                    style={{ height: `${(val / maxVal) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-accent rounded-sm"
                      style={{ height: i === 11 ? '100%' : `${60 + Math.random() * 40}%` }}
                    />
                  </div>
                  <span className="text-2xs text-ink-muted">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-2xs text-ink-muted mt-3">
              <span className="font-semibold text-ink">{MONTHLY[11]}</span> enrollments in Dec
            </p>
          </div>

          {/* Recent activity */}
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-ui-border">
              <h2 className="text-sm font-semibold text-ink">Recent Activity</h2>
            </div>
            <div className="divide-y divide-ui-border">
              {ACTIVITY.map((a, i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      a.type === 'warning' ? 'bg-status-warning' :
                      a.type === 'success' ? 'bg-status-success' : 'bg-accent'
                    }`} />
                    <div>
                      <p className="text-xs text-ink leading-snug">{a.text}</p>
                      <p className="text-2xs text-ink-muted mt-0.5">{a.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attention required */}
          <div className="bg-st-warning-b border border-st-warning/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-st-warning flex-shrink-0" />
              <h3 className="text-xs font-semibold text-st-warning">Needs Attention</h3>
            </div>
            <p className="text-xs text-ink-secondary">
              DataSci Bangalore subscription expires in 7 days. Renew to avoid service interruption.
            </p>
            <Link to="/superadmin/institutes" className="inline-block mt-2 text-xs font-medium text-st-warning hover:underline">
              View institute →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
