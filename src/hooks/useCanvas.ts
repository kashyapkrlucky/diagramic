import { useCallback, useEffect } from "react";
import { type CanvasNode } from "../types";
import { drawShape } from "../utils/canvas";

interface ZoomPanState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  zoomPan: ZoomPanState
) => {
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  }, [canvasRef]);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, [canvasRef, getContext]);

  const drawGrid = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    // Save context state
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(zoomPan.offsetX, zoomPan.offsetY);
    ctx.scale(zoomPan.scale, zoomPan.scale);

    // Calculate visible area in canvas coordinates
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    const startX = -zoomPan.offsetX / zoomPan.scale;
    const startY = -zoomPan.offsetY / zoomPan.scale;
    const endX = startX + canvasWidth / zoomPan.scale;
    const endY = startY + canvasHeight / zoomPan.scale;

    // set bg color
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(startX, startY, endX - startX, endY - startY);

    // draw dotted grid
    ctx.fillStyle = "#e7e7e7";
    const spacing = 50;

    // Calculate grid range
    const gridStartX = Math.floor(startX / spacing) * spacing;
    const gridStartY = Math.floor(startY / spacing) * spacing;
    const gridEndX = Math.ceil(endX / spacing) * spacing;
    const gridEndY = Math.ceil(endY / spacing) * spacing;

    for (let x = gridStartX; x <= gridEndX; x += spacing) {
      for (let y = gridStartY; y <= gridEndY; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Restore context state
    ctx.restore();
  }, [getContext, zoomPan]);

  const clearCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawGrid();
  }, [getContext, drawGrid]);

  const draw = useCallback((nodes: CanvasNode[]) => {
    const ctx = getContext();
    if (!ctx) return;

    // Save context state
    ctx.save();

    // Apply zoom and pan transformations
    ctx.translate(zoomPan.offsetX, zoomPan.offsetY);
    ctx.scale(zoomPan.scale, zoomPan.scale);

    if (nodes.length > 0) {
      nodes.forEach((node: CanvasNode) => {
        if (!node) return;
        drawShape(ctx, node);
      });
    }

    // Restore context state
    ctx.restore();
  }, [getContext, zoomPan]);

  useEffect(() => {
    const handleResize = () => {
      setCanvasSize();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setCanvasSize]);

  return {
    getContext,
    setCanvasSize,
    drawGrid,
    clearCanvas,
    draw,
  };
};
