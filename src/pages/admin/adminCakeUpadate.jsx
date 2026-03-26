import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadFile } from '../../utils/meadiaUpload';

export default function AdminCakeUpdatePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', altName: '', description: '', price: '',
        category: '', flavor: '', weight: '', quantity: ''
    });
    const [preview, setPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCake = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cakes/${id}`);
                setFormData({
                    name: data.name, altName: data.altName, description: data.description,
                    price: data.price, category: data.category, flavor: data.flavor,
                    weight: data.weight, quantity: data.quantity
                });
                setPreview(data.Image?.[0]); // Schema එකේ තියෙන්නේ Image (Array)
            } catch (error) {
                toast.error("Error loading cake data.");
            }
        };
        fetchCake();
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
        const toastId = toast.loading('Updating...');

        try {
            let finalImageUrl = preview;
            if (imageFile) {
                finalImageUrl = await uploadFile(imageFile);
            }

            const updatedPayload = {
                ...formData,
                price: parseFloat(formData.price),
                quantity: parseInt(formData.quantity),
                Image: [finalImageUrl]
            };

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/cakes/${id}`, updatedPayload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            toast.success('Updated successfully!', { id: toastId });
            navigate('/admin/cakes');
        } catch (error) {
            toast.error('Update failed.', { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold mb-6 italic">Refine Your Masterpiece</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2 border-2 border-dashed rounded-xl p-4 flex flex-col items-center bg-gray-50">
                    <img src={preview} className="h-40 w-40 object-cover rounded-lg shadow-md mb-3" />
                    <input type="file" onChange={handleImageChange} className="text-sm" accept="image/*" />
                </div>

                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Name</label>
                <input name="name" value={formData.name} onChange={handleChange} className="p-3 border rounded-lg" required /></div>
                
                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Tagline</label>
                <input name="altName" value={formData.altName} onChange={handleChange} className="p-3 border rounded-lg" required /></div>

                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Price ($)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} className="p-3 border rounded-lg" required /></div>

                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="p-3 border rounded-lg">
                    <option>Artisan</option><option>Wedding</option><option>Luxury</option>
                </select></div>

                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Flavor</label>
                <input name="flavor" value={formData.flavor} onChange={handleChange} className="p-3 border rounded-lg" required /></div>

                <div className="flex flex-col"><label className="text-xs font-bold text-gray-500 ml-1">Weight</label>
                <input name="weight" value={formData.weight} onChange={handleChange} className="p-3 border rounded-lg" required /></div>

                <div className="flex flex-col md:col-span-2"><label className="text-xs font-bold text-gray-500 ml-1">Stock Quantity</label>
                <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} className="p-3 border rounded-lg" required /></div>

                <textarea name="description" value={formData.description} onChange={handleChange} className="p-3 border rounded-lg md:col-span-2 h-24" required />

                <button type="submit" disabled={isLoading} className="md:col-span-2 bg-blue-500 text-white p-4 rounded-lg font-bold hover:bg-blue-600 transition-all disabled:opacity-50">
                    {isLoading ? "Saving..." : "Update Changes"}
                </button>
            </form>
        </div>
    );
}