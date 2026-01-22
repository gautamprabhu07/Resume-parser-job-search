import http from './http';

const BASE_URL = import.meta.env.VITE_PARSER_API;
const PARSER_TIMEOUT_MS = Number(import.meta.env.VITE_PARSER_TIMEOUT_MS) || 120000;

export function parseResume(formData, onProgress) {
  return http.post(
    `${BASE_URL}/parse-resume`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress,
      timeout: PARSER_TIMEOUT_MS, // allow longer parsing for cold starts/large files
    }
  );
}
