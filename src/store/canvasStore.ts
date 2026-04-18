import { create } from "zustand";
import type { Tool } from "../types";
import { tools } from "../components/ToolListing";

interface CanvasStore {
  tools: Tool[];
  subTools: Tool[];
  setSubTools: (subTools: Tool[]) => void;
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
  selectedSubTool: Tool | null;
  setSelectedSubTool: (tool: Tool) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  tools: tools,
  subTools: [],
  setSubTools: (subTools: Tool[]) => set({ subTools }),
  selectedTool: null,
  setSelectedTool: (tool: Tool) =>
    set({ selectedTool: tool, subTools: tool.subTools || [] }),
  selectedSubTool: null,
  setSelectedSubTool: (tool: Tool) => set({ selectedSubTool: tool }),
}));
