import { History, Plus, Menu, X } from "lucide-react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
const {ResultsContext} = require("../../context/result");

function Nav({newProject}) {
  const { user, setUser } = useContext(ResultsContext);
   const router = useRouter();
   const interSectionMobile = useRef();   
   const interSectionDesktop = useRef();
   const [isVisibleMobiel, setIsVisibleMobiel] = useState(false);
   const [isVisibleDesktop, setIsVisibleDesktop] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   useEffect(() => {       
     const mobielObserver = new IntersectionObserver((entries) => {       
       const enteri = entries[0];    
       console.log(enteri.isIntersecting);
          
       setIsVisibleMobiel(enteri.isIntersecting);     
       //setIsVisibleDesktop(enteri.isIntersecting);     
     });  
     const desktopObserver = new IntersectionObserver((entries) => {       
      const enteri = entries[0];    
      console.log(enteri.isIntersecting);
         
      setIsVisibleDesktop(enteri.isIntersecting);     
      //setIsVisibleDesktop(enteri.isIntersecting);     
    });       
     mobielObserver.observe(interSectionMobile.current);    
     desktopObserver.observe(interSectionDesktop.current);    
   }, [user]);       

   return (
     <>
       {/* Desktop Navigation */}
       <div 
         className={`
           hidden md:flex items-center justify-between 
           transition duration-1000 
           ${isVisibleDesktop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
         `} 
         ref={interSectionDesktop}
       >
         <div className="cursor-pointer" onClick={()=> router.push('/')}>
           <Image src={"/logo.png"} alt="logo" width={250} height={250} />
         </div>
         
         {user?.userData?.email ?
           <ul className="flex items-center justify-between gap-4">
             <li 
               className={`
                 flex gap-2 cursor-pointer text-white font-medium py-2 
                 ${newProject ? "" : "px-8"} 
                 rounded-lg transition-all duration-500 transform hover:scale-[1.1]
               `}
               onClick={()=> router.push('/history')}
             >
               <History className="w-5 h-5" />History
             </li>
               <li 
                 className="
                   flex gap-2 cursor-pointer text-white font-medium py-2 px-4 
                   rounded-lg transition-all duration-500 transform hover:scale-[1.05]
                   border-solid border-2 border-white
                 "
                 onClick={()=> router.push('/project')}
               >
                 <Plus className="w-5 h-5" />New Project
               </li>
             <li 
               className="
                 cursor-pointer border-solid border-2 border-indigo-500 
                 hover:border-transparent text-white font-medium 
                 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 
                 py-2 px-8 rounded-lg transition-all duration-500 
                 transform hover:scale-[1.1] shadow-lg
               "
               onClick={() => {
                 setUser({});
                 localStorage.removeItem("user");
               }}
             >
               Logout
             </li>
           </ul>
           :
           <ul className="flex items-center justify-between gap-4">
             <li 
               className="
                 cursor-pointer border-solid border-2 border-indigo-500 
                 hover:border-transparent text-white font-medium 
                 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 
                 py-2 px-8 rounded-lg transition-all duration-200 
                 transform hover:scale-[1.02] shadow-lg
               "
               onClick={() => router.push('/login')}
             >
               Login
             </li>
           </ul>
         }
       </div>

       {/* Mobile Navigation */}
       <div className="md:hidden relative">
         <div 
           className={`
             flex items-center justify-between transition duration-1000 
             ${isVisibleMobiel ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
           `}
           ref={interSectionMobile}
         >
           <div className="cursor-pointer" onClick={()=> router.push('/')}>
           <Image src={"/logo.png"} alt="logo" width={150} height={150} />
           </div>
           
           <button 
             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             className="text-white p-2"
           >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
           </button>
         </div>

         {isMobileMenuOpen && (
           <div className="absolute top-full left-0 w-full bg-black z-50">
             {user?.userData?.email ? (
               <ul className="flex flex-col items-center justify-between gap-4 p-4">
                 <li 
                   className={`
                     flex gap-2 cursor-pointer text-white font-medium py-2 
                     ${newProject ? "" : "px-8"} 
                     rounded-lg transition-all duration-500 transform hover:scale-[1.1]
                   `}
                   onClick={()=> {
                     router.push('/history');
                     setIsMobileMenuOpen(false);
                   }}
                 >
                   <History className="w-5 h-5" />History
                 </li>
                   <li 
                     className="
                       flex gap-2 cursor-pointer text-white font-medium py-2 px-8 
                       rounded-lg transition-all duration-500 transform hover:scale-[1.1]
                       
                     "
                     onClick={()=> {
                       router.push('/project');
                       setIsMobileMenuOpen(false);
                     }}
                   >
                     <Plus className="w-5 h-5" />New Project
                   </li>
                 <li 
                   className="
                     cursor-pointer border-solid border-2 border-indigo-500 
                     hover:border-transparent text-white font-medium 
                     hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 
                     py-2 px-8 rounded-lg transition-all duration-500 
                     transform hover:scale-[1.1] shadow-lg
                   "
                   onClick={() => {
                     setUser({});
                     localStorage.removeItem("user");
                     setIsMobileMenuOpen(false);
                   }}
                 >
                   Logout
                 </li>
               </ul>
             ) : (
               <ul className="flex flex-col items-center justify-between gap-4 p-4">
                 <li 
                   className="
                     cursor-pointer border-solid border-2 border-indigo-500 
                     hover:border-transparent text-white font-medium 
                     hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 
                     py-2 px-8 rounded-lg transition-all duration-200 
                     transform hover:scale-[1.02] shadow-lg
                   "
                   onClick={() => {
                     router.push('/login');
                     setIsMobileMenuOpen(false);
                   }}
                 >
                   Login
                 </li>
               </ul>
             )}
           </div>
         )}
       </div>
     </>
   );
}

export default Nav;