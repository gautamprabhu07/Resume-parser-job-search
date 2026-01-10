import http from './http';

const BASE_URL = import.meta.env.VITE_PARSER_API;

export function parseResume(formData, onProgress) {
  return http.post(
    `${BASE_URL}/parse-resume`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
      timeout: 20000, // 20 seconds for heavy NLP/PDF parsing
    }
  );
}
