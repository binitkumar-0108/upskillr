import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Globe, ChevronDown } from 'lucide-react';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const INITIAL = [
  { _id:'i1', name:'Tech Academy Mumbai',   domain:'techacademy.in',  desc:'Premier tech training',           isActive:true,  adminEmail:'admin@techacademy.in',  users:145, courses:12, plan:'Professional', since:'Jan 2025' },
  { _id:'i2', name:'CodeCraft Delhi',        domain:'codecraft.edu',   desc:'Full-stack bootcamp',             isActive:true,  adminEmail:'admin@codecraft.edu',   users:320, courses:28, plan:'Enterprise',   since:'Feb 2025' },
  { _id:'i3', name:'DataSci Bangalore',      domain:'datasci.org',     desc:'Data science & ML programs',     isActive:false, adminEmail:'admin@datasci.org',    users:33,  courses:8,  plan:'Starter',       since:'Mar 2025' },
  { _id:'i4', name:'AI Institute Pune',      domain:'aiinstitute.in',  desc:'Artificial intelligence courses', isActive:true,  adminEmail:'admin@aiinstitute.in', users:167, courses:15, plan:'Professional', since:'Apr 2025' },
  { _id:'i5', name:'WebDev College Chennai', domain:'webdevcol.ac.in', desc:'Web development programs',       isActive:true,  adminEmail:'admin@webdevcol.ac.in',users:98,  courses:9,  plan:'Starter',       since:'May 2025' },
];

const EMPTY = { name:'', domain:'', desc:'', adminEmail:'' };

export default function InstitutesPage() {
  const [institutes, setInstitutes] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [openMenu, setOpenMenu] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const filtered = institutes.filter(i => {
    const q = search.toLowerCase();
    const matchSearch = !q || i.name.toLowerCase().includes(q) || i.domain.includes(q);
    const matchStatus = filterStatus === 'all' || (filterStatus === 'active' ? i.isActive : !i.isActive);
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setInstitutes(p => [...p, { _id:`i${Date.now()}`, ...form, isActive:true, users:0, courses:0, plan:'Starter', since:'Now' }]);
    setForm(EMPTY); setAddOpen(false); toast.success('Institute added');
  };

  const handleEdit = () => {
    setInstitutes(p => p.map(i => i._id === editItem._id ? { ...i, ...form } : i));
    setEditItem(null); toast.success('Institute updated');
  };

  const toggleActive = id => {
    setInstitutes(p => p.map(i => i._id === id ? { ...i, isActive: !i.isActive } : i));
    setOpenMenu(null);
    const inst = institutes.find(i => i._id === id);
    toast.success(`${inst.name} ${inst.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDelete = id => {
    if (!window.confirm('Delete this institute?')) return;
    setInstitutes(p => p.filter(i => i._id !== id));
    setOpenMenu(null); toast.success('Institute removed');
  };

  const openEdit = inst => {
    setEditItem(inst);
    setForm({ name:inst.name, domain:inst.domain, desc:inst.desc, adminEmail:inst.adminEmail });
  };

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Super Admin</p>
          <h1 className="page-title">Institutes</h1>
          <p className="text-sm text-ink-secondary mt-0.5">
            {institutes.length} institutes · {institutes.filter(i=>i.isActive).length} active
          </p>
        </div>
        <button onClick={() => { setForm(EMPTY); setAddOpen(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Institute
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input className="field pl-9" placeholder="Search institutes…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="field w-auto" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Institute</th>
              <th className="hidden sm:table-cell">Plan</th>
              <th className="hidden md:table-cell">Users</th>
              <th className="hidden md:table-cell">Courses</th>
              <th>Status</th>
              <th className="hidden lg:table-cell">Since</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-ink-muted text-sm">No institutes found</td></tr>
            ) : filtered.map(inst => (
              <tr key={inst._id} className="relative">
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-accent-light flex items-center justify-center flex-shrink-0">
                      <Globe className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">{inst.name}</p>
                      <p className="text-2xs text-ink-muted">{inst.domain}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="badge badge-gray">{inst.plan}</span>
                </td>
                <td className="hidden md:table-cell text-ink-secondary">{inst.users}</td>
                <td className="hidden md:table-cell text-ink-secondary">{inst.courses}</td>
                <td>
                  <span className={inst.isActive ? 'badge badge-green' : 'badge badge-red'}>
                    {inst.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="hidden lg:table-cell text-ink-muted text-xs">{inst.since}</td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button onClick={() => setOpenMenu(openMenu === inst._id ? null : inst._id)}
                      className="btn-icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === inst._id && (
                      <div className="absolute right-0 top-8 w-44 bg-pg-surface border border-ui-border
                                      shadow-elevated rounded-lg py-1 z-20 animate-slide-down">
                        <button onClick={() => { openEdit(inst); setOpenMenu(null); }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-pg-canvas transition-colors">
                          Edit details
                        </button>
                        <button onClick={() => toggleActive(inst._id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-pg-canvas transition-colors">
                          {inst.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <div className="border-t border-ui-border my-1" />
                        <button onClick={() => handleDelete(inst._id)}
                          className="w-full text-left px-3 py-2 text-sm text-st-danger hover:bg-st-danger-b transition-colors">
                          Delete institute
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Institute">
        <div className="space-y-4">
          {[{n:'name',l:'Institute name *',p:'e.g. Tech Academy Mumbai'},{n:'domain',l:'Domain',p:'techacademy.in'},{n:'adminEmail',l:'Admin email',p:'admin@institute.com'},{n:'desc',l:'Description',p:'Brief description'}].map(f=>(
            <div key={f.n} className="field-group">
              <label className="field-label">{f.l}</label>
              <input name={f.n} className="field" placeholder={f.p} value={form[f.n]||''} onChange={handleChange} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary flex-1">Add Institute</button>
            <button onClick={() => setAddOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Institute">
        <div className="space-y-4">
          {[{n:'name',l:'Name'},{n:'domain',l:'Domain'},{n:'adminEmail',l:'Admin email'},{n:'desc',l:'Description'}].map(f=>(
            <div key={f.n} className="field-group">
              <label className="field-label">{f.l}</label>
              <input name={f.n} className="field" value={form[f.n]||''} onChange={handleChange} />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button onClick={handleEdit} className="btn-primary flex-1">Save Changes</button>
            <button onClick={() => setEditItem(null)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
