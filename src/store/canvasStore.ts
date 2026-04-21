import { create } from "zustand";
import type { Tool, CanvasNode, NodeDataType, ToolType } from "../types";
import { tools } from "../components/ToolListing";

interface CanvasStore {
  tools: Tool[];
  subTools: Tool[];
  setSubTools: (subTools: Tool[]) => void;
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  selectedSubTool: ToolType | string | null;
  setSelectedSubTool: (tool: ToolType | string) => void;
  color: string;
  setColor: (color: string) => void;

  nodes: CanvasNode[];
  setNodes: (nodes: CanvasNode[]) => void;
  addNode: (node: CanvasNode) => void;
  selectedNode: CanvasNode | null;
  setSelectedNode: (node: CanvasNode) => void;
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeDataType>) => void;
  removeNode: (nodeId: string) => void;
  removeNodes: () => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  tools: tools,
  subTools: [],
  setSubTools: (subTools: Tool[]) => set({ subTools }),
  selectedTool: tools[0].name,
  setSelectedTool: (tool: ToolType) => {
    set({ selectedTool: tool, subTools: [] });
  },
  selectedSubTool: null,
  setSelectedSubTool: (tool: ToolType | string) =>
    set({ selectedSubTool: tool }),
  color: "#000000",
  setColor: (color: string) => set({ color }),

  nodes: [],
  setNodes: (nodes: CanvasNode[]) => set({ nodes }),
  addNode: (node: CanvasNode) =>
    set((state) => ({ nodes: [...state.nodes, node] })),
  selectedNode: null,
  setSelectedNode: (node: CanvasNode) => {
    set({ selectedNode: node });
  },
  updateNode: (nodeId: string, updates: Partial<CanvasNode>) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...updates,
          };
        }
        return node;
      }),
    })),
  updateNodeData: (nodeId: string, data: Partial<NodeDataType>) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            ...data,
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
