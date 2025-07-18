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
###  Environment Variables
Create a .env in root for Jooble:

JOOBLE_API_KEY=your_jooble_api_key

---

##  Installation & Setup


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
```
---

## UI Preview

<img width="1140" height="482" alt="rs1" src="https://github.com/user-attachments/assets/8f9bced7-9b0b-499e-a0bc-cec0a6511a8b" />


<img width="1053" height="831" alt="image" src="https://github.com/user-attachments/assets/eb01c5aa-3c65-483c-89ca-a719832b661f" />



<img width="1635" height="827" alt="r3" src="https://github.com/user-attachments/assets/3287cda5-fca4-41d8-9e44-bb783a342f82" />




