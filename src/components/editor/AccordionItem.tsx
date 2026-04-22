import { useState } from "react";
import type { CanvasNode } from "../../types";
import { ChevronRightIcon, Trash2Icon } from "lucide-react";

interface AccordionItemProps {
  node: CanvasNode;
  isSelected: boolean;
  onRemove: () => void;
}

export function AccordionItem({
  node,
  isSelected,
  onRemove,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <div
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
      </div>

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
