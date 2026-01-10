# resume_parser/utils.py

import os
import re
import dateparser
import docx
from pdfminer.high_level import extract_text as extract_pdf_text
from langdetect import detect as _langdetect_detect


# --- Cleaning Helpers ---


def clean_text(text: str) -> str:
    """
    Cleans and normalizes raw resume text.
    - Removes extra whitespaces and line breaks
    - Converts to single-line normalized text
    """
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def detect_language(text: str) -> str | None:
    """
    Detect the language of the given text using langdetect.
    Returns a two-letter language code like 'en', 'es', 'fr', or None on failure.
    """
    try:
        return _langdetect_detect(text)
    except Exception:
        return None


def normalize_skill(skill: str) -> str:
    """
    Standardize a skill string (e.g., ' PYTHON  ' → 'python')
    """
    return skill.lower().strip()


def normalize_line(line: str) -> str:
    """
    Normalize a single line without collapsing the whole document:
    - Fix hyphenated line breaks: develop-\nment -> development
    - Normalize bullet symbols
    - Collapse internal multiple spaces
    """
    # Fix hyphenated line breaks: "develop-\nment" → "development"
    line = re.sub(r"(\w+)-\s+(\w+)", r"\1\2", line)

    # Normalize bullet symbols at start of line
    line = re.sub(r"^[\-\u2022\u2023\u25E6]+", "", line).strip()

    # Collapse internal multiple spaces
    line = re.sub(r"\s+", " ", line)

    return line.strip()


def extract_lines(text: str) -> list[str]:
    """
    Breaks text into meaningful, non-empty lines.
    Uses line-level normalization instead of collapsing everything.
    Useful for line-by-line parsing like experience blocks.
    """
    raw_lines = text.splitlines()
    lines: list[str] = []
    for line in raw_lines:
        line = normalize_line(line)
        if line:
            lines.append(line)
    return lines


def remove_repeated_lines(lines: list[str], min_repeats: int = 3) -> list[str]:
    """
    Remove lines that repeat across the document, useful for headers/footers.
    Any line appearing >= min_repeats times is treated as boilerplate and removed.
    """
    from collections import Counter

    counts = Counter(lines)
    to_remove = {line for line, c in counts.items() if c >= min_repeats}
    return [l for l in lines if l not in to_remove]


def clean_text_preserve_structure(text: str) -> str:
    """
    Clean text while preserving logical line structure:
    - Split into normalized lines
    - Remove repeated header/footer lines
    - Join back with newline separators
    """
    lines = extract_lines(text)
    lines = remove_repeated_lines(lines)
    return "\n".join(lines)


# --- Date Range Parser ---


def parse_date_range(text: str):
    """
    Attempts to extract start and end years from a given date range string.

    Supports formats like (case-insensitive, various separators):
      - 'Jan 2019 - Dec 2022'
      - '2018 - 2020'
      - 'March 2017 – Present'
      - '2021/01 – Present'
      - "Aug'20 – Dec'22"

    Returns:
        (start_year: int or None, end_year: int or str or None)
        where end_year can be 'present' if text indicates an ongoing role.
    """
    # Normalize separators and quotes
    normalized = (
        text.replace("–", "-")
            .replace("—", "-")
            .replace("—", "-")
            .replace("to", "-")
            .replace("–", "-")
            .replace("’", "'")
            .strip()
            .lower()
    )

    # Common tokens indicating "present"
    present_tokens = {"present", "current", "now"}

    # Split on dash-like separators (keep max 2 parts)
    parts = [p.strip() for p in re.split(r"\s*-\s*|\s+to\s+", normalized) if p.strip()]

    start_part = parts[0] if parts else ""
    end_part = parts[1] if len(parts) > 1 else ""

    # Helper to parse a single date-like part into a year
    def parse_part(part: str):
        if not part:
            return None

        # If it clearly says present/current/etc.
        if any(tok in part for tok in present_tokens):
            return "present"

        # Handle short year forms like '20, '22
        m_short = re.search(r"'(\d{2})", part)
        if m_short:
            yy = int(m_short.group(1))
            # Heuristic: '90–'99 -> 1990–1999, '00–'29 -> 2000–2029
            if yy >= 90:
                return 1900 + yy
            return 2000 + yy

        # General fallback: use dateparser to interpret month/year patterns, etc.
        dt = dateparser.parse(part)
        if dt:
            return dt.year

        # Last resort: extract a 4-digit year directly
        m_year = re.search(r"(19|20)\d{2}", part)
        if m_year:
            return int(m_year.group(0))

        return None

    start_year = parse_part(start_part)
    end_year = parse_part(end_part)

    return start_year, end_year



# --- Resume File Reader ---


def extract_text_from_docx(path: str) -> str:
    """
    Extracts and returns text from a .docx file.
    """
    doc_obj = docx.Document(path)
    return "\n".join([para.text for para in doc_obj.paragraphs])


def extract_text_from_txt(path: str) -> str:
    """
    Extracts and returns text from a .txt file.
    """
    with open(path, "r", encoding="utf-8") as file:
        return file.read()


def extract_text_from_pdf(path: str) -> str:
    """
    Extracts and returns text from a .pdf file using pdfminer.six
    """
    return extract_pdf_text(path)


def extract_text_from_file(path: str) -> str:
    """
    Extracts raw text from .pdf, .docx, or .txt file.
    Applies structured cleanup afterward, preserving lines and sections.
    """
    ext = os.path.splitext(path)[1].lower()

    if ext == ".pdf":
        raw = extract_text_from_pdf(path)
    elif ext == ".docx":
        raw = extract_text_from_docx(path)
    elif ext == ".txt":
        raw = extract_text_from_txt(path)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    # Use structured cleaning that preserves line structure
    return clean_text_preserve_structure(raw)


# --- Experience Parser Helpers ---


def find_experience_lines(text: str, titles=None) -> list[str]:
    """
    Extract lines likely related to experience using title keywords.
    """
    if not titles:
        titles = [
            "intern",
            "engineer",
            "developer",
            "assistant",
            "analyst",
            "scientist",
            "manager",
            "consultant",
            "designer",
        ]

    lines = extract_lines(text)
    exp_lines = [
        line
        for line in lines
        if any(title.lower() in line.lower() for title in titles)
    ]
    return exp_lines
