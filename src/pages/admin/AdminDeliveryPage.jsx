import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Truck, Trash2, Clock, Loader2, Plus, CheckCircle2 } from "lucide-react";

export default function AdminDeliveryPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        orderID: "",
        driverName: "",
        driverPhone: "",
        vehicleNumber: "",
        estimatedTime: ""
    });

    const token = localStorage.getItem("token");
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const loadData = async () => {
        try {
            const [delRes, orderRes, payRes] = await Promise.all([
                axios.get(`${BASE_URL}/deliveries`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            // Backend එකෙන් දත්ත එන ආකාරය අනුව Array එක වෙන් කර ගැනීම
            const deliveryList = delRes.data?.data || delRes.data || [];
            const orderList = orderRes.data?.data || orderRes.data || [];
            const paymentList = payRes.data?.data || payRes.data || [];

            setDeliveries(Array.isArray(deliveryList) ? deliveryList : []);

            // 1. Payment එක "Verified" හෝ "Approved" වූ Order IDs වෙන් කරගන්න
            const verifiedOrderIds = Array.isArray(paymentList) 
                ? paymentList
                    .filter(p => p.status === 'Verified' || p.status === 'Approved')
                    .map(p => (p.orderID?._id || p.orderID || "").toString())
                : [];

            // 2. දැනටමත් Delivery එකක් Assign කර ඇති Order IDs
            const alreadyAssignedIds = Array.isArray(deliveryList)
                ? deliveryList.map(d => (d.orderID?._id || d.orderID || "").toString())
                : [];

            // 3. පෙරා ගැනීම: Payment Verified වූ සහ තවමත් Assign නොකළ Orders
            const validOrders = Array.isArray(orderList)
                ? orderList.filter(o => 
                    verifiedOrderIds.includes(o._id.toString()) && 
                    !alreadyAssignedIds.includes(o._id.toString())
                )
                : [];

            setOrders(validOrders);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Error loading logistics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                orderID: formData.orderID,
                deliveryPerson: { name: formData.driverName, phone: formData.driverPhone },
                vehicleNumber: formData.vehicleNumber,
                estimatedDeliveryTime: formData.estimatedTime
            };

            await axios.post(`${BASE_URL}/deliveries/assign`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Delivery assigned successfully!");
            setFormData({ orderID: "", driverName: "", driverPhone: "", vehicleNumber: "", estimatedTime: "" });
            loadData(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Assignment failed");
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/deliveries/update/${id}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Status: ${newStatus}`);
            loadData();
        } catch (error) { toast.error("Update failed"); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this record?")) return;
        try {
            await axios.delete(`${BASE_URL}/deliveries/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Deleted");
            loadData();
        } catch (err) { toast.error("Delete failed"); }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-rose-500" size={40} /></div>;

    return (
        <div className="p-8 space-y-10 pb-20 bg-neutral-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="p-4 bg-black text-white rounded-3xl"><Truck size={32} /></div>
                <div>
                    <h1 className="text-4xl font-black italic text-neutral-800 tracking-tighter">Verified <span className="text-rose-500 underline decoration-rose-100">Logistics</span></h1>
                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest">Dispatching Only Payment-Verified Orders</p>
                </div>
            </div>

            {/* Assignment Form */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black flex items-center gap-2 text-neutral-800"><Plus size={20} className="text-rose-500"/> New Dispatch Task</h3>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-600 uppercase">Verification Sync Active</span>
                    </div>
                </div>
                
                <form onSubmit={handleAssign} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-2">Verified Order</label>
                        <select 
                            required
                            className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm focus:ring-2 focus:ring-rose-200"
                            value={formData.orderID}
                            onChange={(e) => setFormData({...formData, orderID: e.target.value})}
                        >
                            <option value="">Choose Order</option>
                            {orders.map(o => (
                                <option key={o._id} value={o._id}>
                                    #{o._id.slice(-6).toUpperCase()} - {o.user?.firstName || "Customer"}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-2">Driver Name</label>
                        <input required type="text" className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm" 
                        value={formData.driverName} onChange={(e) => setFormData({...formData, driverName: e.target.value})} placeholder="Full Name"/>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-2">Arrival Date/Time</label>
                        <input required type="datetime-local" className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm text-neutral-500"
                        value={formData.estimatedTime} onChange={(e) => setFormData({...formData, estimatedTime: e.target.value})}/>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-2">Contact Number</label>
                        <input required type="text" className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm"
                        value={formData.driverPhone} onChange={(e) => setFormData({...formData, driverPhone: e.target.value})} placeholder="07XXXXXXXX"/>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-neutral-400 ml-2">Vehicle Plate</label>
                        <input required type="text" className="w-full p-4 bg-neutral-50 rounded-2xl border-none font-bold text-sm"
                        value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})} placeholder="WP XXX-XXXX"/>
                    </div>

                    <div className="flex items-end">
                        <button disabled={submitting || orders.length === 0} className="w-full p-4 bg-rose-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-rose-100 disabled:opacity-30">
                            {submitting ? "Assigning..." : "Assign Task"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-neutral-50 bg-neutral-50/30">
                    <h3 className="font-black text-neutral-800 text-xs uppercase tracking-widest">Active Deliveries</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-[10px] font-black uppercase text-neutral-400 tracking-widest border-b">
                            <tr>
                                <th className="px-8 py-6">Reference</th>
                                <th className="px-8 py-6">Driver</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {deliveries.length > 0 ? deliveries.map((item) => (
                                <tr key={item._id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-8 py-6">
                                        <p className="text-neutral-900 font-bold">#{item.orderID?._id?.slice(-6).toUpperCase() || "N/A"}</p>
                                        <p className="text-[10px] text-neutral-400 font-bold flex items-center gap-1 uppercase">
                                            <Clock size={10} /> {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <p className="text-neutral-800 font-black text-sm">{item.deliveryPerson.name}</p>
                                        <p className="text-[11px] text-neutral-400 font-bold tracking-tighter">{item.vehicleNumber} • {item.deliveryPerson.phone}</p>
                                    </td>
                                    <td className="px-8 py-6">
                                        <select 
                                            value={item.deliveryStatus}
                                            onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                                            className={`text-[10px] font-black uppercase p-2 px-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-rose-200 ${
                                                item.deliveryStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                            }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Out for Delivery">Out for Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button onClick={() => handleDelete(item._id)} className="p-3 text-neutral-300 hover:text-rose-500 transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-10 text-center text-neutral-400 font-bold italic">No active deliveries found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}