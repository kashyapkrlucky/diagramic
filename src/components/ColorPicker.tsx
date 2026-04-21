import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "../store/canvasStore";

const colors = [
  "#000000", // Black
  "#ffffff", // White
  "#ff6b6b", // Red
  "#ee5a6f", // Pink
  "#ff9ff3", // Light Pink
  "#c44569", // Dark Pink
  "#4ecdc4", // Teal
  "#45b7d1", // Blue
  "#54a0ff", // Light Blue
  "#5f27cd", // Purple
  "#00d2d3", // Cyan
  "#96ceb4", // Green
  "#6ab04c", // Light Green
  "#feca57", // Yellow
  "#ff9f43", // Orange
  "#ff6348", // Coral
  "#786fa6", // Lavender
  "#546de5", // Indigo
  "#e15f41", // Red Orange
  "#3dc1d3", // Sky Blue
];

export default function ColorPicker() {
  const { color, setColor } = useCanvasStore();
  const [isOpen, setIsOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleColorSelect = (selectedColor: string) => {
    setColor(selectedColor);
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center" ref={tooltipRef}>
      <button
        className="w-6 h-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group relative"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change color"
        title="Choose color"
      >
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 z-50 min-w-[200px]">
          <div className="text-xs font-medium text-gray-600 mb-3 text-center">Choose Color</div>
          <div className="grid grid-cols-4 gap-1">
            {colors.map((clr) => (
              <button
                key={clr}
                className={`w-7 h-7 rounded-lg transition-all duration-200 relative ${
                  clr === color 
                    ? 'ring-2 ring-blue-500 ring-offset-2 shadow-md' 
                    : 'hover:scale-105 hover:shadow-sm border border-gray-200'
                }`}
                style={{ backgroundColor: clr }}
                onClick={() => handleColorSelect(clr)}
                aria-label={`Select color ${clr}`}
                title={clr}
              >
                {clr === color && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white drop-shadow-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
}
