/**
 * Text editor component for editing text nodes
 */
import { useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../../store/canvasStore";
import { useZoomPan } from "../../hooks/useZoomPan";
import type { CanvasNode } from "../../types";

interface TextEditorProps {
  node: CanvasNode;
  onSave: (text: string) => void;
  onCancel: () => void;
}

export default function TextEditor({ node, onSave, onCancel }: TextEditorProps) {
  const { editText } = useCanvasStore();
  const { zoomPan, canvasToScreen } = useZoomPan();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(() => node.text || editText || "");

  // Position the input at the node's screen coordinates
  const screenCoords = canvasToScreen(node.x, node.y);

  useEffect(() => {
    // Focus the input when it appears
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSave(value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    // Save on blur
    onSave(value);
  };

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div
      className="absolute z-50"
      style={{
        left: `${screenCoords.x}px`,
        top: `${screenCoords.y}px`,
        transform: `scale(${zoomPan.scale})`,
        transformOrigin: "top left",
      }}
    >
      <div className="flex items-center bg-white border border-gray-300 rounded shadow-lg">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="px-2 py-1 text-sm border-none outline-none min-w-[100px]"
          placeholder="Enter text..."
          style={{
            fontSize: `${16 * zoomPan.scale}px`,
            color: node.color,
          }}
        />
        <div className="flex gap-1 px-1">
          <button
            onClick={handleSave}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
