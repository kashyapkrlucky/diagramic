import {
  XIcon,
  LayersIcon,
  CodeIcon,
  DownloadIcon,
  UploadIcon,
  WorkflowIcon,
} from "lucide-react";
import { useCanvasStore } from "../../store/canvasStore";
import { AccordionItem } from "./AccordionItem";
import { useState } from "react";
import { useJsonAction } from "../../hooks/useJsonAction";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { nodes, removeNode, selectedNode, setNodes } = useCanvasStore();

  const tabs = ["Nodes", "Json"];
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  const { handleExport, handleImport } = useJsonAction(nodes, setNodes);

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-2xl transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      {/* Header */}
      <header className="flex flex-col gap-4 justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <LayersIcon className="w-4 h-4 text-gray-500" />
            <h1 className="text-lg font-semibold text-gray-900">Properties</h1>
          </div>

          <button
            onClick={onClose}
            className="p-2 float-right rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
          >
            <XIcon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setCurrentTab(tabs[0])}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              currentTab === tabs[0]
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <WorkflowIcon className="w-4 h-4 text-gray-500" />
            <span>Nodes</span>
          </button>
          <button
            onClick={() => setCurrentTab(tabs[1])}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
              currentTab === tabs[1]
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <CodeIcon className="w-4 h-4 text-gray-500" />
            <span>JSON</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <section
        className="px-6 py-4 overflow-hidden"
        style={{ height: "calc(100vh - 120px)" }}
      >
        <div className="overflow-y-auto hide-scrollbar h-full">
          {currentTab === tabs[0] && (
            <div className="space-y-4">
              {nodes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LayersIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    No nodes yet
                  </h3>
                  <p className="text-sm text-gray-500 max-w-xs mx-auto">
                    Start by adding shapes, text, or drawings to your canvas
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-gray-900">
                      Canvas Nodes ({nodes.length})
                    </h2>
                    <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {
                        nodes.filter((node) => selectedNode?.id === node.id)
                          .length
                      }{" "}
                      selected
                    </div>
                  </div>
                  <div className="space-y-2">
                    {nodes.map((node) => (
                      <AccordionItem
                        key={node.id}
                        node={node}
                        isSelected={selectedNode?.id === node.id}
                        onRemove={() => removeNode(node.id)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {currentTab === tabs[1] && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-900">
                  JSON Data
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExport}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 transition-all duration-200"
                  >
                    <DownloadIcon className="w-3 h-3" />
                    Export
                  </button>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition-all duration-200">
                    <UploadIcon className="w-3 h-3" />
                    Import
                    <input
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleImport}
                    />
                  </label>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full h-96 p-4 hide-scrollbar text-xs font-mono bg-gray-900 text-green-400 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={JSON.stringify(nodes, null, 2)}
                  readOnly
                  placeholder="No nodes data available..."
                />
                <div className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {nodes.length} objects
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
