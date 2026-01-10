// src/hooks/useJobs.js
import { useEffect, useState } from 'react';
import { fetchJobs } from '../api/jobsApi';

export function useJobs(parsedData) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(Boolean(parsedData));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!parsedData) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadJobs = async () => {
      try {
        const res = await fetchJobs(parsedData);
        if (!cancelled) {
          setJobs(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
        if (!cancelled) {
          setError('Failed to fetch jobs.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadJobs();

    return () => {
      cancelled = true;
    };
  }, [parsedData]);

  return { jobs, loading, error };
}
