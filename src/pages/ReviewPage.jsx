import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
    Star, ChevronLeft, Loader2, Send, Trash2, AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function ReviewPage() {
    const [deliveredOrders, setDeliveredOrders] = useState([]);
    const [reviews, setReviews] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [userReviews, setUserReviews] = useState([]);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    // Form state for review submission
    const [reviewForm, setReviewForm] = useState({
        orderId: null,
        cakeId: null,
        itemName: "",
        rating: 5,
        comment: ""
    });

    useEffect(() => {
        fetchDeliveredOrders();
        if (userId) {
            fetchUserReviews();
        }
    }, [token, BASE_URL, userId]);

    const fetchDeliveredOrders = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/deliveries/my-orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                // Filter only delivered orders
                const delivered = res.data.data.filter(order => order.deliveryStatus === 'Delivered');
                setDeliveredOrders(delivered);
                
                // Fetch existing reviews for each order
                delivered.forEach(order => {
                    if (order.orderID?._id) {
                        fetchOrderReviews(order.orderID._id);
                    }
                });
            }
        } catch (error) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderReviews = async (orderId) => {
        try {
            const res = await axios.get(`${BASE_URL}/reviews/cake/${orderId}`);
            if (res.data.success) {
                setReviews(prev => ({
                    ...prev,
                    [orderId]: res.data.data || []
                }));
            }
        } catch (error) {
            console.log("No reviews for this order yet");
        }
    };

    const fetchUserReviews = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/reviews/user/${userId}`);
            if (res.data.success) {
                setUserReviews(res.data.data || []);
            }
        } catch (error) {
            console.log("Error fetching user reviews");
        }
    };

    const isItemReviewed = (orderId, cakeId) => {
        return userReviews.some(review => 
            review.orderId === orderId && review.cakeId === cakeId
        );
    };

    const handleReviewSubmit = async (orderId, cakeId, itemName) => {
        if (!reviewForm.comment.trim()) {
            toast.error("Please write a comment");
            return;
        }

        setSubmitting(true);
        try {
            const res = await axios.post(
                `${BASE_URL}/reviews`,
                {
                    orderId,
                    cakeId,
                    rating: reviewForm.rating,
                    comment: reviewForm.comment
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Review submitted successfully!");
                setReviewForm({
                    orderId: null,
                    cakeId: null,
                    itemName: "",
                    rating: 5,
                    comment: ""
                });
                // Refresh reviews
                fetchUserReviews();
                fetchOrderReviews(orderId);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                const res = await axios.delete(
                    `${BASE_URL}/reviews/${reviewId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (res.data.success) {
                    toast.success("Review deleted successfully");
                    fetchUserReviews();
                    deliveredOrders.forEach(order => {
                        if (order.orderID?._id) {
                            fetchOrderReviews(order.orderID._id);
                        }
                    });
                }
            } catch (error) {
                toast.error("Failed to delete review");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen grid place-items-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-black" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Loading Reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] p-6 md:p-12 font-poppins text-black">
            <div className="max-w-4xl mx-auto">
                
                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <Link to={-1} className="h-12 w-12 bg-white border border-neutral-100 rounded-2xl grid place-items-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none mb-1">Customer Reviews</p>
                        <h4 className="font-black text-xs text-rose-500 uppercase italic">Share Your Experience</h4>
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-[0.85]">
                        Rate Your <br /> <span className="text-rose-500">Cakes</span>
                    </h1>
                    <p className="mt-4 text-neutral-400 font-bold italic text-[9px] uppercase tracking-[0.2em]">Help others discover amazing cakes by sharing your feedback</p>
                </div>

                {/* Delivered Orders for Review */}
                <div className="grid gap-6 mb-12">
                    <h2 className="text-2xl font-black uppercase italic tracking-tight">Your Delivered Orders</h2>
                    
                    {deliveredOrders.length === 0 ? (
                        <div className="text-center p-12 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
                            <AlertCircle className="mx-auto text-neutral-200 mb-4" size={40} />
                            <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest font-poppins">No delivered orders yet</p>
                        </div>
                    ) : (
                        deliveredOrders.map((delivery) => (
                            <div key={delivery._id} className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-lg hover:shadow-xl transition-all">
                                
                                {/* Order Header */}
                                <div 
                                    onClick={() => setExpandedOrder(expandedOrder === delivery._id ? null : delivery._id)}
                                    className="p-6 cursor-pointer hover:bg-neutral-50 transition-colors"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-1">Order ID</p>
                                            <h3 className="text-xl font-black italic uppercase tracking-tight">
                                                #{delivery._id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-neutral-500 mt-2">
                                                {delivery.orderID?.customer?.name}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase text-neutral-400 tracking-widest mb-2">Items</p>
                                            <p className="text-2xl font-black text-rose-500">
                                                {delivery.orderID?.items?.length || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Review Section */}
                                {expandedOrder === delivery._id && (
                                    <div className="border-t border-neutral-100 p-6 bg-neutral-50">
                                        {delivery.orderID?.items && delivery.orderID.items.length > 0 ? (
                                            <div className="space-y-6">
                                                {delivery.orderID.items.map((item, idx) => {
                                                    const hasReview = isItemReviewed(delivery.orderID._id, item.productID);
                                                    const itemReviews = reviews[delivery.orderID._id]?.filter(r => r.cakeId === item.productID) || [];

                                                    return (
                                                        <div key={idx} className="bg-white rounded-xl p-4 border border-neutral-100">
                                                            
                                                            {/* Item Info */}
                                                            <div className="flex gap-4 mb-6">
                                                                {item.image && (
                                                                    <img 
                                                                        src={item.image} 
                                                                        alt={item.name} 
                                                                        className="w-24 h-24 rounded-lg object-cover"
                                                                    />
                                                                )}
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div>
                                                                            <h4 className="font-bold text-sm uppercase">{item.name}</h4>
                                                                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-1">
                                                                                {item.itemType}
                                                                            </p>
                                                                        </div>
                                                                        {item.flavor && (
                                                                            <span className="text-[8px] bg-rose-100 text-rose-600 px-2 py-1 rounded font-bold uppercase">
                                                                                {item.flavor}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    {item.weight && (
                                                                        <p className="text-[9px] text-neutral-400 uppercase tracking-wide">
                                                                            Weight: {item.weight}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs font-bold mt-2">Rs. {item.price}</p>
                                                                </div>
                                                            </div>

                                                            {/* Review Form or Existing Review */}
                                                            {!hasReview ? (
                                                                <div className="space-y-4 border-t border-neutral-100 pt-4">
                                                                    <div>
                                                                        <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest block mb-2">
                                                                            ⭐ Rate this {item.itemType}
                                                                        </label>
                                                                        <div className="flex gap-2">
                                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                                <button
                                                                                    key={star}
                                                                                    onClick={() => setReviewForm({
                                                                                        ...reviewForm,
                                                                                        orderId: delivery.orderID._id,
                                                                                        cakeId: item.productID,
                                                                                        itemName: item.name,
                                                                                        rating: star
                                                                                    })}
                                                                                    className={`text-2xl transition-transform hover:scale-110 ${
                                                                                        (reviewForm.orderId === delivery.orderID._id && 
                                                                                         reviewForm.cakeId === item.productID && 
                                                                                         reviewForm.rating >= star) 
                                                                                            ? "text-yellow-400" 
                                                                                            : "text-neutral-300"
                                                                                    }`}
                                                                                >
                                                                                    ★
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    {reviewForm.orderId === delivery.orderID._id && reviewForm.cakeId === item.productID && (
                                                                        <div className="space-y-2">
                                                                            <textarea
                                                                                placeholder="Share your experience..."
                                                                                value={reviewForm.comment}
                                                                                onChange={(e) => setReviewForm({
                                                                                    ...reviewForm,
                                                                                    comment: e.target.value
                                                                                })}
                                                                                className="w-full p-3 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                                                                                rows="3"
                                                                            />
                                                                            <button
                                                                                onClick={() => handleReviewSubmit(
                                                                                    delivery.orderID._id,
                                                                                    item.productID,
                                                                                    item.name
                                                                                )}
                                                                                disabled={submitting}
                                                                                className="w-full bg-rose-500 text-white font-bold py-2 rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                                                            >
                                                                                <Send size={16} />
                                                                                {submitting ? "Submitting..." : "Submit Review"}
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <div className="border-t border-neutral-100 pt-4">
                                                                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-3">✓ Your Review</p>
                                                                    {itemReviews.map((review) => (
                                                                        <div key={review._id} className="bg-yellow-50 rounded-lg p-3">
                                                                            <div className="flex justify-between items-start mb-2">
                                                                                <div className="flex gap-1">
                                                                                    {[...Array(5)].map((_, i) => (
                                                                                        <Star 
                                                                                            key={i}
                                                                                            size={14} 
                                                                                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                                                                                        />
                                                                                    ))}
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleDeleteReview(review._id)}
                                                                                    className="text-neutral-400 hover:text-rose-500 transition-colors"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                            <p className="text-[11px] text-neutral-700">{review.comment}</p>
                                                                            <p className="text-[8px] text-neutral-400 mt-2 uppercase tracking-wide">
                                                                                {new Date(review.createdAt).toLocaleDateString()}
                                                                            </p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-neutral-400 text-sm">No items in this order</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Your Reviews Summary */}
                {userReviews.length > 0 && (
                    <div className="bg-white rounded-[2rem] border border-neutral-100 p-8">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight mb-6">
                            Your Reviews ({userReviews.length})
                        </h2>
                        <div className="grid gap-4">
                            {userReviews.map((review) => (
                                <div key={review._id} className="border border-neutral-100 rounded-lg p-4 hover:bg-neutral-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-bold uppercase text-sm">{review.cakeId?.name}</h4>
                                            <div className="flex gap-1 my-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i}
                                                        size={14} 
                                                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-200"}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-neutral-600">{review.comment}</p>
                                            <p className="text-[8px] text-neutral-400 mt-2 uppercase tracking-wide">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 text-center space-y-2">
                    <p className="text-[9px] font-black text-neutral-300 uppercase tracking-[0.4em] animate-pulse">
                        • Helping Others Choose Perfect Cakes •
                    </p>
                    <p className="text-[7px] font-bold text-neutral-200 uppercase tracking-widest font-poppins">
                        Cake Ordering System v2.0
                    </p>
                </div>
            </div>
        </div>
    );
}
