import Canvas from "../components/editor/Canvas";
import ToolBar from "../components/editor/ToolBar";
import Sidebar from "../components/editor/Sidebar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useAuth } from "../hooks/useAuth";
import { useDrawingStore } from "../store/drawingStore";
import { useCanvasStore } from "../store/canvasStore";
import Loader from "../components/common/Loader";

export default function Editor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canvasAction, setCanvasAction] = useState<string>("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { drawing, loading, fetchDrawingById } = useDrawingStore();
  const { setNodes } = useCanvasStore();

  const onCanvasAction = (action: string) => {
    setCanvasAction(action);
  };

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchDrawingById(params.id);
    }
  }, [params.id, fetchDrawingById]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (drawing && drawing.data) {
      setNodes(JSON.parse(drawing.data));
    } else {
      setNodes([]);
    }
  }, [drawing, setNodes]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <Loader message="Preparing your drawing environment..." />;
  }

  return (
    <Layout
      navbarType="editor"
      navbarProps={{
        isSidebarOpen,
        onToggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
      }}
    >
      <Canvas action={canvasAction} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ToolBar onCanvasAction={onCanvasAction}/>
    </Layout>
  );
}
