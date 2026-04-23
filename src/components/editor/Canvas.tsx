import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasStore } from "../../store/canvasStore";
import { type CanvasNode } from "../../types";
import { useMousePosition, useNodeAtPosition } from "../../hooks/usePosition";
import { useCanvas } from "../../hooks/useCanvas";
import { useZoomPan } from "../../hooks/useZoomPan";
import {
  isShapeTool,
  isTextTool,
  createTextNode,
  createShapeNode,
} from "../../utils/toolHandlers";
import { drawPreview } from "../../utils/previewDrawing";
import ZoomControls from "./ZoomControls";
import TextEditor from "./TextEditor";
import { useParams } from "react-router-dom";
import { useDrawingStore } from "../../store/drawingStore";
// import Loader from "./Loader";

// Utility function to get pen size from selected subtool
const getPenSize = (selectedSubTool: string | null): number => {
  switch (selectedSubTool) {
    case "Thin":
      return 2;
    case "Medium":
      return 4;
    case "Thick":
      return 8;
    default:
      return 2; // Default to medium
  }
};

interface CanvasProps {
  action: string;
  onActionHandled?: () => void;
}

export default function Canvas({ action, onActionHandled }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    selectedTool,
    selectedSubTool,
    addNode,
    nodes,
    removeNodes,
    setSelectedNode,
    updateNode,
    editingNodeId,
    setEditingNodeId,
    setEditText,
    addTempNode,
    removeTempNode,
  } = useCanvasStore();
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>(
    [],
  );
  const [isFreehandDrawing, setIsFreehandDrawing] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const nodesRef = useRef(nodes);
  const clickTimeoutRef = useRef<number | null>(null);

  const params = useParams();

  const { updateDrawing } = useDrawingStore();

  const {
    zoomPan,
    zoomIn,
    zoomOut,
    resetZoom,
    startPan,
    pan,
    endPan,
    screenToCanvas,
    getZoomPercentage,
  } = useZoomPan();

  const { getMousePosition } = useMousePosition(canvasRef);
  const { getNodeAtPosition } = useNodeAtPosition(nodes);
  const { getContext, setCanvasSize, clearCanvas, draw } = useCanvas(
    canvasRef,
    zoomPan,
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);
      const canvasCoords = screenToCanvas(x, y);

      if (e.shiftKey) {
        // Start panning with shift key
        setIsPanning(true);
        startPan(x, y);
        return;
      }

      const existingNode = getNodeAtPosition(canvasCoords.x, canvasCoords.y);

      if (selectedTool === "Hand") {
        // Hand tool always pans the canvas
        setIsPanning(true);
        startPan(x, y);
        return;
      }

      if (selectedTool === "Select") {
        if (existingNode) {
          // Start dragging the node
          setDraggedNode(existingNode.id);
          setDragOffset({
            x: canvasCoords.x - existingNode.x,
            y: canvasCoords.y - existingNode.y,
          });
          setSelectedNode(existingNode);
        } else {
          // Select tool does NOT pan on empty canvas - only works on nodes
          return;
        }
        return;
      }

      if (!selectedTool) {
        // Start panning when no tool is selected
        setIsPanning(true);
        startPan(x, y);
        return;
      }

      if (isTextTool(selectedTool)) {
        // Clear any existing timeout
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current);
        }

        // Use a timeout to delay text node creation
        clickTimeoutRef.current = window.setTimeout(() => {
          const node = createTextNode(
            canvasCoords.x,
            canvasCoords.y,
            selectedTool,
          );
          addNode(node);
          // Start editing the new text node immediately
          setEditingNodeId(node.id);
          setEditText("");
          clickTimeoutRef.current = null;
        }, 200); // 200ms delay to detect double-click
      } else if (selectedTool === "Draw") {
        // Start freehand drawing
        setIsFreehandDrawing(true);
        setCurrentPath([{ x: canvasCoords.x, y: canvasCoords.y }]);
      } else if (isShapeTool(selectedTool)) {
        setIsDrawing(true);
        setStartX(canvasCoords.x);
        setStartY(canvasCoords.y);
      } else if (existingNode) {
        // Start dragging any existing node (text, shape, or draw) when no drawing tool is selected
        setDraggedNode(existingNode.id);
        setDragOffset({
          x: canvasCoords.x - existingNode.x,
          y: canvasCoords.y - existingNode.y,
        });
        setSelectedNode(existingNode);
        return;
      }
    },
    [
      selectedTool,
      addNode,
      setStartX,
      setStartY,
      getMousePosition,
      getNodeAtPosition,
      setSelectedNode,
      screenToCanvas,
      startPan,
      setEditingNodeId,
      setEditText,
    ],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);
      const canvasCoords = screenToCanvas(x, y);

      if (isPanning) {
        endPan();
        setIsPanning(false);
        return;
      }

      if (draggedNode) {
        setDraggedNode(null);
        setDragOffset({ x: 0, y: 0 });
        return;
      }

      if (isFreehandDrawing) {
        // Finish freehand drawing and create the node
        if (currentPath.length > 1) {
          const color = useCanvasStore.getState().color;
          const penSize = getPenSize(selectedSubTool);
          const drawNode: CanvasNode = {
            id: Date.now().toString(),
            type: "Draw",
            color: color,
            x: currentPath[0].x,
            y: currentPath[0].y,
            data: {
              points: currentPath,
              strokeColor: color,
              strokeWidth: penSize,
              strokeStyle: "solid" as const,
            },
          };
          addNode(drawNode);
        }
        setIsFreehandDrawing(false);
        setCurrentPath([]);
        return;
      }

      if (!isDrawing || !selectedTool || !isShapeTool(selectedTool)) {
        setIsDrawing(false);
        return;
      }

      const node = createShapeNode(
        startX,
        startY,
        canvasCoords.x,
        canvasCoords.y,
        selectedTool,
      );
      if (node) {
        addNode(node);
      }

      setStartX(0);
      setStartY(0);
      setIsDrawing(false);
    },
    [
      selectedTool,
      selectedSubTool,
      addNode,
      startX,
      startY,
      getMousePosition,
      screenToCanvas,
      endPan,
      isPanning,
      isDrawing,
      draggedNode,
      currentPath,
      isFreehandDrawing,
    ],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const { x, y } = getMousePosition(e);
      const canvasCoords = screenToCanvas(x, y);

      // Check for hover over nodes (only when using Select tool)
      if (selectedTool === "Select") {
        const hoveredNodeFound = getNodeAtPosition(
          canvasCoords.x,
          canvasCoords.y,
        );
        setHoveredNode(hoveredNodeFound?.id || null);
      } else {
        setHoveredNode(null);
      }

      if (isPanning) {
        pan(x, y);
        return;
      }

      if (draggedNode) {
        const canvasCoords = screenToCanvas(x, y);
        const newX = canvasCoords.x - dragOffset.x;
        const newY = canvasCoords.y - dragOffset.y;

        // Update node position
        updateNode(draggedNode, { x: newX, y: newY });

        // Update x1 and y1 if they exist (for shapes)
        const node = nodes.find((n) => n.id === draggedNode);
        if (node && node.x1 !== undefined && node.y1 !== undefined) {
          const deltaX = newX - node.x;
          const deltaY = newY - node.y;
          updateNode(draggedNode, {
            x: newX,
            y: newY,
            x1: node.x1 + deltaX,
            y1: node.y1 + deltaY,
          });
        }

        return;
      }

      if (isFreehandDrawing) {
        const canvasCoords = screenToCanvas(x, y);
        setCurrentPath((prev) => [
          ...prev,
          { x: canvasCoords.x, y: canvasCoords.y },
        ]);

        // Draw the current path
        const ctx = getContext();
        if (!ctx) return;

        clearCanvas();
        draw(nodes);

        // Draw current freehand path with proper transformations
        ctx.save();
        ctx.translate(zoomPan.offsetX, zoomPan.offsetY);
        ctx.scale(zoomPan.scale, zoomPan.scale);

        const color = useCanvasStore.getState().color;
        const penSize = getPenSize(selectedSubTool);
        ctx.strokeStyle = color;
        ctx.lineWidth = penSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(currentPath[0].x, currentPath[0].y);
        for (let i = 1; i < currentPath.length; i++) {
          ctx.lineTo(currentPath[i].x, currentPath[i].y);
        }
        ctx.lineTo(canvasCoords.x, canvasCoords.y);
        ctx.stroke();
        ctx.restore();
      } else if (isDrawing) {
        const canvasCoords = screenToCanvas(x, y);
        const ctx = getContext();
        if (!ctx) return;

        // Clear canvas and redraw existing shapes
        clearCanvas();
        draw(nodes);

        const color = useCanvasStore.getState().color;
        drawPreview(
          ctx,
          startX,
          startY,
          canvasCoords.x,
          canvasCoords.y,
          selectedTool || "",
          color,
        );
      }
    },
    [
      startX,
      startY,
      getContext,
      clearCanvas,
      draw,
      selectedTool,
      selectedSubTool,
      getMousePosition,
      nodes,
      screenToCanvas,
      pan,
      isPanning,
      isDrawing,
      draggedNode,
      dragOffset,
      updateNode,
      currentPath,
      isFreehandDrawing,
      zoomPan.offsetX,
      zoomPan.offsetY,
      zoomPan.scale,
      getNodeAtPosition,
      setHoveredNode,
    ],
  );

  useEffect(() => {
    if (action === "clear") {
      clearCanvas();
      removeNodes();
      onActionHandled?.();
    } else if (action === "undo") {
      addTempNode();
      onActionHandled?.();
    } else if (action === "redo") {
      removeTempNode();
      onActionHandled?.();
    } else if (action === "download") {
      const canvas = canvasRef.current;
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "lets-draw.png";
        link.href = dataUrl;
        link.click();
      }
      onActionHandled?.();
    } else if (action === "save") {
      const payload = {
        image: canvasRef.current?.toDataURL("image/png"),
        data: JSON.stringify(nodesRef.current),
      };

      if (params.id) {
        updateDrawing(params.id, payload);
      }
      onActionHandled?.();
    }
  }, [action, clearCanvas, removeNodes, params, updateDrawing, onActionHandled, addTempNode, removeTempNode]);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    setCanvasSize();
    clearCanvas();
    draw(nodes);
  }, [setCanvasSize, clearCanvas, draw, nodes, zoomPan]);

  // Text editing handlers
  const handleTextSave = useCallback(
    (text: string) => {
      if (editingNodeId) {
        const node = nodes.find((n) => n.id === editingNodeId);
        if (node && isTextTool(node.type)) {
          // Recalculate dimensions based on new text
          const fontSize = node.type === "Annotation" ? 20 : 16;
          const textLength = text.length || 1;
          const estimatedWidth = textLength * fontSize * 0.6;
          const estimatedHeight = fontSize;

          updateNode(editingNodeId, {
            text,
            width: estimatedWidth,
            height: estimatedHeight,
          });
        }
        setEditingNodeId(null);
        setEditText("");
      }
    },
    [editingNodeId, updateNode, setEditingNodeId, setEditText, nodes],
  );

  const handleTextCancel = useCallback(() => {
    setEditingNodeId(null);
    setEditText("");
  }, [setEditingNodeId, setEditText]);

  const handleTextDoubleClick = useCallback(
    (node: CanvasNode) => {
      if (isTextTool(node.type)) {
        setEditingNodeId(node.id);
        setEditText(node.text || "");
      }
    },
    [setEditingNodeId, setEditText],
  );

  const cursorClass = isPanning
    ? "cursor-grabbing"
    : draggedNode
      ? "cursor-move"
      : hoveredNode && selectedTool === "Select"
        ? "cursor-move"
        : isDrawing
          ? "crosshair"
          : selectedTool === "Hand"
            ? "cursor-grab"
            : selectedTool === "Select"
              ? "cursor-default"
              : isShapeTool(selectedTool) || isTextTool(selectedTool)
                ? "cursor-crosshair"
                : "cursor-default";
  return (
    <>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full bg-gray-100 ${cursorClass}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onDoubleClick={(e) => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const { x, y } = getMousePosition(e);
          const canvasCoords = screenToCanvas(x, y);
          const existingNode = getNodeAtPosition(
            canvasCoords.x,
            canvasCoords.y,
          );
          if (existingNode && isTextTool(existingNode.type)) {
            // Clear the timeout to prevent new text node creation
            if (clickTimeoutRef.current) {
              clearTimeout(clickTimeoutRef.current);
              clickTimeoutRef.current = null;
            }
            handleTextDoubleClick(existingNode);
            e.preventDefault();
          }
        }}
      />
      <ZoomControls
        zoomPercentage={getZoomPercentage()}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
      />
      {editingNodeId &&
        (() => {
          const editingNode = nodes.find((n) => n.id === editingNodeId);
          return editingNode ? (
            <TextEditor
              node={editingNode}
              onSave={handleTextSave}
              onCancel={handleTextCancel}
            />
          ) : null;
        })()}
    </>
  );
}
