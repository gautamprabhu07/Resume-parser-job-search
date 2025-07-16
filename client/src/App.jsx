import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [resume, setResume] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loadingParse, setLoadingParse] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setError("");
    if (!resume) {
      setError("Please select a resume file first.");
      return;
    }

    setLoadingParse(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);

      const res = await axios.post("http://localhost:8000/parse-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setParsedData(res.data);
      setJobs([]); // Clear previous jobs if any
    } catch (err) {
      setError("Failed to parse resume. Try again.");
    } finally {
      setLoadingParse(false);
    }
  };

  const handleJobSearch = async () => {
    setError("");
    setLoadingJobs(true);
    try {
      const res = await axios.post("http://localhost:5000/jobs");
      setJobs(res.data);
    } catch (err) {
      setError("Failed to fetch jobs. Try again.");
    } finally {
      setLoadingJobs(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: "0 1rem", fontFamily: "Arial, sans-serif" }}>
      <h2>📄 Resume Parser + Job Finder</h2>

      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setResume(e.target.files[0])}
        disabled={loadingParse || loadingJobs}
      />
      <button onClick={handleUpload} disabled={loadingParse || loadingJobs} style={{ marginLeft: 8 }}>
        {loadingParse ? "Parsing..." : "Upload & Parse"}
      </button>

      {error && (
        <div style={{ color: "red", marginTop: 12 }}>
          {error}
        </div>
      )}

      {parsedData && (
        <>
          <section style={{ marginTop: 20 }}>
            <h3>Parsed Resume Data:</h3>
            <pre style={{ background: "#f4f4f4", padding: 12, borderRadius: 4, maxHeight: 400, overflowY: "auto" }}>
              {JSON.stringify(parsedData, null, 2)}
            </pre>

            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(parsedData, null, 2))}`}
              download="parsed_resume.json"
              style={{ display: "inline-block", marginTop: 12 }}
            >
              ⬇️ Download JSON
            </a>

            <br />

            <button
              onClick={handleJobSearch}
              disabled={loadingJobs}
              style={{ marginTop: 16, padding: "8px 16px", fontSize: 16 }}
            >
              {loadingJobs ? "Searching Jobs..." : "🔎 Search Jobs"}
            </button>
          </section>
        </>
      )}

      {jobs.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h3>🔥 Job Listings</h3>
          {jobs.map((job, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: 12,
                marginBottom: 12,
                backgroundColor: "#fafafa",
              }}
            >
              <h4>{job.title}</h4>
              <p>{job.snippet}</p>
              <a href={job.link} target="_blank" rel="noopener noreferrer">
                Apply
              </a>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
