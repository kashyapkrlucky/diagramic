import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../../store/canvasStore";
import { ToolType, type CanvasNode } from "../../types";
import { drawShape } from "../../utils/canvas";
import { useMousePosition, useNodeAtPosition } from "../../hooks/usePosition";

interface CanvasProps {
  action: string;
}

export default function Canvas({ action }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { selectedTool, addNode, nodes, removeNodes, setSelectedNode } =
    useCanvasStore();
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const { getMousePosition } = useMousePosition(canvasRef);
  const { getNodeAtPosition } = useNodeAtPosition(nodes);

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

  // Draw grid on canvas
  const drawGrid = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    // set bg color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // draw dotted grid
    ctx.fillStyle = "#e7e7e7";
    const spacing = 15;

    for (let x = spacing; x < ctx.canvas.width; x += spacing) {
      for (let y = spacing; y < ctx.canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, [getContext]);

  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid();
  }, [getContext, drawGrid]);

  const draw = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    if (nodes.length > 0) {
      nodes.forEach((node: CanvasNode) => {
        if (!node) return;
        drawShape(ctx, node);
      });
    }
  }, [getContext, nodes]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);

      const color = useCanvasStore.getState().color;
      if (!selectedTool) return;

      const existingNode = getNodeAtPosition(x, y);
      if (existingNode) {
        setSelectedNode(existingNode);

        return;
      }
      const toolName = selectedTool;
      if (
        toolName === ToolType.Square ||
        toolName === ToolType.SquareDashed ||
        toolName === ToolType.Circle ||
        toolName === ToolType.Ellipse ||
        toolName === ToolType.Diamond ||
        toolName === ToolType.Arrow
      ) {
        setStartX(x);
        setStartY(y);
        return;
      } else if (
        toolName === ToolType.Text ||
        toolName === ToolType.Annotation
      ) {
        const node: CanvasNode = {
          id: Date.now().toString(),
          type: toolName as ToolType,
          color: color,
          x: x,
          y: y,
          text: "Text",
        };
        addNode(node);
      } else if (toolName === ToolType.Select) {
        // No action needed
      }
    },
    [
      selectedTool,
      addNode,
      setStartX,
      setStartY,
      getMousePosition,
      getNodeAtPosition,
      setSelectedNode,
    ],
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

      const color = useCanvasStore.getState().color;
      if (!selectedTool) return;

      const toolName = selectedTool;

      if (
        toolName === ToolType.Square ||
        toolName === ToolType.SquareDashed ||
        toolName === ToolType.Circle ||
        toolName === ToolType.Ellipse ||
        toolName === ToolType.Diamond ||
        toolName === ToolType.Arrow
      ) {
        if (!startX || !startY) return;
        if (startX < x && startY < y) {
          addNode({
            id: Date.now().toString(),
            type: toolName as ToolType,
            color: color,
            x: startX,
            y: startY,
            x1: x,
            y1: y,
          });
        }
        setStartX(0);
        setStartY(0);

        return;
      }
    },
    [
      selectedTool,
      addNode,
      startX,
      startY,
      getMousePosition,
      getNodeAtPosition,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (startX && startY) {
        const { x, y } = getMousePosition(e);
        const color = useCanvasStore.getState().color;
        const ctx = getContext();
        if (!ctx) return;

        // Clear canvas and redraw existing shapes
        clearCanvas();
        draw();
        const toolName = selectedTool;
        if (toolName === ToolType.Arrow) {
          // Draw arrow preview
          ctx.strokeStyle = "#cccccc";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(x, y);
          ctx.stroke();
        } else {
          // Draw selection preview with dashed line
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]); // Create dashed line
          ctx.strokeRect(startX, startY, x - startX, y - startY);
          ctx.setLineDash([]); // Reset to solid line
        }
      }
    },
    [
      startX,
      startY,
      getContext,
      clearCanvas,
      draw,
      selectedTool,
      getMousePosition,
    ],
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
  }, [setCanvasSize, clearCanvas, draw, drawGrid]);

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
