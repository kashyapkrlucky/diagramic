import { ClockIcon, FolderIcon, StarIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Drawing } from "../types";
import Layout from "../components/common/Layout";
import Modal from "../components/common/Modal";
import CreateDrawingForm from "../components/editor/CreateDrawingForm";
import { useDrawingStore } from "../store/drawingStore";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { loading, error, drawings, fetchDrawings } = useDrawingStore();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/sign-in');
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isAuthenticated) {
    navigate('/sign-in');
    return null;
  }

  const redirectTo = async (id: string) => {
    try {
      navigate(`/editor/${id}`);
    } catch (error) {
      console.error("Error redirecting to drawing:", error);
    }
  };

  return (
    <Layout navbarType="home">
      {/* Main Content */}
      <div className="flex-1 h-full bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Drawings
                </h1>
                <p className="text-gray-600">
                  Create and manage your flowcharts and diagrams
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create New</span>
              </button>
            </div>
          </div>

          {/* Drawings Grid */}
          {drawings.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <PlusIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No drawings yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first drawing to get started
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Create Drawing</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {drawings.map((drawing: Drawing) => (
                <div
                  key={drawing._id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
                >
                  {/* Card Header */}
                  <div className="relative">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                      <button
                        onClick={() => redirectTo(drawing._id)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 font-medium rounded-lg shadow-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <FolderIcon className="w-4 h-4" />
                        <span>Open</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {drawing.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            {new Date(drawing.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0 ml-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Drawing Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Drawing"
        showCloseButton={true}
        closeOnBackdropClick={true}
      >
        <CreateDrawingForm
          onSuccess={(id: string) => {
            setIsModalOpen(false);
            window.location.href = `/editor/${id}`;
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
