import { XIcon, Trash2Icon, ChevronRightIcon } from "lucide-react";
import { useCanvasStore } from "../store/canvasStore";
import { useState } from "react";
import type { CanvasNode } from "../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AccordionItemProps {
  node: CanvasNode;
  isSelected: boolean;
  onRemove: () => void;
}

function AccordionItem({ node, isSelected, onRemove }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 ${
          isSelected ? "border-2 border-blue-500" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <ChevronRightIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          <span className="text-xs text-gray-700 font-medium">{node.type}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 hover:bg-red-50 rounded transition-colors"
        >
          <Trash2Icon className="w-3 h-3 text-red-500" />
        </button>
      </button>
      
      {isOpen && (
        <div className="px-3 py-3 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <span>{node.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ID:</span>
              <span className="font-mono text-xs">{node.id}</span>
            </div>
            {node.color && (
              <div className="flex justify-between">
                <span className="font-medium">Color:</span>
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: node.color }}
                  />
                  <span className="text-xs">{node.color}</span>
                </div>
              </div>
            )}
            {/* {node.data && (
              <div className="flex justify-between">
                <span className="font-medium">Data:</span>
                <span className="text-xs">{JSON.stringify(node.data)}</span>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { nodes, removeNode, selectedNode } = useCanvasStore();

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-64 bg-gray-100 border-l border-gray-300 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <header className="flex items-center justify-end p-4">
        <button onClick={onClose}>
          <XIcon className="w-4 h-4" />
        </button>
      </header>

      <section className="px-4 pb-4">
        <h2 className="text-xs font-semibold text-gray-700 mb-2">Nodes</h2>
        <div className="overflow-y-auto hide-scrollbar" style={{ height: 'calc(100vh - 100px)' }}>
          {nodes.length === 0 && (
            <div className="text-xs text-gray-500 text-center py-4">
              Please add some shapes or drawings to the canvas
            </div>
          )}
          <div className="flex flex-col gap-1">
            {nodes.map((node) => (
              <AccordionItem
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onRemove={() => removeNode(node.id)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
