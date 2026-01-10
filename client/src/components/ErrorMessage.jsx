// src/components/ErrorMessage.jsx
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <p className="text-red-600 text-center font-semibold text-lg">
      {message}
    </p>
  );
};

export default ErrorMessage;
