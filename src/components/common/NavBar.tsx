import {
  PanelRightCloseIcon,
  PanelRightIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

interface NavBarProps {
  type: "home" | "editor";
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export default function NavBar({
  type,
  isSidebarOpen,
  onToggleSidebar,
}: NavBarProps) {

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

            <div className="w-px h-6 bg-gray-300 mx-2" />

          </>
        )}

       <UserMenu />
      </div>
    </header>
  );
}
