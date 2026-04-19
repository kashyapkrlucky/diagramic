import { XIcon, Trash2Icon } from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";
import { ToolType } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { nodes, removeNode, updateNodeData } = useCanvasStore();
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
        <div className="divide-y divide-gray-200">
          {nodes.map((node) => (
            <div key={node.id} className="flex flex-col gap-2 py-2">
              <header className="flex flex-row items-center justify-between gap-2">
                <div className="text-sm">{node.tool}</div>
                <div>
                  <button onClick={() => removeNode(node.id)}>
                    <Trash2Icon className="w-3 h-3" />
                  </button>
                </div>
              </header>
              <section className="text-xs text-gray-500">
                {node.tool === ToolType.Square &&
                  node?.data &&
                  "x" in node.data &&
                  "y" in node.data &&
                  "width" in node.data &&
                  "height" in node.data && (
                  <div>
                    <div>
                      <input
                        type="number"
                        value={node.data.x}
                        onChange={(e) =>
                          updateNodeData(node.id, { x: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={node.data.y}
                        onChange={(e) =>
                          updateNodeData(node.id, { y: Number(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={node.data.width}
                        onChange={(e) =>
                          updateNodeData(node.id, {
                            width: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={node.data.height}
                        onChange={(e) =>
                          updateNodeData(node.id, {
                            height: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
