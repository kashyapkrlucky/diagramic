import {
  PanelRightCloseIcon,
  PanelRightIcon,
  UserCircle2Icon,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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
  const [isLogoutDropdownOpen, setIsLogoutDropdownOpen] = useState(false);
  const { signOut } = useAuth();

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
