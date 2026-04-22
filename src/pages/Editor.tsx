import Canvas from "../components/editor/Canvas";
import ToolBar from "../components/editor/ToolBar";
import Sidebar from "../components/editor/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../hooks/useAuth";

export default function Editor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [canvasAction, setCanvasAction] = useState<string>("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const onCanvasAction = (action: string) => {
    setCanvasAction(action);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout
      navbarType="editor"
      navbarProps={{
        onCanvasAction,
        isSidebarOpen,
        onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
      }}
    >
      <Canvas action={canvasAction} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ToolBar />
    </Layout>
  );
}
