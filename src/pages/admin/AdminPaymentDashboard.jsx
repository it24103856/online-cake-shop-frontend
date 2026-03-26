import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    CheckCircle, XCircle, Trash2, Eye, 
    Loader2, Search, Filter, ExternalLink,
    Clock, ShieldCheck, AlertTriangle
} from "lucide-react";

export default function AdminPaymentDashboard() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedReceipt, setSelectedReceipt] = useState(null); // Modal එක සඳහා

    useEffect(() => {
        fetchAllPayments();
    }, []);

    const fetchAllPayments = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setPayments(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    // 1. Status Update (Approve/Reject)
    const handleStatusUpdate = async (paymentId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/payments/verify`, 
                { paymentId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success(`Payment marked as ${newStatus}`);
                fetchAllPayments(); // ලැයිස්තුව Refresh කිරීම
            }
        } catch (error) {
            toast.error("Update failed");
        }
    };

    // 2. Delete Payment
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/payments/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Record deleted");
            fetchAllPayments();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const filteredPayments = payments.filter(p => 
        p.orderID?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-500" size={40} /></div>;

    return (
        <main className="pt-28 pb-12 px-6 bg-[#FCFCFC] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <h1 className="text-4xl font-serif font-black italic">Payment <span className="text-rose-500">Control Panel</span></h1>
                    
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Ref..." 
                            className="pl-10 pr-4 py-3 bg-white border border-neutral-100 rounded-2xl shadow-sm w-72 focus:ring-2 focus:ring-rose-100 outline-none"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-neutral-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100">
                                <th className="px-8 py-6">Order ID</th>
                                <th className="px-8 py-6">Method / Ref</th>
                                <th className="px-8 py-6">Amount</th>
                                <th className="px-8 py-6">Receipt</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {filteredPayments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-neutral-50/30 transition-colors">
                                    <td className="px-8 py-6 font-bold text-sm">#{payment.orderID?._id?.slice(-8) || "N/A"}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-xs font-bold text-neutral-600">{payment.paymentMethod}</div>
                                        <div className="text-[10px] text-neutral-400 uppercase tracking-tighter">{payment.referenceNumber || "No Ref"}</div>
                                    </td>
                                    <td className="px-8 py-6 font-black text-neutral-900">${payment.amount?.toFixed(2)}</td>
                                    <td className="px-8 py-6">
                                        {payment.receiptImage ? (
                                            <button 
                                                onClick={() => setSelectedReceipt(payment.receiptImage)}
                                                className="flex items-center gap-1 text-[10px] font-black uppercase text-rose-500 hover:underline"
                                            >
                                                <Eye size={14} /> View Slip
                                            </button>
                                        ) : <span className="text-[10px] text-neutral-300 italic">No Slip</span>}
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                            payment.status === 'Verified' ? 'bg-green-50 text-green-600 border-green-100' : 
                                            payment.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                            'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                            {payment.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(payment._id, 'Verified')}
                                                className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                                                title="Approve"
                                            >
                                                <CheckCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(payment._id, 'Rejected')}
                                                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                                                title="Reject"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(payment._id)}
                                                className="p-2 bg-neutral-100 text-neutral-400 rounded-xl hover:bg-black hover:text-white transition-all"
                                                title="Delete"
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

            {/* Receipt Viewer Modal */}
            {selectedReceipt && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
                    <div className="bg-white rounded-[2.5rem] p-4 max-w-2xl w-full relative">
                        <button 
                            onClick={() => setSelectedReceipt(null)}
                            className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-lg"
                        >
                            <XCircle size={24} />
                        </button>
                        <img 
                            src={selectedReceipt} 
                            alt="Payment Slip" 
                            className="w-full h-auto rounded-2xl max-h-[80vh] object-contain"
                        />
                        <div className="mt-4 text-center">
                            <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Customer Payment Receipt</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}