import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Package, Layers, Loader2 } from "lucide-react";

export default function AdminCakePage() {
    const [cakes, setCakes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCakes();
    }, []);

    const fetchCakes = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cakes`, {
                headers: { 
                    Authorization: `Bearer ${token}` 
                }
            });
            
            // Backend returns { success: true, data: [...] }, so use response.data.data
            if (response.data && response.data.success) {
                setCakes(response.data.data);
            } else {
                setCakes([]);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error("Session has expired. Please log in again.");
            } else {
                toast.error("Unable to fetch data.");
            }
            console.error("Fetch Error:", error);
            setCakes([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (cakeId) => {
        if (window.confirm("Are you sure you want to remove this design from the gallery?")) {
            const toastId = toast.loading("Removing...");
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/cakes/${cakeId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success("Removed successfully!", { id: toastId });
                fetchCakes(); 
            } catch (error) {
                toast.error("Failed to remove.", { id: toastId });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-96 space-y-4">
                <Loader2 className="animate-spin text-gray-900" size={40} />
                <p className="text-gray-500 animate-pulse font-medium italic">Loading your masterpiece gallery...</p>
            </div>
        );
    }

    return (
        <div className="animate-fade-in p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 italic tracking-tight">Cake Inventory</h1>
                    <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest">Fine Patisserie Management</p>
                </div>
                <Link
                    to="/admin/cakes/add"
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all shadow-lg font-semibold uppercase text-xs tracking-widest"
                >
                    <Plus size={18} />
                    Add New Creation
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Masterpiece</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Details</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Availability</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cakes.length > 0 ? cakes.map((cake) => (
                                <tr key={cake._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="relative h-20 w-20">
                                            <img 
                                                src={cake.Image?.[0] || 'https://via.placeholder.com/150'} 
                                                alt={cake.name} 
                                                className="h-full w-full object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500" 
                                            />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-gray-900 text-lg">{cake.name}</span>
                                            <span className="text-xs text-gray-400 italic font-medium">{cake.altName}</span>
                                            <span className="text-[10px] text-blue-500 mt-1 font-bold uppercase tracking-tighter">{cake.flavor}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-tighter">
                                            <Layers size={12} /> {cake.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xl font-black text-gray-900">${cake.price}</span>
                                            <span className={`text-[10px] font-bold uppercase ${cake.quantity < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                                {cake.quantity} in stock • {cake.weight}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link 
                                                to={`/admin/cakes/edit/${cake._id}`} 
                                                className="p-3 text-gray-400 hover:text-black hover:bg-white hover:shadow-md rounded-xl transition-all"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(cake._id)} 
                                                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center opacity-20 scale-150">
                                            <Package size={48} />
                                            <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em]">Gallery Empty</p>
                                        </div>
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