import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
    Package, Truck, Clock, 
    Loader2, ChevronLeft, Mail, Star, MapPin, CheckCircle, MessageSquare
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CustomerTrackByEmail() {
    const [deliveries, setDeliveries] = useState([]);
    const [currentUserEmail, setCurrentUserEmail] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchAllDeliveries = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/deliveries/my-orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setDeliveries(res.data.data);
                    setCurrentUserEmail(res.data.currentUserEmail);
                }
            } catch (error) {
                toast.error("An error occurred while fetching data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllDeliveries();
    }, [token, BASE_URL]);

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-black" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 font-poppins">Syncing Live Feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-12 font-poppins text-black">
            <div className="max-w-3xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <Link to={-1} className="h-12 w-12 bg-white border border-neutral-100 rounded-2xl grid place-items-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none mb-1">Live Tracking</p>
                        <h4 className="font-black text-xs text-rose-500 uppercase italic">Cake Delivery System</h4>
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.85]">
                        Global <br /> <span className="text-rose-500">Updates</span>
                    </h1>
                    <p className="mt-4 text-neutral-400 font-bold italic text-[9px] uppercase tracking-[0.2em]">Real-time status of all active deliveries</p>
                </div>

                {/* Orders List */}
                <div className="grid gap-8">
                    {deliveries.length === 0 ? (
                        <div className="text-center p-20 bg-neutral-50 rounded-[3rem] border border-dashed border-neutral-200">
                            <Mail className="mx-auto text-neutral-200 mb-4" size={40} />
                            <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest font-poppins">No active deliveries found</p>
                        </div>
                    ) : (
                        deliveries.map((item) => {
                            const isMyOrder = item.orderID?.customer?.email === currentUserEmail;
                            
                            return (
                                <div 
                                    key={item._id}
                                    className={`relative rounded-[3rem] p-1 shadow-2xl transition-all duration-700 ${
                                        isMyOrder ? "bg-black scale-[1.03] z-10" : "bg-neutral-100/50 scale-100"
                                    }`}
                                >
                                    <div className={`rounded-[2.8rem] p-8 ${isMyOrder ? "bg-black text-white" : "bg-white text-black border border-neutral-100"}`}>
                                        
                                        {/* Top Info */}
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    {isMyOrder && (
                                                        <span className="bg-rose-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-rose-500/20">
                                                            <Star size={8} fill="white" /> YOUR ORDER
                                                        </span>
                                                    )}
                                                    <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                                        isMyOrder ? "border-white/10 bg-white/5" : "border-neutral-100 bg-neutral-50 text-neutral-400"
                                                    }`}>
                                                        #{item._id.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>
                                                <h3 className="text-3xl font-black italic uppercase tracking-tight leading-none mt-2">
                                                    {item.orderID?.customer?.name || "Customer"}
                                                </h3>
                                            </div>
                                            <div className={`h-14 w-14 rounded-2xl grid place-items-center ${isMyOrder ? "bg-white text-black" : "bg-black text-white"}`}>
                                                <Package size={24} />
                                            </div>
                                        </div>

                                        {/* Status Timeline Visualization */}
                                        <div className="mb-10 px-2">
                                            <div className="flex justify-between items-center relative">
                                                {/* Connecting Line */}
                                                <div className={`absolute left-0 right-0 h-[2px] top-1/2 -translate-y-1/2 ${isMyOrder ? "bg-white/10" : "bg-neutral-100"}`} />
                                                <div className={`absolute left-0 h-[2px] top-1/2 -translate-y-1/2 bg-rose-500 transition-all duration-1000`} style={{ width: item.deliveryStatus === 'Delivered' ? '100%' : '50%' }} />

                                                {/* Status Points */}
                                                {['Order Placed', 'On the Way', 'Delivered'].map((step, idx) => (
                                                    <div key={idx} className="relative z-10 flex flex-col items-center">
                                                        <div className={`h-4 w-4 rounded-full border-4 transition-all ${
                                                            item.deliveryStatus === step 
                                                            ? "bg-white border-rose-500 scale-125" 
                                                            : "bg-neutral-200 border-transparent"
                                                        }`} />
                                                        <span className={`text-[7px] font-black uppercase mt-3 tracking-tighter ${
                                                            item.deliveryStatus === step ? "text-rose-500" : "text-neutral-400"
                                                        }`}>
                                                            {step}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Bottom Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-dashed border-neutral-100/10">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-1">
                                                    <Clock size={10} /> Time
                                                </p>
                                                <p className="font-bold text-xs uppercase">{item.estimatedDeliveryTime || "TBA"}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-1">
                                                    <Truck size={10} /> Vehicle
                                                </p>
                                                <p className="font-bold text-xs uppercase">{item.vehicleNumber || "Pending"}</p>
                                            </div>
                                            <div className="col-span-2 space-y-1">
                                                <p className="text-[8px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-1">
                                                    <MapPin size={10} /> To
                                                </p>
                                                <p className="font-bold text-[10px] uppercase truncate italic">{item.orderID?.customer?.address || "Delivery Address"}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        {(item.deliveryStatus === 'Delivered' || item.deliveryStatus === 'DELIVERED' || item.deliveryStatus === 'delivered') && (
                                            <div className="flex gap-3 mt-6 pt-6 border-t border-dashed border-white/10">
                                                <button
                                                    onClick={() => {
                                                        toast.success("Order marked as received!");
                                                    }}
                                                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl uppercase text-[10px] tracking-widest"
                                                >
                                                    <CheckCircle size={16} />
                                                    Complete
                                                </button>
                                                <Link
                                                    to="/reviews"
                                                    className="flex-1 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl uppercase text-[10px] tracking-widest"
                                                >
                                                    <MessageSquare size={16} />
                                                    Review
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Ghost Icon Effect */}
                                    <Truck className={`absolute -bottom-8 -right-8 opacity-[0.03] rotate-12 pointer-events-none ${isMyOrder ? "text-white" : "text-black"}`} size={180} />
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-16 text-center space-y-2">
                    <p className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.4em] animate-pulse">
                        • Live Satellite Sync Active •
                    </p>
                    <p className="text-[7px] font-bold text-neutral-200 uppercase tracking-widest font-poppins">
                        Cake Ordering System v2.0
                    </p>
                </div>
            </div>
        </div>
    );
}