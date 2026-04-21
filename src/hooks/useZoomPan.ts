import { useCallback, useRef, useState } from "react";

interface ZoomPanState {
  scale: number;
  offsetX: number;
  offsetY: number;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_STEP = 0.1;

export const useZoomPan = () => {
  const [zoomPan, setZoomPan] = useState<ZoomPanState>({
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
  });

  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const zoomIn = useCallback(() => {
    setZoomPan(prev => ({
      ...prev,
      scale: Math.min(prev.scale + ZOOM_STEP, MAX_ZOOM),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomPan(prev => ({
      ...prev,
      scale: Math.max(prev.scale - ZOOM_STEP, MIN_ZOOM),
    }));
  }, []);

  const setZoom = useCallback((zoomLevel: number) => {
    setZoomPan(prev => ({
      ...prev,
      scale: Math.max(MIN_ZOOM, Math.min(zoomLevel, MAX_ZOOM)),
    }));
  }, []);

  const setZoomWithOffset = useCallback((zoomLevel: number, offsetX: number, offsetY: number) => {
    setZoomPan(prev => ({
      ...prev,
      scale: Math.max(MIN_ZOOM, Math.min(zoomLevel, MAX_ZOOM)),
      offsetX,
      offsetY,
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomPan({
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
    });
  }, []);

  const startPan = useCallback((x: number, y: number) => {
    isPanning.current = true;
    lastMousePos.current = { x, y };
  }, []);

  const pan = useCallback((x: number, y: number) => {
    if (!isPanning.current) return;

    const deltaX = x - lastMousePos.current.x;
    const deltaY = y - lastMousePos.current.y;

    setZoomPan(prev => ({
      ...prev,
      offsetX: prev.offsetX + deltaX,
      offsetY: prev.offsetY + deltaY,
    }));

    lastMousePos.current = { x, y };
  }, []);

  const endPan = useCallback(() => {
    isPanning.current = false;
  }, []);

  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX - zoomPan.offsetX) / zoomPan.scale,
      y: (screenY - zoomPan.offsetY) / zoomPan.scale,
    };
  }, [zoomPan]);

  const canvasToScreen = useCallback((canvasX: number, canvasY: number) => {
    return {
      x: canvasX * zoomPan.scale + zoomPan.offsetX,
      y: canvasY * zoomPan.scale + zoomPan.offsetY,
    };
  }, [zoomPan]);

  const getZoomPercentage = useCallback(() => {
    return Math.round(zoomPan.scale * 100);
  }, [zoomPan.scale]);

  return {
    zoomPan,
    zoomIn,
    zoomOut,
    setZoom,
    setZoomWithOffset,
    resetZoom,
    startPan,
    pan,
    endPan,
    screenToCanvas,
    canvasToScreen,
    getZoomPercentage,
    isPanning: () => isPanning.current,
  };
};
