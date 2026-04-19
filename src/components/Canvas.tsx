import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../store/canvasStore";
import { ToolType, type CanvasNode } from "../types";
import { drawShape } from "../utils/canvas";

interface CanvasProps {
  action: string;
}

export default function Canvas({ action }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { selectedTool, addNode, nodes, removeNodes } = useCanvasStore();
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, []);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, [getContext]);

  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }, [getContext]);

  const draw = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    if (nodes.length > 0) {
      nodes.forEach((node: CanvasNode) => {
        if (!node.data) return;
        drawShape(ctx, node);
      });
    }
  }, [getContext, nodes]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const color = useCanvasStore.getState().color;
      if (!selectedTool) return;

      if (selectedTool.name === ToolType.Select) {
        setStartX(x);
        setStartY(y);
        return;
      } else {
        const node: CanvasNode = {
          id: Date.now().toString(),
          tool: selectedTool.name as ToolType,
          subTool: null,
          data: null,
          color: color,
        };

        if (selectedTool?.name === "Square") {
          node.data = {
            x: x,
            y: y,
            width: 100,
            height: 100,
          };
        } else if (selectedTool?.name === "Circle") {
          node.data = {
            x: x,
            y: y,
            radius: 50,
          };
        } else if (selectedTool?.name === "Triangle") {
          node.data = {
            x1: x,
            y1: y,
            x2: x - 50,
            y2: y + 100,
            x3: x + 50,
            y3: y + 100,
          };
        } else if (
          selectedTool?.name === "Text" ||
          selectedTool?.name === "Annotation"
        ) {
          node.data = {
            x: x,
            y: y,
            text: "Text",
            fontSize: 16,
          };
        }
        addNode(node);
      }
    },
    [selectedTool, addNode, setStartX, setStartY],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const color = useCanvasStore.getState().color;
      if (!selectedTool) return;

      if (selectedTool.name === ToolType.Select) {
        addNode({
          id: Date.now().toString(),
          tool: ToolType.Select,
          subTool: null,
          data: {
            x1: startX,
            y1: startY,
            x2: x,
            y2: y,
          },
          color: color,
        });
        setStartX(0);
        setStartY(0);
        return;
      }
    },
    [selectedTool, addNode, startX, startY],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (startX && startY) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const color = useCanvasStore.getState().color;
        const ctx = getContext();
        if (!ctx) return;
        
        // Clear canvas and redraw existing shapes
        clearCanvas();
        draw();
        
        // Draw selection preview with dashed line
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]); // Create dashed line
        ctx.strokeRect(startX, startY, x - startX, y - startY);
        ctx.setLineDash([]); // Reset to solid line
      }
    },
    [startX, startY, getContext, clearCanvas, draw],
  );

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCanvasSize]);

  useEffect(() => {
    if (action === "clear") {
      clearCanvas();
      removeNodes();
    }
  }, [action, clearCanvas, removeNodes]);

  useEffect(() => {
    setCanvasSize();
    clearCanvas();
    draw();
  }, [setCanvasSize, clearCanvas, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full bg-gray-100"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}
