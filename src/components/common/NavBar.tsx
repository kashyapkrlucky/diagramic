import {
  PanelRightCloseIcon,
  PanelRightIcon,
  UndoIcon,
  RedoIcon,
  BrushCleaningIcon,
  SaveIcon,
  UserCircle2Icon,
  DownloadIcon,
  Loader2Icon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDrawingStore } from "../../store/drawingStore";
import { useAuth } from "../../hooks/useAuth";

interface NavBarProps {
  type: "home" | "editor";
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  onCanvasAction?: (action: string) => void;
}

export default function NavBar({
  type,
  isSidebarOpen,
  onToggleSidebar,
  onCanvasAction,
}: NavBarProps) {
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false);

  const { isUpdating } = useDrawingStore();

  const { signOut } = useAuth();
  // Editor navbar
  const actions = [
    { icon: <UndoIcon className="w-4 h-4" />, name: "undo", label: "Undo" },
    { icon: <RedoIcon className="w-4 h-4" />, name: "redo", label: "Redo" },
    {
      icon: <BrushCleaningIcon className="w-4 h-4" />,
      name: "clear",
      label: "Clear Canvas",
    },
    {
      icon: <DownloadIcon className="w-4 h-4" />,
      name: "download",
      label: "Download as JPG",
    },
    { icon: <SaveIcon className="w-4 h-4" />, name: "save", label: "Save" },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Link to={"/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">LD</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">Let's Draw</h1>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        {type === "editor" && (
          <>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              {actions.map((action) => (
                <button
                  key={action.name}
                  className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 group relative"
                  onClick={() => onCanvasAction?.(action.name)}
                  title={action.label}
                >
                  {isUpdating && action.name === "save" ? (
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                      <Loader2Icon className="w-4 h-4 animate-spin" />
                    </span>
                  ) : (
                    <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                      {action.icon}
                    </span>
                  )}
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
          </>
        )}

        <div className="p-2 rounded-lg hover:bg-gray-100  relative">
          <UserCircle2Icon
            className="w-4 h-4 text-gray-600"
            onClick={() => setIsLogoutDropdownOpen(!isLogoutDropdownOpen)}
          />
          {isLogoutDropdownOpen && (
            <div className="absolute top-8 z-10 right-0">
              <button
                onClick={() => {
                  signOut();
                  window.location.href = "/sign-in";
                }}
                className="bg-gray-800 text-white text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
