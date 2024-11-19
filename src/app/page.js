"use client";
import { useState, useEffect, useRef, useContext } from "react";
import {
  SearchCheck,
  Sparkles,
  ChevronDown,
  BarChart,
  Lock,
  Zap,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Nav from "./components/Nav";

export default function Home() {
  const newProject = true;
  const router = useRouter();
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false); // Changed to true by default
  const [isScondSectionVisible, setIsScondSectionVisible] = useState(false); // Changed to true by default
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isInitialMount = useRef(true);
  const isFirstSectioinVisible = useRef(false);
  const isScondSectioinVisibleRef = useRef(false)
  const features = [
    {
      icon: <Globe className="w-12 h-12 text-blue-500" />,
      title: "Local SEO Analysis",
      description:
        "Get detailed insights into your local market performance and discover untapped opportunities.",
    },
    {
      icon: <BarChart className="w-12 h-12 text-purple-500" />,
      title: "Competitor Tracking",
      description:
        "Monitor your competitors' rankings and understand their strategies to stay ahead.",
    },
    {
      icon: <Zap className="w-12 h-12 text-blue-500" />,
      title: "Real-time Updates",
      description:
        "Receive instant notifications about ranking changes and new opportunities.",
    },
  ];
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp",
      content:
        "This tool has transformed our local SEO strategy. We've seen a 150% increase in local search visibility.",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      company: "Chen's Cuisine",
      content:
        "Easy to use and incredibly effective. Our restaurant now ranks #1 for local food searches.",
    },
    {
      name: "Emily Rodriguez",
      role: "SEO Specialist",
      company: "Digital Solutions",
      content:
        "The AI-powered insights have helped us optimize our clients' campaigns with incredible precision.",
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const enteri = entries[0];
      console.log(enteri);
      
      setIsVisible(enteri.isIntersecting);
    });
     observer.observe(isFirstSectioinVisible.current); 
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
    const handleScroll = () => {
      const observer = new IntersectionObserver((entries) => {
        const enteri = entries[0];   
        setIsScondSectionVisible(enteri.isIntersecting);
      });
      observer.observe(isScondSectioinVisibleRef.current); 

    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    // After first mount, set the ref to false
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div
      className="min-h-screen bg-gray-900 text-white relative overflow-hidden"
      ref={containerRef}
    >
      {/* Enhanced animated background gradient */}
      <div
        className="absolute inset-0 opacity-30 transition-opacity duration-1000"
        style={{
          background: `
            radial-gradient(circle at ${gradientPosition.x}% ${
            gradientPosition.y
          }%, 
            rgb(59, 130, 246) 0%,
            rgb(37, 99, 235) 25%,
            rgb(29, 78, 216) 50%,
            transparent 100%),
            radial-gradient(circle at ${100 - gradientPosition.x}% ${
            100 - gradientPosition.y
          }%,
            rgb(147, 51, 234) 0%,
            rgb(126, 34, 206) 25%,
            rgb(107, 33, 168) 50%,
            transparent 100%)
          `,
        }}
      />
      {/* Improved grid pattern overlay with animation */}
      <div
        className="fixed inset-0 opacity-10 w-screen h-screen animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />
      {/* Floating particles effect */}
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
      {/* Debug Overlay
           <div className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded">
             <p>X: {mousePosition.x}</p>
             <p>Y: {mousePosition.y}</p>
            </div>
      */}
      {/* Mouse follower effect */}
      <div
        className="pointer-events-none absolute w-8 h-8 rounded-full border-2 border-blue-500/50 transition-all duration-200 ease-out"
        style={{
          left: mousePosition.x - 16,
          top: mousePosition.y - 16,
          transform: "translate(0, 0)",
        }}
      />

      <div className="relative max-w-7xl h-screen mx-auto p-6 space-y-6">
        {/* Simple Navigation */}
        <Nav newProject={newProject}/>
        <div
          className={`mt-10 h-[80%] flex flex-col items-center justify-center mx-5 my-10 transition duration-[2000ms] ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`} 
          ref={isFirstSectioinVisible}
        >
          <div className="relative">
            <Sparkles className="absolute -top-8 -left-8 text-blue-500 animate-pulse" />
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-gradient">
              Unlock the Power of Local SEO
            </h1>
          </div>

          <p className="w-[60%] text-gray-300 text-center px-10 mt-6 text-lg leading-relaxed">
            Discover untapped keyword opportunities for your niche and location.
            Our intuitive tool does the heavy lifting, delivering tailored
            results in seconds.
          </p>

          <div className="mt-8 space-y-4 flex flex-col items-center">
            <button
              onClick={() => {
                router.push("/login");
              }}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
            >
              <SearchCheck className="w-5 h-5 transition-transform group-hover:rotate-12" />
              Start Your Research
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
            </button>

            <div className="animate-bounce mt-12">
              <ChevronDown className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Features Section
        
         <section className={`py-20 transition-all duration-[2000ms] ease-out ${isScondSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`} ref={isScondSectioinVisibleRef}>
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Powerful Features for Local Success
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
        
        
        */}
       

        {/* Testimonials Section 
        
             <section className="py-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300"
              >
                <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
                <div className="border-t border-gray-700 pt-4">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                  <p className="text-sm text-blue-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        */}
   

        {/* CTA Section 
          <section className="py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Ready to Dominate Local Search?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using our platform to improve
              their local SEO performance.
            </p>
            <p
              onClick={() => {
                router.push("/login");
              }}
              className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20"
            >
              <Lock className="w-5 h-5" />
              Get Started Today
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-lg transition-opacity opacity-0 group-hover:opacity-100" />
            </p>
          </div>
        </section>
        */}
      </div>
    </div>
  );
}
