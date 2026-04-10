import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Plus, Edit, Trash2, Package, Tag } from "lucide-react";

export default function AdminAccessoriesPage() {
    const [accessories, setAccessories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accessories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Backend returns success: true and data: items
            if (response.data && response.data.success) {
                setAccessories(response.data.data || []);
            } else {
                setAccessories([]);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load inventory.");
            setAccessories([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (accessoryId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            const toastId = toast.loading("Deleting item...");
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/accessories/${accessoryId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                toast.success("Accessory removed successfully!", { id: toastId });
                fetchAccessories(); 
            } catch (error) {
                toast.error("Failed to delete accessory.", { id: toastId });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                <p className="text-gray-400 mt-4 uppercase tracking-widest text-xs">Loading Inventory...</p>
            </div>
        );
    }

    return (
        <div className="p-8 bg-[#FDFDFD] min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 italic">Accessory Inventory</h1>
                    <p className="text-sm text-gray-400 mt-1 uppercase tracking-wider">Manage your premium cake decorations</p>
                </div>
                <Link
                    to="/admin/accessories/add"
                    className="flex items-center gap-3 bg-neutral-900 text-white px-8 py-4 rounded-2xl hover:bg-rose-500 transition-all duration-500 shadow-xl group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    <span className="font-bold uppercase tracking-widest text-[11px]">Add New Item</span>
                </Link>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-neutral-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-neutral-100">
                            <tr>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Product</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Category</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Stock & Price</th>
                                <th className="px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-50">
                            {accessories.length > 0 ? accessories.map((accessory) => (
                                <tr key={accessory._id} className="hover:bg-rose-50/10 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-sm border border-neutral-100 bg-gray-50">
                                                <img 
                                                    src={accessory.image?.[0] || accessory.Image?.[0] || 'https://via.placeholder.com/150'} 
                                                    alt={accessory.name} 
                                                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-base">{accessory.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-50 text-neutral-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-neutral-100">
                                            <Tag size={12} className="text-rose-400" />
                                            {accessory.category || 'Other'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-serif font-bold text-gray-900">LKR.{accessory.price}</span>
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${accessory.quantity < 10 ? 'text-red-500' : 'text-gray-400'}`}>
                                                {accessory.quantity} Units in Stock
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link 
                                                to={`/admin/accessories/edit/${accessory._id}`} 
                                                className="p-3 text-gray-400 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-all"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(accessory._id)} 
                                                className="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                                            <Package size={60} strokeWidth={1} />
                                            <p className="font-bold uppercase tracking-[0.3em] text-xs">No Items Found</p>
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