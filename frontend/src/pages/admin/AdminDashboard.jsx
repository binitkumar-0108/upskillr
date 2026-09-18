import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowRight, TrendingUp, Users, BookOpen, Activity } from 'lucide-react';

const DEMO_USERS = [
  { _id:'u1', name:'Jamie Learner',   email:'learner@upskillr.com',     role:'learner',     isActive:true,  joinedAt:'Jan 10' },
  { _id:'u2', name:'Alex Instructor', email:'instructor@upskillr.com',  role:'instructor',  isActive:true,  joinedAt:'Jan 05' },
  { _id:'u3', name:'Priya Sharma',    email:'priya@example.com',        role:'learner',     isActive:true,  joinedAt:'Feb 14' },
  { _id:'u4', name:'Ravi Kumar',      email:'ravi@example.com',         role:'learner',     isActive:false, joinedAt:'Mar 01' },
  { _id:'u5', name:'Maria Gonzalez',  email:'maria@example.com',        role:'instructor',  isActive:true,  joinedAt:'Feb 20' },
  { _id:'u6', name:'Tom Wilson',      email:'tom@example.com',          role:'learner',     isActive:true,  joinedAt:'Apr 05' },
];

const WEEKLY = [12, 19, 15, 27, 23, 31, 28];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then(setCourses).finally(() => setLoading(false));
  }, []);

  const activeUsers   = DEMO_USERS.filter(u => u.isActive).length;
  const instructors   = DEMO_USERS.filter(u => u.role === 'instructor').length;
  const maxWeekly     = Math.max(...WEEKLY);

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="text-sm text-ink-secondary mt-0.5">Institute administration dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/users" className="btn-secondary btn-sm">Manage Users</Link>
          <Link to="/admin/courses" className="btn-primary btn-sm">View Courses</Link>
        </div>
      </div>

      {/* Summary strip */}
      <div className="bg-pg-surface border border-ui-border rounded-lg p-5 mb-6 flex flex-wrap gap-8">
        <div>
          <p className="text-3xl font-bold text-ink">{DEMO_USERS.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Total users <span className="text-st-success font-medium">({activeUsers} active)</span></p>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <p className="text-3xl font-bold text-ink">{instructors}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Instructors</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">{courses.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Active courses</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">284</p>
          <p className="text-xs text-ink-secondary mt-0.5">Total enrollments</p>
        </div>
        <div className="ml-auto hidden lg:flex items-center gap-1.5 text-xs text-st-success font-medium self-center">
          <TrendingUp className="w-3.5 h-3.5" /> +12% this month
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Users table */}
        <div className="lg:col-span-3 bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
            <h2 className="text-sm font-semibold text-ink">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-accent hover:underline flex items-center gap-1">
              All users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <table className="data-table">
            <thead><tr>
              <th>Name</th>
              <th className="hidden sm:table-cell">Role</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Joined</th>
            </tr></thead>
            <tbody>
              {DEMO_USERS.slice(0,5).map(u => (
                <tr key={u._id}>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center
                                      text-accent text-2xs font-bold flex-shrink-0">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{u.name}</p>
                        <p className="text-2xs text-ink-muted hidden sm:block">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell">
                    <span className={u.role==='instructor' ? 'badge badge-blue' : 'badge badge-gray'}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={u.isActive ? 'badge badge-green' : 'badge badge-red'}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="hidden md:table-cell text-ink-muted text-xs">{u.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly activity chart */}
          <div className="bg-pg-surface border border-ui-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-1">Weekly Logins</h2>
            <p className="text-2xs text-ink-muted mb-4">Last 7 days</p>
            <div className="flex items-end gap-1.5 h-24">
              {WEEKLY.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm bg-accent"
                    style={{ height: `${(v/maxWeekly)*100}%`, minHeight: '3px', opacity: 0.7 + (v/maxWeekly)*0.3 }} />
                  <span className="text-2xs text-ink-muted">{DAYS[i]}</span>
                </div>
              ))}
            </div>
            <p className="text-2xs text-ink-muted mt-3">
              <span className="font-semibold text-ink">{WEEKLY[6]}</span> logins on Sunday
            </p>
          </div>

          {/* Courses status */}
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
              <h2 className="text-sm font-semibold text-ink">Courses</h2>
              <Link to="/admin/courses" className="text-xs text-accent hover:underline">View all →</Link>
            </div>
            <div className="divide-y divide-ui-border">
              {courses.slice(0, 4).map(c => (
                <div key={c._id} className="flex items-center justify-between px-5 py-3">
                  <p className="text-sm text-ink font-medium truncate pr-2">{c.title}</p>
                  <span className={c.isPublished ? 'badge badge-green flex-shrink-0' : 'badge badge-yellow flex-shrink-0'}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-ink-muted">No courses yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
