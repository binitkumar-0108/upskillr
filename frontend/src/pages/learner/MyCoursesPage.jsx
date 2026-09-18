import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../api/courseService';
import CourseCard from '../../components/common/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MyCoursesPage() {
  const { getMyEnrollments, getCourseProgress } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrollments = getMyEnrollments();
    if (!enrollments.length) { setLoading(false); return; }
    Promise.all(enrollments.map(e => courseService.getById(e.courseId).catch(() => null)))
      .then(data => setCourses(data.filter(Boolean)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Learning</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{courses.length} enrolled course{courses.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/courses" className="btn-secondary btn-sm">Browse more</Link>
      </div>

      {courses.length === 0 ? (
        <div className="bg-pg-surface border border-ui-border rounded-lg">
          <div className="empty-state">
            <BookOpen className="empty-state-icon" />
            <p className="empty-state-title">No enrolled courses</p>
            <p className="empty-state-desc mb-4">Browse the catalog and enroll in something</p>
            <Link to="/courses" className="btn-primary btn-sm inline-flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5" /> Browse courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(c => (
            <CourseCard key={c._id} course={c} enrolled progress={getCourseProgress(c._id, 10)} />
          ))}
        </div>
      )}
    </div>
  );
}
