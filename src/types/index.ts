export const ToolType = {
  Select: "Select",
  Draw: "Draw",
  Square: "Square",
  SquareDashed: "SquareDashed",
  Circle: "Circle",
  Ellipse: "Ellipse",
  Diamond: "Diamond",
  Arrow: "Arrow",
  ArrowDashed: "ArrowDashed",
  Text: "Text",
  Annotation: "Annotation",
} as const

export type ToolType = typeof ToolType[keyof typeof ToolType]

export interface Tool {
  name: string;
  icon: React.ReactNode;
  subTools: {name: string}[];
}

export interface Square {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Draw {
  points: { x: number; y: number }[];
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

export interface Arrow {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface ArrowDashed extends Arrow {
  dashPattern: number[];
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

export type NodeDataType = Square | SquareDashed | Circle | Ellipse | Diamond | Arrow | Text | Annotation | Draw;

export interface CanvasNode {
  id: string;
  type: ToolType;
  color: string;
  x: number;
  y: number;
  x1?: number;
  y1?: number;
  text?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  radius?: number;
  data?: NodeDataType | null;
}


export const EDGE_COLORS = {
  DEFAULT: '#666',
  SELECTED: '#007AFF',
  HOVER: '#0056b3',
  DASHED: '#999',
} as const;
