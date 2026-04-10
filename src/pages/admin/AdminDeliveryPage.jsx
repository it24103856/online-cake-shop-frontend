import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Truck, Loader2, Plus, Eye, X, Trash2 } from "lucide-react";
import DriverSelect from "../../components/DriverSelect";

export default function AdminDeliveryPage() {
    const [deliveries, setDeliveries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        orderID: "",
        driverId: "",
        estimatedTime: ""
    });

    const token = localStorage.getItem("token");
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const loadData = async () => {
        try {
            const [delRes, orderRes] = await Promise.all([
                axios.get(`${BASE_URL}/deliveries`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BASE_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setDeliveries(delRes.data?.data || []);
            
            const alreadyAssignedIds = (delRes.data?.data || []).map(d => (d.orderID?._id || d.orderID || "").toString());
            const validOrders = (orderRes.data?.data || []).filter(o => !alreadyAssignedIds.includes(o._id.toString()));
            setOrders(validOrders);
        } catch (error) {
            toast.error("Failed to fetch data");
        } finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    const handleStatusUpdate = async (deliveryId, newStatus) => {
        try {
            await axios.put(`${BASE_URL}/deliveries/update/${deliveryId}`, 
                { status: newStatus }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`Status updated to ${newStatus}`);
            loadData(); 
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleDelete = async (deliveryId) => {
        if (!window.confirm("Are you sure you want to delete this delivery assignment?")) return;
        try {
            await axios.delete(`${BASE_URL}/deliveries/${deliveryId}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Delivery removed successfully");
            loadData(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete delivery");
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        
        if (!formData.orderID || !formData.driverId) {
            return toast.error("Please select both an order and a driver");
        }

        setSubmitting(true);
        try {
            const payload = {
                orderID: formData.orderID,
                driverId: formData.driverId,
                estimatedDeliveryTime: formData.estimatedTime
            };
            await axios.post(`${BASE_URL}/deliveries/assign`, payload, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Delivery assigned successfully!");
            setFormData({ orderID: "", driverId: "", estimatedTime: "" });
            loadData(); 
        } catch (error) { 
            toast.error(error.response?.data?.message || "Assignment failed"); 
        }
        finally { setSubmitting(false); }
    };

    const statusClasses = {
        Delivered: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
        Pending: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
        "Out for Delivery": "bg-sky-100 text-sky-700 ring-1 ring-sky-200",
        Cancelled: "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    };

    if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="animate-spin text-rose-500" /></div>;

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8">
            <header className="mb-8 flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-neutral-100">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 grid place-items-center bg-black text-white rounded-2xl"><Truck size={28} /></div>
                    <h1 className="text-3xl font-black italic text-neutral-800 uppercase tracking-tighter">Logistics Hub</h1>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                <section className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm h-fit">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic uppercase"><Plus size={20} className="text-rose-500"/> Dispatch Task</h2>
                    <form onSubmit={handleAssign} className="space-y-4">
                        <select required className="w-full h-14 bg-neutral-50 rounded-2xl border border-neutral-200 px-4 font-bold"
                            value={formData.orderID} onChange={(e) => setFormData({ ...formData, orderID: e.target.value })}>
                            <option value="">Select Order</option>
                            {orders.map(o => <option key={o._id} value={o._id}>#{o._id.slice(-8).toUpperCase()}</option>)}
                        </select>

                        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                            <DriverSelect
                                selectedDriverId={formData.driverId}
                                onDriverSelect={(driverId) => setFormData({ ...formData, driverId })}
                            />
                        </div>
                        
                        <input type="datetime-local" className="w-full h-14 bg-neutral-50 rounded-2xl border border-neutral-200 px-4 font-medium"
                            placeholder="Estimated Delivery Time"
                            value={formData.estimatedTime} onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })} />
                        
                        <button type="submit" disabled={submitting} className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-rose-600 transition-colors">
                            {submitting ? "Processing..." : "Assign & Dispatch"}
                        </button>
                    </form>
                </section>

                <section className="xl:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50 text-[10px] uppercase font-black text-neutral-400">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Driver</th>
                                <th className="px-6 py-4">Status & Proof</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {deliveries.map(item => (
                                <tr key={item._id} className="hover:bg-neutral-50 transition-all">
                                    <td className="px-6 py-4 font-black text-neutral-700">#{item.orderID?._id.slice(-8).toUpperCase() || "N/A"}</td>
                                    <td className="px-6 py-4 font-bold text-sm">
                                        <div>{item.deliveryPerson?.name}</div>
                                        <div className="text-[10px] text-neutral-400 font-medium">{item.deliveryPerson?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <span className="relative flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                                </span>
                                            )}
                                            
                                            <select 
                                                value={item.deliveryStatus} 
                                                onChange={(e) => handleStatusUpdate(item._id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border-none ring-1 ring-inset focus:ring-2 focus:ring-black cursor-pointer appearance-none ${statusClasses[item.deliveryStatus] || statusClasses.Pending}`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        <button 
                                            onClick={() => { setSelectedDelivery(item); setIsModalOpen(true); }} 
                                            className={`p-2 rounded-xl transition-all ${item.image ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-neutral-100 hover:bg-black hover:text-white'}`}
                                            title="View Details & Proof"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)} 
                                            className="p-2 rounded-xl transition-all bg-neutral-100 text-rose-500 hover:bg-rose-500 hover:text-white"
                                            title="Delete Assignment"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </div>

            {isModalOpen && selectedDelivery && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="relative h-72 bg-neutral-900 overflow-hidden">
                            {selectedDelivery.image ? (
                                <img src={selectedDelivery.image} alt="Proof" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 italic">
                                    <Truck size={48} className="mb-2 opacity-20" />
                                    No proof image uploaded yet
                                </div>
                            )}
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/20 text-white hover:bg-rose-500 rounded-full transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase">Delivery Review</h3>
                                    <p className="text-sm font-bold text-neutral-400">Order: #{selectedDelivery.orderID?._id.slice(-8).toUpperCase()}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase ${statusClasses[selectedDelivery.deliveryStatus]}`}>
                                    {selectedDelivery.deliveryStatus}
                                </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-8 my-6 bg-neutral-50 p-6 rounded-3xl border border-neutral-100">
                                <div>
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Courier Info</label>
                                    <p className="font-bold text-lg mt-1">{selectedDelivery.deliveryPerson?.name}</p>
                                    <p className="text-sm text-neutral-500 font-bold italic">{selectedDelivery.deliveryPerson?.phone}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Logistics</label>
                                    <p className="font-bold text-lg mt-1">{selectedDelivery.vehicleNumber}</p>
                                    <p className="text-sm text-neutral-500 font-bold italic">Est: {selectedDelivery.estimatedDeliveryTime}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-neutral-100 text-black rounded-2xl font-black uppercase hover:bg-neutral-200 transition-all">Close</button>
                                {selectedDelivery.deliveryStatus !== "Delivered" && selectedDelivery.image && (
                                    <button 
                                        onClick={() => { handleStatusUpdate(selectedDelivery._id, "Delivered"); setIsModalOpen(false); }} 
                                        className="flex-[2] h-14 bg-emerald-500 text-white rounded-2xl font-black uppercase shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                                    >
                                        Approve & Mark Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}