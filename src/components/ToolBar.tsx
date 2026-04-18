
import type { Tool } from "../types";

interface ToolBarProps {
  tools: Tool[];
  selectedTool: Tool;
  setSelectedTool: (tool: Tool) => void;
}

export default function ToolBar({ tools, selectedTool, setSelectedTool }: ToolBarProps) {
  return (
    <div className="absolute top-5 left-5 border border-gray-300 rounded-lg p-2 flex flex-col gap-4 shadow-md bg-white">
      {tools.map((tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedTool(tool)}
          className={selectedTool.name === tool.name ? "text-purple-500" : ""}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}