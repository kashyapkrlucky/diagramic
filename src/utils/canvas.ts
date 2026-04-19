import { ToolType, type CanvasNode } from "../types";

const DEFAULT_STROKE_WIDTH = 2;
const DEFAULT_FILL_COLOR = "#ffffff";
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_ANNOTATION_FONT_SIZE = 20;
const DEFAULT_BORDER_RADIUS = 5;
const DEFAULT_DASH_PATTERN = [5, 5];

interface DrawingContext {
  ctx: CanvasRenderingContext2D;
  node: CanvasNode;
}

function setupShapeStyle(ctx: CanvasRenderingContext2D, color: string): void {
  ctx.fillStyle = DEFAULT_FILL_COLOR;
  ctx.strokeStyle = color;
  ctx.lineWidth = DEFAULT_STROKE_WIDTH;
}

function setupTextStyle(ctx: CanvasRenderingContext2D, fontSize: number): void {
  ctx.font = `${fontSize}px system-ui`;
}

function drawCircle({ ctx, node }: DrawingContext): void {
  const { x1, y1, x2 } = node.data as { x1: number; y1: number; x2: number };
  const radius = (x2 - x1) / 2;
  const centerX = x1 + radius;
  const centerY = y1 + radius;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawEllipse({ ctx, node }: DrawingContext): void {
  const { x1, y1, x2, y2 } = node.data as { x1: number; y1: number; x2: number; y2: number };
  const radiusX = (x2 - x1) / 2;
  const radiusY = (y2 - y1) / 2;
  const centerX = x1 + radiusX;
  const centerY = y1 + radiusY;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawDiamond({ ctx, node }: DrawingContext): void {
  const { x1, y1, x2, y2 } = node.data as { x1: number; y1: number; x2: number; y2: number };
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - height / 2);
  ctx.lineTo(centerX + width / 2, centerY);
  ctx.lineTo(centerX, centerY + height / 2);
  ctx.lineTo(centerX - width / 2, centerY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawSquare({ ctx, node }: DrawingContext): void {
  const { x1, y1, x2, y2 } = node.data as { x1: number; y1: number; x2: number; y2: number };
  const width = x2 - x1;
  const height = y2 - y1;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.roundRect(x1, y1, width, height, DEFAULT_BORDER_RADIUS);
  ctx.fill();

  if (node.tool === ToolType.SquareDashed) {
    ctx.setLineDash(DEFAULT_DASH_PATTERN);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawText({ ctx, node }: DrawingContext): void {
  const { x, y, text } = node.data as { x: number; y: number; text: string };
  
  setupTextStyle(ctx, DEFAULT_FONT_SIZE);
  ctx.fillText(text, x, y);
}

function drawAnnotation({ ctx, node }: DrawingContext): void {
  const { x, y } = node.data as { x: number; y: number };
  
  setupTextStyle(ctx, DEFAULT_ANNOTATION_FONT_SIZE);
  ctx.fillText("📝", x, y);
}


const DRAW_HANDLERS: Record<ToolType, ((context: DrawingContext) => void) | undefined> = {
  [ToolType.Circle]: drawCircle,
  [ToolType.Ellipse]: drawEllipse,
  [ToolType.Diamond]: drawDiamond,
  [ToolType.Square]: drawSquare,
  [ToolType.SquareDashed]: drawSquare,
  [ToolType.Text]: drawText,
  [ToolType.Annotation]: drawAnnotation,
  [ToolType.Select]: undefined,
  [ToolType.Draw]: undefined,
};

export function drawShape(ctx: CanvasRenderingContext2D, node: CanvasNode): void {
  const handler = DRAW_HANDLERS[node.tool];
  
  if (!handler) {
    console.warn("Unsupported tool:", node.tool, node);
    return;
  }

  if (!node.data) {
    console.warn("No data provided for tool:", node.tool);
    return;
  }

  handler({ ctx, node });
}
