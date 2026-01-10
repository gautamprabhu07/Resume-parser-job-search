// src/pages/ParsePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseResume } from '../api/parserApi';
import { validateResume } from '../utils/fileValidation';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ParsePage = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setError('');
    setParsedData(null);
    setUploadProgress(0);

    const validationError = validateResume(selected);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleParse = async () => {
  if (!file) {
    setError('Please select a resume file first.');
    return;
  }

  setIsParsing(true);
  setUploadProgress(0);
  setParsedData(null);
  setError('');

  const formData = new FormData();
  formData.append('resume', file);

  try {
    const response = await parseResume(formData, (progressEvent) => {
      const total = progressEvent.total || 1;
      const percent = Math.round((progressEvent.loaded * 100) / total);
      setUploadProgress(percent);
    });

    setParsedData(response.data);
    localStorage.setItem('resparse_lastParsed', JSON.stringify(response.data));
  } catch (err) {
    console.error('Parsing failed:', err);
    if (err.code === 'ECONNABORTED') {
      setError('Parsing is taking too long. Please try again with a smaller file or try once more.');
    } else {
      setError('Resume parsing failed. Please try again.');
    }
  } finally {
    setIsParsing(false);
  }
};



  const downloadJSON = () => {
    if (!parsedData) return;
    const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'parsed_resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearchJobs = () => {
    if (!parsedData) return;
    navigate('/jobs', { state: { parsedData } });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <header className="w-full mb-8 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-gray-900">
          AI Powered Resume Parser
        </h1>
        <p className="text-lg text-gray-600">
          Upload your resume and get structured data instantly.
        </p>
      </header>

      <main className="bg-white shadow-xl rounded-2xl p-8 w-full flex flex-col gap-8">
        <section className="flex flex-col gap-5">
          <label
            htmlFor="resume-upload"
            className="cursor-pointer inline-flex justify-center items-center rounded-lg border-2 border-dashed border-indigo-400 p-8 text-indigo-500 hover:text-indigo-700 hover:border-indigo-600 transition"
          >
            <svg
              className="w-10 h-10 mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16v-4m0 0V8a4 4 0 014-4h4m-4 4v4m8 4v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2m10-8l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {file ? (
              <span className="text-lg font-medium">{file.name}</span>
            ) : (
              <span className="text-lg font-medium">
                Click here to upload your resume (PDF/DOC/DOCX)
              </span>
            )}
          </label>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="text-sm text-gray-500">
            Supported formats: <strong>PDF, DOC, DOCX</strong> | Max size: <strong>5MB</strong>
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-2">
              <div
                className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {error && <ErrorMessage message={error} />}

          {file && (
            <button
              onClick={handleParse}
              disabled={isParsing}
              className={`mt-4 w-full py-3 rounded-lg font-semibold text-white shadow-md transition 
                ${isParsing ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isParsing ? 'Parsing your resume...' : 'Parse Resume'}
            </button>
          )}
        </section>

        {isParsing && !parsedData && <LoadingSpinner message="Parsing resume..." />}

        {parsedData && (
          <section className="bg-gray-50 border border-gray-300 rounded-lg p-6 overflow-auto max-h-96">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Parsed Resume Data</h2>
            <pre className="whitespace-pre-wrap text-gray-700 text-sm">
              {JSON.stringify(parsedData, null, 2)}
            </pre>
          </section>
        )}

        {parsedData?.skills && parsedData.skills.length > 0 && (
  <section className="bg-white border border-gray-200 rounded-lg p-4">
    <h3 className="text-md font-semibold mb-2 text-gray-800">
      Detected Skills
    </h3>

    <div className="flex flex-wrap gap-2">
      {parsedData.skills.map((skillObj, idx) => (
        <span
          key={`${skillObj.value}-${idx}`}
          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
          title={`Confidence: ${(skillObj.confidence * 100).toFixed(0)}%`}
        >
          {skillObj.value}
        </span>
      ))}
    </div>
  </section>
)}



        {parsedData && (
          <div className="mt-6 flex flex-wrap gap-4 justify-end w-full">
            <button
              onClick={downloadJSON}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg shadow-md transition font-semibold"
            >
              Download JSON
            </button>
            <button
              onClick={handleSearchJobs}
              className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-5 rounded-lg shadow-md transition font-semibold"
            >
              Search Jobs
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ParsePage;
