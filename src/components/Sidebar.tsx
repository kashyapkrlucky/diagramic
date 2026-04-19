import { XIcon } from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { nodes, removeNode } = useCanvasStore();
  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-64 bg-white p-4 border-l border-gray-300 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <header className="flex items-center justify-end">
        <button onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </button>
      </header>

      <section className="flex flex-col gap-2 overflow-y-auto">
        <h2>Nodes</h2>
        <ul className=" divide-y divide-gray-200">
          {nodes.map((node) => (
            <li key={node.id} className="flex items-center justify-between">
              <div>{node.tool?.name}</div>
              <div>
                <button onClick={() => removeNode(node.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
