import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import JobCard from '../components/JobCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useJobs } from '../hooks/useJobs';

const JobsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateParsed = location.state?.parsedData || null;
  const [parsedData] = useState(() => {
    if (stateParsed) return stateParsed;
    const stored = localStorage.getItem('resparse_lastParsed');
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ ALWAYS call hooks
  const { jobs, loading, error } = useJobs(parsedData);

  // ✅ Redirect side-effect
  useEffect(() => {
    if (!parsedData) {
      navigate('/', { replace: true });
    }
  }, [parsedData, navigate]);

  // Optional guard while redirecting
  if (!parsedData) return null;

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center">
      <header className="w-full mb-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
          Recommended Jobs
        </h2>
        <p className="text-gray-600 text-lg">
          Explore the best opportunities tailored to your skills.
        </p>
      </header>

      {loading && <LoadingSpinner message="Loading jobs..." />}

      <ErrorMessage message={error} />

      {!loading && !error && jobs.length === 0 && (
        <p className="text-gray-600 text-center text-lg">
          No jobs found. Try uploading a different resume or check back later.
        </p>
      )}

      <main className="w-full grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, idx) => (
          <JobCard key={idx} job={job} />
        ))}
      </main>
    </div>
  );
};

export default JobsPage;
