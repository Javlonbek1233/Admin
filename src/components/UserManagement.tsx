import { useState } from 'react';
import { useAppDispatch, useAppSelector, addUser, editUser, deleteUser, toggleUserStatus } from '../store';
import { User } from '../types';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Shield,
  MapPin,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Lock,
  Compass,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserManagement() {
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals / Drawer
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'User' as User['role'],
    status: 'Active' as User['status'],
    location: '',
  });

  // Action helpers
  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: 'User',
      status: 'Active',
      location: '',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      location: user.location,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      // Update
      const updated: User = {
        ...editingUser,
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        role: formData.role,
        status: formData.status,
        location: formData.location,
      };
      dispatch(editUser(updated));
    } else {
      // Create
      dispatch(addUser(formData));
    }
    setIsFormOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you absolutely sure you want to scrub this user account from active security databases?')) {
      dispatch(deleteUser(id));
    }
  };

  // Searching, Filtering & Sorting logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'id') {
      comparison = a.id.localeCompare(b.id);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination bounds
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: User['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'Suspended':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/20';
      case 'Inactive':
        return 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      
      {/* Header operations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Staff Directories</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Audit system operations permissions, edit corporate profiles, and restrict credential tokens.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 shadow-lg shadow-blue-500/10 transition-all cursor-pointer self-start sm:self-auto"
        >
          <UserPlus className="h-4 w-4" /> Provision New User
        </button>
      </div>

      {/* Control Panel: Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl shadow-xs">
        {/* Search */}
        <div className="relative flex items-center md:col-span-2">
          <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search account name, UUID, email..."
            className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 outline-hidden hover:border-slate-200 dark:hover:border-slate-705 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/25 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Role</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 rounded-xl py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-hidden hover:border-slate-200"
          >
            <option value="all">All Roles</option>
            <option value="Administrator">Administrator</option>
            <option value="Editor">Editor</option>
            <option value="Support Agent">Support Agent</option>
            <option value="User">User</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">State</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800/80 rounded-xl py-2 px-3 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-hidden hover:border-slate-200"
          >
            <option value="all">All States</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Primary Users Table Workspace */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider select-none">
                <th className="px-6 py-4.5">Security Operator</th>
                <th className="px-6 py-4.5">UUID Code</th>
                <th className="px-6 py-4.5">Status</th>
                <th className="px-6 py-4.5">System Location</th>
                <th className="px-6 py-4.5">Last Pulse</th>
                <th className="px-6 py-4.5 text-right">Database Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No security operators matched filter profiles.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-colors">
                    {/* User profile details */}
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-850" />
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm leading-tight hover:text-blue-500 transition-colors cursor-pointer">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                            <Mail className="h-3 w-3 inline" /> {u.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Security credentials role / ID */}
                    <td className="px-6 py-4.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-800 dark:text-slate-200 font-bold font-mono text-[11px]">
                          {u.id}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 font-semibold">
                          <Shield className="h-3.2 w-3.2 text-indigo-500" /> {u.role}
                        </span>
                      </div>
                    </td>

                    {/* Status Toggle control */}
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${getStatusBadge(u.status)} select-none`}>
                        {u.status}
                      </span>
                    </td>

                    {/* Region Location */}
                    <td className="px-6 py-4.5 font-semibold text-slate-500 dark:text-slate-405">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.2 w-3.2 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{u.location}</span>
                      </div>
                    </td>

                    {/* Last active timer */}
                    <td className="px-6 py-4.5 font-medium font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {u.lastActive}
                    </td>

                    {/* Direct Actions console */}
                    <td className="px-6 py-4.5 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        {/* Toggle Status direct button */}
                        <button
                          onClick={() => dispatch(toggleUserStatus(u.id))}
                          title="Instant status suspend toggle"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-450 hover:text-slate-650 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {u.status === 'Active' ? <ToggleRight className="h-4.5 w-4.5 text-blue-500" /> : <ToggleLeft className="h-4.5 w-4.5 text-slate-400" />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Edit operator metadata"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-450 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Revoke access entirely"
                          className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-rose-50 dark:hover:bg-rose-955 text-slate-450 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info: pagination */}
        <div className="flex items-center justify-between border-t border-slate-150 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-950/20 text-xs text-slate-400 dark:text-slate-500 font-mono select-none">
          <span>
            Displaying results <span className="font-bold text-slate-650 dark:text-slate-350">{Math.min(startIndex + 1, totalItems)}</span>-
            <span className="font-bold text-slate-650 dark:text-slate-350">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{' '}
            <span className="font-bold text-slate-650 dark:text-slate-350">{totalItems}</span> operators
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-semibold px-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 disabled:opacity-40 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Provision / Update Drawer Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <div id="user-drawer-portal" className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Slider Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col justify-between"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 uppercase font-mono">
                    <Compass className="h-4.5 w-4.5 text-blue-500" /> {editingUser ? 'Update Credentials' : 'Provision Secure Node'}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {editingUser ? `Editing ${editingUser.id}` : 'Enroll a new system access operator'}
                  </p>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-105 hover:text-slate-600 dark:hover:bg-slate-800"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Form content */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
                {/* Image Avatar display */}
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150 dark:border-slate-850">
                  <img src={formData.avatar} alt="Avatar profile" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-slate-200 dark:ring-slate-800" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-extrabold text-slate-400 font-mono uppercase tracking-wider">Avatar image seeding</label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="HTTPS link to Unsplash..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-mono p-1 rounded-sm outline-hidden"
                    />
                  </div>
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="E.g., Jane Cooper"
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 text-xs font-semibold p-2.5 rounded-xl outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Secure Email address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="E.g., jane@cooper-ops.io"
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 text-xs font-semibold p-2.5 rounded-xl outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Location */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Cluster Deployment Region</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="E.g., Munich, Germany"
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 text-xs font-semibold p-2.5 rounded-xl outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Role */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Credential clearances</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                    className="w-full bg-slate-50/50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-800 text-xs font-semibold p-2.5 rounded-xl outline-hidden cursor-pointer"
                  >
                    <option value="Administrator">Administrator (Root permission)</option>
                    <option value="Editor">Editor (Write keys permission)</option>
                    <option value="Support Agent">Support Agent (Read tickets permission)</option>
                    <option value="User">User (Read-only access)</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">Security Status</label>
                  <div className="flex items-center gap-3 mt-1">
                    {['Active', 'Inactive', 'Suspended'].map((st) => (
                      <label key={st} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="status-radio"
                          value={st}
                          checked={formData.status === st}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                          className="accent-blue-600"
                        />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-350">{st}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </form>

              {/* Actions Footer */}
              <div className="p-4 border-t border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-end gap-3.5">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 font-semibold text-xs py-2 px-4 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 shadow-lg shadow-blue-500/10 cursor-pointer"
                >
                  {editingUser ? 'Save Updates' : 'Commit Credentials'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
