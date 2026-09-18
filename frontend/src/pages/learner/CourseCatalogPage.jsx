import { useEffect, useState } from 'react';
import { courseService } from '../../api/courseService';
import CourseCard from '../../components/common/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { Search, BookOpen } from 'lucide-react';

const CATEGORIES = ['All','Java','Python','JavaScript','React','Node.js','Data Science','Machine Learning','Web Development'];

export default function CourseCatalogPage() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { getMyEnrollments, getCourseProgress } = useAuth();

  useEffect(() => {
    courseService.getAll().then(data => { setCourses(data); setFiltered(data); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let r = courses;
    if (search) r = r.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'All') r = r.filter(c => c.category?.toLowerCase() === category.toLowerCase());
    setFiltered(r);
  }, [search, category, courses]);

  const enrolledIds = new Set(getMyEnrollments().map(e => e.courseId));

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{courses.length} courses available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input className="field pl-9" placeholder="Search courses…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                category === cat
                  ? 'bg-accent text-white border-accent'
                  : 'bg-pg-surface text-ink-secondary border-ui-border hover:border-ui-border-strong hover:text-ink'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-pg-surface border border-ui-border rounded-lg">
          <div className="empty-state">
            <BookOpen className="empty-state-icon" />
            <p className="empty-state-title">No courses found</p>
            <p className="empty-state-desc">Try a different search or category</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(c => (
            <CourseCard key={c._id} course={c} enrolled={enrolledIds.has(c._id)} progress={getCourseProgress(c._id, 10)} />
          ))}
        </div>
      )}
    </div>
  );
}
