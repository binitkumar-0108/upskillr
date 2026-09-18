import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';

const MONTHLY_VIEWS = [8, 14, 11, 20, 18, 26, 24, 31, 28, 35, 32, 41];
const MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
const DEMO_STUDENTS = [
  { name:'Jamie Learner',  progress:67,  lastSeen:'Today'      },
  { name:'Priya Sharma',   progress:100, lastSeen:'Yesterday'  },
  { name:'Tom Wilson',     progress:33,  lastSeen:'3 days ago' },
];

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxVal = Math.max(...MONTHLY_VIEWS);

  useEffect(() => {
    courseService.getAll().then(setCourses).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="text-sm text-ink-secondary mt-0.5">Instructor workspace</p>
        </div>
        <Link to="/instructor/courses/new" className="btn-primary">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      {/* Summary */}
      <div className="bg-pg-surface border border-ui-border rounded-lg p-5 mb-6 flex flex-wrap gap-8">
        <div>
          <p className="text-3xl font-bold text-ink">{courses.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Courses created</p>
        </div>
        <div className="w-px bg-border self-stretch" />
        <div>
          <p className="text-3xl font-bold text-ink">{courses.filter(c=>c.isPublished).length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Published</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">{DEMO_STUDENTS.length}</p>
          <p className="text-xs text-ink-secondary mt-0.5">Active students</p>
        </div>
        <div className="w-px bg-border self-stretch hidden sm:block" />
        <div>
          <p className="text-3xl font-bold text-ink">4.8</p>
          <p className="text-xs text-ink-secondary mt-0.5">Avg. course rating</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Course list */}
        <div className="lg:col-span-3 bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
            <h2 className="text-sm font-semibold text-ink">Your Courses</h2>
            <Link to="/instructor/courses" className="text-xs text-accent hover:underline flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {courses.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <BookOpen className="w-8 h-8 text-ink-muted mx-auto mb-3" />
              <p className="text-sm text-ink-secondary mb-3">No courses yet</p>
              <Link to="/instructor/courses/new" className="btn-primary btn-sm inline-flex">
                <Plus className="w-3.5 h-3.5" /> Create first course
              </Link>
            </div>
          ) : (
            <table className="data-table">
              <thead><tr>
                <th>Title</th>
                <th className="hidden sm:table-cell">Category</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr></thead>
              <tbody>
                {courses.slice(0, 6).map(c => (
                  <tr key={c._id}>
                    <td>
                      <p className="text-sm font-medium text-ink line-clamp-1">{c.title}</p>
                    </td>
                    <td className="hidden sm:table-cell">
                      {c.category ? <span className="badge badge-gray">{c.category}</span> : <span className="text-ink-muted">—</span>}
                    </td>
                    <td>
                      <span className={c.isPublished ? 'badge badge-green' : 'badge badge-yellow'}>
                        {c.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/instructor/courses/${c._id}/build`} className="text-xs text-accent hover:underline">
                        Build →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video views chart */}
          <div className="bg-pg-surface border border-ui-border rounded-lg p-5">
            <h2 className="text-sm font-semibold text-ink mb-1">Video Views</h2>
            <p className="text-2xs text-ink-muted mb-4">Monthly, this year</p>
            <div className="flex items-end gap-1 h-24">
              {MONTHLY_VIEWS.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm bg-accent"
                    style={{ height:`${(v/maxVal)*100}%`, minHeight:'3px', opacity: 0.6 + (v/maxVal)*0.4 }} />
                  <span className="text-2xs text-ink-muted">{MONTHS[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Student progress */}
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
              <h2 className="text-sm font-semibold text-ink">Student Progress</h2>
              <Link to="/instructor/students" className="text-xs text-accent hover:underline">All →</Link>
            </div>
            <div className="divide-y divide-ui-border">
              {DEMO_STUDENTS.map((s, i) => (
                <div key={i} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-ink">{s.name}</p>
                    <span className="text-xs text-ink-muted">{s.lastSeen}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 progress-track">
                      <div className="progress-fill" style={{ width:`${s.progress}%` }} />
                    </div>
                    <span className="text-2xs text-ink-muted w-7 text-right">{s.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
