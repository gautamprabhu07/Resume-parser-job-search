import http from './http';

const BASE_URL = import.meta.env.VITE_JOBS_API;

export function fetchJobs(parsedData) {
  return http.post(
    `${BASE_URL}/jobs`,
    parsedData
  );
}
