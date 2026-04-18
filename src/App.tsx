import ToolBar from "./components/ToolBar";
import ToolOptions from "./components/ToolOptions";
import NavBar from "./components/NavBar";

import { useState } from "react";
import Canvas from "./components/Canvas";
import Sidebar from "./components/Sidebar";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const onCanvasAction = (action: string) => {
    console.log("Canvas action", action);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar onCanvasAction={onCanvasAction} isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 relative">
        <Canvas onAction={onCanvasAction} />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ToolBar />
        <ToolOptions />
      </main>
    </div>
  );
}

export default App;
