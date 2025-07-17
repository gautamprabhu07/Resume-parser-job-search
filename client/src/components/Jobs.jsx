// src/components/Jobs.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.post('http://localhost:5000/jobs');
        setJobs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError('Failed to fetch jobs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-bl from-gray-50 via-gray-100 to-gray-200 p-12 flex flex-col items-center">
      <header className="max-w-4xl w-full mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Recommended Jobs
        </h2>
        <p className="text-gray-600 text-lg">
          Explore the best opportunities tailored to your skills.
        </p>
      </header>

      {loading && (
        <p className="text-indigo-600 text-center font-medium text-lg animate-pulse">
          Loading jobs...
        </p>
      )}

      {error && (
        <p className="text-red-600 text-center font-semibold text-lg">
          {error}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-600 text-center text-lg">
          No jobs found. Try uploading a different resume or check back later.
        </p>
      )}

      <main className="max-w-6xl w-full grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, idx) => (
          <article
            key={idx}
            className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
            tabIndex={0}
          >
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {job.title}
              </h3>
              <p className="text-gray-700 font-medium mb-1">{job.company}</p>
              <p className="text-gray-500 text-sm mb-4">
                {job.location || 'Location not specified'}
              </p>
            </div>
            <a
              href={job.link || job.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
            >
              View Details
            </a>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Jobs;
