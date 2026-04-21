import { useCanvasStore } from "../store/canvasStore";

export default function ToolOptions() {
  const { subTools, selectedSubTool, setSelectedSubTool } = useCanvasStore();
  
  if (subTools.length === 0) {
    return null;
  }
  return (
    <div className="absolute bottom-20 left-[35%] translate-x-[-35%] border border-gray-300 rounded-lg p-2 flex gap-2 shadow-md bg-white">
      {subTools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedSubTool(tool.name)}
        >
          {tool.name === 'Thin' ? (
            <div className={`w-4 h-1 bg-gray-700 rounded ${selectedSubTool === tool.name ? "bg-red-500" : ""}`}></div>
          ) : tool.name === 'Medium' ? (
            <div className={`w-4 h-2 bg-gray-700 rounded ${selectedSubTool === tool.name ? "bg-red-500" : ""}`}></div>
          ) : tool.name === 'Thick' ? (
            <div className={`w-4 h-3 bg-gray-700 rounded ${selectedSubTool === tool.name ? "bg-red-500" : ""}`}></div>
          ) : null}
        </button>
      ))}
    </div>
  );
}
