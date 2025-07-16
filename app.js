const express = require('express');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Set your Jooble API key
const JOOBLE_API_KEY = 'b4a3b748-a8e9-49a9-8cd3-3a32bad344ac'; // Replace this with your actual key

// Configure Handlebars
app.engine('hbs', exphbs.engine({ extname: 'hbs' }));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'client/views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// GET /search → Resume Search Form
app.get('/search', (req, res) => {
    res.render('index'); // index.hbs
});

// POST /results → Show jobs based on parsed resume
app.post('/results', async (req, res) => {
    const outputDir = path.join(__dirname, 'parser/output_json');

    // Get the latest parsed JSON file (based on timestamp)
    const files = fs.readdirSync(outputDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({ file: f, time: fs.statSync(path.join(outputDir, f)).mtime }))
        .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
        return res.render('results', { jobs: [], error: "No parsed resume found." });
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
        console.error("Failed to read resume:", err);
        return res.render('results', { jobs: [], error: "Error reading resume file." });
    }

    const joobleURL = `https://jooble.org/api/${JOOBLE_API_KEY}`;

    try {
        const response = await axios.post(joobleURL, {
            keywords: keywords,
            location: "India"
        });

        const jobs = response.data.jobs || [];
        res.render('results', { jobs });
    } catch (err) {
        console.error("Jooble API error:", err.message);
        res.render('results', { jobs: [], error: "Failed to fetch jobs from Jooble API." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Job Finder running at http://localhost:${PORT}`);
});
