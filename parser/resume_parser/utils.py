# resume_parser/utils.py

import os
import re
import dateparser
import docx
from pdfminer.high_level import extract_text as extract_pdf_text

# --- Cleaning Helpers ---

def clean_text(text):
    """
    Cleans and normalizes raw resume text.
    - Removes extra whitespaces and line breaks
    - Converts to single-line normalized text
    """
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def normalize_skill(skill):
    """
    Standardize a skill string (e.g., ' PYTHON  ' → 'python')
    """
    return skill.lower().strip()


def extract_lines(text):
    """
    Breaks text into meaningful, non-empty lines.
    Useful for line-by-line parsing like experience blocks.
    """
    return [line.strip() for line in text.splitlines() if line.strip()]


# --- Date Range Parser ---

def parse_date_range(text):
    """
    Attempts to extract start and end years from a given date range string.
    Supports formats like:
    - 'Jan 2019 - Dec 2022'
    - '2018 - 2020'
    - 'March 2017 – Present'
    
    Returns:
        (start_year: int or None, end_year: int or str or None)
    """
    text = text.replace("–", "-").replace("—", "-").strip().lower()
    dates = re.findall(r'(?:\w+\s)?\d{4}', text)

    if len(dates) >= 1:
        start = dateparser.parse(dates[0])
        end = dateparser.parse(dates[1]) if len(dates) > 1 else None

        start_year = start.year if start else None
        end_year = end.year if end else (
            "present" if "present" in text else None
        )

        return start_year, end_year

    return None, None

# --- Resume File Reader ---

def extract_text_from_docx(path):
    """
    Extracts and returns text from a .docx file.
    """
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_text_from_txt(path):
    """
    Extracts and returns text from a .txt file.
    """
    with open(path, 'r', encoding='utf-8') as file:
        return file.read()

def extract_text_from_pdf(path):
    """
    Extracts and returns text from a .pdf file using pdfminer.six
    """
    return extract_pdf_text(path)

def extract_text_from_file(path):
    """
    Extracts raw text from .pdf, .docx, or .txt file.
    Applies basic cleanup afterward.
    """
    ext = os.path.splitext(path)[1].lower()

    if ext == '.pdf':
        raw = extract_text_from_pdf(path)
    elif ext == '.docx':
        raw = extract_text_from_docx(path)
    elif ext == '.txt':
        raw = extract_text_from_txt(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    return clean_text(raw)


# --- Experience Parser Helpers ---

def find_experience_lines(text, titles=None):
    """
    Extract lines likely related to experience using title keywords.
    """
    if not titles:
        titles = [
            "intern", "engineer", "developer", "assistant", "analyst",
            "scientist", "manager", "consultant", "designer"
        ]

    lines = extract_lines(text)
    exp_lines = [
        line for line in lines
        if any(title.lower() in line.lower() for title in titles)
    ]
    return exp_lines
