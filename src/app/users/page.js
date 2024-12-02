'use client';
import { useState, useEffect, useRef, useContext } from "react";
import { Mail, ArrowLeft, Sparkles, User, Lock, CheckCircle, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";
import PopUpError from "../components/PopUpError";

export default function CreateUser() {
  const {user} = useContext(ResultsContext);
   const [errorMessage, setErrorMessage] = useState("");
   const [showError, setShowError] = useState(false);
  const [userData, setUserData] = useState([]);
  const router = useRouter();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);


  const getUser = async () => {
     try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/users` , {credentials: "include"});
        if(response.ok){
            const data = await response.json();
            console.log(data);
            
            setUserData(setUserData);
            return ;
        }
        setErrorMessage("something went wrong");
        setShowError(true);
        
     }catch(error){
        setErrorMessage(error.error,"somthing went wrong");
        setShowError(true);
     }

  }

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
    getUser();
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if(!user.userData.role === 'admin'){
    router.push('/login');
  }
  else{
    return (
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
              onClick={() => router.back()}
              className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
    
            <div className="w-full max-w-md relative">
                {/* user data display */}
                {userData?.map((user , i) => (
                    <div className="flex items-center justify-center mb-6" key={user[i]}>
                        <UserPlus className="w-12 h-12 text-blue-500 animate-pulse" />
                        <span>{user?.name}</span>
                    </div>
                ))}
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

          <PopUpError  isOpen={showError} onClose={() => setShowError(false)} message={errorMessage} />
        </div>
      );
  }
}