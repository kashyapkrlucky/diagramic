import { useCallback, useEffect, useRef } from "react";
import { useCanvasStore } from "../store/canvasStore";
import type { CanvasNode } from "../types";

interface CanvasProps {
  action: string;
}

export default function Canvas({ action }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { selectedTool, addNode, nodes, removeNodes } = useCanvasStore();

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

        // Handle different shape types
        const data = node.data;
        if ("x" in data && "y" in data && "width" in data && "height" in data) {
          // Square
          ctx.fillStyle = node.color;
          ctx.fillRect(data.x, data.y, data.width, data.height);
        } else if (
          "x1" in data &&
          "y1" in data &&
          "x2" in data &&
          "y2" in data &&
          "x3" in data &&
          "y3" in data
        ) {
          // Triangle
          console.log(data);
          ctx.beginPath();
          ctx.moveTo(data.x1, data.y1);
          ctx.lineTo(data.x2, data.y2);
          ctx.lineTo(data.x3, data.y3);
          ctx.closePath();
          ctx.fillStyle = node.color;
          ctx.fill();
        } else if (
          "x1" in data &&
          "y1" in data &&
          "x2" in data &&
          "y2" in data
        ) {
          // Line, Arrow
          ctx.beginPath();
          ctx.moveTo(data.x1, data.y1);
          ctx.lineTo(data.x2, data.y2);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if ("x" in data && "y" in data && "text" in data) {
          // Text, Annotation
          ctx.fillText(data.text, data.x, data.y);
        } else if ("x" in data && "y" in data && "radius" in data) {
          // Circle
          ctx.beginPath();
          ctx.arc(data.x, data.y, data.radius, 0, 2 * Math.PI);
          ctx.fillStyle = node.color;
          ctx.fill();
        }
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
      const node: CanvasNode = {
        id: Date.now().toString(),
        tool: selectedTool,
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
      } else if (selectedTool?.name === "Line") {
        node.data = {
          x1: x,
          y1: y,
          x2: x + 100,
          y2: y + 100,
        };
      } else if (selectedTool?.name === "Arrow") {
        node.data = {
          x1: x,
          y1: y,
          x2: x + 100,
          y2: y + 100,
        };
      } else if (selectedTool?.name === "Text") {
        node.data = {
          x: x,
          y: y,
          text: "Text",
          fontSize: 16,
        };
      }
      addNode(node);
    },
    [selectedTool, addNode],
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
    ></canvas>
  );
}
