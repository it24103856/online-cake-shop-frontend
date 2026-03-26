import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Star, Send, Loader2, Package, Cake, MessageSquare } from "lucide-react";

export default function Feedback() {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [category, setCategory] = useState("cake"); // Schema enum එකට අනුව 'cake' default ලෙස තබා ඇත
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Rating එකක් තෝරා තිබිය යුතුමයි
        if (rating === 0) return toast.error("Please select a rating star");
        
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            
            // Backend Controller එක බලාපොරොත්තු වන දත්ත ව්‍යුහය (Request Body)
            const feedbackData = {
                feedback: comment,    // Schema එකේ field එක 'feedback' බැවින්
                rating: Number(rating),
                category: category    // Enum values: "cake", "acessories", "All"
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/feedback/create`, 
                feedbackData,
                { 
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    } 
                }
            );

            toast.success(response.data.message || "Feedback submitted successfully!");
            
            // Form එක reset කිරීම
            setRating(0);
            setComment("");
            setCategory("cake");
            
        } catch (err) {
            // Backend එකෙන් එන enum validation errors මෙතැනින් පෙන්වයි
            const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to send feedback";
            console.error("Submission Error:", errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 bg-[#FAFAFA]">
            <div className="max-w-xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-rose-50">
                    <div className="text-center mb-10">
                        <h3 className="text-4xl font-serif font-black text-neutral-800 italic mb-2">
                            Rate Your <span className="text-rose-500">Experience</span>
                        </h3>
                        <p className="text-neutral-400 font-medium">How was your cake today?</p>
                    </div>

                    {/* Category Selection */}
                    <div className="mb-8">
                        <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-4 mb-3 block">
                            Select Category
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setCategory("cake")}
                                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${category === "cake" ? "border-rose-500 bg-rose-50 text-rose-500" : "border-neutral-50 text-neutral-400"}`}
                            >
                                <Cake size={20} /> Cake
                            </button>
                            <button
                                type="button"
                                onClick={() => setCategory("acessories")}
                                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold ${category === "acessories" ? "border-rose-500 bg-rose-50 text-rose-500" : "border-neutral-50 text-neutral-400"}`}
                            >
                                <Package size={20} /> Accessories
                            </button>
                        </div>
                    </div>

                    {/* Star Rating */}
                    <div className="flex gap-4 mb-10 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="transform transition-all hover:scale-125 active:scale-95"
                            >
                                <Star 
                                    size={42} 
                                    className={star <= rating ? "fill-rose-500 text-rose-500" : "text-neutral-100"} 
                                />
                            </button>
                        ))}
                    </div>

                    {/* Feedback Textarea */}
                    <div className="relative mb-8">
                        <textarea 
                            className="w-full p-6 bg-neutral-50 rounded-[2rem] border-none outline-none focus:ring-2 focus:ring-rose-100 h-44 text-neutral-700 font-medium resize-none shadow-inner"
                            placeholder="Tell us what you loved or what we can improve..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                        <MessageSquare className="absolute bottom-6 right-6 text-neutral-200" size={24} />
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading} 
                        className="w-full py-5 bg-black text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] hover:bg-rose-600 active:bg-rose-700 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <Send size={20} /> 
                                Submit Review
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}