import { useCallback, useRef } from "react";
import type { CanvasNode } from "../types";

/**
 * Custom hook for mouse position tracking
 */
export const useMousePosition = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) => {
  const mousePosition = useRef({ x: 0, y: 0 });

  const getMousePosition = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mousePosition.current = { x, y };
      return { x, y };
    },
    [canvasRef],
  );

  return { getMousePosition, mousePosition };
};


/**
 * Get node at position
 */
export const useNodeAtPosition = (nodes: CanvasNode[]) => {
  const getNodeAtPosition = useCallback(
    (x: number, y: number): CanvasNode | null => {
      const node = nodes.find((node) =>
        isPointInRect(
          x,
          y,
          node.x,
          node.y,
          (node.x1 || node.x) + (node.width || 0),
          (node.y1 || node.y) + (node.height || 0),
        ),
      );
      return node || null;
    },
    [nodes],
  );

  return { getNodeAtPosition };
};


/**
 * Check if point is within rectangle bounds
 */
export const isPointInRect = (
  pointX: number,
  pointY: number,
  rectX1: number,
  rectY1: number,
  rectX2: number,
  rectY2: number,
): boolean => {
  return (
    pointX >= rectX1 &&
    pointX <= rectX2 &&
    pointY >= rectY1 &&
    pointY <= rectY2
  );
};