import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, MapPin, Loader2, CheckCircle, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../utils/meadiaUpload";

export default function DriverDashboard() {
    const [tasks, setTasks] = useState([]);
    const [isUpdating, setIsUpdating] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Auth & Role Validation Logic
    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        
        if (!token) {
            navigate('/login');
            return;
        }

        // Check if user is driver
        if (role === "driver") {
            setIsLoading(false);
            fetchTasks();
        } else {
            toast.error("Access Denied: Drivers only");
            navigate("/login");
        }
    }, [navigate]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/deliveries/my-tasks`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (error) { 
            toast.error("Failed to load tasks"); 
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleUploadProof = async (e, taskId) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUpdating(taskId);
            toast.loading("Uploading Proof...", { id: "delivery" });

            // 1. Upload to Supabase
            const imageUrl = await uploadFile(file);

            // 2. Update backend
            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/deliveries/driver-update/${taskId}`, {
                imageUrl: imageUrl 
            }, { 
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } 
            });

            toast.success("Proof uploaded successfully!", { id: "delivery" });
            fetchTasks(); 
        } catch (error) { 
            toast.error("Upload failed", { id: "delivery" }); 
        } finally { 
            setIsUpdating(null); 
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-rose-500" size={40} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 py-10">
            <header className="mb-6 flex items-center justify-between rounded-2xl bg-black p-5 text-white">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold italic">Driver Portal</h1>
                    <span className="text-[10px] text-gray-400">Authenticated Access Only</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="bg-rose-500 px-3 py-1 text-[10px] font-black rounded-full">{tasks.length} Active</span>
                    <button onClick={handleLogout} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <LogOut size={18} className="text-white" />
                    </button>
                </div>
            </header>

            <div className="space-y-4">
                {tasks.map(task => (
                    <div key={task._id} className="rounded-3xl border border-white bg-white p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-black text-neutral-400 italic">#{task._id.slice(-8).toUpperCase()}</span>
                            <span className="bg-amber-100 px-2 py-1 text-[10px] font-bold text-amber-600 rounded-lg uppercase">{task.deliveryStatus}</span>
                        </div>

                        <div className="flex items-start gap-3 text-neutral-700 mb-6">
                            <MapPin size={18} className="text-rose-500 mt-1 shrink-0" />
                            <div className="w-full">
                                <p className="text-sm font-bold mb-3">Delivery Details</p>
                                
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Customer Name</p>
                                        <p className="text-sm font-bold text-gray-800">{task.customerName}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Phone</p>
                                        <p className="text-sm font-bold text-gray-800">{task.customerPhone}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold">Delivery Address</p>
                                        <p className="text-sm font-bold text-gray-800">{task.customerAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <input type="file" accept="image/*" id={`file-${task._id}`} className="hidden" 
                            onChange={(e) => handleUploadProof(e, task._id)} disabled={isUpdating === task._id} />

                        {task.image ? (
                            <div className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-black uppercase text-emerald-600 bg-emerald-50 border-2 border-emerald-100 italic text-sm">
                                <CheckCircle size={18} /> Proof Uploaded
                            </div>
                        ) : (
                            <label htmlFor={`file-${task._id}`} 
                                className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-4 font-black uppercase text-white transition-all active:scale-95 ${
                                    isUpdating === task._id ? "bg-gray-400" : "bg-black shadow-lg"
                                }`}>
                                {isUpdating === task._id ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                                {isUpdating === task._id ? "Processing..." : "Upload Proof"}
                            </label>
                        )}
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="text-center py-20 text-gray-400 font-medium">
                        No delivery tasks assigned yet.
                    </div>
                )}
            </div>
        </div>
    );
}