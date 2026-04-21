import { ToolType } from "../types";

export const drawArrowPreview = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
): void => {
  ctx.strokeStyle = "#cccccc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
};

export const drawShapePreview = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string
): void => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]); // Create dashed line
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  ctx.setLineDash([]); // Reset to solid line
};

export const drawPreview = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  toolName: string,
  color: string
): void => {
  if (toolName === ToolType.Arrow) {
    drawArrowPreview(ctx, startX, startY, endX, endY);
  } else {
    drawShapePreview(ctx, startX, startY, endX, endY, color);
  }
};
