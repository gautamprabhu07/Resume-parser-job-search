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
    <div className="min-h-screen bg-[#E9EDF5] p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#333940]">Recommended Jobs</h2>

      {loading && <p className="text-[#636978]">Loading jobs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && jobs.length === 0 && !error && (
        <p className="text-[#555A66]">No jobs found. Try uploading a different resume.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white shadow-md p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-[#FF6C52]">{job.title}</h3>
            <p className="text-[#555A66] font-medium">{job.company}</p>
            <p className="text-sm text-[#636978]">{job.location || 'Location not specified'}</p>
            <a
              href={job.link || job.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[#F92814] hover:underline text-sm"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
