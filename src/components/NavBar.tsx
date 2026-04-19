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

  const { color, setColor } = useCanvasStore();

  const actions = [
    { icon: <UndoIcon className="w-5 h-5" />, name: "undo" },
    { icon: <RedoIcon className="w-5 h-5" />, name: "redo" },
    { icon: <BrushCleaningIcon className="w-5 h-5" />, name: "clear" },
    { icon: <SaveIcon className="w-5 h-5" />, name: "save" },
  ];

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
