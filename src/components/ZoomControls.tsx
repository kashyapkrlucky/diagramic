import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from "lucide-react";

interface ZoomControlsProps {
  zoomPercentage: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export default function ZoomControls({
  zoomPercentage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}: ZoomControlsProps) {
  return (
    <div className="absolute bottom-5 left-5 bg-white border border-gray-300 rounded-lg shadow-md p-2 flex items-center gap-2">
      <button
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={onZoomOut}
        title="Zoom Out"
      >
        <ZoomOutIcon className="w-4 h-4" />
      </button>
      
      <div className="min-w-[60px] text-center text-sm font-medium">
        {zoomPercentage}%
      </div>
      
      <button
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        onClick={onZoomIn}
        title="Zoom In"
      >
        <ZoomInIcon className="w-4 h-4" />
      </button>
      
      <button
        className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
        onClick={onResetZoom}
        title="Reset Zoom"
      >
        <RotateCcwIcon className="w-4 h-4" />
      </button>
    </div>
  );
}
