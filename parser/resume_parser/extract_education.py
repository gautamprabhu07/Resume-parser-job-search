# resume_parser/extract_education.py

from __future__ import annotations

import re
from typing import List, Dict, Any, Optional

from .utils import clean_text_preserve_structure

DEGREE_PATTERNS = [
    r"(b\.?\s*tech|bachelor of technology)",
    r"(b\.?\s*e\.?|bachelor of engineering)",
    r"(m\.?\s*tech|master of technology)",
    r"(b\.?\s*sc\.?|bachelor of science)",
    r"(m\.?\s*sc\.?|master of science)",
    r"(b\.?\s*c\.?\s*a\.?|bachelor of computer applications)",
    r"(m\.?\s*c\.?\s*a\.?|master of computer applications)",
    r"(b\.?\s*com\.?|bachelor of commerce)",
    r"(m\.?\s*com\.?|master of commerce)",
    r"(ph\.?\s*d\.?|doctor of philosophy)",
]

DEGREE_REGEXES = [re.compile(p, re.IGNORECASE) for p in DEGREE_PATTERNS]
YEAR_REGEX = re.compile(r"\b(19|20)\d{2}\b")

def _education_signature(ed: dict) -> str:
    """
    Build a hashable signature for an education entry.
    Uses normalized degree + line + graduation year.
    """
    degree = (ed.get("degree_raw") or "").strip().lower()
    line = (ed.get("line") or "").strip().lower()
    year = ed.get("graduation_year")
    return f"{degree}|{line}|{year}"



def _find_degree(line_lower: str) -> Optional[str]:
    for rx in DEGREE_REGEXES:
        m = rx.search(line_lower)
        if m:
            return m.group(0)
    return None


def _score_education(degree: Optional[str], grad_year: Optional[int]) -> float:
    if degree and grad_year:
        return 0.9
    if degree:
        return 0.7
    return 0.0


def extract_education(text: str, sections: dict | None = None) -> List[Dict[str, Any]]:
    if sections and "education" in sections and sections["education"].strip():
        text = sections["education"]

    text = clean_text_preserve_structure(text)
    lines = text.splitlines()

    entries: List[Dict[str, Any]] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        lower = stripped.lower()
        degree = _find_degree(lower)
        if not degree:
            continue

        year_match = YEAR_REGEX.search(stripped)
        grad_year = int(year_match.group(0)) if year_match else None

        confidence = _score_education(degree, grad_year)

        entries.append(
            {
                "degree_raw": degree,
                "line": stripped,
                "graduation_year": grad_year,
                "confidence": confidence,
            }
        )

    # Deduplicate education entries by signature while preserving order
    seen = set()
    deduped: List[Dict[str, Any]] = []
    for ed in entries:
        sig = _education_signature(ed)
        if sig in seen:
            continue
        seen.add(sig)
        deduped.append(ed)

    return deduped
