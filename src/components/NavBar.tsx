import {
  PanelRightCloseIcon,
  PanelRightIcon,
  UndoIcon,
  RedoIcon,
  BrushCleaningIcon,
  SaveIcon,
} from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";

interface NavBarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onCanvasAction: (action: string) => void;
}

export default function NavBar({
  isSidebarOpen,
  onToggleSidebar,
  onCanvasAction,
}: NavBarProps) {
  const colors = [
    "#0f7868",
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
  ];

  const { color, setColor, nodes, setNodes } = useCanvasStore();

  const actions = [
    { icon: <UndoIcon className="w-5 h-5" />, name: "undo" },
    { icon: <RedoIcon className="w-5 h-5" />, name: "redo" },
    { icon: <BrushCleaningIcon className="w-5 h-5" />, name: "clear" },
    { icon: <SaveIcon className="w-5 h-5" />, name: "save" },
  ];

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
    <header className="border-b border-gray-300 p-2 flex items-center justify-between">
      <h1>Let's Draw</h1>

      <div className="flex items-center gap-2">
        {colors.map((clr, index) => (
          <button
            key={index}
            className="w-8 h-8 rounded-full shadow-md"
            style={{
              backgroundColor: clr,
              border: clr === color ? "2px solid #525252" : "none",
            }}
            onClick={() => setColor(clr)}
          ></button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={handleExport}>Export</button>

               <label
          className="px-3 py-2 bg-gradient-to-t from-indigo-600 to-blue-600 text-white rounded-md text-xs cursor-pointer"
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
        {actions.map((action, index) => (
          <button
            key={index}
            className="p-2"
            onClick={() => onCanvasAction(action.name)}
          >
            {action.icon}
          </button>
        ))}

        <button className="" onClick={onToggleSidebar}>
          {isSidebarOpen ? (
            <PanelRightCloseIcon className="w-5 h-5" />
          ) : (
            <PanelRightIcon className="w-5 h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
