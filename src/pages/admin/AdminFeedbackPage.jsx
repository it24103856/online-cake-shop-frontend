import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Star, TrendingUp, Loader2, Users } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const token = localStorage.getItem("token");

    const loadData = async () => {
        try {
            // Backend Controller එකට අනුව API calls
            const [fbRes, statsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedback/get-all`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/feedback/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            // Controller එකෙන් feedbacks එවන්නේ { feedbacks: [], totalPages: x } ලෙසයි
            setFeedbacks(fbRes.data.feedbacks || []);
            // Controller එකෙන් stats එවන්නේ { success: true, stats: { overall: {}, ... } } ලෙසයි
            setStats(statsRes.data.stats);
        } catch (err) {
            console.error("Error loading feedback:", err);
            toast.error("Failed to load feedback data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/feedback/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Feedback deleted successfully");
            loadData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="animate-spin text-rose-500" size={48} />
            <p className="text-neutral-400 font-bold animate-pulse">Loading Reviews...</p>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-10 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-4xl font-serif font-black text-gray-900 italic">
                    Customer <span className="text-rose-500">Reviews</span>
                </h1>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center gap-6 transform hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center">
                        <TrendingUp size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Avg Rating</p>
                        <h2 className="text-3xl font-black text-neutral-900">
                            {stats?.overall?.avgRating?.toFixed(1) || "0.0"} <span className="text-sm text-neutral-300">/ 5.0</span>
                        </h2>
                    </div>
                </div>

                <div className="p-8 bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center gap-6 transform hover:scale-105 transition-transform">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center">
                        <Users size={32} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Total Reviews</p>
                        <h2 className="text-3xl font-black text-neutral-900">
                            {stats?.overall?.totalFeedback || 0}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Feedback Table */}
            <div className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100 text-[11px] font-black uppercase text-neutral-400 tracking-widest">
                            <tr>
                                <th className="px-10 py-7">Customer Details</th>
                                <th className="px-10 py-7">Feedback Message</th>
                                <th className="px-10 py-7">Rating</th>
                                <th className="px-10 py-7 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {feedbacks.length > 0 ? feedbacks.map((fb) => (
                                <tr key={fb._id} className="hover:bg-neutral-50/40 transition-colors group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            {fb.userId?.image ? (
                                                <img src={fb.userId.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 font-bold">
                                                    {fb.userId?.firstName?.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-neutral-900 leading-none mb-1">
                                                    {fb.userId?.firstName} {fb.userId?.lastName}
                                                </p>
                                                <p className="text-xs text-neutral-400 uppercase tracking-tighter">{fb.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-sm text-neutral-600 italic leading-relaxed max-w-xs">
                                            "{fb.feedback}"
                                        </p>
                                        <p className="text-[10px] text-neutral-300 mt-2">
                                            {new Date(fb.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex gap-1 text-rose-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={16} 
                                                    fill={i < fb.rating ? "currentColor" : "none"} 
                                                    className={i < fb.rating ? "text-rose-500" : "text-neutral-100"}
                                                />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-right">
                                        <button 
                                            onClick={() => handleDelete(fb._id)} 
                                            className="p-3 text-neutral-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all"
                                            title="Delete Review"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-10 py-20 text-center text-neutral-400 font-medium italic">
                                        No reviews found yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}