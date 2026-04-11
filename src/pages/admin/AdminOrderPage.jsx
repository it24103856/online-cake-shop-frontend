import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Loader2, Trash2, AlertCircle, Filter 
} from "lucide-react";

export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [updatingId, setUpdatingId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const statusOptions = ['pending', 'processing', 'shipped'];
    const editableStatuses = new Set(statusOptions);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.data || []);
        } catch (error) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Status updated successfully");
            fetchOrders(); // Refresh data
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCancelOrder = async (orderId) => {
        setCancellingId(orderId);
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/orders/${orderId}/cancel`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order cancelled successfully");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        } finally {
            setCancellingId(null);
        }
    };

    const confirmDelete = (id) => {
        setDeleteModal({ show: true, id });
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/orders/${deleteModal.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Order deleted");
            setOrders(orders.filter(o => o._id !== deleteModal.id));
        } catch (error) {
            toast.error("Delete failed");
        } finally {
            setDeleteModal({ show: false, id: null });
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-neutral-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-neutral-900">Order Management</h1>
                        <p className="text-neutral-500 text-sm">Monitor and update customer purchases</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl border border-neutral-200 flex items-center gap-2 shadow-sm">
                        <Filter size={16} className="text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-600">Total Orders: {orders.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50/50 border-b border-neutral-100">
                                <th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Order Details</th>
                                <th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Customer</th>
                                <th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Total</th>
                                <th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-400">Status</th>
                                <th className="p-5 text-xs font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-neutral-50/30 transition-colors">
                                    <td className="p-5">
                                        <p className="font-bold text-sm text-neutral-800">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-neutral-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="p-5">
                                        <p className="font-medium text-sm text-neutral-800">{order.customer.name}</p>
                                        <p className="text-xs text-neutral-400">{order.customer.phone}</p>
                                    </td>
                                    <td className="p-5 font-bold text-neutral-900">LKR.{order.totalPrice.toFixed(2)}</td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1 items-start">
                                            {editableStatuses.has(order.status) ? (
                                                <>
                                                    <select 
                                                        value={order.status}
                                                        disabled={updatingId === order._id || order.paymentStatus !== 'Paid'}
                                                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                        className={`text-xs font-bold px-3 py-2 rounded-lg border-none outline-none cursor-pointer transition-all
                                                            ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : ''}
                                                            ${order.status === 'processing' ? 'bg-blue-50 text-blue-600' : ''}
                                                            ${order.status === 'shipped' ? 'bg-purple-50 text-purple-600' : ''}
                                                            ${order.paymentStatus !== 'Paid' ? 'opacity-60 cursor-not-allowed' : ''}
                                                        `}
                                                    >
                                                        {statusOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                                        ))}
                                                    </select>
                                                    {order.paymentStatus !== 'Paid' && (
                                                        <span className="text-[10px] text-rose-500 italic font-semibold">Payment required to unlock</span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className={`text-[10px] font-bold px-3 py-2 rounded-lg uppercase tracking-widest ${order.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {order.status}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleCancelOrder(order._id)}
                                                disabled={order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled' || cancellingId === order._id}
                                                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${order.status === 'shipped' || order.status === 'delivered' || order.status === 'cancelled'
                                                    ? 'bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 hover:text-white'}
                                                `}
                                            >
                                                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(order._id)}
                                                className="p-2 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Custom Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
                    <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="text-rose-500" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-center text-neutral-900 mb-2">Are you sure?</h3>
                        <p className="text-neutral-500 text-center text-sm mb-8 leading-relaxed">
                            This action cannot be undone. This will permanently remove the order from the database.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeleteModal({ show: false, id: null })}
                                className="flex-1 py-3 bg-neutral-100 text-neutral-600 font-bold rounded-2xl hover:bg-neutral-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-2xl hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}