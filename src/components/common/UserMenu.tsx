import { UserCircle2Icon, LogOutIcon, ChevronDownIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function UserMenu() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut();
    window.location.href = "/sign-in";
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
        aria-label="User menu"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          {
            user?.avatar ? (
              <img src={user.avatar} alt="User avatar" className="w-8 h-8 rounded-full" />
            ) : (
              <UserCircle2Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
            )
          }
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 animate-in slide-in-from-top-1 fade-in-0 duration-200">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || "Guest Account"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "No account linked"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
            >
              <LogOutIcon className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
