"use client"
import { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ResultsContext } from "@/context/result";
import { 
  ChevronLeft
} from 'lucide-react';




const Gmini = () => {
  const { aiResponse } = useContext(ResultsContext);
  const router = useRouter();
  const responseContent = typeof aiResponse === 'string' ? aiResponse : aiResponse?.html || '';


  return (
<div className="">
<button
      onClick={()=> router.back()}
      className="flex items-center px-4 py-2 rounded-lg bg-blue-600/20 border border-blue-500/30
               text-blue-400 hover:bg-blue-600/30 transition-all duration-200 mr-2 mt-5 ml-5"
    >
      <ChevronLeft className="mr-2 h-5 w-5" />
      Go back
</button>
<div className="flex flex-col items-center mt-50 justify-center mt-5 mx-5 my-10">
      <div className="bg-gray-800/90 border border-gray-700 rounded-lg 
                    shadow-2xl backdrop-blur-md overflow-hidden w-full overflow-y-scroll 
                    transform transition-all duration-200 srollbar scale-100 ">
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                      animate-pulse" />
        <div className="relative p-6" >
          <div className="flex flex-col items-center text-start">
            <div className="text-gray-300 mb-6" dangerouslySetInnerHTML={{ __html: responseContent }}/>
             
          </div>
        </div>
      </div>
    </div>
</div>
  );
};
export default Gmini ;