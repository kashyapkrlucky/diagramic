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
    { icon: <UndoIcon className="w-4 h-4" />, name: "undo", label: "Undo" },
    { icon: <RedoIcon className="w-4 h-4" />, name: "redo", label: "Redo" },
    { icon: <BrushCleaningIcon className="w-4 h-4" />, name: "clear", label: "Clear Canvas" },
    { icon: <SaveIcon className="w-4 h-4" />, name: "save", label: "Save" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LD</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Let's Draw</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {actions.map((action) => (
            <button
              key={action.name}
              className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 group relative"
              onClick={() => onCanvasAction(action.name)}
              title={action.label}
            >
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                {action.icon}
              </span>
              <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {action.label}
              </span>
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <button 
          className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 group relative"
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
            {isSidebarOpen ? (
              <PanelRightCloseIcon className="w-4 h-4" />
            ) : (
              <PanelRightIcon className="w-4 h-4" />
            )}
          </span>
        </button>
      </div>
    </header>
  );
}
