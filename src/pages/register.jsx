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
    };

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
        <main className="w-full min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-10">

            {/* Background image — full opacity, clearly visible */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000&auto=format&fit=crop"
                    className="w-full h-full object-cover"
                    alt=""
                />
            </div>

            {/* Rose tint layer */}
            <div className="absolute inset-0 z-[1] bg-rose"></div>

            {/* Bottom fade for readability */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-rose-100/60 via-transparent to-transparent"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">

                {/* Left — Brand Identity */}
                <div className="text-center md:text-left max-w-[550px]">
                    <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-rose-500 italic text-xl shadow-lg">C</div>
                        <span className="text-white font-black uppercase tracking-[0.4em] text-sm drop-shadow-md">Crave Luxury</span>
                    </div>

                    <h1
                        className="font-black text-5xl md:text-7xl leading-[1] italic uppercase tracking-tighter drop-shadow-lg text-white"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Start the <br />
                        <span className="text-rose-100">Journey.</span>
                    </h1>

                    <p className="mt-6 text-white/90 text-lg font-light tracking-[0.15em] uppercase italic max-w-md drop-shadow">
                        "Elevating every celebration with a touch of antigravity elegance."
                    </p>

                    <div className="w-24 h-0.5 bg-white/60 mt-8 mx-auto md:mx-0"></div>
                </div>

                {/* Right — Frosted Glass Form Card */}
                <div className="w-full max-w-[480px]">
                    <form
                        onSubmit={HandleRegister}
                        className="bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_60px_rgba(244,63,94,0.15)] p-10 flex flex-col items-center"
                    >
                        <div className="w-full mb-6">
                            <p className="uppercase text-[10px] tracking-[0.4em] font-semibold text-rose-400 mb-2">New member</p>
                            <h2
                                className="text-3xl font-black text-[#1A1A1A] italic tracking-tighter"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                Sign Up
                            </h2>
                            <div className="h-1 w-12 bg-rose-400 mt-2 rounded-full"></div>
                        </div>

                        {/* Profile Image Picker */}
                        <div className="relative mb-8">
                            <div className="w-24 h-24 rounded-full border-2 border-dashed border-rose-300 overflow-hidden bg-rose-50/60 flex items-center justify-center shadow-md">
                                {preview ? (
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center text-rose-300 text-[9px] font-bold uppercase tracking-widest px-2">Add Photo</div>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-rose-500 hover:bg-rose-600 transition-colors p-2 rounded-full cursor-pointer shadow-md border-2 border-white">
                                <BiCamera size={16} className="text-white" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex gap-3">
                                <input required value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                    type="text" placeholder="FIRST NAME"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                                <input required value={lastName} onChange={(e) => setLastName(e.target.value)}
                                    type="text" placeholder="LAST NAME"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                            </div>

                            <input required value={email} onChange={(e) => setEmail(e.target.value)}
                                type="email" placeholder="EMAIL ADDRESS"
                                className="w-full p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                            />

                            <div className="flex gap-3">
                                <input required value={phone} onChange={(e) => setPhone(e.target.value)}
                                    type="tel" placeholder="MOBILE"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                                <input required value={address} onChange={(e) => setAddress(e.target.value)}
                                    type="text" placeholder="CITY"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                            </div>

                            <div className="flex gap-3">
                                <input required value={password} onChange={(e) => setPassword(e.target.value)}
                                    type="password" placeholder="PASSWORD"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                                <input required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                    type="password" placeholder="CONFIRM"
                                    className="w-1/2 p-4 rounded-xl bg-white/80 border border-rose-100 focus:border-rose-400 focus:bg-white transition-all duration-300 outline-none text-[#1A1A1A] text-xs tracking-widest placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#1A1A1A] text-white font-bold py-4 rounded-full hover:bg-rose-500 active:scale-[0.97] transition-all duration-500 mt-8 uppercase text-xs tracking-[0.2em] shadow-md"
                        >
                            {isLoading ? "Setting up..." : "Create Account"}
                        </button>

                        <p className="text-gray-500 mt-6 text-[10px] uppercase tracking-[0.2em]">
                            Member?{" "}
                            <Link to="/login" className="text-rose-500 font-black hover:text-rose-700 underline underline-offset-4">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}