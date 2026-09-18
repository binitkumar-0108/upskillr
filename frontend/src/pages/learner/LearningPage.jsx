import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import { videoService } from '../../api/videoService';
import { useAuth } from '../../context/AuthContext';
import VideoPlayer from '../../components/common/VideoPlayer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, ArrowLeft, PanelRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LearningPage() {
  const { courseId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEnrolled, isVideoCompleted, markVideoComplete, getCourseProgress } = useAuth();

  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlistOpen, setPlaylistOpen] = useState(true);

  useEffect(() => {
    Promise.all([courseService.getById(courseId), videoService.getByCourse(courseId)])
      .then(([c, v]) => {
        setCourse(c); setVideos(v);
        const vid = searchParams.get('video');
        setCurrentVideo(v.find(x => x._id === vid) || v[0] || null);
      })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [courseId]);

  useEffect(() => {
    if (!loading && !isEnrolled(courseId)) navigate(`/courses/${courseId}`, { replace: true });
  }, [loading, courseId]);

  const selectVideo = v => { setCurrentVideo(v); setSearchParams({ video: v._id }); };

  const handleComplete = () => {
    if (!currentVideo) return;
    markVideoComplete(courseId, currentVideo._id);
    toast.success('Marked as complete');
    const idx = videos.findIndex(v => v._id === currentVideo._id);
    if (idx < videos.length - 1) selectVideo(videos[idx + 1]);
  };

  const currentIdx = videos.findIndex(v => v._id === currentVideo?._id);
  const progress   = getCourseProgress(courseId, videos.length);
  const doneCount  = videos.filter(v => isVideoCompleted(courseId, v._id)).length;

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;

  return (
    /* Full-viewport layout — override page-chrome padding */
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-pg-surface border-b border-ui-border flex-shrink-0">
        <button onClick={() => navigate(`/courses/${courseId}`)}
          className="flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink">
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:block truncate max-w-xs font-medium">{course?.title}</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 bg-pg-canvas border border-ui-border rounded-full h-1.5">
              <div className="h-1.5 bg-accent rounded-full transition-all" style={{ width:`${progress}%` }} />
            </div>
            <span className="text-xs text-ink-muted">{doneCount}/{videos.length}</span>
          </div>
          <button onClick={() => setPlaylistOpen(v => !v)} className="btn-icon">
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Player area */}
        <div className="flex-1 overflow-y-auto bg-pg-canvas">
          <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            {currentVideo ? (
              <>
                <VideoPlayer youtubeId={currentVideo.youtubeId} title={currentVideo.title} />

                <div className="bg-pg-surface border border-ui-border rounded-lg p-4">
                  <h2 className="text-base font-semibold text-ink">{currentVideo.title}</h2>
                  {currentVideo.description && (
                    <p className="text-sm text-ink-secondary mt-1">{currentVideo.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button onClick={() => currentIdx > 0 && selectVideo(videos[currentIdx - 1])}
                    disabled={currentIdx === 0}
                    className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40">
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button onClick={handleComplete}
                    className={`btn-sm flex items-center gap-1.5 font-semibold rounded px-5 py-2 transition-all ${
                      isVideoCompleted(courseId, currentVideo._id)
                        ? 'bg-st-success-b text-st-success border border-st-success/20'
                        : 'btn-primary'
                    }`}>
                    <CheckCircle className="w-4 h-4" />
                    {isVideoCompleted(courseId, currentVideo._id) ? 'Completed ✓' : 'Mark Complete & Next'}
                  </button>

                  <button onClick={() => currentIdx < videos.length - 1 && selectVideo(videos[currentIdx + 1])}
                    disabled={currentIdx === videos.length - 1}
                    className="btn-secondary btn-sm flex items-center gap-1.5 disabled:opacity-40">
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 text-ink-muted text-sm">No videos in this course.</div>
            )}
          </div>
        </div>

        {/* Playlist sidebar */}
        {playlistOpen && (
          <div className="w-72 flex-shrink-0 bg-pg-surface border-l border-ui-border overflow-y-auto">
            <div className="px-4 py-3 border-b border-ui-border">
              <p className="text-xs font-semibold text-ink">Playlist</p>
              <p className="text-2xs text-ink-muted mt-0.5">{doneCount} of {videos.length} done</p>
            </div>
            <div>
              {videos.map((v, i) => {
                const done   = isVideoCompleted(courseId, v._id);
                const active = v._id === currentVideo?._id;
                return (
                  <button key={v._id} onClick={() => selectVideo(v)}
                    className={`playlist-item w-full ${active ? 'active' : ''}`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {done
                        ? <CheckCircle className="w-3.5 h-3.5 text-st-success" />
                        : <Circle className={`w-3.5 h-3.5 ${active ? 'text-accent' : 'text-ui-border-strong'}`} />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-medium truncate ${active ? 'text-accent' : 'text-ink'}`}>{v.title}</p>
                      {v.duration && <p className="text-2xs text-ink-muted mt-0.5">{v.duration}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
