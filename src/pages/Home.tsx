import {
  ClockIcon,
  FolderIcon,
  StarIcon,
  SearchIcon,
  PlusIcon,
  User2Icon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useFetch } from "../hooks/useFetch";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, getData } = useFetch("drawings");

  useEffect(() => {
    getData();
  }, []);

  console.log(data);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  
  const projects = [
    {
      id: 1,
      name: "Process Workflow",
      thumbnail: "flowchart",
      description: "Business process flowchart for order management system",
      created: "2024-04-21T14:30:00Z",
      lastSaved: "2024-04-21T16:45:00Z",
      caption: "Step-by-step order processing workflow",
      tags: ["process", "workflow"],
      starred: true,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">LD</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Let's Draw</h1>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 w-64"
              />
            </div>
            <User2Icon className="w-6 h-6 text-gray-600" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="flex-1 max-w-7xl mx-auto px-6 py-8 overflow-y-auto pt-20 hide-scrollbar">
        {/* Create Button */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Flowcharts</h2>
            <Link
              to="/editor/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-lg shadow hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Flowchart</span>
            </Link>
          </div>
         

        {/* Projects Grid/List */}
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          }
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/editor/${project.id}`}
              className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300"
            >
              <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-xl p-6 flex items-center justify-center text-6xl">
                {project.thumbnail === "flowchart" && "flowchart"}
                {project.thumbnail === "diagram" && "diagram"}
                {project.thumbnail === "tree" && "tree"}
                {project.thumbnail === "mindmap" && "mindmap"}
                {project.thumbnail === "dataflow" && "dataflow"}
                {project.thumbnail === "orgchart" && "orgchart"}
              </div>

              <div className="p-4">
                {/* Project Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>
                        Updated{" "}
                        {new Date(project.lastSaved).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {project.starred && (
                    <StarIcon className="w-4 h-4 text-yellow-500 fill-current" />
                  )}
                </div>

                {/* Project Description */}
                <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500">Ready to edit</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 group-hover:text-blue-600 transition-colors">
                    <FolderIcon className="w-3 h-3" />
                    <span className="text-xs font-medium">Open</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
