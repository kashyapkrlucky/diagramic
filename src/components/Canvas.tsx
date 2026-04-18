interface CanvasProps {
  onAction: (action: string) => void;
}

export default function Canvas({ onAction }: CanvasProps) {
  return <canvas className="absolute inset-0 w-full h-full bg-gray-100" onClick={() => onAction("click")}></canvas>;
}