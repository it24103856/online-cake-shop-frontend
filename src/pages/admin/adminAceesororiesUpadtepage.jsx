import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../../utils/meadiaUpload';

export default function AdminAccessoriesUpdatePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: ''
    });
    
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Show while data is loading

    const categories = ['Candles', 'Toppers', 'Cards', 'Balloons', 'Other'];

    useEffect(() => {
        const fetchAccessory = async () => {
            setIsFetching(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accessories/${id}`);
                
                // Backend returns success: true and data: { item }
                const item = response.data.data;

                if (item) {
                    setFormData({
                        name: item.name || '',
                        price: item.price || '',
                        quantity: item.quantity || '',
                        description: item.description || '',
                        category: item.category || 'Other'
                    });
                    // Set preview image for display
                    setPreview(item.image?.[0] || item.Image?.[0] || null);
                }
            } catch (error) {
                toast.error("Unable to fetch accessory data.");
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };
        fetchAccessory();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Updating accessory...');

        try {
            let finalImageUrl = preview;
            
            // Upload only when a new image is selected
            if (imageFile) {
                finalImageUrl = await uploadFile(imageFile);
            }

            const updatedPayload = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                image: [finalImageUrl] 
            };

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/accessories/${id}`, updatedPayload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Accessory updated successfully!', { id: toastId });
            navigate('/admin/accessories');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Update failed.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-rose-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-[2rem] shadow-xl border border-neutral-100 mt-10 mb-10">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-neutral-900 italic">Update Accessory</h1>
                <p className="text-neutral-500 text-sm">Modify the details of your accessory item below.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Image Section */}
                <div className="md:col-span-2 group relative border-2 border-dashed border-neutral-200 rounded-[2rem] p-6 flex flex-col items-center bg-neutral-50 hover:bg-rose-50/30 transition-all duration-500">
                    <div className="relative overflow-hidden rounded-2xl shadow-lg border-4 border-white mb-4 bg-white">
                        <img 
                            src={preview || 'https://via.placeholder.com/150'} 
                            className="h-44 w-44 object-cover transition-transform duration-500 group-hover:scale-110" 
                            alt="Preview"
                        />
                    </div>
                    <label className="cursor-pointer bg-white px-6 py-2 rounded-full border border-neutral-200 text-xs font-bold uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all shadow-sm">
                        Change Photo
                        <input type="file" onChange={handleImageChange} className="hidden" accept="image/*" />
                    </label>
                </div>

                {/* Accessory Name */}
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Accessory Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} className="p-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-100 outline-none text-neutral-800 font-medium" required />
                </div>
                
                {/* Category */}
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Category</label>
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className="p-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-100 outline-none text-neutral-800 font-medium appearance-none"
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Price ($)</label>
                    <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} className="p-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-100 outline-none text-neutral-800 font-medium" required />
                </div>

                {/* Quantity */}
                <div className="flex flex-col space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Stock Quantity</label>
                    <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="p-4 bg-neutral-50 border-none rounded-2xl focus:ring-2 focus:ring-rose-100 outline-none text-neutral-800 font-medium" required />
                </div>

                {/* Description */}
                <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 ml-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="p-4 bg-neutral-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-rose-100 h-32 text-neutral-800 resize-none" required />
                </div>

                {/* Buttons */}
                <div className="md:col-span-2 flex gap-4 mt-4">
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/accessories')}
                        className="flex-1 px-8 py-5 border border-neutral-100 text-neutral-400 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 transition-all"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="flex-[2] bg-neutral-900 text-white px-8 py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-rose-500 transition-all shadow-xl shadow-rose-100 disabled:opacity-50"
                    >
                        {isLoading ? "Updating..." : "Update Accessory"}
                    </button>
                </div>
            </form>
        </div>
    );
}