#  Resume Parser + Job Finder 

A full-stack web application that helps users upload a resume, extract key data using NLP, and find personalized job listings using the Jooble Job Search API.

---

##  Features

- Upload resumes (`.pdf`, `.docx`, `.txt`)
-  Extract details using NLP (skills, experience, education)
-  Download parsed resume data as JSON
-  Search and display job listings based on extracted content
-  Clean, responsive UI with Tailwind CSS
-  React + Flask + Node.js integration

---

## Tech Stack

### 🔹 Frontend (React + Tailwind CSS)
- Vite
- Axios
- Tailwind CSS

### 🔹 Backend
- Flask (Python):  for Resume Parsing
- Node.js + Express: for Job Fetching (Jooble API)

### 🔹 NLP Parsing Tools
- spaCy
- pdfminer / python-docx
- dateparser
- regex


---

##  Getting Started

###  Prerequisites

- Node.js (v18+)
- Python 3.9+
- pip
- virtualenv

---

##  Installation & Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/resparse.git
cd resparse

cd parser
python -m venv venv
source venv/bin/activate   # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py              # Runs on http://localhost:8000

cd ..
npm install
node app.js                # Runs on http://localhost:5000

cd client
npm install
npm run dev                # Runs on http://localhost:5173
