require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

// Middleware
app.use(cors()); // Enable CORS for React frontend
app.use(express.json()); // Parse JSON bodies

// POST /jobs → Fetch jobs based on latest parsed resume
app.post('/jobs', async (req, res) => {
  const outputDir = path.join(__dirname, 'parser/output_json');

  // Get latest parsed JSON file
  const files = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.json'))
    .map(f => ({ file: f, time: fs.statSync(path.join(outputDir, f)).mtime }))
    .sort((a, b) => b.time - a.time);

  if (files.length === 0) {
    return res.status(404).json({ error: 'No parsed resume found.' });
  }

  const latestFile = files[0].file;
  const resumePath = path.join(outputDir, latestFile);

  let keywords = 'developer'; // fallback
  try {
    const resumeData = JSON.parse(fs.readFileSync(resumePath, 'utf-8'));
    if (resumeData.skills && resumeData.skills.length > 0) {
      keywords = resumeData.skills.join(', ');
    }
  } catch (err) {
    console.error('Failed to read resume JSON:', err);
    return res.status(500).json({ error: 'Failed to read resume data.' });
  }

  // Send request to Jooble API
  const joobleURL = `https://jooble.org/api/${JOOBLE_API_KEY}`;
  try {
    const { data } = await axios.post(joobleURL, {
      keywords,
      location: 'India',
    });
    res.json(data.jobs || []);
  } catch (err) {
    console.error('Jooble API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch jobs from Jooble API.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Job Finder API running at http://localhost:${PORT}`);
});
