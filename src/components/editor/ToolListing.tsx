import {
  MousePointer2Icon,
  HandIcon,
  LineSquiggleIcon,
  CircleIcon,
  SquareIcon,
  DiamondIcon,
  SquareDashedIcon,
  EllipseIcon,
  CableIcon,
  TextCursorIcon,
  // StickyNoteIcon,
} from "lucide-react";
import { ToolType } from "../../types";
import type { Tool } from "../../types";

export const tools: Tool[] = [
  { 
    name: ToolType.Select,
    icon: <MousePointer2Icon className="w-4 h-4" />,
    subTools: [],
  },
  { 
    name: ToolType.Hand,
    icon: <HandIcon className="w-4 h-4" />,
    subTools: [],
  },
  {
    name: ToolType.Draw,
    icon: <LineSquiggleIcon className="w-4 h-4" />,
    subTools: [
      {
        name: "Thin",
      },
      {
        name: "Medium",
      },
      {
        name: "Thick",
      },
    ],
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
];