import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck, Clock, PackageCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";
import ReviewsList from "../components/ReviewsList";

export default function AccessoryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [accessory, setAccessory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImg, setActiveImg] = useState("");

    useEffect(() => {
        const fetchAccessory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accessories/${id}`);
                if (response.data && response.data.success) {
                    const data = response.data.data;
                    setAccessory(data);
                    setActiveImg(data.image?.[0] || data.Image?.[0] || "");
                } else {
                    toast.error("This item could not be found.");
                    navigate("/accessories");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load details.");
                navigate("/accessories");
            } finally {
                setLoading(false);
            }
        };
        fetchAccessory();
    }, [id, navigate]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find(item => item._id === accessory._id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ ...accessory, quantity, type: 'accessory' });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            toast.success(`${accessory.name} added to cart!`);
            navigate("/order");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-neutral-50">
                <Loader2 className="animate-spin text-rose-500 mb-4" size={48} />
                <p className="text-neutral-400 font-medium tracking-widest animate-pulse">LOADING ELEGANCE...</p>
            </div>
        );
    }

    if (!accessory) return null;

    return (
        <>
        <main className="bg-[#FAFAFA] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                <Link to="/accessories" className="group inline-flex items-center gap-2 text-neutral-400 hover:text-rose-500 transition-colors mb-12 uppercase text-xs font-bold tracking-widest">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Accessories
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Image Section */}
                    <div className="space-y-6">
                        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-neutral-200/50 group border border-neutral-100">
                            <img
                                src={activeImg || "https://via.placeholder.com/800"}
                                alt={accessory.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Right: Details Section */}
                    <div className="space-y-8 lg:py-4">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                {accessory.category}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-900 leading-[1.1]">
                                {accessory.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(accessory.rating) ? "fill-rose-400 text-rose-400" : "text-neutral-300"} />)}
                                </div>
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{accessory.rating || 0} Rating</span>
                            </div>
                        </div>

                        <p className="text-neutral-500 text-lg leading-relaxed font-light max-w-xl">
                            {accessory.description || "The perfect finishing touch for your celebration, crafted with attention to detail and premium materials."}
                        </p>

                        <div className="grid grid-cols-2 gap-6 py-8 border-y border-neutral-100">
                            <div>
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Price per unit</p>
                                <p className="text-4xl font-black text-neutral-900">LKR.{accessory.price}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Availability</p>
                                <p className={`text-sm font-bold mt-1 ${accessory.quantity < 10 ? "text-rose-500" : "text-emerald-500"}`}>
                                    {accessory.quantity > 0 ? `${accessory.quantity} items left` : "Out of Stock"}
                                </p>
                            </div>
                        </div>

                        {/* Order Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-center bg-white border border-neutral-100 rounded-2xl p-1 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 rounded-xl transition-colors text-xl font-light"
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 rounded-xl transition-colors text-xl font-light"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={addingToCart || accessory.quantity === 0}
                                className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-500 transition-all shadow-xl shadow-neutral-200 disabled:bg-neutral-300"
                            >
                                {addingToCart ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                                Order Now
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
                            <div className="flex items-center gap-3 text-neutral-500">
                                <PackageCheck size={18} className="text-rose-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Quality Inspected</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-500">
                                <Truck size={18} className="text-rose-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Express Shipping</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsList productId={accessory._id} productType="accessory" />
            </div>
            <Footer />
        </main>
        </>
    );
}