import { useEffect, useState } from 'react';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const STUDENTS = [
  { _id:'s1', name:'Jamie Learner',  email:'learner@upskillr.com', progress:67,  lastSeen:'Today',     status:'In Progress' },
  { _id:'s2', name:'Priya Sharma',   email:'priya@example.com',    progress:100, lastSeen:'Yesterday', status:'Completed'   },
  { _id:'s3', name:'Tom Wilson',     email:'tom@example.com',      progress:33,  lastSeen:'3 days ago',status:'In Progress' },
];

export default function InstructorStudentsPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then(data => {
      setCourses(data);
      if (data.length > 0) setSelectedCourse(data[0]._id);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  const completedCount = STUDENTS.filter(s=>s.status==='Completed').length;
  const avgProgress = Math.round(STUDENTS.reduce((s,x)=>s+x.progress,0)/STUDENTS.length);

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Instructor</p>
          <h1 className="page-title">Students</h1>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="bg-pg-surface border border-ui-border rounded-lg">
          <div className="empty-state"><p className="empty-state-title">No courses to show students for</p></div>
        </div>
      ) : (
        <>
          <div className="mb-4 max-w-xs">
            <label className="field-label">Select course</label>
            <select className="field" value={selectedCourse} onChange={e=>setSelectedCourse(e.target.value)}>
              {courses.map(c=><option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>

          {/* Summary strip */}
          <div className="bg-pg-surface border border-ui-border rounded-lg p-4 mb-4 flex gap-8">
            <div>
              <p className="text-2xl font-bold text-ink">{STUDENTS.length}</p>
              <p className="text-xs text-ink-secondary">Enrolled</p>
            </div>
            <div className="w-px bg-border self-stretch" />
            <div>
              <p className="text-2xl font-bold text-ink">{completedCount}</p>
              <p className="text-xs text-ink-secondary">Completed</p>
            </div>
            <div className="w-px bg-border self-stretch hidden sm:block" />
            <div>
              <p className="text-2xl font-bold text-ink">{avgProgress}%</p>
              <p className="text-xs text-ink-secondary">Avg. progress</p>
            </div>
          </div>

          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th className="hidden sm:table-cell">Progress</th>
                  <th className="hidden md:table-cell">Last seen</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {STUDENTS.map(s => (
                  <tr key={s._id}>
                    <td>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center
                                        text-accent text-xs font-bold flex-shrink-0">
                          {s.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink">{s.name}</p>
                          <p className="text-2xs text-ink-muted">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden sm:table-cell">
                      <div className="flex items-center gap-2 w-36">
                        <div className="flex-1 progress-track">
                          <div className="progress-fill" style={{ width:`${s.progress}%` }} />
                        </div>
                        <span className="text-2xs text-ink-muted w-7">{s.progress}%</span>
                      </div>
                    </td>
                    <td className="hidden md:table-cell text-ink-muted text-xs">{s.lastSeen}</td>
                    <td>
                      <span className={s.status==='Completed' ? 'badge badge-green' : 'badge badge-blue'}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
