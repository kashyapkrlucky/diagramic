import {
  BrushCleaningIcon,
  Loader2Icon,
  RedoIcon,
  SaveIcon,
  UndoIcon,
} from "lucide-react";
import { useCanvasStore } from "../../store/canvasStore";
import type { Tool, ToolType } from "../../types";
import ColorPicker from "./ColorPicker";
import { useEffect, useRef, useState } from "react";
import { useDrawingStore } from "../../store/drawingStore";

interface ToolBarProps {
  onCanvasAction: (action: string) => void;
}

export default function ToolBar({ onCanvasAction }: ToolBarProps) {
  const toolBarRef = useRef<HTMLDivElement>(null);
  const [showSubTools, setShowSubTools] = useState(false);
  const {
    tools,
    selectedTool,
    setSelectedTool,
    subTools,
    selectedSubTool,
    setSelectedSubTool,
  } = useCanvasStore();
  const { isUpdating } = useDrawingStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolBarRef.current &&
        !toolBarRef.current.contains(event.target as Node)
      ) {
        setShowSubTools(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!tools) return null;

  const getSelectedToolIndex = () => {
    return tools.findIndex((tool: Tool) => tool.name === selectedTool);
  };

  const handleToolClick = (toolName: ToolType) => {
    setSelectedTool(toolName);
    setShowSubTools(true);
  };

  const handleSubToolClick = (subToolName: string) => {
    setSelectedSubTool(subToolName);
    setShowSubTools(false);
  };

  const getStrokeSize = (toolName: string) => {
    switch (toolName) {
      case "Thin":
        return "h-0.5";
      case "Medium":
        return "h-2";
      case "Thick":
        return "h-3";
      default:
        return "h-1";
    }
  };

  // Editor navbar
  const actions = [
    { icon: <UndoIcon className="w-4 h-4" />, name: "undo", label: "Undo" },
    { icon: <RedoIcon className="w-4 h-4" />, name: "redo", label: "Redo" },
    {
      icon: <BrushCleaningIcon className="w-4 h-4" />,
      name: "clear",
      label: "Clear Canvas",
    },
    { icon: <SaveIcon className="w-4 h-4" />, name: "save", label: "Save" },
  ];

  const selectedToolIndex = getSelectedToolIndex();

  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center gap-2"
      ref={toolBarRef}
    >
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 relative">
        {tools.map((tool: Tool, index: number) => (
          <button
            key={tool.name}
            onClick={() => handleToolClick(tool.name as ToolType)}
            className={`p-2 rounded-md transition-all duration-200 group relative ${
              selectedTool === tool.name
                ? "bg-white shadow-sm text-blue-600"
                : "hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-800"
            }`}
            title={tool.name}
            data-index={index}
          >
            <span className="w-4 h-4 flex items-center justify-center">
              {tool.icon}
            </span>
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {tool.name}
            </span>
          </button>
        ))}

        {/* ToolOptions popup positioned near selected tool */}
        {selectedTool && subTools.length > 0 && showSubTools && (
          <div
            className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 z-50"
            style={{
              left: `${selectedToolIndex * 40 + 20}px`,
              transform: "translateX(-50%)",
            }}
          >
            <div className="text-xs font-medium text-gray-600 mr-1">
              Stroke:
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
              {subTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={() => handleSubToolClick(tool.name)}
                  className={`px-3 py-2 rounded-md transition-all duration-200 group relative flex items-center justify-center ${
                    selectedSubTool === tool.name
                      ? "bg-white shadow-sm text-blue-600"
                      : "hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-800"
                  }`}
                  title={`${tool.name} stroke`}
                >
                  <div
                    className={`w-4 ${getStrokeSize(tool.name)} ${
                      selectedSubTool === tool.name
                        ? "bg-blue-600"
                        : "bg-gray-600 group-hover:bg-gray-800"
                    } rounded-full transition-colors`}
                  ></div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-2 px-1">
        <ColorPicker />

        {actions.map((action) => (
          <button
            key={action.name}
            className="p-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 group relative"
            onClick={() => onCanvasAction(action.name)}
            title={action.label}
          >
            {isUpdating && action.name === "save" ? (
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                <Loader2Icon className="w-4 h-4 animate-spin" />
              </span>
            ) : (
              <span className="text-gray-600 group-hover:text-gray-800 transition-colors">
                {action.icon}
              </span>
            )}
            <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
