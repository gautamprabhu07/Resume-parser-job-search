# resume_parser/sections.py

from __future__ import annotations

import re
from .utils import extract_lines

# Known section header patterns (lowercase, without trailing colon)
SECTION_HEADERS: dict[str, list[str]] = {
    "experience": ["experience", "work experience", "professional experience"],
    "education": ["education", "academic background"],
    "skills": ["skills", "technical skills", "key skills"],
    "projects": ["projects", "personal projects"],
    "certifications": ["certifications", "certificates"],
}


def _normalize_header(line: str) -> str:
    """
    Normalize a potential header line for comparison:
    - strip surrounding whitespace
    - remove trailing colon(s)
    - lowercase
    """
    norm = line.strip()
    # remove trailing ":" or "::"
    norm = re.sub(r":+$", "", norm)
    return norm.lower().strip()


def _match_header(normalized_line: str) -> str | None:
    """
    Return the canonical section key if the line matches a known header,
    otherwise None.
    """
    for key, patterns in SECTION_HEADERS.items():
        for p in patterns:
            if normalized_line.startswith(p):
                return key
    return None


def detect_sections(text: str) -> dict[str, str]:
    """
    Split resume text into logical sections based on simple header detection.

    Returns a dict mapping section name -> text block, e.g.
    {
        "experience": "....",
        "education": "....",
        "skills": "....",
        "other": "...."
    }
    """
    lines = extract_lines(text)
    sections: dict[str, str] = {}
    current = "other"
    buffer: list[str] = []

    for line in lines:
        norm = _normalize_header(line)
        header_key = _match_header(norm)

        if header_key:
            # flush previous buffer into current section
            if buffer:
                prev = sections.setdefault(current, "")
                sections[current] = prev + ("\n" if prev else "") + "\n".join(buffer)
                buffer = []

            current = header_key
        else:
            buffer.append(line)

    # flush remaining buffer
    if buffer:
        prev = sections.setdefault(current, "")
        sections[current] = prev + ("\n" if prev else "") + "\n".join(buffer)

    return sections
