import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../../utils/meadiaUpload';

export default function AdminAcessoriesAddpage() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        quantity: '',
        description: '',
        category: 'Other' // Default අගය
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Schema එකේ ඇති enum අගයන්
    const categories = ['Candles', 'Toppers', 'Cards', 'Balloons', 'Other'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        if (!imageFile) return toast.error('Please upload an image.');
        if (!formData.category) return toast.error('Please select a category.');

        setIsLoading(true);
        const toastId = toast.loading('Adding new accessory...');

        try {
            const imageUrl = await uploadFile(imageFile);
            
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                image: [imageUrl], // 'Image' නොව 'image' ලෙස Schema එකට අනුව නිවැරදි කළා
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/accessories`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Accessory added successfully!', { id: toastId });
            navigate('/admin/accessories');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add accessory.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 italic text-center">Add New Accessory</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Image Upload Area */}
                <div className="md:col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer">
                    {preview ? (
                        <img src={preview} className="h-40 w-40 object-cover rounded-xl shadow-md mb-3" />
                    ) : (
                        <div className="h-20 w-20 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-gray-400">IMG</div>
                    )}
                    <input type="file" onChange={handleImageChange} className="text-sm cursor-pointer" accept="image/*" />
                </div>

                {/* Input Fields */}
                <input name="name" placeholder="Accessory Name" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-rose-200 outline-none" required />
                
                {/* Category Selector */}
                <select 
                    name="category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    className="p-3 border rounded-lg focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <input name="price" type="number" placeholder="Price ($)" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-rose-200 outline-none" required />
                <input name="quantity" type="number" placeholder="Stock Quantity" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-rose-200 outline-none" required />
                
                <textarea name="description" placeholder="Short Description..." onChange={handleChange} className="p-3 border rounded-lg md:col-span-2 outline-none h-24" required />

                <button type="submit" disabled={isLoading} className="md:col-span-2 bg-neutral-900 text-white p-4 rounded-xl font-bold hover:bg-rose-500 transition-all disabled:opacity-50 shadow-lg shadow-gray-200">
                    {isLoading ? "Saving..." : "Save Accessory"}
                </button>
            </form>
        </div>
    );
}