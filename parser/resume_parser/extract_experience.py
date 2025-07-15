# resume_parser/extract_experience.py

import re
from resume_parser.utils import clean_text, parse_date_range, find_experience_lines

# Expandable title set
TITLES = {
    "Data Scientist", "Software Engineer", "Machine Learning Engineer", "Research Assistant",
    "AI Engineer", "Developer", "Intern", "Data Analyst", "Backend Developer",
    "Frontend Developer", "Full Stack Developer"
}

def extract_experience(text):
    """
    Extracts work experience entries from resume text.
    Each entry contains: job title, company name, and duration (in years).
    """
    text = clean_text(text)
    lines = find_experience_lines(text, titles=TITLES)

    experiences = []

    for line in lines:
        match = re.search(
            r'(?P<title>[A-Za-z &]+?)\s+(?:at|@|-|–)\s+(?P<company>[A-Za-z0-9 &]+)[,\s]+(?P<range>.*?)(?=$|\n)',
            line, re.IGNORECASE
        )

        if match:
            title = match.group("title").strip()
            company = match.group("company").strip()
            date_range = match.group("range").strip()

            start_year, end_year = parse_date_range(date_range)

            try:
                if isinstance(end_year, int) and isinstance(start_year, int):
                    duration = end_year - start_year if end_year >= start_year else None
                elif isinstance(end_year, str) and start_year:
                    duration = 2025 - start_year  # fallback if 'present'
                else:
                    duration = None
            except:
                duration = None

            experiences.append({
                "title": title,
                "company": company,
                "years": duration
            })

    return experiences
