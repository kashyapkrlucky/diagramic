import { useCanvasStore } from "../../store/canvasStore";

export default function ToolOptions() {
  const { subTools, selectedSubTool, setSelectedSubTool, selectedTool } = useCanvasStore();
  
  // Only show if there are subtools and a tool is selected
  if (subTools.length === 0 || !selectedTool) {
    return null;
  }

  const getStrokeSize = (toolName: string) => {
    switch (toolName) {
      case 'Thin': return 'h-0.5';
      case 'Medium': return 'h-2';
      case 'Thick': return 'h-3';
      default: return 'h-1';
    }
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-40">
      <div className="text-xs font-medium text-gray-600 mr-1">Stroke:</div>
      <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
        {subTools.map((tool) => (
          <button
            key={tool.name}
            onClick={() => setSelectedSubTool(tool.name)}
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
  );
}
