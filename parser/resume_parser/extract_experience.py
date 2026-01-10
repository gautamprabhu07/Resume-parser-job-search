# resume_parser/extract_experience.py

from __future__ import annotations

import re
from datetime import datetime
from typing import Dict, List, Any, Optional

from resume_parser.utils import (
    clean_text_preserve_structure,
    parse_date_range,
    extract_lines,
)

CURRENT_YEAR = datetime.now().year

TITLES = {
    "Data Scientist",
    "Software Engineer",
    "Machine Learning Engineer",
    "Research Assistant",
    "AI Engineer",
    "Developer",
    "Intern",
    "Data Analyst",
    "Backend Developer",
    "Frontend Developer",
    "Full Stack Developer",
}

def _experience_signature(exp: dict) -> str:
    """
    Build a hashable signature for an experience entry to dedupe similar entries.
    Uses normalized title, company, years, and responsibilities.
    """
    title = (exp.get("title") or "").strip().lower()
    company = (exp.get("company") or "").strip().lower()
    years = exp.get("years")
    start_year = exp.get("start_year")
    end_year = exp.get("end_year")

    # Normalize responsibilities as a single string
    resp_lines = exp.get("responsibilities") or []
    resp_norm = " ".join(line.strip().lower() for line in resp_lines if line.strip())

    # Build a simple signature string
    return f"{title}|{company}|{start_year}|{end_year}|{years}|{resp_norm}"


def _looks_like_experience_header(line: str) -> bool:
    lower = line.lower()
    has_title = any(t.lower() in lower for t in TITLES)
    if not has_title:
        return False

    if re.search(r"\b(at|@|-|–)\b", lower):
        return True

    if re.search(r"\b(19|20)\d{2}\b", lower):
        return True

    return False


def _split_into_blocks(lines: List[str]) -> List[List[str]]:
    blocks: List[List[str]] = []
    current_block: List[str] = []

    for line in lines:
        if _looks_like_experience_header(line):
            if current_block:
                blocks.append(current_block)
                current_block = []
            current_block.append(line)
        else:
            if current_block:
                current_block.append(line)

    if current_block:
        blocks.append(current_block)

    return blocks


def _score_experience(title: Optional[str], company: Optional[str], start_year, end_year) -> float:
    """
    Simple confidence scoring:
    - 0.9 if title+company and a valid year range
    - 0.7 if title+company but missing/invalid years
    - 0.6 if only title detected
    """
    if title and company and isinstance(start_year, int):
        if isinstance(end_year, int) and end_year >= start_year:
            return 0.9
        if isinstance(end_year, str):  # 'present'
            return 0.9
        return 0.7
    if title:
        return 0.6
    return 0.0


def extract_experience(text: str, sections: Dict[str, str] | None = None) -> List[Dict[str, Any]]:
    """
    Extracts work experience entries from resume text (block-based) with confidence.
    """
    if sections and "experience" in sections and sections["experience"].strip():
        text = sections["experience"]

    text = clean_text_preserve_structure(text)
    lines = extract_lines(text)

    blocks = _split_into_blocks(lines)
    experiences: List[Dict[str, Any]] = []

    for block in blocks:
        if not block:
            continue

        header = block[0]
        body_lines = block[1:] if len(block) > 1 else []

        match = re.search(
            r"(?P<title>[A-Za-z &]+?)\s+(?:at|@|-|–)\s+(?P<company>[A-Za-z0-9 &]+)[,\s]+(?P<range>.*)",
            header,
            re.IGNORECASE,
        )

        title = None
        company = None
        date_range = ""
        start_year = None
        end_year = None
        duration = None

        if match:
            title = match.group("title").strip()
            company = match.group("company").strip()
            date_range = match.group("range").strip()
            start_year, end_year = parse_date_range(date_range)

            if isinstance(start_year, int):
                if isinstance(end_year, int) and end_year >= start_year:
                    duration = end_year - start_year
                elif isinstance(end_year, str):
                    duration = CURRENT_YEAR - start_year
        else:
            lower = header.lower()
            for t in TITLES:
                if t.lower() in lower:
                    title = header.strip()
                    break

        confidence = _score_experience(title, company, start_year, end_year)

        experiences.append(
            {
                "title": title,
                "company": company,
                "start_year": start_year,
                "end_year": end_year,
                "years": duration,
                "responsibilities": body_lines,
                "confidence": confidence,
            }
        )

        # Deduplicate experiences by signature while preserving order
    seen = set()
    deduped: List[Dict[str, Any]] = []
    for exp in experiences:
        sig = _experience_signature(exp)
        if sig in seen:
            continue
        seen.add(sig)
        deduped.append(exp)

    return deduped

