import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Drawing } from "../types";
import Layout from "../components/common/Layout";
import Modal from "../components/common/Modal";
import CreateDrawingForm from "../components/editor/CreateDrawingForm";
import { useDrawingStore } from "../store/drawingStore";
import Loader from "../components/common/Loader";
import { useAuth } from "../hooks/useAuth";
import DrawingCard from "../components/home/DrawingCard";

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
      navigate("/sign-in");
    }
  }, [isAuthenticated, navigate]);

  if (loading) {
    return <Loader message="Loading your workplace..." />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout navbarType="home">
      {/* Main Content */}
      <div className="flex-1 h-full bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xl font-bold text-gray-900 mb-2">
                  My Drawings
                </p>
                <p className="text-xs text-gray-600">
                  Create and manage your flowcharts and diagrams
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 text-sm py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Create</span>
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
                <DrawingCard key={drawing._id} drawing={drawing} />
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
            navigate(`/editor/${id}`);
            setIsModalOpen(false);
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </Layout>
  );
}
