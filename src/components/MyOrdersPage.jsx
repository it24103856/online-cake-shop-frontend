import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Loader2, Package, Calendar, Tag, 
    ExternalLink, ShoppingBag, ArrowRight 
} from "lucide-react";
import Footer from "../components/Footer";

export default function MyOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Please login to view your orders");
                return;
            }
            
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/orders/my-orders`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Sorting to show newest orders first
            const sortedOrders = (response.data.data || []).sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error(error);
            toast.error("Could not load your orders.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-neutral-50">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    return (
        <>
        <main className="bg-[#FAFAFA] min-h-screen pt-24">
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-neutral-900 mb-2">My Orders</h1>
                    <p className="text-neutral-500">Track your cake journey from our kitchen to your door.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-neutral-200">
                        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag className="text-rose-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-800 mb-2">No orders yet</h2>
                        <p className="text-neutral-500 mb-8">It looks like you haven't ordered any treats lately.</p>
                        <button 
                            onClick={() => window.location.href = '/cakes'}
                            className="px-8 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-[2rem] border border-neutral-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="p-6 md:p-8 bg-neutral-50/50 flex flex-wrap justify-between items-center gap-4 border-b border-neutral-100">
                                    <div className="flex gap-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Order Date</p>
                                            <p className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                                                <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Order ID</p>
                                            <p className="text-xs font-bold text-neutral-700">#{order._id.toUpperCase()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-1">Total Amount</p>
                                            <p className="text-sm font-bold text-rose-500">LKR.{order.totalPrice.toFixed(2)}</p>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest
                                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-500'}
                                    `}>
                                        {order.status}
                                    </div>
                                </div>

                                {/* Order Items List */}
                                <div className="p-6 md:p-8">
                                    <div className="divide-y divide-neutral-50">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-6">
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-20 h-20 object-cover rounded-2xl bg-neutral-100"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-neutral-800">{item.name}</h4>
                                                    <p className="text-xs text-neutral-400">Quantity: {item.quantity} | {item.weight || '1kg'}</p>
                                                </div>
                                                <div className="hidden md:block text-right">
                                                    <p className="text-sm font-bold text-neutral-800">LKR.{(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-8 pt-6 border-t border-neutral-50 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
                                            <Package size={14} /> 
                                            Payment: {order.paymentStatus || "Processing"}
                                        </div>
                                        <button className="flex items-center gap-2 text-sm font-bold text-neutral-900 hover:text-rose-500 transition-colors">
                                            View Full Details <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </main>
        </>
    );
}