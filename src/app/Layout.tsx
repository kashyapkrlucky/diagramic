import { Outlet } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import PageLoader from "@/shared/components/loaders/PageLoader";
import { getCodeFromURL } from "@/shared/utils";

export default function AppLayout() {
  const navigate = useNavigate();
  const [isOAuthChecked, setIsOAuthChecked] = useState(false);
  const { getUserData, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = getCodeFromURL();
      if (code) {
        try {
          await getUserData(code);
          setIsOAuthChecked(true);
        } catch (error) {
          console.error("OAuth callback failed:", error);
        }
      } else {
        setIsOAuthChecked(true);
      }
    };

    handleOAuthCallback();
  }, [getUserData]);

  useEffect(() => {
    if (isOAuthChecked && !isAuthenticated && !loading) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, loading, isOAuthChecked, navigate]);

  if (loading && !isOAuthChecked) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex flex-row h-screen bg-gray-50">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        {/* <ChatBot /> */}
        <Toaster position="bottom-left" reverseOrder={false} />
      </div>
    </Suspense>
  );
}
