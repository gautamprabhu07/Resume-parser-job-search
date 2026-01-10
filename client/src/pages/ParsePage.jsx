// src/pages/ParsePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseResume } from '../api/parserApi';
import { validateResume } from '../utils/fileValidation';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ResumeDetails from '../components/ResumeDetails.jsx';
import { Brain, FileText, Upload, Download, Search, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-indigo-400 mr-3" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              AI Resume Parser
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced AI-powered resume analysis and structured data extraction
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          {/* Upload Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 shadow-lg backdrop-blur">
            <div className="flex items-center mb-6">
              <FileText className="w-5 h-5 text-indigo-400 mr-2" />
              <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">
                Upload Resume
              </h2>
            </div>

            <label
              htmlFor="resume-upload"
              className={`
                cursor-pointer flex flex-col items-center justify-center
                rounded-lg border-2 border-dashed p-12
                transition-all duration-200 ease-out
                ${file 
                  ? 'border-indigo-500/50 bg-indigo-500/5 hover:border-indigo-500/70' 
                  : 'border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/50'
                }
              `}
            >
              <Upload className={`w-12 h-12 mb-4 ${file ? 'text-indigo-400' : 'text-gray-500'}`} />
              
              {file ? (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-100 mb-1">{file.name}</p>
                  <p className="text-sm text-gray-400">Click to change file</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-300 mb-1">
                    Click to upload your resume
                  </p>
                  <p className="text-sm text-gray-500">PDF, DOC, or DOCX up to 5MB</p>
                </div>
              )}
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Uploading</span>
                  <span className="text-xs text-indigo-400 font-medium">{uploadProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-1.5 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6">
                <ErrorMessage message={error} />
              </div>
            )}

            {/* Parse Button */}
            {file && (
              <button
                onClick={handleParse}
                disabled={isParsing}
                className={`
                  mt-6 w-full py-3.5 rounded-lg font-semibold
                  transition-all duration-200 ease-out
                  flex items-center justify-center
                  ${isParsing 
                    ? 'bg-slate-800 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:translate-y-[-2px]'
                  }
                `}
              >
                {isParsing ? (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                    AI is analyzing the resume
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-2" />
                    Parse with AI
                  </>
                )}
              </button>
            )}
          </div>

          {/* Loading State */}
          {isParsing && !parsedData && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-12 shadow-lg backdrop-blur">
              <LoadingSpinner message="AI is analyzing the resume" />
            </div>
          )}

          {/* Parsed Data */}
          {parsedData && (
            <>
              <ResumeDetails data={parsedData} />

              {/* Skills Section */}
              {parsedData?.skills && parsedData.skills.length > 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-lg backdrop-blur">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Sparkles className="w-5 h-5 text-indigo-400 mr-2" />
                      <h3 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">
                        Detected Skills
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 text-xs bg-cyan-900/40 text-cyan-300 rounded-full border border-cyan-500/20">
                      AI Extracted
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skillObj, idx) => {
                      const confidence = skillObj.confidence || 0;
                      const getConfidenceColor = () => {
                        if (confidence >= 0.8) return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300';
                        if (confidence >= 0.5) return 'border-amber-500/20 bg-amber-500/10 text-amber-300';
                        return 'border-rose-500/20 bg-rose-500/10 text-rose-300';
                      };

                      return (
                        <div
                          key={`${skillObj.value}-${idx}`}
                          className="group relative"
                        >
                          <span
                            className={`
                              inline-flex items-center px-3 py-1.5
                              border rounded-full text-sm font-medium
                              transition-all duration-200 ease-out
                              hover:translate-y-[-2px]
                              ${getConfidenceColor()}
                            `}
                          >
                            {skillObj.value}
                          </span>
                          
                          {/* Confidence Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                            <div className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
                              <p className="text-xs text-gray-400 mb-1">Confidence</p>
                              <div className="flex items-center">
                                <div className="h-1.5 w-20 bg-slate-800 rounded-full overflow-hidden mr-2">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      confidence >= 0.8 ? 'bg-emerald-400' :
                                      confidence >= 0.5 ? 'bg-amber-400' : 'bg-rose-400'
                                    }`}
                                    style={{ width: `${confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-300 font-medium">
                                  {(confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 justify-end">
                <button
                  onClick={downloadJSON}
                  className="
                    flex items-center px-6 py-3 rounded-lg font-semibold
                    bg-slate-800 hover:bg-slate-700 text-gray-100
                    border border-slate-700 hover:border-slate-600
                    transition-all duration-200 ease-out
                    hover:translate-y-[-2px]
                    shadow-lg
                  "
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download JSON
                </button>
                <button
                  onClick={handleSearchJobs}
                  className="
                    flex items-center px-6 py-3 rounded-lg font-semibold
                    bg-indigo-600 hover:bg-indigo-500 text-white
                    transition-all duration-200 ease-out
                    hover:translate-y-[-2px]
                    shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30
                  "
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ParsePage;