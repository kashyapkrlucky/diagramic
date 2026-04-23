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
      const node = nodes.find((node) => {
        // Calculate bounds differently for shapes vs text nodes
        let x1, y1, x2, y2;
        
        if (node.x1 !== undefined && node.y1 !== undefined) {
          // Shape nodes: x1 and y1 are end coordinates
          x1 = Math.min(node.x, node.x1);
          y1 = Math.min(node.y, node.y1);
          x2 = Math.max(node.x, node.x1);
          y2 = Math.max(node.y, node.y1);
        } else {
          // Text nodes: use width and height from start position
          x1 = node.x;
          y1 = node.y;
          x2 = node.x + (node.width || 40);
          y2 = node.y + (node.height || 20);
        }
        
        return isPointInRect(
          x,
          y,
          x1,
          y1,
          x2,
          y2,
        )},
      );

      console.log(node);
      
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