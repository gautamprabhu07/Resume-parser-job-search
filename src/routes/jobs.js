// src/routes/jobs.js

import express from 'express';
import { extractKeywords } from '../utils/keywords.js';
import { getJobsForParsedResume } from '../services/joobleService.js';

const router = express.Router();

/**
 * POST /jobs
 * Body: parsed resume JSON
 */
router.post('/', async (req, res) => {
  try {
    const parsedData = req.body;

    // Basic validation: must be an object
    if (!parsedData || typeof parsedData !== 'object') {
      return res.status(400).json({ error: 'Invalid payload: expected JSON object.' });
    }

    // Validate skills presence (soft check, no hard fail)
    const skills = extractKeywords(parsedData);
    if (!skills.length && !Array.isArray(parsedData.skills_detailed)) {
      // No skills at all: still proceed with fallback keyword, but log
      console.warn({
        route: '/jobs',
        message: 'No skills found in parsedData; using fallback keyword.',
      });
    }

    const { keywords, fromCache, jobs } = await getJobsForParsedResume(parsedData);

    console.log({
  requestId: req.requestId,
  route: '/jobs',
  keywords,
  fromCache,
  jobCount: jobs.length,
});

    return res.json(jobs);
  } catch (err) {
    console.error('Jooble API error:', err.message || err);

    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Job provider timeout. Please try again.' });
    }

    return res.status(502).json({ error: 'Failed to fetch jobs from provider.' });
  }
});

export default router;
