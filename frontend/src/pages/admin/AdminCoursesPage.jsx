import { useEffect, useState } from 'react';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Search, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    courseService.getAll().then(data => { setCourses(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = courses;
    if (search) r = r.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter !== 'all') r = r.filter(c => statusFilter === 'published' ? c.isPublished : !c.isPublished);
    setFiltered(r);
  }, [search, statusFilter, courses]);

  const handleDelete = async id => {
    if (!window.confirm('Remove this course from the platform?')) return;
    try {
      await courseService.remove(id);
      setCourses(p => p.filter(c => c._id !== id));
      toast.success('Course removed');
    } catch { toast.error('Failed to remove'); }
  };

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Admin</p>
          <h1 className="page-title">Courses</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{courses.length} courses on the platform</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input className="field pl-9" placeholder="Search courses…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="field w-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

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
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-sm text-ink-muted">No courses found</td></tr>
            ) : filtered.map(c => (
              <tr key={c._id}>
                <td>
                  <p className="text-sm font-medium text-ink">{c.title}</p>
                  {c.description && <p className="text-2xs text-ink-muted mt-0.5 line-clamp-1">{c.description}</p>}
                </td>
                <td className="hidden sm:table-cell">
                  {c.category ? <span className="badge badge-blue">{c.category}</span> : <span className="text-ink-muted text-xs">—</span>}
                </td>
                <td>
                  <span className={c.isPublished ? 'badge badge-green' : 'badge badge-yellow'}>
                    {c.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => navigate(`/courses/${c._id}`)} className="btn-icon" data-tooltip="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c._id)} className="btn-icon text-st-danger hover:bg-st-danger-b" data-tooltip="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-ui-border bg-pg-canvas">
          <p className="text-xs text-ink-muted">Showing {filtered.length} of {courses.length} courses</p>
        </div>
      </div>
    </div>
  );
}
