import { Link } from 'react-router-dom';
import { PlayCircle, CheckCircle, BookOpen } from 'lucide-react';
import ProgressBar from './ProgressBar';

export default function CourseCard({ course, enrolled = false, progress = 0 }) {
  return (
    <Link
      to={`/courses/${course._id}`}
      className="block bg-pg-surface border border-ui-border rounded-lg shadow-surface
                 hover:border-accent/30 hover:shadow-elevated transition-all group"
    >
      {/* Thumbnail strip */}
      <div className="h-36 rounded-t-lg bg-accent-light overflow-hidden flex items-center justify-center
                      border-b border-ui-border relative">
        <BookOpen className="w-8 h-8 text-accent/30" />
        {course.category && (
          <span className="badge badge-blue absolute top-3 left-3">{course.category}</span>
        )}
        {enrolled && (
          <span className="absolute top-3 right-3">
            {progress === 100
              ? <CheckCircle className="w-4 h-4 text-st-success" />
              : <PlayCircle className="w-4 h-4 text-accent" />
            }
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-ink leading-snug group-hover:text-accent
                       transition-colors line-clamp-2 mb-1">
          {course.title}
        </h3>
        {course.description && (
          <p className="text-xs text-ink-secondary line-clamp-2 mb-3">
            {course.description}
          </p>
        )}

        {enrolled ? (
          <ProgressBar value={progress} showLabel={false} />
        ) : (
          <div className="flex items-center justify-between pt-1">
            <span className={course.isPublished ? 'badge badge-green' : 'badge badge-yellow'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </span>
            <span className="text-2xs text-ink-muted group-hover:text-accent font-medium transition-colors">
              View course →
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
