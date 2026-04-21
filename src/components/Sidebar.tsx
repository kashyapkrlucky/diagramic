import { XIcon, Trash2Icon } from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { nodes, removeNode, updateNodeData, selectedNode } = useCanvasStore();
  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-64 bg-gray-100 p-4 border-l border-gray-300 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      <header className="flex items-center justify-end">
        <button onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </button>
      </header>

      <section className="flex flex-col gap-2">
        <h2>Nodes</h2>
        <div className="flex flex-col gap-2 overflow-y-auto h-[calc(100vh-150px)] hide-scrollbar">
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`bg-white rounded-lg flex flex-col gap-2 p-3 ${selectedNode?.id === node.id ? "border-2 border-blue-500" : ""}`}
            >
              <header className="flex flex-row items-center justify-between gap-2">
                <div className="text-sm text-gray-700 font-semibold">{node.type}</div>
                <div>
                  <button onClick={() => removeNode(node.id)}>
                    <Trash2Icon className="w-3 h-3" />
                  </button>
                </div>
              </header>
              <section className="text-xs text-gray-500">
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase font-semibold">Start Point</div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="uppercase text-xs">X</p>
                    <input
                      type="number"
                      value={node.x}
                      className="w-14 border border-gray-300 rounded px-1 py-1 outline-none"
                      onChange={(e) =>
                        updateNodeData(node.id, {
                          x: Number(e.target.value),
                        })
                      }
                    />
                    <p className="uppercase text-xs">Y</p>
                    <input
                      type="number"
                      value={node.y}
                      className="w-14 border border-gray-300 rounded px-1 py-1 outline-none"
                      onChange={(e) =>
                        updateNodeData(node.id, {
                          y: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="text-sm font-semibold">End Point</div>
                  <div className="flex flex-row gap-2 items-center">
                    <p className="uppercase text-xs">X</p>
                    <input
                      type="number"
                      value={node.x1}
                      className="w-14 border border-gray-300 rounded px-1 py-1 outline-none"
                      onChange={(e) =>
                        updateNodeData(node.id, {
                          x1: Number(e.target.value),
                        })
                      }
                    />
                    <p className="uppercase text-xs">Y</p>
                    <input
                      type="number"
                      value={node.y1}
                      className="w-14 border border-gray-300 rounded px-1 py-1 outline-none"
                      onChange={(e) =>
                        updateNodeData(node.id, {
                          y1: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </section>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
