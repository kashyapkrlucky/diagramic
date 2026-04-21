import {
  PanelRightCloseIcon,
  PanelRightIcon,
  UndoIcon,
  RedoIcon,
  BrushCleaningIcon,
  SaveIcon,
} from "lucide-react";

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
