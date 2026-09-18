import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../api/courseService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CourseCard from '../../components/common/CourseCard';
import { BookOpen, ArrowRight, CheckCircle } from 'lucide-react';

export default function LearnerDashboard() {
  const { user, getMyEnrollments, getCourseProgress } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseService.getAll().then(setCourses).finally(() => setLoading(false));
  }, []);

  const enrollments    = getMyEnrollments();
  const enrolledIds    = new Set(enrollments.map(e => e.courseId));
  const enrolledCourses = courses.filter(c => enrolledIds.has(c._id));
  const completed      = enrolledCourses.filter(c => getCourseProgress(c._id, 10) === 100).length;
  const inProgress     = enrolledCourses.filter(c => { const p = getCourseProgress(c._id, 10); return p > 0 && p < 100; }).length;

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-ink-secondary mt-0.5">Your learning activity</p>
        </div>
        <Link to="/courses" className="btn-primary btn-sm">Browse Courses</Link>
      </div>

      {/* Summary strip */}
      {enrollments.length > 0 && (
        <div className="bg-pg-surface border border-ui-border rounded-lg p-5 mb-6 flex flex-wrap gap-8">
          <div>
            <p className="text-3xl font-bold text-ink">{enrollments.length}</p>
            <p className="text-xs text-ink-secondary mt-0.5">Courses enrolled</p>
          </div>
          <div className="w-px bg-border self-stretch" />
          <div>
            <p className="text-3xl font-bold text-ink">{inProgress}</p>
            <p className="text-xs text-ink-secondary mt-0.5">In progress</p>
          </div>
          <div className="w-px bg-border self-stretch hidden sm:block" />
          <div>
            <p className="text-3xl font-bold text-ink">{completed}</p>
            <p className="text-xs text-ink-secondary mt-0.5 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-st-success" /> Completed
            </p>
          </div>
        </div>
      )}

      {/* Continue learning */}
      {enrolledCourses.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">Continue Learning</h2>
            <Link to="/my-courses" className="text-xs text-accent hover:underline flex items-center gap-1">
              My courses <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.slice(0, 3).map(c => (
              <CourseCard key={c._id} course={c} enrolled progress={getCourseProgress(c._id, 10)} />
            ))}
          </div>
        </div>
      )}

      {/* Discover */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-secondary">
            {enrolledCourses.length > 0 ? 'Discover More' : 'Available Courses'}
          </h2>
          <Link to="/courses" className="text-xs text-accent hover:underline flex items-center gap-1">
            All courses <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {courses.filter(c => !enrolledIds.has(c._id)).length === 0 ? (
          <div className="bg-pg-surface border border-ui-border rounded-lg">
            <div className="empty-state">
              <BookOpen className="empty-state-icon" />
              <p className="empty-state-title">No courses available yet</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.filter(c => !enrolledIds.has(c._id)).slice(0, 6).map(c => (
              <CourseCard key={c._id} course={c} enrolled={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
