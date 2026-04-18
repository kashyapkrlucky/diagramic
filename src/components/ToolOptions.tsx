import type { Tool } from "../types";

interface ToolOptionsProps {
  subTools: Tool[];
  selectedSubTool: Tool | null;
  setSelectedSubTool: (tool: Tool | null) => void;
}

export default function ToolOptions({ subTools, selectedSubTool, setSelectedSubTool }: ToolOptionsProps) {
  if (subTools.length === 0) {
    return null;
  }
  return (
    <div className="absolute bottom-5 left-[50%] border border-gray-300 rounded-lg p-2 flex gap-2 shadow-md bg-white">
      {subTools.map((tool) => (
        <button 
          key={tool.name}
          onClick={() => setSelectedSubTool(tool)}
          className={selectedSubTool?.name === tool.name ? "text-purple-500" : ""}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  )
}