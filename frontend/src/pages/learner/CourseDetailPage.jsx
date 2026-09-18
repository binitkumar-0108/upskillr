import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import { videoService } from '../../api/videoService';
import { useAuth } from '../../context/AuthContext';
import VideoPlayer from '../../components/common/VideoPlayer';
import StarRating from '../../components/common/StarRating';
import ProgressBar from '../../components/common/ProgressBar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { BookOpen, Play, CheckCircle, Lock, Star } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isEnrolled, enroll, getCourseProgress, getRating, submitRating, getCourseRatings } = useAuth();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    Promise.all([courseService.getById(id), videoService.getByCourse(id)])
      .then(([c, v]) => { setCourse(c); setVideos(v); })
      .catch(() => toast.error('Course not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const enrolled   = isEnrolled(id);
  const progress   = getCourseProgress(id, videos.length);
  const myRating   = getRating(id);
  const allRatings = getCourseRatings(id);
  const avgRating  = allRatings.length ? (allRatings.reduce((s,r)=>s+r.rating,0)/allRatings.length).toFixed(1) : null;

  const handleEnroll = () => {
    if (!user) { navigate('/login'); return; }
    enroll(id); toast.success('Enrolled! Start learning now.');
  };

  const handleRating = () => {
    if (!ratingValue) { toast.error('Select a rating'); return; }
    submitRating(id, ratingValue, reviewText);
    setRatingOpen(false); toast.success('Rating submitted');
  };

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;
  if (!course)  return <div className="page-chrome text-ink-muted text-sm py-16 text-center">Course not found.</div>;

  return (
    <div className="page-chrome animate-fade-in">
      {/* Course header */}
      <div className="bg-pg-surface border border-ui-border rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {course.category && <span className="badge badge-blue mb-2">{course.category}</span>}
            <h1 className="text-2xl font-bold text-ink mt-2 leading-snug">{course.title}</h1>
            {course.description && (
              <p className="text-sm text-ink-secondary mt-2 leading-relaxed max-w-2xl">{course.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-ink-secondary">
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5" /> {videos.length} video{videos.length!==1?'s':''}
              </span>
              {avgRating && (
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {avgRating} ({allRatings.length} review{allRatings.length!==1?'s':''})
                </span>
              )}
            </div>
          </div>

          {/* Enroll / continue */}
          <div className="bg-pg-canvas border border-ui-border rounded-lg p-4 min-w-[200px]">
            {enrolled ? (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-st-success text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Enrolled
                </div>
                <ProgressBar value={progress} />
                <button onClick={() => navigate(`/learn/${id}`)} className="btn-primary w-full justify-center">
                  {progress > 0 ? 'Continue Learning' : 'Start Learning'}
                </button>
                {!myRating ? (
                  <button onClick={() => setRatingOpen(true)} className="btn-secondary w-full justify-center btn-sm">
                    Rate this course
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <StarRating value={myRating.rating} readonly size="sm" />
                    <span className="text-xs text-ink-muted">Your rating</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-ink-secondary">Enroll to access all videos and track progress.</p>
                <button onClick={handleEnroll} className="btn-primary w-full justify-center">Enroll — Free</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video list */}
        <div className="lg:col-span-2 bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
          <div className="px-5 py-3.5 border-b border-ui-border">
            <h2 className="text-sm font-semibold text-ink">Course Content</h2>
          </div>
          {videos.length === 0 ? (
            <div className="empty-state">
              <BookOpen className="empty-state-icon" />
              <p className="empty-state-title">No videos yet</p>
            </div>
          ) : (
            <div className="divide-y divide-ui-border">
              {videos.map((v, i) => (
                <button key={v._id}
                  onClick={() => enrolled ? navigate(`/learn/${id}?video=${v._id}`) : handleEnroll()}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-pg-canvas
                             transition-colors group">
                  <div className="w-7 h-7 rounded border border-ui-border bg-pg-canvas flex items-center justify-center
                                  text-xs text-ink-muted flex-shrink-0 group-hover:border-accent/40">
                    {enrolled ? <Play className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate group-hover:text-accent">{v.title}</p>
                    {v.description && <p className="text-2xs text-ink-muted truncate mt-0.5">{v.description}</p>}
                  </div>
                  {v.duration && <span className="text-2xs text-ink-muted flex-shrink-0">{v.duration}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        {allRatings.length > 0 && (
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden h-fit">
            <div className="px-5 py-3.5 border-b border-ui-border">
              <h2 className="text-sm font-semibold text-ink">Reviews</h2>
            </div>
            <div className="divide-y divide-ui-border">
              {allRatings.slice(0,4).map((r,i) => (
                <div key={i} className="px-5 py-3.5">
                  <StarRating value={r.rating} readonly size="sm" />
                  {r.review && <p className="text-xs text-ink-secondary mt-1">{r.review}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={ratingOpen} onClose={() => setRatingOpen(false)} title="Rate this Course">
        <div className="space-y-4">
          <div className="flex justify-center py-2">
            <StarRating value={ratingValue} onChange={setRatingValue} size="lg" />
          </div>
          <div className="field-group">
            <label className="field-label">Review (optional)</label>
            <textarea className="field resize-none h-24" placeholder="Share your experience…"
              value={reviewText} onChange={e => setReviewText(e.target.value)} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleRating} className="btn-primary flex-1">Submit Rating</button>
            <button onClick={() => setRatingOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
