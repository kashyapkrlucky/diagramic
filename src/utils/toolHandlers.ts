import { ToolType, type CanvasNode } from "../types";
import { useCanvasStore } from "../store/canvasStore";

export const isShapeTool = (toolName: string): boolean => {
  return toolName === ToolType.Square ||
         toolName === ToolType.SquareDashed ||
         toolName === ToolType.Circle ||
         toolName === ToolType.Ellipse ||
         toolName === ToolType.Diamond ||
         toolName === ToolType.Arrow;
};

export const isTextTool = (toolName: string): boolean => {
  return toolName === ToolType.Text || toolName === ToolType.Annotation;
};

export const createTextNode = (x: number, y: number, toolName: string): CanvasNode => {
  const color = useCanvasStore.getState().color;
  // Estimate text dimensions based on font size and text length
  const fontSize = toolName === "Annotation" ? 20 : 16;
  const textLength = 4; // Default "Text" length
  const estimatedWidth = textLength * fontSize * 0.6; // Approximate character width
  const estimatedHeight = fontSize;
  
  return {
    id: Date.now().toString(),
    type: toolName as ToolType,
    color: color,
    x: x,
    y: y,
    text: "Text",
    width: estimatedWidth,
    height: estimatedHeight,
  };
};

export const createShapeNode = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  toolName: string
): CanvasNode | null => {
  if (!startX || !startY) return null;
  if (startX < endX && startY < endY) {
    const color = useCanvasStore.getState().color;
    return {
      id: Date.now().toString(),
      type: toolName as ToolType,
      color: color,
      x: startX,
      y: startY,
      x1: endX,
      y1: endY,
    };
  }
  return null;
};
