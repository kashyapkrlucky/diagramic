import Canvas from "../components/editor/Canvas";
import ToolBar from "../components/editor/ToolBar";
import Sidebar from "../components/editor/Sidebar";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/common/Layout";
import { useDrawingStore } from "../store/drawingStore";
import { useCanvasStore } from "../store/canvasStore";
import Loader from "../components/common/Loader";
import useAuthStore from "../store/authStore";

export default function Editor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canvasAction, setCanvasAction] = useState<string>("");
  const { isAuthenticated } = useAuthStore();
  const { drawing, loading, fetchDrawingById } = useDrawingStore();
  const { setNodes } = useCanvasStore();

  const onCanvasAction = (action: string) => {
    setCanvasAction(action);
  };

  const onActionHandled = () => {
    setCanvasAction("");
  };

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      fetchDrawingById(params.id);
    }
  }, [params.id, fetchDrawingById]);

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
      <Canvas action={canvasAction} onActionHandled={onActionHandled} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <ToolBar onCanvasAction={onCanvasAction}/>
    </Layout>
  );
}
