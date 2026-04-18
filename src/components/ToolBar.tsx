
import { useCanvasStore } from "../store/canvasStore";
import type { Tool } from "../types";

export default function ToolBar() {
  const { tools, selectedTool, setSelectedTool } = useCanvasStore();
  if (!tools) return null;
  return (
    <div className="absolute top-5 left-5 border border-gray-300 rounded-lg p-2 flex flex-col gap-4 shadow-md bg-white">
      {tools.map((tool: Tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedTool(tool)}
          className={selectedTool?.name === tool.name ? "text-purple-500" : ""}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}