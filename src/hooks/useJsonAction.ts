import type { CanvasNode } from "../types";

export const useJsonAction = (nodes: CanvasNode[], setNodes: (nodes: CanvasNode[]) => void) => {


  const handleExport = () => {
    const nodesJson = JSON.stringify(nodes);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(nodesJson);
    const exportFileDefaultName = "workflow.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          if (data) {
            setNodes(data);
          } else {
            alert("Invalid workflow format. Please check the file structure.");
          }
        } catch (error) {
          console.error("Failed to import workflow:", error);
          alert(
            "Failed to import workflow file. Please check the file format.",
          );
        }
      };
      reader.readAsText(file);
    }
  };

  return {
    handleExport,
    handleImport,
  };
};
