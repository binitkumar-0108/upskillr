import { useState } from 'react';
import { Search, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL = [
  { _id:'u1', name:'Jamie Learner',   email:'learner@upskillr.com',    role:'learner',    isActive:true,  joined:'2026-01-10' },
  { _id:'u2', name:'Alex Instructor', email:'instructor@upskillr.com', role:'instructor', isActive:true,  joined:'2026-01-05' },
  { _id:'u3', name:'Priya Sharma',    email:'priya@example.com',       role:'learner',    isActive:true,  joined:'2026-02-14' },
  { _id:'u4', name:'Ravi Kumar',      email:'ravi@example.com',        role:'learner',    isActive:false, joined:'2026-03-01' },
  { _id:'u5', name:'Maria Gonzalez',  email:'maria@example.com',       role:'instructor', isActive:true,  joined:'2026-02-20' },
  { _id:'u6', name:'Tom Wilson',      email:'tom@example.com',         role:'learner',    isActive:true,  joined:'2026-04-05' },
  { _id:'u7', name:'Sana Ahmed',      email:'sana@example.com',        role:'learner',    isActive:true,  joined:'2026-05-01' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const matchQ = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchR = roleFilter === 'all' || u.role === roleFilter;
    const matchS = statusFilter === 'all' || (statusFilter === 'active' ? u.isActive : !u.isActive);
    return matchQ && matchR && matchS;
  });

  const changeRole = (id, role) => {
    setUsers(p => p.map(u => u._id === id ? { ...u, role } : u));
    setOpenMenu(null);
    toast.success('Role updated');
  };

  const toggleActive = id => {
    const u = users.find(u => u._id === id);
    setUsers(p => p.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
    setOpenMenu(null);
    toast.success(`${u.name} ${u.isActive ? 'deactivated' : 'activated'}`);
  };

  return (
    <div className="page-chrome animate-fade-in">
      <div className="page-header">
        <div>
          <p className="breadcrumb">Admin</p>
          <h1 className="page-title">Users</h1>
          <p className="text-sm text-ink-secondary mt-0.5">{users.length} total · {users.filter(u=>u.isActive).length} active</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
          <input className="field pl-9" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="field w-auto" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
          <option value="all">All roles</option>
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <select className="field w-auto" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-pg-surface border border-ui-border rounded-lg overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th className="hidden sm:table-cell">Role</th>
              <th className="hidden md:table-cell">Joined</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-sm text-ink-muted">No users match your filters</td></tr>
            ) : filtered.map(u => (
              <tr key={u._id}>
                <td>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-accent-light flex items-center justify-center
                                    text-accent text-xs font-bold flex-shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{u.name}</p>
                      <p className="text-2xs text-ink-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden sm:table-cell">
                  <span className={u.role==='instructor' ? 'badge badge-blue' : u.role==='admin' ? 'badge badge-yellow' : 'badge badge-gray'}>
                    {u.role}
                  </span>
                </td>
                <td className="hidden md:table-cell text-ink-muted text-xs">{u.joined}</td>
                <td>
                  <span className={u.isActive ? 'badge badge-green' : 'badge badge-red'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="relative inline-block">
                    <button onClick={() => setOpenMenu(openMenu===u._id ? null : u._id)} className="btn-icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenu === u._id && (
                      <div className="absolute right-0 top-8 w-44 bg-pg-surface border border-ui-border
                                      shadow-elevated rounded-lg py-1 z-20 animate-slide-down">
                        <div className="px-3 py-1.5 border-b border-ui-border">
                          <p className="text-2xs text-ink-muted uppercase tracking-wider font-semibold">Change role</p>
                        </div>
                        {['learner','instructor','admin'].filter(r=>r!==u.role).map(r=>(
                          <button key={r} onClick={()=>changeRole(u._id,r)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-pg-canvas capitalize">{r}</button>
                        ))}
                        <div className="border-t border-ui-border my-1" />
                        <button onClick={()=>toggleActive(u._id)}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-pg-canvas ${!u.isActive ? 'text-st-success' : 'text-st-danger'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer count */}
        <div className="px-5 py-3 border-t border-ui-border bg-pg-canvas">
          <p className="text-xs text-ink-muted">Showing {filtered.length} of {users.length} users</p>
        </div>
      </div>
    </div>
  );
}
