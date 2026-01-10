// src/components/LoadingSpinner.jsx
const LoadingSpinner = ({ message = 'Loading...' }) => (
  <p className="text-indigo-600 text-center font-medium text-lg animate-pulse">
    {message}
  </p>
);

export default LoadingSpinner;
