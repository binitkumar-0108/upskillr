import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus, Search, BookOpen, Wrench, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    courseService.getAll().then(data => { setCourses(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!search) setFiltered(courses);
    else setFiltered(courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, courses]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this course and all its videos?')) return;
    try {
      await courseService.remove(id);
      setCourses(p => p.filter(c => c._id !== id));
      toast.success('Course deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Instructor</p>
          <h1 className="page-title">My Courses</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{courses.length} course{courses.length!==1?'s':''}</p>
        </div>
        <Link to="/instructor/courses/new" className="btn-primary">
          <Plus className="w-4 h-4" /> New Course
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input className="field pl-9" placeholder="Search courses…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-pg-surface border border-ui-border rounded-lg">
          <div className="empty-state">
            <BookOpen className="empty-state-icon" />
            <p className="empty-state-title">No courses yet</p>
            <p className="empty-state-desc mb-4">Create your first course to start teaching</p>
            <Link to="/instructor/courses/new" className="btn-primary btn-sm">
              <Plus className="w-3.5 h-3.5" /> Create Course
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th className="hidden sm:table-cell">Category</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c._id} className="cursor-pointer" onClick={() => navigate(`/instructor/courses/${c._id}/build`)}>
                  <td>
                    <p className="text-sm font-medium text-ink">{c.title}</p>
                    {c.description && <p className="text-2xs text-ink-muted mt-0.5 line-clamp-1">{c.description}</p>}
                  </td>
                  <td className="hidden sm:table-cell">
                    {c.category ? <span className="badge badge-gray">{c.category}</span> : <span className="text-ink-muted text-xs">—</span>}
                  </td>
                  <td>
                    <span className={c.isPublished ? 'badge badge-green' : 'badge badge-yellow'}>
                      {c.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="text-right" onClick={e=>e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => navigate(`/instructor/courses/${c._id}/build`)}
                        className="btn-ghost btn-sm flex items-center gap-1">
                        <Wrench className="w-3.5 h-3.5" /> Build
                      </button>
                      <button onClick={e=>handleDelete(c._id,e)}
                        className="btn-icon text-st-danger hover:bg-st-danger-b">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
