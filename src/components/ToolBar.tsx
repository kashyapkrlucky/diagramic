import { useCanvasStore } from "../store/canvasStore";
import type { Tool, ToolType } from "../types";
import ColorPicker from "./ColorPicker";

export default function ToolBar() {
  const { tools, selectedTool, setSelectedTool, nodes, setNodes } =
    useCanvasStore();
  if (!tools) return null;

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
  return (
    <div className="absolute bottom-5 left-[50%] translate-x-[-50%] border border-gray-300 rounded-lg p-2 flex flex-row items-center gap-4 shadow-md bg-white">
      {tools.map((tool: Tool) => (
        <button
          key={tool.name}
          onClick={() => setSelectedTool(tool.name as ToolType)}
          className={selectedTool === tool.name ? "text-red-500" : ""}
        >
          {tool.icon}
        </button>
      ))}
      <ColorPicker />
      <button
        className="px-2 py-1 border border-gray-300 text-gray-700 rounded-md text-xs cursor-pointer"
        onClick={handleExport}
      >
        Export
      </button>

      <label
        className="px-2 py-1 border border-gray-300 text-gray-700 rounded-md text-xs cursor-pointer"
        title="Import Workflow"
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
  );
}
