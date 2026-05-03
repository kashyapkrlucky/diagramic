import {
  ArrowRightIcon,
  SparklesIcon,
  ZapIcon,
  LayersIcon,
  PaletteIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../store/authStore";

export default function SignIn() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { onGuestLogin, loading } = useUserStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Use requestAnimationFrame to avoid synchronous setState
    requestAnimationFrame(() => {
      setTimeout(() => setMounted(true), 100);
    });
  }, []);

  const handleGuestLogin = async () => {
    const token = await onGuestLogin();
    if (token) {
      navigate("/");
    } else {
      alert("Failed to login as guest. Please try again.");
    }
  };

  const onAtlasLogin = () => {
    window.location.href = `${import.meta.env.VITE_AUTH_APP_URL}/authorize?o=${import.meta.env.VITE_APP_BASE_URL || window.location.origin}`;
  }

  const features = [
    {
      icon: <SparklesIcon className="w-6 h-6" />,
      title: "Easy Drawing",
      description: "Intuitive tools for creating flowcharts",
    },
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Quick Start",
      description: "Create projects instantly and begin drawing",
    },
    {
      icon: <LayersIcon className="w-6 h-6" />,
      title: "Clean Interface",
      description: "Simple, distraction-free design environment",
    },
    {
      icon: <PaletteIcon className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Modern UI with smooth animations",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-white border-b border-gray-200">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        {/* Logo Section */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl shadow-sm border border-black/20">
            <span className="text-4xl font-bold text-gray-900">LD</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">Let's Draw</h1>
          <p className="text-xl text-gray-600 font-light">
            Professional Flowchart Creator
          </p>
        </div>

        {/* Feature Cards */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto w-full transition-all duration-1000 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-gray-200  transition-all duration-300"
            >
              <div className="text-white mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div
          className={`text-center transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="bg-gray-50 backdrop-blur-lg rounded-3xl p-8 border border-gray-200 max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Start Drawing
            </h2>
            <p className="text-gray-600 mb-8">
              Create beautiful flowcharts with our simple and intuitive drawing
              tools
            </p>

            <div className="flex flex-row justify-between gap-6">
              <div className="flex-1 flex flex-col gap-4">
                <button
                  onClick={handleGuestLogin}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  disabled={loading}
                  className={`group inline-flex items-center justify-center gap-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue as Guest</span>
                      <ArrowRightIcon
                        className={`w-4 h-4 transition-transform duration-300 ${
                          hovered ? "translate-x-1" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                <span className="text-gray-600 text-xs">
                  No registration required
                </span>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <button
                  onClick={onAtlasLogin}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  disabled={loading}
                  className={`group inline-flex items-center justify-center gap-3 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <span>Login with Atlas Id</span>
                      <ArrowRightIcon
                        className={`w-4 h-4 transition-transform duration-300 ${
                          hovered ? "translate-x-1" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                <span className="text-gray-600 text-xs">
                  Register with Atlas Id for saving your projects and accessing
                  them across devices
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
