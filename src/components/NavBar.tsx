import { PanelRightCloseIcon } from "lucide-react";

interface NavBarProps {
  onToggleSidebar: () => void;
}

export default function NavBar({ onToggleSidebar }: NavBarProps) {
  return (
    <header className="border-b border-gray-300 p-2 flex items-center justify-between">
      <h1>Let's Draw</h1>
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 border border-gray-300 rounded text-xs"
          onClick={onToggleSidebar}
        >
          <PanelRightCloseIcon className="w-4 h-4" />
        </button>
        <button className="px-2 py-1 border border-gray-300 rounded text-xs">
          Undo
        </button>
        <button className="px-2 py-1 border border-gray-300 rounded text-xs">
          Redo
        </button>
        <button className="px-2 py-1 border border-gray-300 rounded text-xs">
          Clear
        </button>
        <button className="px-2 py-1 border border-gray-300 rounded text-xs">
          Save
        </button>
      </div>
    </header>
  );
}
