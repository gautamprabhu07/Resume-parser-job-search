// src/utils/fileValidation.js
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateResume(file) {
  if (!file) return 'No file selected.';
  if (file.size > MAX_SIZE_BYTES) return 'File too large (max 5MB).';
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Unsupported file type. Please upload a PDF or Word document.';
  }
  return null;
}
