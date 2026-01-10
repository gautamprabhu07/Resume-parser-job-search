// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 shadow-lg backdrop-blur max-w-lg w-full text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <svg className="w-24 h-24 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-indigo-400">404</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Please check the URL or return to the home page.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-lg font-semibold
              bg-indigo-600 hover:bg-indigo-500 text-white
              transition-all duration-200 ease-out
              hover:translate-y-[-2px]
              shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
            "
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              inline-flex items-center justify-center
              px-6 py-3 rounded-lg font-semibold
              bg-slate-800 hover:bg-slate-700 text-gray-100
              border border-slate-700 hover:border-slate-600
              transition-all duration-200 ease-out
              hover:translate-y-[-2px]
              shadow-lg
            "
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs text-gray-500 mb-2">Need help?</p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Upload Resume
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                const stored = localStorage.getItem('resparse_lastParsed');
                if (stored) {
                  navigate('/jobs', { state: { parsedData: JSON.parse(stored) } });
                } else {
                  navigate('/');
                }
              }}
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              View Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;