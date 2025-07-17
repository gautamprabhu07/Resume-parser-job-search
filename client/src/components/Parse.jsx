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
    <div className="min-h-screen bg-[#E9EDF5] text-[#333940] p-8">
      <h1 className="text-3xl font-bold mb-2">AI Powered Resume Parser</h1>
      <p className="mb-6 text-[#555A66]">Upload your resume and get structured data in seconds.</p>

      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-2xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <input type="file" onChange={handleFileChange} className="hidden" id="resume-upload" />
            <label htmlFor="resume-upload" className="cursor-pointer px-4 py-2 bg-[#FF6C52] text-white rounded hover:bg-[#F92814] transition">Upload</label>
            {file && <span className="text-sm text-[#636978]">{file.name}</span>}
          </div>

          <div className="text-sm text-[#555A66]">
            Supported: PDF, DOCX | Max Size: 5MB
          </div>

          {uploadProgress > 0 && (
            <div className="w-full bg-[#d3d7dc] h-2 rounded">
              <div className="h-2 bg-[#FFBEAA] rounded" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}

          {file && (
            <button
              onClick={handleParse}
              className="mt-4 px-4 py-2 bg-[#636978] text-white rounded hover:bg-[#333940] transition"
              disabled={isParsing}
            >
              {isParsing ? "Parsing..." : "Parse"}
            </button>
          )}
        </div>

        {parsedData && (
          <div className="mt-6 bg-[#fafafa] p-4 rounded border border-[#ccc]">
            <pre className="text-sm text-[#555A66] overflow-auto">{JSON.stringify(parsedData, null, 2)}</pre>

            <div className="mt-4 flex gap-4">
              <button
                onClick={downloadJSON}
                className="bg-[#333940] text-white px-4 py-2 rounded hover:bg-[#555A66] transition"
              >
                Download JSON
              </button>
              <button
                onClick={() => navigate('/jobs')}
                className="bg-[#F92814] text-white px-4 py-2 rounded hover:bg-[#D31705] transition"
              >
                Search Jobs
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parse;
