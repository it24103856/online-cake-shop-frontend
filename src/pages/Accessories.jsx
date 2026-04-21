import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import Footer from "../components/Footer";

export default function AccessoriesPage() {
    const [accessories, setAccessories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAccessories();
    }, []);

    const fetchAccessories = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accessories`);
            
            // Backend returns success: true and data: [], so:
            if (response.data && response.data.success) {
                setAccessories(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setError("We could not fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-neutral-50">
                <Loader2 className="animate-spin text-rose-500 mb-4" size={40} />
                <p className="text-neutral-400 font-medium tracking-widest animate-pulse">UNVEILING ACCESSORIES...</p>
            </div>
        );
    }

    return (
        <>
            <main className="bg-[#FDF8F0] min-h-screen font-sans ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-16 space-y-4">
                        <span className="text-rose-500 font-bold tracking-[0.3em] text-xs uppercase">Complete Your Celebration</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-neutral-900 tracking-tighter">
                            Exquisite <span className="text-rose-500">Add-ons</span>
                        </h1>
                        <div className="w-24 h-1 bg-rose-200 rounded-full mt-2"></div>
                        <p className="text-neutral-500 mt-6 max-w-xl text-lg leading-relaxed">
                            From elegant toppers to artistic candles, find the perfect accessories 
                            to complement your premium cakes and celebrations.
                        </p>
                    </div>

                    {/* Accessories Grid */}
                    {error ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200 shadow-sm">
                            <p className="text-rose-500 font-medium">{error}</p>
                            <button onClick={fetchAccessories} className="mt-6 px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {accessories.map((item) => (
                                <div key={item._id} className="group relative flex flex-col">
                                    {/* Image Container */}
                                    <Link 
                                        to={`/accessory/${item._id}`}
                                        className="relative aspect-4/5 overflow-hidden rounded-4xl bg-neutral-100 shadow-sm group-hover:shadow-2xl transition-all duration-500"
                                    >
                                        <img
                                            src={item.image?.[0] || item.Image?.[0] || "https://via.placeholder.com/600"}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Badges */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            {item.quantity === 0 && (
                                                <span className="bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                    Out of Stock
                                                </span>
                                            )}
                                        </div>

                                        {/* Quick View Button */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 w-[80%]">
                                            <button
                                                type="button"
                                                disabled={item.quantity <= 0}
                                                className="w-full py-3.5 bg-white text-neutral-900 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-colors disabled:bg-neutral-200 disabled:text-neutral-500 disabled:cursor-not-allowed disabled:hover:bg-neutral-200 disabled:hover:text-neutral-500"
                                            >
                                                {item.quantity <= 0 ? "Out of Stock" : "View Accessory"} <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </Link>

                                    {/* Content Section */}
                                    <div className="mt-6 px-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 mr-4">
                                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 block">
                                                    {item.category || 'Premium Accessory'}
                                                </span>
                                                <h3 className="text-2xl font-serif font-bold text-neutral-800 group-hover:text-rose-500 transition-colors line-clamp-1">
                                                    {item.name}
                                                </h3>
                                                <p className="text-neutral-400 text-sm italic mt-0.5 line-clamp-1">
                                                    {item.description || 'Artisanal finishing touch'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-neutral-900">LKR.{item.price}</p>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && accessories.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="p-10 bg-neutral-50 rounded-full mb-6">
                                <Package size={64} className="text-neutral-200" />
                            </div>
                            <h2 className="text-2xl font-serif text-neutral-400 italic">No accessories found...</h2>
                            <p className="text-neutral-400 mt-2">We are restocking our decorative collection. Check back soon!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}