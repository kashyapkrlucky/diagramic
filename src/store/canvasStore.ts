import { create } from "zustand";
import type { Tool, CanvasNode, NodeDataType, ToolType } from "../types";
import { tools } from "../components/editor/ToolListing";

interface CanvasStore {
  tools: Tool[];
  subTools: { name: string }[];
  setSubTools: (subTools: Tool[]) => void;
  selectedTool: ToolType;
  setSelectedTool: (tool: ToolType) => void;
  selectedSubTool: string | null;
  setSelectedSubTool: (tool: string) => void;
  showSubTools: boolean;
  setShowSubTools: (show: boolean) => void;
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

  tempNodes: CanvasNode[];
  addTempNode: () => void;
  removeTempNode: () => void;

  // Text editing state
  editingNodeId: string | null;
  setEditingNodeId: (nodeId: string | null) => void;
  editText: string;
  setEditText: (text: string) => void;
}

export const useCanvasStore = create<CanvasStore>((set) => ({
  tools: tools,
  subTools: [],
  setSubTools: (subTools: Tool[]) => set({ subTools }),
  selectedTool: tools[0].name as ToolType,
  setSelectedTool: (tool: ToolType) => {
    set({
      selectedTool: tool,
      subTools: tools.find((t) => t.name === tool)?.subTools || [],
      showSubTools: true,
    });
  },
  selectedSubTool: null,
  setSelectedSubTool: (tool: string) =>
    set({ selectedSubTool: tool, showSubTools: false }),
  showSubTools: false,
  setShowSubTools: (show: boolean) => set({ showSubTools: show }),
  color: "#ff6b6b",
  setColor: (color: string) => set({ color }),

  nodes: [],
  setNodes: (nodes: CanvasNode[]) => {
    set({ nodes });
  },
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

  tempNodes: [],
  addTempNode: () =>
    set((state) => {
      if (state.nodes.length > 0) {
        const lastNode = state.nodes[state.nodes.length - 1];
        const newState = {
          tempNodes: [...state.tempNodes, lastNode],
          nodes: state.nodes.slice(0, -1),
        };
        return newState;
      }
      return state;
    }),
  removeTempNode: () =>
    set((state) => {
      if (state.tempNodes.length > 0) {
        const lastTempNode = state.tempNodes[state.tempNodes.length - 1];
        const newState = {
          tempNodes: state.tempNodes.slice(0, -1),
          nodes: [...state.nodes, lastTempNode],
        };
        return newState;
      }
      return state;
    }),

  // Text editing state
  editingNodeId: null,
  setEditingNodeId: (nodeId: string | null) => set({ editingNodeId: nodeId }),
  editText: "",
  setEditText: (text: string) => set({ editText: text }),
}));
