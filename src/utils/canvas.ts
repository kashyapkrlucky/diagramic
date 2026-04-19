import { ToolType, type CanvasNode } from "../types";

export function drawShape(ctx: CanvasRenderingContext2D, node: CanvasNode) {
  ctx.fillStyle = node.color;
  if (
    node.data &&
    "x" in node.data &&
    "y" in node.data &&
    "width" in node.data &&
    "height" in node.data &&
    node.tool === ToolType.Square
  ) {
    ctx.fillRect(node.data.x, node.data.y, node.data.width, node.data.height);
  } else if (
    node.data &&
    "x" in node.data &&
    "y" in node.data &&
    "radius" in node.data &&
    node.tool === ToolType.Circle
  ) {
    ctx.beginPath();
    ctx.arc(node.data.x, node.data.y, node.data.radius, 0, 2 * Math.PI);
    ctx.fill();
  } else if (
    "x1" in node.data &&
    "y1" in node.data &&
    "x2" in node.data &&
    "y2" in node.data &&
    "x3" in node.data &&
    "y3" in node.data &&
    node.tool === ToolType.Triangle
  ) {
    // Triangle
    console.log(node.data);
    ctx.beginPath();
    ctx.moveTo(node.data.x1, node.data.y1);
    ctx.lineTo(node.data.x2, node.data.y2);
    ctx.lineTo(node.data.x3, node.data.y3);
    ctx.closePath();
    ctx.fillStyle = node.color;
    ctx.fill();
  } else if (
    "x" in node.data &&
    "y" in node.data &&
    "text" in node.data &&
    node.tool === ToolType.Text
  ) {
    ctx.fillText(node.data.text, node.data.x, node.data.y);
    ctx.font = "16px system-ui";
  } else if (
    "x" in node.data &&
    "y" in node.data &&
    node.tool === ToolType.Annotation
  ) {
    // so sticky note icon
    ctx.font = "20px system-ui";
    ctx.fillText("📝", node.data.x, node.data.y);
  } else if (
    "x1" in node.data &&
    "y1" in node.data &&
    "x2" in node.data &&
    "y2" in node.data &&
    node.tool === ToolType.Select
  ) {
    // Selection rectangle
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(node.data.x1, node.data.y1, node.data.x2 - node.data.x1, node.data.y2 - node.data.y1);
  } else {
    console.log("Unknown tool", node);
  }
}
