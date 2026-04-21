import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { useMousePosition, useNodeAtPosition } from "../hooks/usePosition";
import { useCanvas } from "../hooks/useCanvas";
import { isShapeTool, isTextTool, createTextNode, createShapeNode } from "../utils/toolHandlers";
import { drawPreview } from "../utils/previewDrawing";

interface CanvasProps {
  action: string;
}

export default function Canvas({ action }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedTool, addNode, nodes, removeNodes, setSelectedNode } = useCanvasStore();
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const { getMousePosition } = useMousePosition(canvasRef);
  const { getNodeAtPosition } = useNodeAtPosition(nodes);
  const { getContext, setCanvasSize, clearCanvas, draw } = useCanvas(canvasRef);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);

      if (!selectedTool) return;

      const existingNode = getNodeAtPosition(x, y);
      if (existingNode) {
        setSelectedNode(existingNode);
        return;
      }

      if (isTextTool(selectedTool)) {
        const node = createTextNode(x, y, selectedTool);
        addNode(node);
      } else if (isShapeTool(selectedTool)) {
        setStartX(x);
        setStartY(y);
      }
      // Select tool requires no action
    },
    [selectedTool, addNode, setStartX, setStartY, getMousePosition, getNodeAtPosition, setSelectedNode]
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);

      const existingNode = getNodeAtPosition(x, y);
      if (existingNode) {
        return;
      }

      if (!selectedTool || !isShapeTool(selectedTool)) return;

      const node = createShapeNode(startX, startY, x, y, selectedTool);
      if (node) {
        addNode(node);
      }
      
      setStartX(0);
      setStartY(0);
    },
    [selectedTool, addNode, startX, startY, getMousePosition, getNodeAtPosition]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      if (startX && startY) {
        const { x, y } = getMousePosition(e);
        const ctx = getContext();
        if (!ctx) return;

        // Clear canvas and redraw existing shapes
        clearCanvas();
        draw(nodes);

        const color = useCanvasStore.getState().color;
        drawPreview(ctx, startX, startY, x, y, selectedTool || '', color);
      }
    },
    [startX, startY, getContext, clearCanvas, draw, selectedTool, getMousePosition, nodes]
  );

  useEffect(() => {
    if (action === "clear") {
      clearCanvas();
      removeNodes();
    }
  }, [action, clearCanvas, removeNodes]);

  useEffect(() => {
    setCanvasSize();
    clearCanvas();
    draw(nodes);
  }, [setCanvasSize, clearCanvas, draw, nodes]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
}
