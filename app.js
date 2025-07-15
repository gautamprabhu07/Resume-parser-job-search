const express = require("express");
const multer = require("multer");
const path = require("path");
const { exec } = require("child_process");
const exphbs = require("express-handlebars");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Setup Handlebars
app.engine("hbs", exphbs.engine({ extname: ".hbs" }));
app.set("view engine", "hbs");
app.set("views", "./client/views");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// Route: Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Route: Handle resume upload
app.post("/upload", upload.single("resume"), (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.file.originalname);

  // Call the Python script and pass the file path
  // Build the resume path relative to /resparse

exec(
  `python -m parser.resume_parser_main "${filePath}"`,
  (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error.message);
      return res.status(500).send("Parser error");
    }

    try {
      const parsed = JSON.parse(stdout);
      const skills = parsed.skills.join(",") || "developer";

      // Use parsed skills to call Indreed job API
      axios
        .get(`https://indreed.herokuapp.com/api/jobs?q=${skills}&limit=10`)
        .then((response) => {
          const jobs = response.data.jobs || [];
          res.render("results", { jobs });
        })
        .catch((err) => {
          console.error("Job API error:", err.message);
          res.status(500).send("Job search failed");
        });
    } catch (err) {
      console.error("Invalid JSON from parser:", stdout);
      res.status(500).send("Failed to parse resume output");
    }
  }
);

});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 
