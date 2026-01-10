// src/services/joobleService.js

import axios from 'axios';
import { getCacheKey, getFromCache, setInCache } from '../cache/memoryCache.js';
import { buildKeywordString } from '../utils/keywords.js';

const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;
const JOOBLE_URL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

// Axios instance with timeout
const axiosInstance = axios.create({
  timeout: 7000,
});

/**
 * Simple retry wrapper around axiosInstance.post
 */
async function fetchWithRetry(url, payload, retries = 2) {
  try {
    return await axiosInstance.post(url, payload);
  } catch (err) {
    if (retries > 0) {
      return fetchWithRetry(url, payload, retries - 1);
    }
    throw err;
  }
}

/**
 * Normalize Jooble job objects into a clean shape for the frontend.
 */
function normalizeJobs(jobs = []) {
  return jobs.map(job => ({
    title: job.title,
    company: job.company,
    location: job.location,
    salary: job.salary,
    url: job.link || job.url,
  }));
}

/**
 * Main service to get jobs for a parsed resume object.
 * Handles:
 *  - keyword generation
 *  - caching
 *  - API call + normalization
 */
export async function getJobsForParsedResume(parsedData, location = 'India') {
  const keywords = buildKeywordString(parsedData);

  const cacheKey = getCacheKey(keywords, location);
  const cached = getFromCache(cacheKey);
  if (cached) {
    return {
      keywords,
      fromCache: true,
      jobs: cached,
    };
  }

  const payload = { keywords, location };
  const { data } = await fetchWithRetry(JOOBLE_URL, payload);

  const jobs = normalizeJobs(data.jobs || []);
  setInCache(cacheKey, jobs);

  return {
    keywords,
    fromCache: false,
    jobs,
  };
}
