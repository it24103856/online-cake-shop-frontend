import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, ShoppingBag, Star, Heart, ArrowRight } from "lucide-react";
import Footer from "../components/Footer";

export default function ShopPage() {
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCakes();
    }, []);

    const fetchCakes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cakes`);
            if (response.data && response.data.success) {
                setCakes(response.data.data);
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
                <p className="text-neutral-400 font-medium tracking-widest animate-pulse">PREPARING DELIGHTS...</p>
            </div>
        );
    }

    return (
        <>
            <main className="bg-[#FDF8F0] min-h-screen font-sans ">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
                    
                    {/* Header Section */}
                    <div className="flex flex-col items-center text-center mb-16 space-y-4">
                        <span className="text-rose-500 font-bold tracking-[0.3em] text-xs uppercase">Premium Collection</span>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-neutral-900 tracking-tighter">
                            Indulge in <span className="text-rose-500">Perfection</span>
                        </h1>
                        <div className="w-24 h-1 bg-rose-200 rounded-full mt-2"></div>
                        <p className="text-neutral-500 mt-6 max-w-xl text-lg leading-relaxed">
                            Handcrafted with artisanal precision and the finest seasonal ingredients. 
                            Your perfect celebration starts here.
                        </p>
                    </div>

                    {/* Cake Grid */}
                    {error ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-neutral-200 shadow-sm">
                            <p className="text-rose-500 font-medium">{error}</p>
                            <button onClick={fetchCakes} className="mt-6 px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-rose-600 transition-colors shadow-lg">
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                            {cakes.map((cake) => (
                                <div key={cake._id} className="group relative flex flex-col">
                                    {/* Image Container */}
                                    <Link 
                                        to={`/cake/${cake._id}`}
                                        className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-neutral-100 shadow-sm group-hover:shadow-2xl transition-all duration-500"
                                    >
                                        <img
                                            src={cake.Image?.[0] || "https://via.placeholder.com/600"}
                                            alt={cake.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        {/* Badges */}
                                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                                            {cake.isAvailable === false && (
                                                <span className="bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                                                    Sold Out
                                                </span>
                                            )}
                                            {cake.quantity < 5 && cake.isAvailable !== false && (
                                                <span className="bg-rose-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
                                                    Only {cake.quantity} Left
                                                </span>
                                            )}
                                        </div>

                                        {/* Quick Actions (Appear on Hover) */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 w-[80%]">
                                            <button className="w-full py-3.5 bg-white text-neutral-900 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-colors">
                                                View Details <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </Link>

                                    {/* Content Section */}
                                    <div className="mt-6 px-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1 block">
                                                    {cake.category}
                                                </span>
                                                <h3 className="text-2xl font-serif font-bold text-neutral-800 group-hover:text-rose-500 transition-colors">
                                                    {cake.name}
                                                </h3>
                                                <p className="text-neutral-400 text-sm italic mt-0.5">{cake.flavor} • {cake.weight}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-black text-neutral-900">LKR.{cake.price}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Rating Display */}
                                        <div className="flex items-center gap-2 mt-3">
                                            <Star size={14} className="fill-rose-400 text-rose-400" />
                                            <span className="text-sm font-bold text-neutral-900">{cake.rating ? cake.rating.toFixed(1) : "0"}</span>
                                            <span className="text-[10px] text-neutral-400 italic">(from reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && cakes.length === 0 && !error && (
                        <div className="flex flex-col items-center justify-center py-32 text-center">
                            <div className="p-10 bg-neutral-50 rounded-full mb-6">
                                <ShoppingBag size={64} className="text-neutral-200" />
                            </div>
                            <h2 className="text-2xl font-serif text-neutral-400 italic">The bakery is currently resting...</h2>
                            <p className="text-neutral-400 mt-2">New creations arriving soon. Stay tuned!</p>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}