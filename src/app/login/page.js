'use client';
import { useState, useEffect, useRef, useContext } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";
import PopUpError from "../components/PopUpError";




export default function Login() {
  const { user, setUser } = useContext(ResultsContext);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({ email: "", password: "" });
  const containerRef = useRef(null);
 
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setGradientPosition({ x, y });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  


const logIn = async () => {
  try{
    const response = await fetch("http://158.220.87.133/api/v1/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formState.email,
        password: formState.password,
      }),
      credentials: "include",
    })
    if(response.ok){
      const data = await response.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/project");
    }else{
      setErrorMessage("Invalid email or password");
      setShowError(true);
    }
  }catch(error){
    console.log(error);
  }

};

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    logIn()
  };

 if(user?.userData?.email){
   router.push("/project");
 }  else{ return (
  <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden" ref={containerRef}>
    {/* Animated background gradient */}
    <div
      className="absolute inset-0 opacity-30 transition-opacity duration-1000"
      style={{
        background: `
          radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
          rgb(59, 130, 246) 0%,
          rgb(37, 99, 235) 25%,
          rgb(29, 78, 216) 50%,
          transparent 100%),
          radial-gradient(circle at ${100 - gradientPosition.x}% ${100 - gradientPosition.y}%,
          rgb(147, 51, 234) 0%,
          rgb(126, 34, 206) 25%,
          rgb(107, 33, 168) 50%,
          transparent 100%)
        `
      }}
    />

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-10 w-screen h-screen animate-pulse"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}
    />

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-500 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${5 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>

    <div className="relative flex min-h-screen items-center justify-center p-6">
      {/* Back button */}
      <button 
        onClick={() => {router.push(`${process.env.NEXT_PUBLIC_BASE_URL}`)}}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      {/* Login form container */}
      <div className="w-full max-w-md relative">
        <div className="absolute -top-8 -left-8">
          <Sparkles className="text-blue-500 animate-pulse" />
        </div>
        
        <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email input */}
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                value={formState.email}
                required
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Password input */}
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formState.password}
                required
                onChange={(e) => setFormState({ ...formState, password: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <button onClick={()=>router.push('/reset')} type="button" className="text-sm text-gray-400 hover:text-white transition-colors">
                Forgot your password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
            >
              Sign In
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
            </button>

            {/* Sign up link 
            <div className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <button type="button" className="text-blue-500 hover:text-blue-400 transition-colors">
                Sign up now
              </button>
            </div>
            */}
            
          </form>
        </div>
      </div>
    </div>

    {/* Mouse follower */}
    <div
      className="pointer-events-none fixed w-8 h-8 rounded-full border-2 border-blue-500/50 transition-all duration-200 ease-out"
      style={{
        left: mousePosition.x - 16,
        top: mousePosition.y - 16,
        transform: 'translate(0, 0)',
      }}
    />
    <PopUpError isOpen={showError} onClose={() => setShowError(false)} message={errorMessage} />
  </div>
);
 }
}