import { create } from "zustand";
import type { Tool, CanvasNode, NodeDataType, ToolType } from "../types";
import { tools } from "../components/ToolListing";

interface CanvasStore {
  tools: Tool[];
  subTools: Tool[];
  setSubTools: (subTools: Tool[]) => void;
  selectedTool: Tool | ToolType | null;
  setSelectedTool: (tool: Tool | ToolType) => void;
  selectedSubTool: Tool | ToolType | null;
  setSelectedSubTool: (tool: Tool | ToolType) => void;
  color: string;
  setColor: (color: string) => void;

  nodes: CanvasNode[];
  addNode: (node: CanvasNode) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeDataType>) => void;
  removeNode: (nodeId: string) => void;
  removeNodes: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  tools: tools,
  subTools: [],
  setSubTools: (subTools: Tool[]) => set({ subTools }),
  selectedTool: tools[0],
  setSelectedTool: (tool: Tool | ToolType) => {
    if (typeof tool === 'string') {
      set({ selectedTool: tool, subTools: [] });
    } else {
      set({ selectedTool: tool, subTools: tool.subTools || [] });
    }
  },
  selectedSubTool: null,
  setSelectedSubTool: (tool: Tool | ToolType) => set({ selectedSubTool: tool }),
  color: "#000000",
  setColor: (color: string) => set({ color }),

  nodes: [],
  addNode: (node: CanvasNode) =>
    set((state) => ({ nodes: [...state.nodes, node] })),
  updateNodeData: (nodeId: string, data: Partial<NodeDataType>) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: node.data ? {
              ...node.data,
              ...data,
            } as NodeDataType : null,
          };
        }
        return node;
      }),
    })),
  removeNode: (nodeId: string) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
    })),
  removeNodes: () => set({ nodes: [] }),
}));
