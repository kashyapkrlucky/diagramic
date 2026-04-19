import { create } from "zustand";
import type { Tool, CanvasNode } from "../types";
import { tools } from "../components/ToolListing";

interface CanvasStore {
  tools: Tool[];
  subTools: Tool[];
  setSubTools: (subTools: Tool[]) => void;
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
  selectedSubTool: Tool | null;
  setSelectedSubTool: (tool: Tool) => void;
  color: string;
  setColor: (color: string) => void;


  nodes: CanvasNode[];
  addNode: (node: CanvasNode) => void;
  removeNode: (nodeId: string) => void;
  removeNodes: () => void;
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
  color: "#000000",
  setColor: (color: string) => set({ color }),
  
  nodes: [],
  addNode: (node: CanvasNode) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (nodeId: string) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== nodeId) })),
  removeNodes: () => set({ nodes: [] }),
}));
