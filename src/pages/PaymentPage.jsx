import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    CreditCard, Landmark, Truck, Upload, 
    CheckCircle, AlertCircle, Loader2, ArrowLeft,
    ShieldCheck, Banknote, Sparkles
} from "lucide-react";
// Provide the path to your Supabase file here
import { uploadFile } from "../utils/meadiaUpload"; 

export default function PaymentPage() {
    const { state } = useLocation(); 
    const navigate = useNavigate();
    
    const [method, setMethod] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [receiptFile, setReceiptFile] = useState(null); // Keep the full file object
    const [referenceNumber, setReferenceNumber] = useState("");
    const [paymentExists, setPaymentExists] = useState(false);

    const orderID = state?.orderID;
    const totalAmount = state?.totalAmount || 0;

    useEffect(() => {
        const checkExistingPayment = async () => {
            if (!orderID) return;
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/payments/my-payments`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data && response.data.success) {
                    const exists = response.data.data.some(p => {
                        const pid = typeof p.orderID === 'object' ? p.orderID?._id : p.orderID;
                        return pid === orderID;
                    });
                    if (exists) {
                        setPaymentExists(true);
                    }
                }
            } catch (err) {
                console.error("Failed to check existing payments");
            }
        };
        checkExistingPayment();
    }, [orderID]);

    if (!orderID) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-neutral-100 text-center max-w-md">
                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle size={40} className="text-rose-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No Active Order</h2>
                    <p className="text-neutral-500 mb-8">We couldn't find any order details. Please try again.</p>
                    <button onClick={() => navigate("/cakes")} className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-rose-500 transition-all">
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    const handlePaymentSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        try {
            let finalReceiptUrl = null;

            // 1. If bank transfer is selected and receipt exists, upload to Supabase
            if (method === 'Bank Transfer') {
                if (!receiptFile || !referenceNumber) {
                    toast.error("Please provide both reference number and receipt image.");
                    setLoading(false);
                    return;
                }
                
                const uploadToast = toast.loading("Uploading your receipt to secure storage...");
                try {
                    finalReceiptUrl = await uploadFile(receiptFile);
                    toast.success("Receipt uploaded successfully!", { id: uploadToast });
                } catch (err) {
                    toast.error("Failed to upload receipt. Please try again.", { id: uploadToast });
                    setLoading(false);
                    return;
                }
            }

            // 2. Send data to backend
            const paymentData = {
                orderID,
                paymentMethod: method,
                amount: totalAmount,
                referenceNumber: referenceNumber || "N/A",
                receiptImage: finalReceiptUrl, // This should be the Supabase URL
            };

            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/payments/submit`, 
                paymentData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Payment successful! Happy Baking!");
                navigate("/my-payments");
            }
        } catch (error) {
            console.error("Payment Error:", error);
            toast.error(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="bg-[#FDF8F0] min-h-screen py-12 px-4 sm:px-6 ">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-neutral-400 hover:text-black mb-4 transition-all">
                            <div className="p-2 bg-white rounded-full shadow-sm group-hover:bg-neutral-100"><ArrowLeft size={16} /></div>
                            <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                        </button>
                        <h1 className="text-4xl md:text-5xl font-serif font-black italic text-neutral-900">
                            Secure <span className="text-rose-500">Checkout</span>
                        </h1>
                    </div>
                    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-neutral-100 flex items-center gap-6">
                        <div className="w-14 h-14 bg-rose-500 rounded-3xl flex items-center justify-center text-white shadow-lg"><Banknote size={28} /></div>
                        <div>
                            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">Payable Amount</p>
                            <h2 className="text-3xl font-black text-neutral-900">LKR.{totalAmount.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Method Selection */}
                    <div className="lg:col-span-2 space-y-4">
                        <div 
                            onClick={() => !paymentExists && setMethod('Cash on Delivery')} 
                            className={`p-8 rounded-[2.5rem] border-2 transition-all 
                                ${paymentExists ? 'opacity-50 cursor-not-allowed border-white bg-white/50' : 'cursor-pointer'}
                                ${method === 'Cash on Delivery' ? 'border-rose-500 bg-white shadow-xl' : (!paymentExists && 'border-white bg-white/50')}
                            `}
                        >
                            <Truck size={32} className={method === 'Cash on Delivery' ? 'text-rose-500' : 'text-neutral-400'} />
                            <h3 className="text-xl font-bold mt-4">Cash on Delivery</h3>
                        </div>

                        <div 
                            onClick={() => !paymentExists && setMethod('Bank Transfer')} 
                            className={`p-8 rounded-[2.5rem] border-2 transition-all 
                                ${paymentExists ? 'opacity-50 cursor-not-allowed border-white bg-white/50' : 'cursor-pointer'}
                                ${method === 'Bank Transfer' ? 'border-rose-500 bg-white shadow-xl' : (!paymentExists && 'border-white bg-white/50')}
                            `}
                        >
                            <Landmark size={32} className={method === 'Bank Transfer' ? 'text-rose-500' : 'text-neutral-400'} />
                            <h3 className="text-xl font-bold mt-4">Bank Transfer</h3>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="lg:col-span-3">
                        {paymentExists ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-rose-50 border-2 border-rose-200 rounded-[3rem] text-center">
                                <ShieldCheck size={64} className="text-emerald-500 mb-4" />
                                <h3 className="text-2xl font-bold text-neutral-800 mb-2">Payment Already Initiated</h3>
                                <p className="text-neutral-500 max-w-sm mb-8 relative">
                                    We have already recorded a payment log for Order ID <span className="font-bold text-neutral-900 border-b-2 border-rose-300">#{orderID}</span>. Multiple payments are not allowed.
                                </p>
                                <button onClick={() => navigate("/my-payments")} className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:bg-rose-500 transition-all uppercase tracking-widest text-xs">
                                    View My Payments
                                </button>
                            </div>
                        ) : !method ? (
                            <div className="h-full flex flex-col items-center justify-center p-12 bg-white/40 border-2 border-dashed border-neutral-200 rounded-[3rem] text-neutral-400 italic">
                                <CreditCard size={48} className="mb-4 opacity-20" />
                                <p>Please select a payment method</p>
                            </div>
                        ) : (
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-neutral-100">
                                {method === 'Cash on Delivery' ? (
                                    <div className="text-center">
                                        <ShieldCheck size={64} className="text-green-500 mx-auto mb-6" />
                                        <h3 className="text-2xl font-bold mb-4">Confirm Your Order</h3>
                                        <p className="text-neutral-500 mb-8 text-sm">You will pay ${totalAmount.toFixed(2)} upon delivery.</p>
                                        <button onClick={handlePaymentSubmit} disabled={loading} className="w-full py-5 bg-black text-white rounded-2xl font-black hover:bg-rose-500 transition-all">
                                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Confirm Order"}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handlePaymentSubmit} className="space-y-6">
                                        <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100">
                                            <p className="text-xs font-bold text-rose-900 mb-2 uppercase">Bank Details</p>
                                            <p className="text-sm font-bold text-neutral-700 underline">Sampath Bank: 1029 4857 2938</p>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-2 block mb-2">Ref Number</label>
                                            <input type="text" required className="w-full p-4 bg-neutral-50 rounded-2xl border-none outline-rose-200" placeholder="TXN-XXXXXX" value={referenceNumber} onChange={(e) => setReferenceNumber(e.target.value)} />
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-black uppercase text-neutral-400 ml-2 block mb-2">Upload Slip</label>
                                            <label className="flex flex-col items-center justify-center w-full h-32 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-200 cursor-pointer hover:bg-rose-50 transition-all">
                                                <Upload size={24} className="text-rose-500 mb-2" />
                                                <span className="text-xs text-neutral-400">{receiptFile ? receiptFile.name : "Select Image"}</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setReceiptFile(e.target.files[0])} />
                                            </label>
                                        </div>

                                        <button type="submit" disabled={loading} className="w-full py-5 bg-black text-white rounded-2xl font-black hover:bg-rose-500 transition-all">
                                            {loading ? <Loader2 className="animate-spin mx-auto" /> : "Securely Submit"}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}