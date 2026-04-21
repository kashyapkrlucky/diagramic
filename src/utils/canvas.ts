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

function setupTextStyle(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  color: string,
): void {
  ctx.fillStyle = color;
  ctx.font = `${fontSize}px Consolas, Monaco, 'Courier New', monospace`;
}

function drawCircle({ ctx, node }: DrawingContext): void {
  const { x, y, x1, y1 } = node;
  const radius = Math.sqrt(Math.pow((x1 || x) - x, 2) + Math.pow((y1 || y) - y, 2)) / 2;
  const centerX = x + radius;
  const centerY = y + radius;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawEllipse({ ctx, node }: DrawingContext): void {
  const { x, y, x1, y1 } = node;
  const radiusX = ((x1 || x) - x) / 2;
  const radiusY = ((y1 || y) - y) / 2;
  const centerX = x + radiusX;
  const centerY = y + radiusY;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function drawDiamond({ ctx, node }: DrawingContext): void {
  const { x, y, x1, y1 } = node;
  const centerX = ((x1 || x) + x) / 2;
  const centerY = ((y1 || y) + y) / 2;
  const width = Math.abs((x1 || x) - x);
  const height = Math.abs((y1 || y) - y);

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
  const { x, y, x1, y1 } = node;
  const width = (x1 || x) - x;
  const height = (y1 || y) - y;

  setupShapeStyle(ctx, node.color);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, DEFAULT_BORDER_RADIUS);
  ctx.fill();

  if (node.type === ToolType.SquareDashed) {
    ctx.setLineDash(DEFAULT_DASH_PATTERN);
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawText({ ctx, node }: DrawingContext): void {
  const { x, y, text } = node;

  setupTextStyle(ctx, DEFAULT_FONT_SIZE, node.color);
  ctx.fillText(text || '', x, y);
}

function drawAnnotation({ ctx, node }: DrawingContext): void {
  const { x, y } = node;

  setupTextStyle(ctx, DEFAULT_ANNOTATION_FONT_SIZE, node.color);
  ctx.fillText("📝", x, y);
}

function drawArrow({ ctx, node }: DrawingContext): void {
  const { x, y, x1, y1 } = node;

  setupShapeStyle(ctx, node.color);
  // Calculate control points for bezier curve
  const dx = (x1 || x) - x;
  const cx1 = x + dx * 0.5;
  const cy1 = y;
  const cx2 = x + dx * 0.5;
  const cy2 = y1 || y;

  // Draw curved path
  ctx.strokeStyle = node.color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(cx1, cy1, cx2, cy2, x1 || x, y1 || y);
  ctx.stroke();

  // Draw arrowhead
  const angle = Math.atan2((y1 || y) - cy2, (x1 || x) - cx2);
  ctx.save();
  ctx.translate(x1 || x, y1 || y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-10, -5);
  ctx.lineTo(-10, 5);
  ctx.closePath();
  ctx.fillStyle = node.color;
  ctx.fill();
  ctx.restore();
}

const DRAW_HANDLERS: Record<
  ToolType,
  ((context: DrawingContext) => void) | undefined
> = {
  [ToolType.Circle]: drawCircle,
  [ToolType.Ellipse]: drawEllipse,
  [ToolType.Diamond]: drawDiamond,
  [ToolType.Square]: drawSquare,
  [ToolType.SquareDashed]: drawSquare,
  [ToolType.Text]: drawText,
  [ToolType.Annotation]: drawAnnotation,
  [ToolType.Select]: undefined,
  [ToolType.Draw]: undefined,
  [ToolType.Arrow]: drawArrow,
  [ToolType.ArrowDashed]: drawArrow,
};

export function drawShape(
  ctx: CanvasRenderingContext2D,
  node: CanvasNode,
): void {
  const handler = DRAW_HANDLERS[node.type];

  if (!handler) {
    console.warn("Unsupported tool:", node.type, node);
    return;
  }

  if (!node) {
    console.warn("No data provided for tool");
    return;
  }
  handler({ ctx, node });
}
