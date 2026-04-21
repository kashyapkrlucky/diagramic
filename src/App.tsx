import ToolBar from "./components/ToolBar";
import NavBar from "./components/NavBar";

import { useState } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [canvasAction, setCanvasAction] = useState<string>("");
  
  const onCanvasAction = (action: string) => {
    setCanvasAction(action);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <NavBar onCanvasAction={onCanvasAction} isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 relative">
        <Canvas action={canvasAction} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ToolBar />
      </main>
    </div>
  );
}

export default App;
