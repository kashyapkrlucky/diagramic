import ToolBar from "./components/ToolBar";
import ToolOptions from "./components/ToolOptions";
import NavBar from "./components/NavBar";

import { useState } from "react";
import type { Tool } from "./types";
import Canvas from "./components/Canvas";
import { tools } from "./components/ToolListing";
import Sidebar from "./components/Sidebar";

function App() {
  const [selectedTool, setSelectedTool] = useState<Tool>(tools[0]);
  const [selectedSubTool, setSelectedSubTool] = useState<Tool | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <NavBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <main className="flex-1 relative">
        <Canvas />
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <ToolBar
          tools={tools}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
        />
        <ToolOptions subTools={selectedTool.subTools} selectedSubTool={selectedSubTool} setSelectedSubTool={setSelectedSubTool} />
      </main>
    </div>
  );
}

export default App;
