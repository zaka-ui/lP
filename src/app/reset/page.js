"use client";
import { useState, useEffect, useRef } from "react";
import { Lock, ArrowLeft, Sparkles, Mail, KeyRound, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import PopUpError from "../components/PopUpError";
import PopUp from "../components/savePopup";

export default function PasswordReset() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1); // 1: email, 2: code verification, 3: new password
  const [formState, setFormState] = useState({
    email: "",
    verificationCode: "",
    newPassword: "",
    confirmPassword: ""
  });
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

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  const forgotPassword = async () => {
     try {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/forgotPassword`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           email: formState.email,
         })
       })
       if(response.ok){
         const data = await response.json();
         setErrorMessage(data.message)
         setShowPopup(true)
         setStep(step + 1);
         return ;
       }else{
        setErrorMessage("Invalid email");
        setShowError(true);
        return ;
       }
     } catch (error) {
        setErrorMessage(`erroc ${error.message}`);
        setShowError(true);
     }

  }
  const sendVerificationcode = async() => {
   try{
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/verifyResetToken`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({
         token: formState.verificationCode.trim(),
       })
     });
     if(response.ok) {
      const data = await response.json();
      console.log(data);
      setStep(step + 1);
      return;
     }else{
    setShowError(true);
     setErrorMessage("Invalid code please try again");
     }
     
   }catch(error){
     setErrorMessage(`erroc ${error.message}`);
     setShowError(true);
   }

  }
  

  const resetPassword = async() => {
     if(formState.newPassword === formState.confirmPassword && formState.newPassword.length > 8){
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/resetPassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: formState.verificationCode,
            password: formState.newPassword,
            confirmation : formState.confirmPassword
          })
        });
        if(response.ok) {
         const data = await response.json();
         router.push("/login");
         setFormState({
          email: "",
          verificationCode: "",
          newPassword: "",
          confirmPassword: ""
        });
         
         return ;
        }else{
          setShowError(true);
          setErrorMessage("Invalid code please try again");
        }
      
      }catch(error){
        setErrorMessage(`erroc ${error.message}`);
        setShowError(true);
      }
     }else{
      setErrorMessage("Passwords do not match or are too short");
      setShowError(true);
      return ;
     }
   }

const handleSubmit = async (e)=> {
    e.preventDefault();
    if (step === 1) {
      if (formState.email.trim().length === 0) {
        setErrorMessage("Please enter a valid email address.");
        setShowError(true);
        return;
      }else{
        if(step === 1){
          const firstStep = await forgotPassword();
        }
      }
    }else if(step === 2){
      console.log("click");
      await sendVerificationcode();        
    }
    else if(step === 3){
      resetPassword();
     // await resetPassword();
    }
    
  }

const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Reset Password
            </h2>
            <p className="text-gray-400 mb-6">
              Enter your email address and well send you a verification code.
            </p>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email address"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Enter Code
            </h2>
            <p className="text-gray-400 mb-6">
              We ve sent a verification code to {formState.email}
            </p>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Verification code"
                value={formState.verificationCode}
                onChange={(e) => setFormState({ ...formState, verificationCode: e.target.value })}
                className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              New Password
            </h2>
            <p className="text-gray-400 mb-6">
              Choose a new password for your account.
            </p>
            <div className="space-y-4">
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="New password"
                  value={formState.newPassword}
                  onChange={(e) => setFormState({ ...formState, newPassword: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={formState.confirmPassword}
                  onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white px-11 py-5 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </>
        );
    }
  };

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
          onClick={() => {router.back()}}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Login
        </button>

        {/* Reset form container */}
        <div className="w-full max-w-md relative">
          <div className="absolute -top-8 -left-8">
            <Sparkles className="text-blue-500 animate-pulse" />
          </div>
          
          <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 shadow-2xl">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-blue-500' : 'bg-gray-700'
                  } transition-colors`}>
                    {step > stepNumber ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      stepNumber
                    )}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-12 h-0.5 ${step > stepNumber ? 'bg-blue-500' : 'bg-gray-700'} transition-colors`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              {/* Submit button */}
              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
              >
                {step === 3 ? "Reset Password" : "Continue"}
                <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
              </button>
             {step > 1 ?  <button type="button" onClick={()=> {
                  if(step > 1){
                    setStep(step - 1)
                  }
              }} className="flex items-center gap-2 text-center text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                back to previos step
              </button> : ""}
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
      <PopUp isOpen={showPopup} onClose={() => setShowPopup(false)} message={errorMessage} />
    </div>
  );
}
