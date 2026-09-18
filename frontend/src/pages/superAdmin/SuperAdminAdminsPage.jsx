import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail } from 'lucide-react';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const INSTITUTES = ['Tech Academy Mumbai','CodeCraft Delhi','DataSci Bangalore','AI Institute Pune','WebDev College Chennai'];

const INITIAL = [
  { _id:'a1', name:'Institute Admin',   email:'admin@upskillr.com',      institute:'Tech Academy Mumbai',   isActive:true,  addedAt:'2026-01-05', lastLogin:'Today'       },
  { _id:'a2', name:'Suresh Patel',      email:'suresh@codecraft.edu',     institute:'CodeCraft Delhi',       isActive:true,  addedAt:'2026-02-10', lastLogin:'2h ago'      },
  { _id:'a3', name:'Anjali Singh',      email:'anjali@datasci.org',       institute:'DataSci Bangalore',     isActive:false, addedAt:'2026-03-15', lastLogin:'3 days ago'  },
  { _id:'a4', name:'Rajan Mehta',       email:'rajan@aiinstitute.in',     institute:'AI Institute Pune',     isActive:true,  addedAt:'2026-04-01', lastLogin:'Yesterday'   },
  { _id:'a5', name:'Priya Krishnan',    email:'priya@webdevcol.ac.in',    institute:'WebDev College Chennai',isActive:true,  addedAt:'2026-05-20', lastLogin:'5h ago'      },
];

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', institute: INSTITUTES[0] });
  const [openMenu, setOpenMenu] = useState(null);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const filtered = admins.filter(a => {
    const q = search.toLowerCase();
    return !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.institute.toLowerCase().includes(q);
  });

  const handleAdd = () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setAdmins(p => [...p, { _id:`a${Date.now()}`, ...form, isActive:true, addedAt:'Now', lastLogin:'—' }]);
    setForm({ name:'', email:'', institute: INSTITUTES[0] });
    setAddOpen(false);
    toast.success('Admin added');
  };

  const toggleActive = id => {
    const a = admins.find(a=>a._id===id);
    setAdmins(p => p.map(a => a._id===id ? { ...a, isActive:!a.isActive } : a));
    setOpenMenu(null);
    toast.success(`${a.name} ${a.isActive?'deactivated':'activated'}`);
  };

  const handleDelete = id => {
    if (!window.confirm('Remove this admin?')) return;
    setAdmins(p => p.filter(a=>a._id!==id));
    setOpenMenu(null);
    toast.success('Admin removed');
  };

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Super Admin</p>
          <h1 className="page-title">Administrators</h1>
          <p className="text-sm text-ink-secondary mt-0.5">Manage who administers each institute</p>
        </div>
        <button onClick={() => setAddOpen(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Admin
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
        <input className="field pl-9" placeholder="Search admins…" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Administrator</th>
              <th className="hidden sm:table-cell">Institute</th>
              <th className="hidden md:table-cell">Added</th>
              <th className="hidden lg:table-cell">Last login</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-ink-muted text-sm">No admins found</td></tr>
            ) : filtered.map(a => (
              <tr key={a._id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center
                                    text-amber-700 text-xs font-bold flex-shrink-0">
                      {a.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">{a.name}</p>
                      <p className="text-2xs text-ink-muted flex items-center gap-1">
                        <Mail className="w-3 h-3" />{a.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell">
                  <span className="text-sm text-ink-secondary">{a.institute}</span>
                </td>
                <td className="hidden md:table-cell text-ink-muted text-xs">{a.addedAt}</td>
                <td className="hidden lg:table-cell text-ink-muted text-xs">{a.lastLogin}</td>
                <td>
                  <span className={a.isActive ? 'badge badge-green' : 'badge badge-red'}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button onClick={() => setOpenMenu(openMenu===a._id ? null : a._id)} className="btn-icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === a._id && (
                      <div className="absolute right-0 top-8 w-40 bg-pg-surface border border-ui-border
                                      shadow-elevated rounded-lg py-1 z-20 animate-slide-down">
                        <button onClick={() => toggleActive(a._id)}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-pg-canvas">
                          {a.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <div className="border-t border-ui-border my-1" />
                        <button onClick={() => handleDelete(a._id)}
                          className="w-full text-left px-3 py-2 text-sm text-st-danger hover:bg-st-danger-b">
                          Remove admin
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

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Institute Admin">
        <div className="space-y-4">
          <div className="field-group">
            <label className="field-label">Full name *</label>
            <input name="name" className="field" placeholder="Admin name" value={form.name} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">Email address *</label>
            <input name="email" type="email" className="field" placeholder="admin@institute.com" value={form.email} onChange={handleChange} />
          </div>
          <div className="field-group">
            <label className="field-label">Assign to institute</label>
            <select name="institute" className="field" value={form.institute} onChange={handleChange}>
              {INSTITUTES.map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAdd} className="btn-primary flex-1">Add Admin</button>
            <button onClick={() => setAddOpen(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
