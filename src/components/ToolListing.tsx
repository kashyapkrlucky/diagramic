import {
  MousePointer2Icon,
  DotIcon,
  CircleSmallIcon,
  CircleIcon,
  SquareIcon,
  TriangleIcon,
  MoveDownRightIcon,
  LineSquiggleIcon,
  TextCursorIcon,
  StickyNoteIcon,
  EraserIcon,
} from "lucide-react";

export const tools = [
    { name: "Select", icon: <MousePointer2Icon className="w-4 h-4" />, subTools: [] },
    {
      name: "Draw",
      icon: <LineSquiggleIcon className="w-4 h-4" />,
      subTools: [
        { name: "Free Draw", icon: <DotIcon className="w-4 h-4" />, subTools: [] },
        { name: "Straight Line", icon: <CircleSmallIcon className="w-4 h-4" />, subTools: [] },
        { name: "Curved Line", icon: <CircleIcon className="w-4 h-4" />, subTools: [] },
      ],
    },
    { name: "Square", icon: <SquareIcon className="w-4 h-4" />, subTools: [] },
    { name: "Circle", icon: <CircleIcon className="w-4 h-4" />, subTools: [] },
    { name: "Triangle", icon: <TriangleIcon className="w-4 h-4" />, subTools: [] },
    { name: "Arrow", icon: <MoveDownRightIcon className="w-4 h-4" />, subTools: [] },
    {
      name: "Eraser",
      icon: <EraserIcon className="w-4 h-4" />,
      subTools: [
        { name: "Eraser 1", icon: <DotIcon className="w-4 h-4" />, subTools: [] },
        { name: "Eraser 2", icon: <CircleSmallIcon className="w-4 h-4" />, subTools: [] },
        { name: "Eraser 3", icon: <CircleIcon className="w-4 h-4" />, subTools: [] },
      ],
    },
    { name: "Text", icon: <TextCursorIcon className="w-4 h-4" />, subTools: [] },
    { name: "Annotation", icon: <StickyNoteIcon className="w-4 h-4" />, subTools: [] },
  ]