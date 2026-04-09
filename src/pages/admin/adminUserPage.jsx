import { Trash2, Pencil, ShieldBan, ShieldCheck, Search, Filter, Users, UserCheck, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, Fragment } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, loyalCustomers: 0 });
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    try {
      const queryParams = new URLSearchParams({
        search,
        role: roleFilter,
        status: statusFilter
      });
      const response = await axios.get(`${backendUrl}/users/all-users?${queryParams}`, { headers: { Authorization: `Bearer ${token}` } });
      setUsers(response.data);
    } catch (error) { toast.error("Failed to load users"); } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${backendUrl}/users/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(response.data);
    } catch (error) { console.error("Failed to load stats"); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // 500ms debounce
    return () => clearTimeout(timer);
  }, [search, roleFilter, statusFilter]);

  useEffect(() => { fetchStats(); }, []);

  const handleRoleChange = async (user, newRole) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`${backendUrl}/users/update-role/${user.email}`, { role: newRole }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`User role updated to ${newRole}`);
      setUsers((prev) => prev.map((u) => (u.email === user.email ? { ...u, role: newRole } : u)));
    } catch (error) { toast.error("Failed to update role."); }
  };

  const handleToggleBlock = async (user) => {
    const token = localStorage.getItem("token");
    const newStatus = user.isblocked;
    try {
      await axios.put(`${backendUrl}/users/update-status/${user.email}`, { isblocked: !newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`User ${newStatus ? "unblocked" : "blocked"} successfully`);
      setUsers((prev) => prev.map((u) => (u.email === user.email ? { ...u, isblocked: !newStatus } : u)));
    } catch (error) { toast.error("Failed to update user status"); }
  };

  const openDeleteConfirm = (user) => { setSelectedUser(user); setIsConfirmOpen(true); };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setDeleting(true);
    try {
      await axios.delete(`${backendUrl}/users/delete-user/${selectedUser.email}`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      toast.success("User deleted successfully!");
      setUsers(users.filter((user) => user._id !== selectedUser._id));
      setIsConfirmOpen(false);
    } catch (error) { toast.error("Failed to delete user"); } finally { setDeleting(false); }
  };

  return (
    <div className="w-full min-h-screen bg-[#FDFDFD] p-10">
      <Toaster position="top-center" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-[Playfair_Display] font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 font-[Inter]">Admin control panel for user accounts</p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Users size={24} /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase truncate">Total Users</p><p className="text-xl font-black">{stats.totalUsers}</p></div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-xl text-green-600"><UserCheck size={24} /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase truncate">Active</p><p className="text-xl font-black">{stats.activeUsers}</p></div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600"><Star size={24} /></div>
              <div><p className="text-xs text-gray-400 font-bold uppercase truncate">Loyal</p><p className="text-xl font-black">{stats.loyalCustomers}</p></div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:border-[#00AEEF] outline-none transition-all shadow-sm" />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-2xl outline-none focus:border-[#00AEEF] shadow-sm cursor-pointer">
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="Driver">Driver</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded-2xl outline-none focus:border-[#00AEEF] shadow-sm cursor-pointer">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-500 border border-gray-100">
          {loading ? (
            <div className="p-20 text-center text-gray-400 animate-pulse text-xl font-[Inter]">Loading Users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-r from-[#00AEEF] to-[#0095cc] text-white">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Profile</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest">Email</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest">Role</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest">Loyalty</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((item) => (
                    <tr key={item.email} className={`${item.isblocked ? "bg-red-50" : "hover:bg-[#00AEEF]/5"} transition-all duration-500`}>
                      <td className="px-6 py-4">
                        <img src={item.image || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full object-cover border-2 border-[#00AEEF]/10" alt="avatar" />
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800 font-[Inter]">{item.firstName} {item.lastName}</td>
                      <td className="px-6 py-4 text-gray-600 font-[Inter]">{item.email}</td>
                      <td className="px-6 py-4 text-center">
                        <select value={item.role} onChange={(e) => handleRoleChange(item, e.target.value)}
                          className={`px-3 py-1 rounded-full text-[11px] font-black uppercase border-none outline-none cursor-pointer transition-all duration-500 ${
                            item.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-[#00AEEF]/10 text-[#00AEEF]"
                          }`}>
                          <option value="user">user</option>
                          <option value="admin">Admin</option>
                          <option value="Driver">Driver</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.isLoyal ? (
                          <div className="flex flex-col items-center">
                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <Star size={10} fill="currentColor" /> LOYAL
                            </span>
                            <span className="text-[9px] text-gray-400 mt-1">{item.totalOrders} Orders / ${item.totalSpent}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${item.isblocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {item.isblocked ? "BLOCKED" : "ACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleToggleBlock(item)}
                            className={`p-2 rounded-xl text-white transition-all duration-500 ${item.isblocked ? "bg-green-500 hover:bg-green-600" : "bg-[#00AEEF] hover:bg-[#0095cc]"}`}
                            title={item.isblocked ? "Unblock User" : "Block User"}>
                            {item.isblocked ? <ShieldCheck size={18} /> : <ShieldBan size={18} />}
                          </button>
                          
                          <button onClick={() => openDeleteConfirm(item)} className="bg-red-50 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all duration-500" title="Delete User">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Transition appear show={isConfirmOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsConfirmOpen(false)}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-2xl transition-all">
              <Dialog.Title className="text-xl font-[Playfair_Display] font-bold text-gray-900">Confirm Deletion</Dialog.Title>
              <p className="mt-3 text-sm text-gray-500 font-[Inter]">
                Are you sure you want to delete <span className="font-bold text-gray-800">{selectedUser?.email}</span>? This action cannot be undone.
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <button onClick={() => setIsConfirmOpen(false)} className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-all duration-500 uppercase tracking-widest text-xs">Cancel</button>
                <button onClick={confirmDelete} disabled={deleting}
                  className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg shadow-red-100 transition-all duration-500 active:scale-95 disabled:bg-red-400 uppercase tracking-widest text-xs">
                   {deleting ? "Deleting..." : "Yes, Delete User"}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}