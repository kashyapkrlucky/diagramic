import { ArrowRightIcon, SparklesIcon, ZapIcon, LayersIcon, PaletteIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SignIn() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [bubbles, setBubbles] = useState<Array<{id: number; width: number; height: number; left: number; top: number}>>([]);
  const { isAuthenticated, signInAsGuest, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Generate random bubbles once on mount
    const newBubbles = [...Array(6)].map((_, i) => ({
      id: i,
      width: Math.random() * 400 + 200,
      height: Math.random() * 400 + 200,
      left: Math.random() * 100,
      top: Math.random() * 100
    }));
    
    // Use requestAnimationFrame to avoid synchronous setState
    requestAnimationFrame(() => {
      setBubbles(newBubbles);
      setTimeout(() => setMounted(true), 100);
    });
  }, []);

  const features = [
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Easy Drawing",
      description: "Intuitive tools for creating flowcharts"
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Quick Start",
      description: "Create projects instantly and begin drawing"
    },
    {
      icon: <LayersIcon className="w-6 h-6" />,
      title: "Clean Interface",
      description: "Simple, distraction-free design environment"
    },
    {
      icon: <PaletteIcon className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Modern UI with smooth animations"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-purple-600/20"></div>
        <div className="absolute inset-0">
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute rounded-full bg-white/5 blur-3xl"
              style={{
                width: `${bubble.width}px`,
                height: `${bubble.height}px`,
                left: `${bubble.left}%`,
                top: `${bubble.top}%`,
                animation: `float ${10 + bubble.id * 2}s ease-in-out infinite`,
                animationDelay: `${bubble.id * 0.5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo Section */}
        <div className={`text-center mb-12 transition-all duration-1000 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20">
            <span className="text-4xl font-bold text-white">LD</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">Let's Draw</h1>
          <p className="text-xl text-white/80 font-light">Professional Flowchart Creator</p>
        </div>

        {/* Feature Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto w-full transition-all duration-1000 delay-300 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="text-white mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-500 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Start Drawing</h2>
            <p className="text-white/80 mb-8">Create beautiful flowcharts with our simple and intuitive drawing tools</p>
            
            <button
              onClick={signInAsGuest}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              disabled={isLoading}
              className={`group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-purple-600 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                hovered ? 'translate-x-1' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Continue as Guest</span>
                  <ArrowRightIcon 
                    className={`w-5 h-5 transition-transform duration-300 ${
                      hovered ? 'translate-x-1' : ''
                    }`} 
                  />
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/70 text-sm">No registration required</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
}