import { useCanvasStore } from "../../store/canvasStore";
import type { Tool, ToolType } from "../../types";
import ColorPicker from "./ColorPicker";
import { useEffect, useRef, useState } from "react";

export default function ToolBar() {
  const toolBarRef = useRef<HTMLDivElement>(null);
  const [showSubTools, setShowSubTools] = useState(false);
  const { tools, selectedTool, setSelectedTool, nodes, setNodes, subTools, selectedSubTool, setSelectedSubTool } =
    useCanvasStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolBarRef.current && !toolBarRef.current.contains(event.target as Node)) {
        setShowSubTools(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!tools) return null;

  const getSelectedToolIndex = () => {
    return tools.findIndex((tool: Tool) => tool.name === selectedTool);
  };

  const handleToolClick = (toolName: ToolType) => {
    setSelectedTool(toolName);
    setShowSubTools(true);
  };

  const handleSubToolClick = (subToolName: string) => {
    setSelectedSubTool(subToolName);
    setShowSubTools(false);
  };

  const handleExport = () => {
    const nodesJson = JSON.stringify(nodes);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(nodesJson);
    const exportFileDefaultName = "workflow.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data) {
            setNodes(data);
          } else {
            alert("Invalid workflow format. Please check the file structure.");
          }
        } catch (error) {
          console.error("Failed to import workflow:", error);
          alert(
            "Failed to import workflow file. Please check the file format.",
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const getStrokeSize = (toolName: string) => {
    switch (toolName) {
      case 'Thin': return 'h-0.5';
      case 'Medium': return 'h-2';
      case 'Thick': return 'h-3';
      default: return 'h-1';
    }
  };

  const selectedToolIndex = getSelectedToolIndex();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center gap-2" ref={toolBarRef}>
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 relative">
        {tools.map((tool: Tool, index: number) => (
          <button
            key={tool.name}
            onClick={() => handleToolClick(tool.name as ToolType)}
            className={`p-2 rounded-md transition-all duration-200 group relative ${
              selectedTool === tool.name
                ? "bg-white shadow-sm text-blue-600"
                : "hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-800"
            }`}
            title={tool.name}
            data-index={index}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {tool.icon}
            </span>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {tool.name}
            </span>
          </button>
        ))}
        
        {/* ToolOptions popup positioned near selected tool */}
        {selectedTool && subTools.length > 0 && showSubTools && (
          <div 
            className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-50"
            style={{ 
              left: `${selectedToolIndex * 40 + 20}px`, 
              transform: 'translateX(-50%)' 
            }}
          >
            <div className="text-xs font-medium text-gray-600 mr-1">Stroke:</div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              {subTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSubToolClick(tool.name)}
                  className={`px-3 py-2 rounded-md transition-all duration-200 group relative flex items-center justify-center ${
                    selectedSubTool === tool.name 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-800'
                  }`}
                  title={`${tool.name} stroke`}
                >
                  <div className={`w-4 ${getStrokeSize(tool.name)} ${
                    selectedSubTool === tool.name 
                      ? 'bg-blue-600' 
                      : 'bg-gray-600 group-hover:bg-gray-800'
                  } rounded-full transition-colors`}></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-2 px-1">
        <ColorPicker />

        <div className="flex items-center gap-1">
          <button
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
            onClick={handleExport}
            title="Export workflow"
          >
            Export
          </button>

          <label
            className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
            title="Import workflow"
          >
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
