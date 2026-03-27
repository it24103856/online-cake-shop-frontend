import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRedirect = (role) => {
    const userRole = role.toLowerCase();
    
    if (userRole === "admin") {
      navigate("/admin");
    } else if (userRole === "driver") {
      navigate("/driver/dashboard");
    } else {
      navigate("/");
    }
  };

  const GoogleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: (response) => {
      setIsLoading(true);
      axios.post(import.meta.env.VITE_BACKEND_URL + "/users/google-login", {
        token: response.access_token,
      }).then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("role", res.data.role);

        handleRedirect(res.data.role);
        
        toast.success("Welcome to the Sweet Journey!");
      }).catch((err) => {
        toast.error("Google Login Failed");
      }).finally(() => { setIsLoading(false); });
    },
    onError: () => { toast.error("Google Login Failed"); }
  });

  async function login(e) {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("role", res.data.role);
      
      handleRedirect(res.data.role);

      toast.success("Ready for something sweet?");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="w-full min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden px-6 ">
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat grayscale-[0.5] scale-110"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-16">

        <div className="text-center md:text-left max-w-[600px]">
          <div className="flex items-center gap-3 mb-8 justify-center md:justify-start">
             <div className="w-12 h-12 bg-[#00AEEF] rounded-full flex items-center justify-center font-black text-black italic">C</div>
             <span className="text-white font-black uppercase tracking-[0.5em] text-sm">Crave Luxury</span>
          </div>
          
          <h1 className="text-white font-black text-6xl md:text-8xl leading-[0.9] italic uppercase tracking-tighter drop-shadow-2xl">
            Bake the <br /> 
            <span className="text-[#00AEEF]">Impossible.</span>
          </h1>
          
          <p className="mt-8 text-gray-400 text-lg font-light tracking-[0.2em] uppercase italic max-w-md">
            "Elevating every celebration with a touch of antigravity elegance."
          </p>
        </div>

        <div className="w-full max-w-[440px] relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00AEEF]/20 blur-[80px] rounded-full"></div>
            
            <form onSubmit={login} className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] p-12 flex flex-col">
              
              <div className="mb-10">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Sign In</h2>
                <div className="h-1 w-12 bg-[#00AEEF] mt-2"></div>
              </div>

              <div className="w-full space-y-5">
                <div className="group">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em] ml-2 mb-2 block font-bold">Account Email</label>
                    <input
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="email@example.com"
                      className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#00AEEF]/50 transition-all duration-500 outline-none text-white font-light tracking-wide"
                    />
                </div>

                <div className="group">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.3em] ml-2 mb-2 block font-bold">Password</label>
                    <input
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="••••••••"
                      className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 focus:border-[#00AEEF]/50 transition-all duration-500 outline-none text-white font-light tracking-wide"
                    />
                </div>
              </div>

              <div className="w-full flex justify-end mt-4 mb-8">
                <Link to="/forget-password" name="forgot" className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-[#00AEEF] transition-all">
                  Recover Access?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-black py-5 rounded-full hover:bg-[#00AEEF] hover:text-white active:scale-[0.95] transition-all duration-500 uppercase text-xs tracking-[0.2em] shadow-xl"
              >
                {isLoading ? "Verifying..." : "Enter Experience"}
              </button>

              <div className="w-full flex items-center gap-4 my-8">
                <div className="h-[1px] bg-white/10 flex-1"></div>
                <span className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">OR</span>
                <div className="h-[1px] bg-white/10 flex-1"></div>
              </div>

              <button
                onClick={() => GoogleLogin()}
                type="button"
                className="w-full flex items-center justify-center gap-4 bg-transparent border border-white/10 text-white py-4 rounded-full hover:bg-white/5 transition-all duration-500 font-bold uppercase text-[10px] tracking-[0.2em]"
              >
                <GrGoogle className="text-lg text-[#00AEEF]" />
                Continue with Google
              </button>

              <p className="text-gray-500 mt-10 text-center text-[10px] uppercase tracking-[0.2em]">
                New here?{" "}
                <Link to="/register" className="text-white font-black hover:text-[#00AEEF] underline underline-offset-4">
                  Create Profile
                </Link>
              </p>
            </form>
        </div>
      </div>
    </main>
  );
}