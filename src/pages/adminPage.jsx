import { Routes, Route, useNavigate, Link, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
    LayoutDashboard, ShieldCheck, Home, LogOut, Cake, ShoppingBag, Users, CreditCard, Puzzle, Settings, Bell
} from "lucide-react";

// Pages
import AdminCakePage from "./admin/adminCakePage";
import AdminCakeAddPage from "./admin/adminCakeAddPage";
import AdminCakeUpdatePage from "./admin/adminCakeUpadate";
import AdminAccesoriespage from "./admin/adminAccesoriespage";
import AdminAcessoriesAddpage from "./admin/adminAcessoriesAddpage";
import AdminAceesororiesUpadtepage from "./admin/adminAceesororiesUpadtepage";
import AdminOrderPage from "./admin/AdminOrderPage";
import AdminUserPage from "./admin/adminUserPage";
import AdminPaymentDashboard from "./admin/AdminPaymentDashboard";
import AdminFeedback from "./admin/AdminFeedbackPage";
import AdminDeliveryPage from "./admin/AdminDeliveryPage";

export default function AdminPage() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then((response) => {
            const userData = response.data;
            if (userData && userData.role === "admin") {
                setUser(userData);
                setIsLoading(false);
            } else {
                navigate("/");
            }
        }).catch(() => navigate("/login"));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    if (isLoading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FDFDFD]">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-[#00AEEF] animate-spin"></div>
                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#00AEEF]" size={24} />
            </div>
            <p className="mt-6 text-gray-500 font-medium tracking-widest uppercase text-[10px]">Authenticating Admin</p>
        </div>
    );

    const TopNavLink = ({ to, icon, label }) => {
        const isActive = to === "/admin" 
            ? location.pathname === "/admin" 
            : location.pathname.startsWith(to);

        return (
            <Link to={to} className={`relative group flex items-center gap-2.5 px-6 py-2.5 rounded-2xl transition-all duration-300 ${
                isActive 
                ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}>
                <span className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                    {React.cloneElement(icon, { size: 18 })}
                </span>
                <span className="text-[12px] font-bold tracking-tight">{label}</span>
                {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#00AEEF] rounded-full"></span>
                )}
            </Link>
        );
    };

    return (
        <div className="w-full h-screen flex flex-col overflow-hidden bg-[#FAFBFC] font-[Inter]">
            
            {/* Header Navigation */}
            <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-xl z-50 border-b border-gray-100/80 px-8 flex items-center">
                <div className="w-full flex items-center justify-between">
                    
                    {/* Brand Section */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-gray-200 rotate-3">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="hidden xl:block">
                            <h2 className="font-[Playfair_Display] text-gray-900 font-black text-lg leading-none">Management</h2>
                            <p className="text-[10px] text-[#00AEEF] font-black tracking-[0.3em] uppercase mt-1">Online Cakes</p>
                        </div>
                    </div>

                    {/* Links Section - Center */}
                    <div className="flex-1 flex justify-center px-8">
                        <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-[2rem] border border-gray-100 overflow-x-auto no-scrollbar max-w-full">
                            <TopNavLink to="/admin" icon={<LayoutDashboard />} label="Overview" />
                            <TopNavLink to="/admin/users" icon={<Users />} label="Users" />
                            <TopNavLink to="/admin/cakes" icon={<Cake />} label="Cakes" />
                            <TopNavLink to="/admin/accessories" icon={<Puzzle />} label="Accessories" />
                            <TopNavLink to="/admin/orders" icon={<ShoppingBag />} label="Orders" />
                            <TopNavLink to="/admin/payments" icon={<CreditCard />} label="Payments" />
                            <TopNavLink to="/admin/feedback" icon={<Bell />} label="Feedback" />
                            <TopNavLink to="/admin/delivery" icon={<Settings />} label="Delivery" />
                        </div>
                    </div>

                    {/* Action Section - Right */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden md:flex items-center gap-2 mr-4 text-right">
                            <p className="text-[11px] font-bold text-gray-900 leading-none">{user?.firstName} {user?.lastName}</p>
                            <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">Verified Admin</p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white p-1 rounded-full border border-gray-100 shadow-sm">
                            <Link to="/" className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#00AEEF] hover:bg-blue-50 rounded-full transition-all">
                                <Home size={20} />
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-500 rounded-full hover:bg-rose-500 hover:text-white transition-all duration-500"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden pt-24">
                <main className="flex-1 overflow-y-auto p-8 lg:p-16 custom-scrollbar">
                    <div className="max-w-[1400px] mx-auto">
                        <Routes>
                            <Route path="/cakes" element={<AdminCakePage />} />
                            <Route path="/cakes/add" element={<AdminCakeAddPage />} />
                            <Route path="/cakes/edit/:id" element={<AdminCakeUpdatePage />} />
                            <Route path="/accessories" element={<AdminAccesoriespage />} />
                            <Route path="/accessories/add" element={<AdminAcessoriesAddpage />} />
                            <Route path="/accessories/edit/:id" element={<AdminAceesororiesUpadtepage />} />
                            <Route path="/orders" element={<AdminOrderPage />} />
                            <Route path="/users" element={<AdminUserPage />} />
                            <Route path="/payments" element={<AdminPaymentDashboard />} />
                            <Route path="/feedback" element={<AdminFeedback />} />
                            <Route path="/delivery" element={<AdminDeliveryPage />} />
                            
                            <Route path="/" element={
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="h-[1px] w-8 bg-[#00AEEF]"></div>
                                        <span className="text-[11px] font-black text-[#00AEEF] uppercase tracking-[0.4em]">Control Center</span>
                                    </div>
                                    <h1 className="text-5xl md:text-6xl font-[Playfair_Display] font-black text-gray-900 italic leading-tight">
                                        Welcome back, <br />
                                        <span className="text-[#00AEEF] not-italic font-[Inter] tracking-tighter">{user?.firstName}</span>
                                    </h1>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                                        <div className="p-10 bg-white rounded-[3rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,174,239,0.05)] transition-all duration-500 group">
                                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#00AEEF] mb-8 group-hover:scale-110 transition-transform">
                                                <LayoutDashboard size={24} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Health Check</h3>
                                            <p className="text-gray-500 leading-relaxed font-medium italic">"System nodes are responding within normal parameters. 100% uptime maintained."</p>
                                        </div>
                                        {/* තව Cards මෙහි එක් කරන්න */}
                                    </div>
                                </div>
                            } />
                        </Routes>
                    </div>
                </main>
            </div>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: #E5E7EB; 
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }

                @font-face {
                    font-family: 'Inter';
                    src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                }
            `}</style>
        </div>
    );
}