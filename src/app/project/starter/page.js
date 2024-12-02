'use client';

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ResultsContext } from "../../../context/result";
import TagInput from "../../components/location";
import Input from "../../components/input";
import KeywordLengthModal from "../../components/KeywordLengthModal ";
import { 
  Building2, 
  MapPin,
  Sparkles,
  Loader2,
  AlertTriangle,
  X,
  ArrowLeft
} from 'lucide-react';
import Image from "next/image";


export default function Starter() {
  const [keywords, setKeywords] = useState([""]);
  const [loading, setLoading] = useState(false);
  const { user , project, setProject, setResults,name, setName , locations } = useContext(ResultsContext);
  const [inputMethod, setInputMethod] = useState("keywords");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const resultsMap = new Map();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 50;
      const y = (e.clientY / window.innerHeight) * 50;
      setGradientPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const showError = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const handleInputMethodChange = (method) => {
    setInputMethod(method);
    if (method === "keywords") {
      setKeywords([""]);
    } else {
      setKeywords([""]);
    }
  };

  const handleChange = (index) => (e) => {
    const newKeywords = [...keywords];
    newKeywords[index] = e.target.value;
    setKeywords(newKeywords);
  };

  const handleAddInput = (index) => {
    const newKeywords = [...keywords];
    newKeywords.splice(index + 1, 0, "");
    setKeywords(newKeywords);
  };

  const handleRemoveInput = (index) => {
    if (keywords.length > 1) {
      const newKeywords = keywords.filter((_, i) => i !== index);
      setKeywords(newKeywords);
    }
  };

  const validateKeywords = () => {
    if (inputMethod === "keywords") {
      const validKeywords = keywords.filter(k => k.trim().length > 0);
      if (validKeywords.length === 0) {
        showError("Please provide at least one keyword.");
        return false;
      }
      if (validKeywords.length < 5) {
        showError("Please enter at least 5 keywords for better results.");
        return false;
      }
    } else {
      const validKeywords = keywords.filter(k => k.trim().length > 0);
      const validLocations = locations.filter(l => l.trim().length > 0);
      
      if (validKeywords.length === 0) {
        showError("Please enter at least one keyword.");
        return false;
      }
      if (validLocations.length === 0) {
        showError("Please enter at least one location.");
        return false;
      }

      const combined = validKeywords.flatMap(keyword =>
        validLocations.map(location => `${keyword} ${location}`.trim())
      );

      if (combined.length < 5) {
        showError("Please provide enough keyword-location combinations (minimum 5).");
        return false;
      }
    }
    return true;
  };


const fetchKeywordsTextArea = async () => {
    setLoading(true);
    const username = process.env.NEXT_PUBLIC_API_USERNAME;
    const password = process.env.NEXT_PUBLIC_API_Password;
    const post_array = [];
    // First create the combinations
    const combined = [];
    for (const keyword of keywords) {
      for (const location of locations) {
        if (keyword.trim() && location.trim()) {
          combined.push(`${keyword.toLowerCase()} ${location.toLowerCase()}`.trim());
        }
      }
    }
   // Add base data for search volume and keyword difficulty
    post_array.push({
      keywords: combined,
      language_name: "French",
      location_code: 2250,
    });

    // Add search volume to the result map
    const searchVolume = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/keywords_data/clickstream_data/dataforseo_search_volume/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 200) {
          const datas = response.data.tasks[0].result[0].items;
          for (const data of datas) {
            const { keyword, search_volume } = data;
            const existingData = resultsMap.get(keyword) || {};
            resultsMap.set(keyword, { ...existingData, keyword, search_volume });
          }
          //console.log("After search volume:", Array.from(results.entries()));
        }
      } catch (error) {
        console.error('Error fetching search volume:', error.response?.data || error.message);
      }
    };
    
    // Add keyword difficulty to the result map
    const getKeywordDifficulty = async () => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.dataforseo.com/v3/dataforseo_labs/bulk_keyword_difficulty/live',
          auth: { username, password },
          data: post_array,
          headers: { 'content-type': 'application/json' },
        });

        if (response.status === 200) {
          const datas = response.data.tasks[0].result[0].items;
          for (const data of datas) {
            const { keyword, keyword_difficulty } = data;
            const existingData = resultsMap.get(keyword) || {};
            resultsMap.set(keyword, { ...existingData, keyword, keyword_difficulty });
          }
        }
      } catch (error) {
        console.error('Error fetching keyword difficulty:', error.response?.data || error.message);
      }
    };

    // Add keyword suggestions to the result map
    const getKeywordSuggestions = async () => {
      for (const combinationKeyword  of combined) {
        const suggestionArray = [
          {
            keyword: combinationKeyword,
            location_code: 2250,
            limit : 20,
          },
        ];

        try {
          const response = await axios({
            method: 'post',
            url: 'https://api.dataforseo.com/v3/dataforseo_labs/keyword_suggestions/live',
            auth: { username, password },
            data: suggestionArray,
            headers: { 'Content-Type': 'application/json' },
          });
          if (response.status === 200) {
            const suggestions = response.data.tasks[0].result[0].items.map(item =>  ({
              keyword: item.keyword,
              search_volume: item.keyword_info.search_volume || 0, // Default to 0 if missing
              keyword_difficulty: item.keyword_properties.keyword_difficulty || 0, // Default to 0 if missing
            })
          );
            const existingData = resultsMap.get(combinationKeyword) || {};
            
            resultsMap.set(combinationKeyword, { ...existingData, combinationKeyword, suggestions });
          }
        } catch (error) {
          console.error('Error fetching keyword suggestions:', error.response?.data || error.message);
        }
      }
    };
   // Fetch all data and merge into the results map
  const getAllKeywordData = async () => {
    await searchVolume();
    await getKeywordDifficulty();
    await getKeywordSuggestions();
    // Log final results with suggestions
    const formattedResults = Array.from(resultsMap.entries()).map(([keyword, data]) => ({
      keyword,
      search_volume: data.search_volume || 0,
      keyword_difficulty: data.keyword_difficulty || 0,
      suggestions: data.suggestions || [], // Log suggestions if present
    }));
    setResults(formattedResults);
  };

  getAllKeywordData();
  setLoading(false);
  router.push('/project/starter/results');
  };
  


const fetchKeywordsInput = async () => {
    setLoading(true);
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    const host = process.env.NEXT_PUBLIC_API_HOST;
    const newResults = [];
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const validKeywords = keywords.filter(k => k.trim().length > 0);

    for (const keyword of validKeywords) {
      const url = `https://ai-google-keyword-research.p.rapidapi.com/keyword-research?keyword=${encodeURIComponent(
        keyword
      )}&country=fr`;

      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': host
        }
      };

      try {
        const response = await fetch(url, options);
        if(response.status === 200){
          const result = await response.json();
          newResults.push({ keyword, result });
          
        }else{
          showError(response.status);
          setLoading(false);
          return;
        }
      } catch (error) {
        showError(response.status);
        setLoading(false);
        return;
      }
      await sleep(500);
    }
    setResults(newResults);
    setProject({...project, mainLocation : mainLocation, results : newResults});
    console.log(project);
    
    setLoading(false);
    router.push('/results');
  };

  const handleAnalyze = () => {
    if (validateKeywords()) {
      inputMethod === "textArea" ? fetchKeywordsTextArea() : fetchKeywordsInput();
    }
  };

  if (!user?.userData?.is_verified && !user?.userData?.role === 'admin') {
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project`);
  }else if(project?.data?.id){
    return (
      <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
        {/* Animated background gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${gradientPosition.x}% ${gradientPosition.y}%, 
                        rgb(59, 130, 246) 0%, 
                        rgb(37, 99, 235) 25%, 
                        rgb(29, 78, 216) 50%, 
                        transparent 100%)`
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
  
        <div className="relative max-screen mx-auto px-6 py-5 space-y-6">
          {/* Header section */}
          <div className="flex items-center justify-between space-y-2 mb-12 ">
          {/* Back button */}
          <button 
            onClick={() => {router.back()}}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to project
          </button>
          {/*logo */}
            
              
          </div>
  
       <div className="relative flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-10  space-y-6">
           {/* Company info section */}
           <div className="space-y-6 mb-12 relative w-full">
            <div className="relative w-full group w-full">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors z-10" />
              <input
                type="text"
                placeholder="Domain name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  
                }}
                required
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-12 pr-4 py-3 h-10
                          text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 
                          focus:border-transparent outline-none transition-all duration-200
                          backdrop-blur-sm"
              />
            </div>
          </div>
  
          {/* Input method selection */}
          <div className="flex space-x-4 mb-8 w-full">
            {['keywords', 'textArea'].map((method) => (
              <button
                key={method}
                onClick={() => handleInputMethodChange(method)}
                className={`px-6 py-3 rounded-lg border transition-all duration-200 
                           ${inputMethod === method 
                             ? 'bg-blue-600 border-blue-500 text-white h-10 flex items-center' 
                             : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700/50 h-10 flex items-center'}`}
              >
                {method === 'keywords' ? 'Keyword Input' : 'Batch Input'}
              </button>
            ))}
          </div>
  
          {/* Input section */}
          <div className="mb-12 w-full">
            {inputMethod === "keywords" ? (
              <div className="space-y-4">
                {keywords.map((keyword, index) => (
                  <Input
                    key={index}
                    index={index + 1}
                    value={keyword}
                    handleChange={handleChange(index)}
                    onAdd={() => handleAddInput(index)}
                    onRemove={() => handleRemoveInput(index)}
                    isLast={index === keywords.length - 1}
                    disabled={loading}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-6 w-full">
                <textarea
                  placeholder="Enter keywords (one per line)"
                  onChange={(e) => {
                    const lines = e.target.value
                      .split('\n')
                      .map(k => k.trim())
                      .filter(k => k.length > 0);
                    setKeywords(lines);
                  }}
                  disabled={loading}
                  className="w-full h-40 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 
                           text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 
                           focus:border-transparent outline-none transition-all duration-200
                           backdrop-blur-sm resize-none"
                />
                <TagInput />
              </div>
            )}
          </div>
  
          {/* Action button */}
          <button
            onClick={handleAnalyze}
            desabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 
                     hover:to-purple-500 text-white font-medium py-4 px-8 rounded-lg
                     transition-all duration-200 transform hover:scale-[1.02] 
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                     flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Keywords</span>
              </>
            )}
          </button>
       </div>
  
          {/* Modal Component */}
          <KeywordLengthModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            message={modalMessage}
          />
        </div>
      </div>
    );
  }else{
    router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/project`);
  }
}