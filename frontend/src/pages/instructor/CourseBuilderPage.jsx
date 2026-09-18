import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import { videoService } from '../../api/videoService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Edit2, Layers, Video, GripVertical, Save } from 'lucide-react';

const getModKey = id => `upskillr_modules_${id}`;

export default function CourseBuilderPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addVideoOpen, setAddVideoOpen] = useState(false);
  const [videoForm, setVideoForm] = useState({ title:'', youtubeUrl:'', description:'' });
  const [addingVideo, setAddingVideo] = useState(false);
  const [editVideo, setEditVideo] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newModTitle, setNewModTitle] = useState('');
  const [addingMod, setAddingMod] = useState(false);

  useEffect(() => {
    Promise.all([courseService.getById(courseId), videoService.getByCourse(courseId)])
      .then(([c, v]) => {
        setCourse(c);
        setVideos(v);
        const stored = localStorage.getItem(getModKey(courseId));
        if (stored) setModules(JSON.parse(stored));
      })
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  }, [courseId]);

  const saveMods = m => { setModules(m); localStorage.setItem(getModKey(courseId), JSON.stringify(m)); };
  const getModForVideo = vId => localStorage.getItem(`upskillr_video_module_${vId}`)?.replace(/"/g,'') || null;
  const setModForVideo = (vId, mId) => { localStorage.setItem(`upskillr_video_module_${vId}`, JSON.stringify(mId)); setVideos(v=>[...v]); };

  const handleAddMod = () => {
    if (!newModTitle.trim()) { toast.error('Module title required'); return; }
    saveMods([...modules, { id:`mod-${Date.now()}`, title:newModTitle.trim() }]);
    setNewModTitle(''); setAddingMod(false); toast.success('Module added');
  };

  const handleDeleteMod = id => { saveMods(modules.filter(m=>m.id!==id)); toast.success('Module removed'); };

  const handleAddVideo = async () => {
    if (!videoForm.title.trim() || !videoForm.youtubeUrl.trim()) { toast.error('Title and URL required'); return; }
    setAddingVideo(true);
    try {
      const v = await videoService.add(courseId, { title:videoForm.title.trim(), youtubeUrl:videoForm.youtubeUrl.trim(), description:videoForm.description.trim() });
      setVideos(p=>[...p,v]);
      setAddVideoOpen(false);
      setVideoForm({ title:'', youtubeUrl:'', description:'' });
      toast.success('Video added');
    } catch (err) { toast.error(err.response?.data?.message||'Failed to add video'); }
    finally { setAddingVideo(false); }
  };

  const handleDeleteVideo = async v => {
    try { await videoService.remove(v._id); setVideos(p=>p.filter(x=>x._id!==v._id)); toast.success('Video deleted'); }
    catch { toast.error('Failed to delete'); }
  };

  const handleSaveEdit = async () => {
    try {
      const updated = await videoService.update(editVideo._id, { title:editForm.title, description:editForm.description, order:editForm.order });
      setVideos(p=>p.map(v=>v._id===updated._id?updated:v));
      setEditVideo(null); toast.success('Video updated');
    } catch { toast.error('Failed to update'); }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm('Delete this course and all its videos?')) return;
    try { await courseService.remove(courseId); toast.success('Course deleted'); navigate('/instructor/courses'); }
    catch { toast.error('Failed to delete course'); }
  };

  if (loading) return <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>;
  if (!course) return null;

  return (
    <div className="page-chrome animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/instructor/courses')}
          className="btn-ghost btn-sm flex items-center gap-1.5 mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="page-title">{course.title}</h1>
            <p className="text-sm text-ink-secondary mt-0.5">
              {course.category && <><span className="font-medium">{course.category}</span> · </>}
              {videos.length} video{videos.length!==1?'s':''} · {modules.length} module{modules.length!==1?'s':''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAddVideoOpen(true)} className="btn-primary">
              <Plus className="w-4 h-4" /> Add Video
            </button>
            <button onClick={handleDeleteCourse} className="btn-danger">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Videos list */}
        <div className="lg:col-span-2">
          <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-ink-secondary" />
                <h2 className="text-sm font-semibold text-ink">Videos ({videos.length})</h2>
              </div>
              <button onClick={() => setAddVideoOpen(true)} className="btn-secondary btn-sm">
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {videos.length === 0 ? (
              <div className="empty-state">
                <Video className="empty-state-icon" />
                <p className="empty-state-title">No videos yet</p>
                <p className="empty-state-desc mb-4">Add YouTube videos to build your curriculum</p>
                <button onClick={() => setAddVideoOpen(true)} className="btn-primary btn-sm">
                  <Plus className="w-3.5 h-3.5" /> Add first video
                </button>
              </div>
            ) : (
              <div className="divide-y divide-ui-border">
                {videos.map((v, i) => (
                  <div key={v._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-pg-canvas group">
                    <GripVertical className="w-4 h-4 text-ink-muted flex-shrink-0 cursor-grab" />
                    <div className="w-8 h-8 rounded bg-pg-canvas border border-ui-border flex items-center justify-center
                                    text-xs font-medium text-ink-muted flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{v.title}</p>
                      {v.description && <p className="text-2xs text-ink-muted truncate mt-0.5">{v.description}</p>}
                    </div>
                    {modules.length > 0 && (
                      <select
                        className="field text-xs py-1 w-32 hidden sm:block"
                        value={getModForVideo(v._id) || ''}
                        onChange={e => setModForVideo(v._id, e.target.value)}
                      >
                        <option value="">No module</option>
                        {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                      </select>
                    )}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditVideo(v); setEditForm({ title:v.title, description:v.description||'', order:v.order }); }}
                        className="btn-icon text-ink-secondary">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteVideo(v)}
                        className="btn-icon text-st-danger hover:bg-st-danger-b">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modules panel */}
        <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden h-fit">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-ui-border">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-ink-secondary" />
              <h2 className="text-sm font-semibold text-ink">Modules</h2>
            </div>
            <button onClick={() => setAddingMod(v=>!v)} className="btn-secondary btn-sm">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {addingMod && (
            <div className="px-5 py-3 border-b border-ui-border bg-pg-canvas">
              <div className="flex gap-2">
                <input className="field flex-1 text-sm" placeholder="Module title…"
                  value={newModTitle} onChange={e => setNewModTitle(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && handleAddMod()} autoFocus />
                <button onClick={handleAddMod} className="btn-primary btn-sm">Add</button>
              </div>
            </div>
          )}

          {modules.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-ink-secondary">No modules yet</p>
              <p className="text-xs text-ink-muted mt-1">Group videos into modules for better organization</p>
            </div>
          ) : (
            <div className="divide-y divide-ui-border">
              {modules.map((m, i) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-3 group hover:bg-pg-canvas">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-medium text-ink-muted w-4">{i+1}</span>
                    <span className="text-sm text-ink">{m.title}</span>
                    <span className="text-2xs text-ink-muted">
                      ({videos.filter(v => getModForVideo(v._id) === m.id).length})
                    </span>
                  </div>
                  <button onClick={() => handleDeleteMod(m.id)}
                    className="btn-icon opacity-0 group-hover:opacity-100 text-st-danger hover:bg-st-danger-b">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      <Modal open={addVideoOpen} onClose={() => setAddVideoOpen(false)} title="Add Video">
        <div className="space-y-4">
          <div className="field-group">
            <label className="field-label">Video title *</label>
            <input className="field" placeholder="e.g. Introduction to React Hooks"
              value={videoForm.title} onChange={e=>setVideoForm(p=>({...p,title:e.target.value}))} />
          </div>
          <div className="field-group">
            <label className="field-label">YouTube URL *</label>
            <input className="field" placeholder="https://www.youtube.com/watch?v=…"
              value={videoForm.youtubeUrl} onChange={e=>setVideoForm(p=>({...p,youtubeUrl:e.target.value}))} />
          </div>
          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea className="field resize-none h-20" placeholder="Short description…"
              value={videoForm.description} onChange={e=>setVideoForm(p=>({...p,description:e.target.value}))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAddVideo} disabled={addingVideo} className="btn-primary flex-1">
              {addingVideo ? 'Adding…' : 'Add Video'}
            </button>
            <button onClick={() => setAddVideoOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Edit Video Modal */}
      <Modal open={!!editVideo} onClose={() => setEditVideo(null)} title="Edit Video">
        {editVideo && (
          <div className="space-y-4">
            <div className="field-group">
              <label className="field-label">Title</label>
              <input className="field" value={editForm.title} onChange={e=>setEditForm(p=>({...p,title:e.target.value}))} />
            </div>
            <div className="field-group">
              <label className="field-label">Description</label>
              <textarea className="field resize-none h-20" value={editForm.description}
                onChange={e=>setEditForm(p=>({...p,description:e.target.value}))} />
            </div>
            <div className="field-group">
              <label className="field-label">Order</label>
              <input type="number" className="field w-24" value={editForm.order}
                onChange={e=>setEditForm(p=>({...p,order:parseInt(e.target.value)}))} />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={handleSaveEdit} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Save className="w-4 h-4" /> Save
              </button>
              <button onClick={() => setEditVideo(null)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
