import { useCallback, useEffect } from "react";
import { type CanvasNode } from "../types";
import { drawShape } from "../utils/canvas";

export const useCanvas = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
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

  const draw = useCallback((nodes: CanvasNode[]) => {
    const ctx = getContext();
    if (!ctx) return;

    if (nodes.length > 0) {
      nodes.forEach((node: CanvasNode) => {
        if (!node) return;
        drawShape(ctx, node);
      });
    }
  }, [getContext]);

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
