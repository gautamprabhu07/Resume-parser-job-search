const JobCard = ({ job }) => {
  const title = job.title || 'Untitled Role';
  const company = job.company || 'Company not specified';
  const location = job.location || 'Location not specified';
  const url = job.url || '#';

  return (
    <article
      className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300"
      tabIndex={0}
    >
      <div>
        <h3 className="text-xl font-semibold text-indigo-600 mb-2">
          {title}
        </h3>
        <p className="text-gray-700 font-medium mb-1">{company}</p>
        <p className="text-gray-500 text-sm mb-4">
          {location}
        </p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
      >
        View Details
      </a>
    </article>
  );
};

export default JobCard;
