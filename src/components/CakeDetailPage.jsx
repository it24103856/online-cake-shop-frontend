import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ArrowLeft, ShoppingCart, Star, Heart, ShieldCheck, Truck, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import Footer from "../components/Footer";
import ReviewsList from "../components/ReviewsList";

export default function CakeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cake, setCake] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [activeImg, setActiveImg] = useState("");

    useEffect(() => {
        fetchCake();
    }, [id]);

    const fetchCake = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cakes/${id}`);
            if (response.data && response.data.success) {
                setCake(response.data.data);
                setActiveImg(response.data.data.Image?.[0] || "");
            } else {
                toast.error("This design could not be found.");
                navigate("/cakes");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load details.");
            navigate("/cakes");
        } finally {
            setLoading(false);
        }
    };

    const handleOrderNow = async () => {
        setAddingToCart(true);
        try {
            let cart = JSON.parse(localStorage.getItem("cart")) || [];
            const existingItem = cart.find(item => item._id === cake._id);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ ...cake, quantity });
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            toast.success(`${cake.name} added to cart!`);
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
                <p className="text-neutral-400 font-medium tracking-widest animate-pulse">CRAFTING DETAILS...</p>
            </div>
        );
    }

    if (!cake) return null;

    return (
        <>
        <main className="bg-[#FAFAFA] min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/* Breadcrumb & Navigation */}
                <Link to="/cakes" className="group inline-flex items-center gap-2 text-neutral-400 hover:text-rose-500 transition-colors mb-12 uppercase text-xs font-bold tracking-widest">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Image Strategy */}
                    <div className="space-y-6">
                        <div className="relative aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-neutral-200/50 group">
                            <img
                                src={activeImg || "https://via.placeholder.com/800"}
                                alt={cake.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        
                        {/* Thumbnails */}
                        {cake.Image?.length > 1 && (
                            <div className="grid grid-cols-5 gap-4">
                                {cake.Image.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImg(img)}
                                        className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImg === img ? 'border-rose-500 scale-95 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="Cake view" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Essence */}
                    <div className="space-y-8 lg:py-4">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                {cake.category} • {cake.flavor}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-900 leading-[1.1]">
                                {cake.name}
                            </h1>
                            <div className="flex items-center gap-3">
                                <Star size={18} className="fill-rose-400 text-rose-400" />
                                <span className="text-lg font-bold text-neutral-900">{cake.rating || 0}</span>
                                <span className="text-sm text-neutral-400 italic">Average Rating</span>
                            </div>
                        </div>

                        <p className="text-neutral-500 text-lg leading-relaxed font-light max-w-xl">
                            {cake.description || "Indulge in this exquisite masterpiece, featuring layers of delicate sponge and artisanal frosting, crafted for your most precious moments."}
                        </p>

                        <div className="grid grid-cols-3 gap-6 py-8 border-y border-neutral-100">
                            <div>
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Price</p>
                                <p className="text-4xl font-black text-neutral-900">LKR.{cake.price}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Weight</p>
                                <p className="text-xl font-bold text-neutral-700">{cake.weight}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest mb-1">Availability</p>
                                <p className={`text-sm font-bold mt-1 ${cake.quantity < 5 ? "text-rose-500" : "text-emerald-500"}`}>
                                    {cake.quantity > 0 ? `${cake.quantity} in Stock` : "Sold Out"}
                                </p>
                            </div>
                        </div>

                        {/* Order Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex items-center bg-white border border-neutral-100 rounded-2xl p-1 shadow-sm">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 disabled:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-xl font-light"
                                    disabled={quantity <= 1}
                                >
                                    −
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(cake.quantity, quantity + 1))}
                                    disabled={quantity >= cake.quantity}
                                    className="w-12 h-12 flex items-center justify-center hover:bg-neutral-50 disabled:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors text-xl font-light"
                                >
                                    +
                                </button>
                            </div>

                            <button
                                onClick={handleOrderNow}
                                disabled={addingToCart || cake.quantity === 0}
                                className="flex-1 py-4 bg-neutral-900 text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-rose-500 transition-all shadow-xl shadow-neutral-200 disabled:bg-neutral-300"
                            >
                                {addingToCart ? <Loader2 className="animate-spin" size={18} /> : <ShoppingCart size={18} />}
                                Order This Masterpiece
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                            <div className="flex items-center gap-3 text-neutral-500">
                                <Truck size={18} className="text-rose-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Islandwide Delivery</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                                <ShieldCheck size={18} className="text-rose-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Safe Payments</span>
                            </div>
                            <div className="flex items-center gap-3 text-neutral-400">
                                <Clock size={18} className="text-rose-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Freshly Baked</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ReviewsList productId={cake._id} productType="cake" />
            </div>
            <Footer />
        </main>
        </>
    );
}