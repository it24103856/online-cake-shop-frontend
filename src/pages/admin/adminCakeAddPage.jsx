import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../../utils/meadiaUpload';

export default function AdminCakeAddPage() {
    const [formData, setFormData] = useState({
        name: '',
        altName: '',
        description: '',
        price: '',
        category: 'Artisan',
        flavor: '',
        weight: '',
        quantity: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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

        setIsLoading(true);
        const toastId = toast.loading('Creating your masterpiece...');

        try {
            const imageUrl = await uploadFile(imageFile);
            
            // Prepare data to match backend schema
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                Image: [imageUrl], // Schema expects an array
            };

            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/cakes`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Cake added successfully!', { id: toastId });
            navigate('/admin/cakes');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add cake.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 italic">Add New Creation</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Image Upload Area */}
                <div className="md:col-span-2 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-all">
                    {preview ? <img src={preview} className="h-40 w-40 object-cover rounded-full shadow-md mb-3 border-2 border-blue-400" /> : <div className="h-20 w-20 bg-gray-200 rounded-full mb-3" />}
                    <input type="file" onChange={handleImageChange} className="text-sm cursor-pointer" accept="image/*" />
                </div>

                <input name="name" placeholder="Cake Name" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <input name="altName" placeholder="Tagline (e.g. For Weddings)" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <input name="price" type="number" placeholder="Price ($)" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <select name="category" onChange={handleChange} className="p-3 border rounded-lg outline-none">
                    <option>Artisan</option>
                    <option>Wedding</option>
                    <option>Luxury</option>
                </select>
                <input name="flavor" placeholder="Flavor (e.g. Chocolate)" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <input name="weight" placeholder="Weight (e.g. 1kg)" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <input name="quantity" type="number" placeholder="Stock Quantity" onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none" required />
                <textarea name="description" placeholder="Short Description..." onChange={handleChange} className="p-3 border rounded-lg md:col-span-2 outline-none h-24" required />

                <button type="submit" disabled={isLoading} className="md:col-span-2 bg-gray-900 text-white p-4 rounded-lg font-semibold hover:bg-blue-600 transition-all disabled:opacity-50">
                    {isLoading ? "Processing..." : "Save Cake"}
                </button>
            </form>
        </div>
    );
}