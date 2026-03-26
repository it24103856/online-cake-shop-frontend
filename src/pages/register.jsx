import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { uploadFile } from '../utils/meadiaUpload';
import { BiCamera } from "react-icons/bi";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    }

    async function HandleRegister(e) {
        if (e) e.preventDefault();
        if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
        
        setIsLoading(true);
        try {
            let imageUrl = "/default-profile.png";
            if (imageFile) {
                const uploadToast = toast.loading("Setting up profile...");
                const uploadedUrl = await uploadFile(imageFile);
                if (uploadedUrl) imageUrl = uploadedUrl;
                toast.dismiss(uploadToast);
            }

            await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/create", {
                firstName, lastName, email, password, image: imageUrl, address, phone
            });

            toast.success("Welcome to the Sweet Journey!");
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="w-full min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden px-6 py-10">
            
            {/* Login Page එකේ වගේම Background එක */}
            <div 
                className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat grayscale-[0.5] scale-110"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000&auto=format&fit=crop')" }}
            ></div>

            {/* Luxury Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">

                {/* Left Side: Brand Identity */}
                <div className="text-center md:text-left max-w-[550px]">
                    <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                        <div className="w-12 h-12 bg-[#00AEEF] rounded-full flex items-center justify-center font-black text-black italic text-xl shadow-[0_0_20px_rgba(0,174,239,0.5)]">C</div>
                        <span className="text-white font-black uppercase tracking-[0.5em] text-sm">Crave Luxury</span>
                    </div>
                    
                    <h1 className="text-white font-black text-5xl md:text-7xl leading-[1] italic uppercase tracking-tighter drop-shadow-2xl">
                        Start the <br /> 
                        <span className="text-[#00AEEF]">Journey.</span>
                    </h1>
                    
                    <p className="mt-6 text-gray-400 text-lg font-light tracking-[0.2em] uppercase italic max-w-md">
                        "Elevating every celebration with a touch of antigravity elegance."
                    </p>
                </div>

                {/* Right Side: Login එකේ විදිහටම Glassmorphism Form එක */}
                <div className="w-full max-w-[480px] relative">
                    <form onSubmit={HandleRegister} className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-10 flex flex-col items-center">
                        
                        <div className="w-full mb-6">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Sign Up</h2>
                            <div className="h-1 w-12 bg-[#00AEEF] mt-2"></div>
                        </div>

                        {/* Profile Image Picker */}
                        <div className="relative mb-8 group">
                            <div className="w-24 h-24 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center shadow-2xl">
                                {preview ? (
                                    <img src={preview} alt="preview" className="w-full h-full object-cover transition-all duration-500" />
                                ) : (
                                    <div className="text-center text-gray-600 text-[10px] font-bold uppercase tracking-widest">Photo</div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer hover:bg-[#00AEEF] transition-all shadow-xl">
                                <BiCamera size={16} />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex gap-3">
                                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder="FIRST NAME" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                                <input required value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder="LAST NAME" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                            </div>
                            
                            <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="EMAIL ADDRESS" className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                            
                            <div className="flex gap-3">
                                <input required value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" placeholder="MOBILE" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                                <input required value={address} onChange={(e) => setAddress(e.target.value)} type="text" placeholder="CITY" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                            </div>

                            <div className="flex gap-3">
                                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="PASSWORD" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                                <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="CONFIRM" className="w-1/2 p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-white text-xs tracking-widest placeholder:text-gray-600" />
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-black py-4 rounded-full hover:bg-[#00AEEF] hover:text-white transition-all duration-500 mt-8 uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95">
                            {isLoading ? "Wait..." : "Create Account"}
                        </button>

                        <p className="text-gray-500 mt-6 text-[10px] uppercase tracking-[0.2em]">
                            Member? <Link to="/login" className="text-white font-black hover:text-[#00AEEF] underline">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}