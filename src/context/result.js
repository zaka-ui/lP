'use client'; // Ensure this is a client component

import { createContext, useEffect, useState } from 'react';

// Named export
export const ResultsContext = createContext();

export const ResultsProvider = ({ children }) => {
  const [results, setResults] = useState([]);
  const [name, setName] = useState("");
  const [mainLocation, setMainLocation] = useState("");
  const [locations , setLocations ] = useState([]);
  const [aiResponse, setAiResponse] = useState("No Responde found");
  const [user, setUser] = useState({
    token : "",
    userData : {
      email : "",
      name : "",
      role : "",
      isVerified : true
    }
  });

  const [project, setProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    mainLocation: "",
    results: []
  });
  
    // Safely retrieve from localStorage after the component mounts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []); // Empty dependency array ensures it runs only once after the component mounts

  return (
    <ResultsContext.Provider value={{ results, setResults, name, setName, mainLocation, setMainLocation ,locations , setLocations ,aiResponse,setAiResponse ,user, setUser, project, setProject}}>
      {children}
    </ResultsContext.Provider>
  );
};
