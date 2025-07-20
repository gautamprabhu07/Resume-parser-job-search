import 'dotenv/config';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 5000;
const JOOBLE_API_KEY = process.env.JOOBLE_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// POST /jobs → Receives parsed JSON from frontend, fetches matching jobs from Jooble
app.post('/jobs', async (req, res) => {
  try {
    const parsedData = req.body; // parsed resume JSON sent from frontend

    let keywords = 'developer'; // fallback keyword
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
