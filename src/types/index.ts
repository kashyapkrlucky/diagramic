export const ToolType = {
  Select: "Select",
  Square: "Square",
  Circle: "Circle",
  Triangle: "Triangle",
  Text: "Text",
  Annotation: "Annotation",
} as const

export type ToolType = typeof ToolType[keyof typeof ToolType]

export interface Tool {
  name: string;
  icon: React.ReactNode;
  subTools: Tool[];
}
export interface Square {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}
export interface Triangle {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Text {
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export interface Arrow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
}

export type NodeData = Square | Circle | Triangle | Line | Text | Arrow | Annotation;

export interface CanvasNode {
  id: string;
  tool: ToolType;
  subTool: ToolType | null;
  color: string;
  data?: NodeData | null;
}