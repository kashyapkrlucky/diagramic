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

export interface CanvasNode {
  id: string;
  tool: Tool;
  subTool: Tool | null;
  color: string;
  data?: Square | Circle | Triangle | Line | Text | Arrow | Annotation | null;
}