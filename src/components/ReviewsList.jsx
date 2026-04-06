import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, ThumbsUp, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewsList({ productId, productType = "cake" }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [avgRating, setAvgRating] = useState(0);
    const [ratingDistribution, setRatingDistribution] = useState({});
    const [markingHelpful, setMarkingHelpful] = useState(null);

    const token = localStorage.getItem("token");
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/reviews/cake/${productId}`);
            if (res.data.success) {
                setReviews(res.data.data || []);
                
                // Calculate average rating
                if (res.data.data.length > 0) {
                    const total = res.data.data.reduce((sum, review) => sum + review.rating, 0);
                    const avg = total / res.data.data.length;
                    setAvgRating(Math.round(avg * 10) / 10);

                    // Calculate rating distribution
                    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                    res.data.data.forEach(review => {
                        distribution[review.rating]++;
                    });
                    setRatingDistribution(distribution);
                }
            }
        } catch (error) {
            console.log("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkHelpful = async (reviewId) => {
        if (!token) {
            toast.error("Please login to mark reviews as helpful");
            return;
        }

        setMarkingHelpful(reviewId);
        try {
            const res = await axios.put(
                `${BASE_URL}/reviews/${reviewId}/helpful`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.data.success) {
                fetchReviews();
            }
        } catch (error) {
            toast.error("Failed to mark review as helpful");
        } finally {
            setMarkingHelpful(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-rose-500" size={30} />
            </div>
        );
    }

    return (
        <div className="mt-12 bg-neutral-50 rounded-[2rem] p-8">
            <h2 className="text-3xl font-black italic uppercase tracking-tight mb-8">Customer Reviews</h2>

            {reviews.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest">
                        No reviews yet. Be the first to review!
                    </p>
                </div>
            ) : (
                <>
                    {/* Rating Summary */}
                    <div className="bg-white rounded-xl p-6 mb-8 border border-neutral-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Average Rating */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="text-5xl font-black text-rose-500 mb-2">
                                    {avgRating}
                                </div>
                                <div className="flex gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                                        />
                                    ))}
                                </div>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
                                    Based on {reviews.length} reviews
                                </p>
                            </div>

                            {/* Rating Distribution */}
                            <div className="md:col-span-2 space-y-3">
                                {[5, 4, 3, 2, 1].map((stars) => (
                                    <div key={stars} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-neutral-600 w-12">
                                            {stars}★
                                        </span>
                                        <div className="flex-1 bg-neutral-200 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="bg-yellow-400 h-full transition-all"
                                                style={{
                                                    width: `${reviews.length > 0 ? (ratingDistribution[stars] / reviews.length) * 100 : 0}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-neutral-400 font-bold w-8 text-right">
                                            {ratingDistribution[stars] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white rounded-xl p-6 border border-neutral-100 hover:shadow-lg transition-shadow">
                                {/* Review Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-sm uppercase text-neutral-800 mb-1">
                                            {review.userId?.name || "Anonymous"}
                                        </h4>
                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-neutral-400 uppercase tracking-wider font-bold">
                                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>

                                {/* Review Comment */}
                                <p className="text-sm text-neutral-700 leading-relaxed mb-4">
                                    {review.comment}
                                </p>

                                {/* Helpful Button */}
                                <button
                                    onClick={() => handleMarkHelpful(review._id)}
                                    disabled={markingHelpful === review._id}
                                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-all ${
                                        markingHelpful === review._id
                                            ? "opacity-50"
                                            : "text-rose-500 hover:bg-rose-50"
                                    }`}
                                >
                                    <ThumbsUp size={12} />
                                    Helpful ({review.helpfulVotes || 0})
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
