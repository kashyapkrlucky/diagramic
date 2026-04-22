
interface LoaderProps {
  message?: string;
}

export default function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white border-b border-gray-200">
      {/* Loading Content */}
      <div className="relative z-10 text-center">

        {/* Loading Text */}
        <div className="space-y-4">
          <p className="text-gray-600 text-sm font-medium max-w-md mx-auto">
            {message}
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce animation-delay-0"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce animation-delay-150"></div>
          <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce animation-delay-300"></div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-64">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
