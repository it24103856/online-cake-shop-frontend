import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Clock, CheckCircle2, XCircle, 
    Search, Calendar, CreditCard, 
    ArrowLeft, Loader2, Landmark, Truck,
    ChevronRight, ReceiptText, ShoppingBag
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPayments();
    }, []);

    const fetchMyPayments = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            
            // Backend එකට අදාළ නිවැරදි URL එක භාවිතා කරන්න
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setPayments(response.data.data);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("ගෙවීම් විස්තර ලබා ගැනීමට නොහැකි විය.");
        } finally {
            setLoading(false);
        }
    };

    // --- වැදගත්: TypeError එක වළක්වන Search Logic එක ---
    const filteredPayments = payments.filter(p => {
        // orderID එක Object එකක් නම් එහි _id එක ගන්න, නැත්නම් කෙලින්ම අගය ගන්න
        const orderIdValue = typeof p.orderID === 'object' ? p.orderID?._id : p.orderID;
        const refValue = p.referenceNumber || "";

        // ආරක්ෂිතව string එකක් බවට පත් කර සෙවීම සිදු කිරීම
        const searchStr = searchTerm.toLowerCase();
        return (
            orderIdValue?.toString().toLowerCase().includes(searchStr) ||
            refValue.toString().toLowerCase().includes(searchStr)
        );
    });

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        if (['completed', 'verified', 'paid', 'approved'].includes(s)) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 border border-green-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={12} /> Verified
                </div>
            );
        } else if (['rejected', 'failed', 'cancelled'].includes(s)) {
            return (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <XCircle size={12} /> Rejected
                </div>
            );
        }
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Clock size={12} /> Pending
            </div>
        );
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA] gap-4">
                <Loader2 className="animate-spin text-rose-500" size={48} />
                <p className="text-neutral-400 font-bold uppercase tracking-[0.3em] text-[10px]">Syncing Transactions...</p>
            </div>
        );
    }

    return (
        <main className="bg-[#FCFCFC] min-h-screen py-10 px-4 sm:px-8 ">
            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="group flex items-center gap-2 text-neutral-400 hover:text-black transition-all font-black uppercase tracking-widest text-[10px]"
                        >
                            <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-neutral-100 border border-neutral-50">
                                <ArrowLeft size={14} />
                            </div>
                            Go Back
                        </button>
                        <h1 className="text-5xl font-serif font-black italic tracking-tight text-neutral-900">
                            Payment <span className="text-rose-500 font-sans not-italic font-black">LOGS</span>
                        </h1>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-rose-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Order ID or Ref..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-6 py-4 bg-white border border-neutral-100 rounded-2xl shadow-sm outline-none focus:ring-4 focus:ring-rose-50 transition-all text-sm w-full sm:w-80 font-medium italic"
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-[2.5rem] shadow-xl shadow-neutral-100/40 border border-neutral-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-neutral-50/50 text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 border-b border-neutral-100">
                                    <th className="px-10 py-8">Order Context</th>
                                    <th className="px-10 py-8">Method</th>
                                    <th className="px-10 py-8">Amount</th>
                                    <th className="px-10 py-8">Status</th>
                                    <th className="px-10 py-8 text-right">View</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50">
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment._id} className="group hover:bg-neutral-50/50 transition-all">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center text-neutral-300 group-hover:bg-rose-500 group-hover:text-white transition-all">
                                                        <ShoppingBag size={20} />
                                                    </div>
                                                    <div>
                                                        <span className="block font-black text-neutral-800 text-sm tracking-tighter uppercase">
                                                            #{typeof payment.orderID === 'object' ? payment.orderID?._id?.slice(-8) : payment.orderID?.slice(-8)}...
                                                        </span>
                                                        <span className="text-[9px] text-neutral-400 font-bold flex items-center gap-1 mt-1">
                                                            <Calendar size={10} /> {new Date(payment.createdAt).toDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-neutral-50 rounded-xl text-neutral-400 group-hover:text-rose-500 transition-colors">
                                                        {payment.paymentMethod === 'Bank Transfer' ? <Landmark size={14}/> : <Truck size={14}/>}
                                                    </div>
                                                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{payment.paymentMethod}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className="font-black text-neutral-900 text-lg italic">${payment.amount?.toFixed(2)}</span>
                                            </td>
                                            <td className="px-10 py-8">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300 hover:bg-black hover:text-white transition-all">
                                                    <ChevronRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-10 py-32 text-center">
                                            <div className="max-w-xs mx-auto flex flex-col items-center">
                                                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-6">
                                                    <CreditCard size={28} className="text-neutral-200" />
                                                </div>
                                                <h4 className="text-md font-black text-neutral-800 uppercase tracking-widest mb-2">No History Found</h4>
                                                <p className="text-xs text-neutral-400 font-medium">Your payment history will appear here once you make your first order.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}