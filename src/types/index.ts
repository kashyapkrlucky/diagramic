export const ToolType = {
  Select: "Select",
  Draw: "Draw",
  Square: "Square",
  SquareDashed: "SquareDashed",
  Circle: "Circle",
  Ellipse: "Ellipse",
  Diamond: "Diamond",
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
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Draw {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  strokeColor: string;
  strokeWidth: number;
  strokeStyle: 'solid' | 'dashed';
}

export interface SquareDashed extends Square {
  borderRadius: number;
}

export interface Diamond {
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

export interface Ellipse {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Text {
  x: number;
  y: number;
  text: string;
  fontSize: number;
}

export interface Annotation {
  x: number;
  y: number;
  text: string;
}

export type NodeDataType = Square | SquareDashed | Circle | Ellipse | Diamond | Text | Annotation;

export interface CanvasNode {
  id: string;
  tool: ToolType;
  subTool: ToolType | null;
  color: string;
  data?: NodeDataType | null;
}