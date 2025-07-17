// src/components/Parse.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Parse = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setParsedData(null); // clear old data when new file selected
      setUploadProgress(0);
    }
  };

  const handleParse = async () => {
    if (!file) return;
    setIsParsing(true);
    setUploadProgress(0);
    setParsedData(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:8000/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: progressEvent => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        }
      });

      setParsedData(response.data);
    } catch (error) {
      console.error("Parsing failed:", error);
      alert("Resume parsing failed. Please try again.");
    } finally {
      setIsParsing(false);
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "parsed_resume.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-800 p-12 flex flex-col items-center">
      <header className="max-w-3xl w-full mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-gray-900">
          AI Powered Resume Parser
        </h1>
        <p className="text-lg text-gray-600">
          Upload your resume and get structured data instantly.
        </p>
      </header>

      <main className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl flex flex-col gap-8">
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
              <span className="text-lg font-medium">Click here to upload your resume (PDF, DOCX)</span>
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

          {file && (
            <button
              onClick={handleParse}
              disabled={isParsing}
              className={`mt-4 w-full py-3 rounded-lg font-semibold text-white shadow-md transition 
                ${isParsing ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isParsing ? "Parsing your resume..." : "Parse Resume"}
            </button>
          )}
        </section>

        {parsedData && (
          <section className="bg-gray-50 border border-gray-300 rounded-lg p-6 overflow-auto max-h-96">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Parsed Resume Data</h2>
            <pre className="whitespace-pre-wrap text-gray-700 text-sm">{JSON.stringify(parsedData, null, 2)}</pre>

            <div className="mt-6 flex gap-4 justify-end">
              <button
                onClick={downloadJSON}
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-5 rounded-lg shadow-md transition font-semibold"
              >
                Download JSON
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-pink-600 hover:bg-pink-700 text-white py-2 px-5 rounded-lg shadow-md transition font-semibold"
              >
                Search Jobs
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Parse;
