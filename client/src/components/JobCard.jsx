const JobCard = ({ job }) => {
  const title = job.title || 'Untitled Role';
  const company = job.company || 'Company not specified';
  const location = job.location || 'Location not specified';
  const url = job.url || '#';

  return (
    <article
      className="
        bg-slate-900/80 border border-slate-800 rounded-xl p-6
        shadow-lg backdrop-blur
        flex flex-col justify-between
        transition-all duration-200 ease-out
        hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10
        hover:translate-y-[-4px]
        focus-within:border-indigo-500/50 focus-within:shadow-xl
      "
      tabIndex={0}
    >
      <div className="flex-1">
        {/* Job Title */}
        <h3 className="text-xl font-semibold text-gray-100 mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Company */}
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-indigo-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-indigo-300 font-medium text-sm">
            {company}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center mb-4">
          <svg className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400 text-sm">
            {location}
          </p>
        </div>
      </div>

      {/* CTA Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          mt-4 w-full inline-flex items-center justify-center
          bg-indigo-600 hover:bg-indigo-500 text-white
          py-3 px-4 rounded-lg font-semibold
          shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
          transition-all duration-200 ease-out
          hover:translate-y-[-2px]
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-slate-900
        "
      >
        <span>View Details</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </article>
  );
};

export default JobCard;