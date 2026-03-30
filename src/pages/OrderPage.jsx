import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
    Loader2, CreditCard, Truck, User, Phone, MapPin, 
    ShoppingBag, Trash2, Plus, Minus, Search, X 
} from "lucide-react";
import Footer from "../components/Footer";

export default function OrderPage() {
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [allItems, setAllItems] = useState([]);
    
    const [formData, setFormData] = useState({
        name: "", phone: "", city: "", address: "", notes: ""
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        if (savedCart.length === 0) {
            toast.error("Your cart is empty.");
            navigate("/shop");
        }
        setCart(savedCart);
        fetchAllProducts();
    }, [navigate]);

    const fetchAllProducts = async () => {
        try {
            const [cakesRes, accRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/cakes`),
                axios.get(`${import.meta.env.VITE_BACKEND_URL}/accessories`)
            ]);
            const combined = [
                ...(cakesRes.data.data || []).map(i => ({ ...i, type: 'Cake' })),
                ...(accRes.data.data || []).map(i => ({ ...i, type: 'Accessories' }))
            ];
            setAllItems(combined);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const updateQuantity = (id, delta) => {
        const updatedCart = cart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const removeItem = (id) => {
        const updatedCart = cart.filter(item => item._id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        if (updatedCart.length === 0) navigate("/shop");
    };

    const addToCartFromSearch = (item) => {
        const existing = cart.find(c => c._id === item._id);
        let newCart;
        if (existing) {
            newCart = cart.map(c => c._id === item._id ? { ...c, quantity: c.quantity + 1 } : c);
        } else {
            const itemWithType = { ...item, type: item.type || 'Cake', quantity: 1 };
            newCart = [...cart, itemWithType];
        }
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success(`${item.name} added!`);
    };

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const deliveryFee = 5.00;
    const total = subtotal + deliveryFee;

    const filteredSearch = useMemo(() => {
        return allItems.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, allItems]);

    const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // --- Main change is here ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const orderData = {
            customer: {
                name: formData.name,
                email: "customer@example.com", // Get user email here
                phone: formData.phone,
                address: `${formData.address}, ${formData.city}`
            },
            items: cart.map(item => ({
                productID: item._id,
                itemType: item.type === 'Accessory' || item.type === 'Accessories' ? 'Accessories' : 'Cake', 
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                image: item.Image?.[0] || item.image?.[0] || "",
                flavor: item.flavor || "Standard",
                weight: item.weight || "1kg"
            })),
            totalPrice: total,
            status: "pending",
            paymentMethod: 'Bank Transfer', // As default
            notes: formData.notes
        };

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/orders`, 
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Order details saved! Redirecting to payment...");
                
                // Remove cart from localStorage (order already saved)
                localStorage.removeItem("cart");

                // After successful order placement, navigate to Payment Page
                // Also send Order ID and Total Amount in state
                navigate("/payment", { 
                    state: { 
                        orderID: response.data.data._id, 
                        totalAmount: total 
                    } 
                });
            }
        } catch (error) {
            console.error("Order Submit Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Failed to save order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
        <main className="bg-[#FDF8F0] min-h-screen ">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif font-bold mb-10 text-neutral-900 italic">Checkout Details</h1>
                
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Shipping Form */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Truck className="text-rose-500" size={20} /> Shipping Information
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                <input type="text" name="name" placeholder="Recipient's Name" required className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-100 transition-all" onChange={handleInputChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                    <input type="tel" name="phone" placeholder="Phone Number" required className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-100 transition-all" onChange={handleInputChange} />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                    <input type="text" name="city" placeholder="City" required className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-100 transition-all" onChange={handleInputChange} />
                                </div>
                            </div>
                            <textarea name="address" placeholder="Detailed Street Address" rows="3" required className="w-full p-4 bg-neutral-50 rounded-2xl outline-none focus:ring-2 focus:ring-rose-100 transition-all" onChange={handleInputChange}></textarea>
                            <textarea name="notes" placeholder="Special instructions for the baker..." rows="2" className="w-full p-4 bg-neutral-50 rounded-2xl outline-none text-sm italic focus:ring-2 focus:ring-rose-100 transition-all" onChange={handleInputChange}></textarea>

                            <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-black text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-rose-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-neutral-200 disabled:bg-neutral-400">
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <CreditCard size={20} />}
                                Confirm & Pay ${total.toFixed(2)}
                            </button>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-neutral-100 sticky top-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ShoppingBag className="text-rose-500" size={20} /> Your Selection
                            </h2>
                            <button onClick={() => setIsAddModalOpen(true)} className="text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-500 px-4 py-2 rounded-full hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2">
                                <Plus size={14} /> Add Items
                            </button>
                        </div>
                        
                        <div className="space-y-6 mb-8 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 group">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-100">
                                        <img src={item.Image?.[0] || item.image?.[0]} className="w-full h-full object-cover" alt={item.name} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-neutral-800 leading-tight">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">{item.type === 'Accessories' ? 'Accessory' : 'Cake'}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center bg-neutral-50 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item._id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md text-neutral-400"><Minus size={12} /></button>
                                                <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item._id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded-md text-neutral-400"><Plus size={12} /></button>
                                            </div>
                                            <button onClick={() => removeItem(item._id)} className="text-neutral-300 hover:text-rose-500 transition-colors p-1"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                    <p className="font-black text-neutral-900">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-dashed pt-6 space-y-3">
                            <div className="flex justify-between text-neutral-500 text-sm"><span>Subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-neutral-500 text-sm font-medium italic"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                            <div className="flex justify-between text-2xl font-black pt-4 text-rose-500 border-t border-neutral-50">
                                <span className="uppercase text-xs tracking-[0.2em] self-center text-neutral-400">Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-neutral-100 flex justify-between items-center">
                            <h3 className="text-2xl font-serif font-bold italic">Add Extra Magic</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors"><X size={20}/></button>
                        </div>
                        <div className="p-6">
                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300" size={18} />
                                <input type="text" placeholder="Search cakes..." className="w-full pl-12 pr-4 py-4 bg-neutral-50 rounded-2xl outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            </div>
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredSearch.map(item => (
                                    <div key={item._id} className="flex items-center justify-between p-3 hover:bg-neutral-50 rounded-2xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <img src={item.Image?.[0] || item.image?.[0]} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                            <div>
                                                <p className="font-bold text-sm text-neutral-800">{item.name}</p>
                                                <p className="text-[10px] text-neutral-400 font-bold">${item.price}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => addToCartFromSearch(item)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Plus size={18} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </main>
        </>
        
    );
}
