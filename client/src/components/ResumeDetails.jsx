import React from 'react';

const ResumeDetails = ({ data }) => {
  if (!data) return null;

  /**
   * Safely extract scalar text from resume-parser outputs.
   * Handles:
   *  - string
   *  - { value, confidence }
   *  - null / undefined
   */
  const safeText = (val, fallback = '') => {
    if (!val) return fallback;
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && typeof val.value === 'string') return val.value;
    return fallback;
  };

  /* =========================
     Header fields
     ========================= */
  const name = safeText(data.name, 'Name not detected');
  const email = safeText(
    data.primary_email_detailed,
    safeText(data.primary_email, 'Email not detected')
  );
  const phone = safeText(
    data.primary_phone_detailed,
    safeText(data.primary_phone, 'Phone not detected')
  );
  const language = safeText(data.language, 'Unknown');

  /* =========================
     Experience & Education
     ========================= */
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return (
    <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 shadow-lg backdrop-blur space-y-8">
      {/* =========================
          Header
         ========================= */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{name}</h2>
            <div className="flex items-center">
              <span className="px-2 py-0.5 text-xs bg-slate-800 text-gray-400 rounded border border-slate-700">
                {language}
              </span>
            </div>
          </div>

          <div className="text-sm space-y-1">
            <div className="flex items-center text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {email}
            </div>
            <div className="flex items-center text-gray-300">
              <svg className="w-4 h-4 mr-2 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {phone}
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          Experience
         ========================= */}
      {experience.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">
              Experience
            </h3>
          </div>

          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div
                key={idx}
                className="border-l-2 border-indigo-500/30 pl-6 pb-6 last:pb-0 relative"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-5px] top-0 w-2 h-2 bg-indigo-500 rounded-full" />

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-100 text-lg">
                      {safeText(exp?.title, 'Role not specified')}
                    </p>
                    <p className="text-sm text-indigo-300 font-medium">
                      {safeText(exp?.company, 'Company not specified')}
                    </p>
                  </div>

                  <span className="text-sm text-gray-400 mt-1 sm:mt-0 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {safeText(exp?.start_year, '?')} – {safeText(exp?.end_year, 'Present')}
                  </span>
                </div>

                {Array.isArray(exp?.responsibilities) &&
                  exp.responsibilities.length > 0 && (
                    <ul className="space-y-2">
                      {exp.responsibilities.map((line, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-300">
                          <svg className="w-4 h-4 mr-2 mt-0.5 text-cyan-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{safeText(line)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================
          Education
         ========================= */}
      {education.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <svg className="w-5 h-5 text-indigo-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
            <h3 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">
              Education
            </h3>
          </div>

          <div className="space-y-4">
            {education.map((ed, idx) => (
              <div 
                key={idx} 
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 transition-all duration-200 ease-out hover:border-indigo-500/30"
              >
                <p className="font-semibold text-gray-100 mb-1">
                  {safeText(ed?.degree_raw, 'Degree not specified')}
                </p>

                {ed?.line && (
                  <p className="text-sm text-gray-300 mb-2">
                    {safeText(ed.line)}
                  </p>
                )}

                <div className="flex items-center text-xs text-gray-400">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {safeText(ed?.graduation_year, 'Year not specified')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ResumeDetails;