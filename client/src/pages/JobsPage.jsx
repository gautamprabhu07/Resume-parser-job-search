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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-indigo-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            AI-Matched Opportunities
          </h2>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Personalized job recommendations based on your resume analysis
        </p>
        
        {/* AI Badge */}
        <div className="mt-4 flex items-center justify-center">
          <span className="px-3 py-1.5 text-xs font-medium bg-cyan-900/40 text-cyan-300 rounded-full border border-cyan-500/20 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z" />
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
            </svg>
            AI-Powered Matching
          </span>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-16 shadow-lg backdrop-blur">
          <LoadingSpinner message="AI is analyzing and matching jobs to your profile" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 shadow-lg backdrop-blur">
          <ErrorMessage message={error} />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 shadow-lg backdrop-blur text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Matching Jobs Found
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            We couldn't find job opportunities matching your profile at this time. Try updating your resume or check back later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-6 py-3 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 ease-out hover:translate-y-[-2px] shadow-lg shadow-indigo-500/20"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Upload New Resume
          </button>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && !error && jobs.length > 0 && (
        <>
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center text-gray-400">
              <svg className="w-5 h-5 mr-2 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">
                Found {jobs.length} matching {jobs.length === 1 ? 'opportunity' : 'opportunities'}
              </span>
            </div>
          </div>

          {/* Job Cards Grid */}
          <main className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, idx) => (
              <JobCard key={idx} job={job} />
            ))}
          </main>
        </>
      )}
    </div>
  );
};

export default JobsPage;