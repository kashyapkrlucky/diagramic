import {
  MousePointer2Icon,
  LineSquiggleIcon,
  CircleIcon,
  SquareIcon,
  DiamondIcon,
  SquareDashedIcon,
  EllipseIcon,
  CableIcon,
  TextCursorIcon,
  StickyNoteIcon,
} from "lucide-react";
import { ToolType } from "../types";

export const tools = [
  {
    name: ToolType.Select,
    icon: <MousePointer2Icon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Draw,
    icon: <LineSquiggleIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Square,
    icon: <SquareIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.SquareDashed,
    icon: <SquareDashedIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Circle,
    icon: <CircleIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Ellipse,
    icon: <EllipseIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Diamond,
    icon: <DiamondIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Arrow,
    icon: <CableIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Text,
    icon: <TextCursorIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Annotation,
    icon: <StickyNoteIcon className="w-4 h-4" />,
    subTools: [],
  },
];