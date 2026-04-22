import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Drawing } from "../../types";
import {
  ClockIcon,
  DownloadIcon,
  FolderIcon,
  LinkIcon,
  MoreHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import ConfirmBox from "../common/ConfirmBox";
import { useDrawingStore } from "../../store/drawingStore";

interface DrawingCardProps {
  drawing: Drawing;
}

export default function DrawingCard({ drawing }: DrawingCardProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteDrawing } = useDrawingStore();
  const redirectTo = async (id: string) => {
    try {
      navigate(`/editor/${id}`);
    } catch (error) {
      console.error("Error redirecting to drawing:", error);
    }
  };

  const onDelete = async () => {
    // TODO: Implement delete functionality
    console.log("Delete drawing:", drawing._id);
    await deleteDrawing(drawing._id); 
    setShowDeleteConfirm(false);
  };

  const onDownload = () => {
    // TODO: Implement download functionality
    console.log("Download drawing:", drawing._id);

    const link = document.createElement("a");
    link.download = "lets-draw.png";
    link.href = drawing.image;
    link.click();
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      key={drawing._id}
      className="group bg-white rounded-md shadow-sm overflow-hidden border border-gray-100"
    >
      {/* Card Header */}
      <div className="relative bg-gray-200 p-3">
        {drawing?.image ? (
          <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            <img
              src={drawing.image}
              alt={drawing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-xl flex items-center justify-center">
              <FolderIcon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
          <button
            onClick={() => redirectTo(drawing._id)}
            className="inline-flex items-center gap-2 px-2 py-1 bg-white text-gray-900 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <LinkIcon className="w-4 h-4" />
            <span className="text-xs">View</span>
          </button>
        </div>
      </div>

      {/* Card Content */}

      <div className="flex items-start justify-between p-5">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {drawing.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <ClockIcon className="w-4 h-4" />
            <span className="text-xs">
              Last updated: {new Date(drawing.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="relative">
          {/* more menu with delete and download options */}

          <button
            className="cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreHorizontalIcon className="w-5 h-5 text-gray-400" />
            <span className="sr-only">More options</span>
          </button>

          {showMenu && (
            <div
              className="absolute top-4 right-0 bg-white rounded-lg shadow-lg border border-gray-200"
              ref={menuRef}
            >
              <button
                className="w-full flex items-center gap-2 px-2 py-1 text-left hover:bg-gray-50"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2Icon className="w-3 h-3 text-red-600" />
                <span className="text-xs">Delete</span>
              </button>
              <button
                className="w-full flex items-center gap-2 px-2 py-1 text-left hover:bg-gray-50"
                onClick={onDownload}
              >
                <DownloadIcon className="w-3 h-3 text-indigo-600" />
                <span className="text-xs">Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <ConfirmBox
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        message="Are you sure you want to delete this drawing?"
        onSubmit={onDelete}
      />
    </div>
  );
}
