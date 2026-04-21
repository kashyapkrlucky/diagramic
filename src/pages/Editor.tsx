import Canvas from "../components/Canvas";
import ToolBar from "../components/ToolBar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import Layout from "../components/Layout";

export default function Editor() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canvasAction, setCanvasAction] = useState<string>("");

  const onCanvasAction = (action: string) => {
    setCanvasAction(action);
  };

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
