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
// Replace this whole block where you're reading local JSON:
const output = await axios.post('https://resume-parser-job-search.onrender.com/parse-resume', formData);

// Instead, just do this to get the latest parsed resume data:
app.post('/jobs', async (req, res) => {
  try {
    // Ideally you'd pass a resume again or use stored ID/session, but for now we'll simulate
    const parsedData = req.body; // expect parsed data to be sent from frontend

    let keywords = 'developer';
    if (parsedData.skills && parsedData.skills.length > 0) {
      keywords = parsedData.skills.join(', ');
    }

    const joobleURL = `https://jooble.org/api/${JOOBLE_API_KEY}`;
    const { data } = await axios.post(joobleURL, {
      keywords,
      location: 'India',
    });

    res.json(data.jobs || []);
  } catch (err) {
    console.error('Jooble API error:', err.message);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Job Finder API running at http://localhost:${PORT}`);
});
