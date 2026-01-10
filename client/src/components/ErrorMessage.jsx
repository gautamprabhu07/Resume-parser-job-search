// src/components/ErrorMessage.jsx
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg backdrop-blur">
      {/* Error Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Error Message */}
      <div className="flex-1">
        <p className="text-rose-300 font-medium text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;