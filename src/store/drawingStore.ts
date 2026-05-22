import { create } from "zustand";
import type { Drawing } from "../types";
import axios from "../lib/axios";

interface DrawingStore {
  loading: boolean;
  isUpdating: boolean;
  error: string | null;
  drawings: Drawing[];
  drawing: Drawing | null;
  fetchDrawings: () => Promise<void>;
  fetchDrawingById: (id: string) => Promise<Drawing | undefined>;
  createDrawing: (drawing: Partial<Drawing>) => Promise<string>;
  updateDrawing: (id: string, drawing: Partial<Drawing>) => Promise<string>;
  deleteDrawing: (id: string) => Promise<void>;
}

export const useDrawingStore = create<DrawingStore>((set, get) => {
  return {
    loading: false,
    isUpdating: false,
    error: null,
    drawings: [],
    drawing: null,
    fetchDrawings: async () => {
      try {
        set({ loading: true, error: null });
        const {
          data: { data },
        } = await axios.get("/v1/modules/drawings");
        set({ drawings: data });
      } catch (error) {
        console.error("Error fetching drawings:", error);
        set({ error: "Failed to fetch drawings" });
      } finally {
        set({ loading: false });
      }
    },
    fetchDrawingById: async (id: string) => {
      try {
        set({ loading: true, error: null });
        const {
          data: { data },
        } = await axios.get(`/v1/modules/drawings/${id}`);
        set({ drawing: data });
        return data;
      } catch (error) {
        console.error("Error fetching drawing:", error);
        set({ error: "Failed to fetch drawing" });
      } finally {
        set({ loading: false });
      }
    },
    createDrawing: async (drawing: Partial<Drawing>) => {
      try {
        set({ loading: true, error: null });
        const {
          data: { data },
        } = await axios.post("/v1/modules/drawings", drawing);
        return data;
      } catch (error) {
        console.error("Error creating drawing:", error);
        set({ error: "Failed to create drawing" });
      } finally {
        set({ loading: false });
      }
    },
    updateDrawing: async (id: string, drawing: Partial<Drawing>) => {
      try {
        set({ isUpdating: true, error: null });
        const { data } = await axios.patch(`/v1/modules/drawings/${id}`, drawing);
        return data;
      } catch (error) {
        console.error("Error updating drawing:", error);
        set({ error: "Failed to update drawing" });
      } finally {
        set({ isUpdating: false });
      }
    },
    deleteDrawing: async (id: string) => {
      try {
        set({ loading: true, error: null });
        await axios.delete(`/v1/modules/drawings/${id}`);
        set({
          drawings: get().drawings.filter((drawing) => drawing._id !== id),
        });
      } catch (error) {
        console.error("Error deleting drawing:", error);
        set({ error: "Failed to delete drawing" });
      } finally {
        set({ loading: false });
      }
    },
  };
});
