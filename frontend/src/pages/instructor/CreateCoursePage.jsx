import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseService } from '../../api/courseService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = ['Java','Python','JavaScript','React','Node.js','Data Science','Machine Learning','Web Development','DevOps','Other'];

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', description:'', category:'' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setLoading(true);
    try {
      const course = await courseService.create({ title:form.title.trim(), description:form.description.trim(), category:form.category });
      toast.success('Course created');
      navigate(`/instructor/courses/${course._id}/build`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-chrome animate-fade-in">
      <div className="mb-6">
        <button onClick={() => navigate('/instructor/courses')}
          className="btn-ghost btn-sm flex items-center gap-1.5 mb-4 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to courses
        </button>
        <h1 className="page-title">New Course</h1>
        <p className="text-sm text-ink-secondary mt-0.5">Fill in the details — you'll add videos next</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleSubmit} className="bg-pg-surface border border-ui-border rounded-lg p-6 space-y-5">
          <div className="field-group">
            <label className="field-label">Course title *</label>
            <input name="title" type="text" className="field"
              placeholder="e.g. Complete React Developer Course"
              value={form.title} onChange={handleChange} required />
          </div>

          <div className="field-group">
            <label className="field-label">Description</label>
            <textarea name="description" className="field resize-none h-28"
              placeholder="What will students learn? Who is it for?"
              value={form.description} onChange={handleChange} />
          </div>

          <div className="field-group">
            <label className="field-label">Category</label>
            <select name="category" className="field" value={form.category} onChange={handleChange}>
              <option value="">Select a category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-ui-border">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating…' : 'Create Course & Add Videos →'}
            </button>
            <button type="button" onClick={() => navigate('/instructor/courses')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
