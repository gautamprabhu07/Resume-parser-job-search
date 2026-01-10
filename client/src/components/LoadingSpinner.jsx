// src/components/LoadingSpinner.jsx
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    {/* Animated Spinner */}
    <div className="relative w-16 h-16 mb-6">
      {/* Outer ring */}
      <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
      
      {/* Spinning gradient ring */}
      <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 border-r-cyan-400 rounded-full animate-spin"></div>
      
      {/* Inner glow */}
      <div className="absolute inset-2 bg-gradient-to-br from-indigo-500/20 to-cyan-400/20 rounded-full blur-sm"></div>
      
      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-cyan-300 rounded-full animate-pulse"></div>
      </div>
    </div>

    {/* Loading Message */}
    <div className="text-center">
      <p className="text-gray-300 font-medium text-lg mb-2">
        {message}
      </p>
      <div className="flex items-center justify-center gap-1">
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;