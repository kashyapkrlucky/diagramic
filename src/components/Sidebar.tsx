import { XIcon } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-64 bg-white p-4 border-l border-gray-300 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <header className="flex items-center justify-end">
        <button onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </button>
      </header>
    </div>
  );
}
