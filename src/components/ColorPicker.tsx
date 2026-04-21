import { useState, useRef, useEffect } from "react";
import { useCanvasStore } from "../store/canvasStore";

const colors = [
  "#000000",
  "#ff6b6b", 
  "#4ecdc4",
  "#45b7d1",
  "#96ceb4",
  "#feca57",
  "#ff9ff3",
  "#54a0ff",
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
    <div className="relative" ref={tooltipRef}>
      <button
        className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change color"
      />

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-1/2 w-40 transform -translate-x-1/2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((clr) => (
              <button
                key={clr}
                className={`w-7 h-7 rounded-md transition-all duration-200 ${
                  clr === color 
                    ? 'ring-2 ring-gray-400 ring-offset-1' 
                    : 'hover:scale-110'
                }`}
                style={{ backgroundColor: clr }}
                onClick={() => handleColorSelect(clr)}
                aria-label={`Select color ${clr}`}
              />
            ))}
          </div>
          
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white"></div>
          </div>
        </div>
      )}
    </div>
  );
}
