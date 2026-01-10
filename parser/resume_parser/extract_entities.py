# resume_parser/extract_entities.py

from __future__ import annotations

import json
import re
import importlib.resources as pkg_resources
from typing import Dict, List, Any, Optional

import spacy
from resume_parser.utils import clean_text, detect_language

# ---------- spaCy Models (multilingual + lazy) ----------

_NLP_CACHE: Dict[str, spacy.language.Language] = {}


def get_nlp(lang_code: str) -> spacy.language.Language:
    """
    Return a spaCy Language object for the given language code.
    Lazy-loads and caches pipelines so each model is loaded only once.
    Currently:
      - 'en' -> en_core_web_md
      - others -> fallback to English
    """
    lang_code = (lang_code or "en").split("-")[0].lower()

    if lang_code in _NLP_CACHE:
        return _NLP_CACHE[lang_code]

    if lang_code == "en":
        nlp = spacy.load("en_core_web_md")
    else:
        # TODO: plug in other language pipelines as needed, e.g.:
        # if lang_code == "es": nlp = spacy.load("es_core_news_md")
        nlp = spacy.load("en_core_web_md")

    _NLP_CACHE[lang_code] = nlp
    return nlp

# ---------- Skills Taxonomy ----------

with pkg_resources.files(__package__).joinpath("skills_taxonomy.json").open(encoding="utf-8") as f:
    SKILL_TAXONOMY: Dict[str, List[str]] = json.load(f)




# ---------- Name Extraction ----------


# ---------- Name Extraction (now uses language-aware nlp) ----------


def extract_name_with_confidence(text: str, lang: str) -> Dict[str, Any]:
    """
    Extract candidate name with a simple confidence score and language-aware model.
    """
    nlp = get_nlp(lang)

    lines = text.splitlines()
    header = "\n".join(lines[:5])

    doc = nlp(header)
    person_entities = [ent for ent in doc.ents if ent.label_ == "PERSON"]

    if person_entities:
        best = min(person_entities, key=lambda e: e.start_char)
        if len(best.text.split()) <= 4:
            return {"value": best.text.strip(), "confidence": 0.9}

    for line in lines[:5]:
        words = line.strip().split()
        if 1 < len(words) <= 4 and all(
            w[0].isupper() for w in words if w.isalpha()
        ):
            return {"value": line.strip(), "confidence": 0.7}

    return {"value": None, "confidence": 0.0}


# ---------- Email & Phone Extraction ----------


def extract_emails_raw(text: str) -> List[str]:
    return re.findall(r"[\w\.-]+@[\w\.-]+\.\w+", text)


def extract_phones_raw(text: str) -> List[str]:
    matches = re.findall(r"(\+?\d[\d\s\-\(\)]{7,}\d)", text)
    return matches


def normalize_phone(raw: str) -> Optional[str]:
    digits = re.sub(r"[^\d+]", "", raw)

    if digits.startswith("00"):
        digits = "+" + digits[2:]

    core = re.sub(r"\D", "", digits)
    if len(core) < 10 or len(core) > 13:
        return None

    return digits


def score_phone(normalized: str) -> float:
    """
    Very simple heuristic:
    - 0.9 for numbers that passed normalization and length checks.
    """
    return 0.9


# ---------- Skills Extraction (taxonomy + sections) ----------


def extract_skills_with_confidence(text: str, sections: Dict[str, str] | None = None) -> List[Dict[str, Any]]:
    """
    Extract skills and attach:
      - canonical id (for matching) = canonical key,
      - label (display) = canonical key,
      - confidence.
    Uses word-boundary matching on canonical name and aliases.
    """
    skills_section_text = None

    if sections and "skills" in sections and sections["skills"].strip():
        skills_section_text = sections["skills"]

    full_lower = text.lower()
    in_section_lower = skills_section_text.lower() if skills_section_text else None

    found: Dict[str, Dict[str, Any]] = {}

    def contains_token(haystack: str, token: str) -> bool:
        pattern = rf"\b{re.escape(token.lower())}\b"
        return re.search(pattern, haystack) is not None

    for canonical, variants in SKILL_TAXONOMY.items():
        # variants is a list of alias strings
        aliases = variants or []
        canonical_id = canonical  # canonical ID is the key itself
        label = canonical         # display text; you can title-case later if you want

        confidence = 0.0

        # Check skills section (higher confidence)
        if in_section_lower:
            if any(contains_token(in_section_lower, v) for v in [canonical] + aliases):
                confidence = max(confidence, 0.9)

        # Check full text (lower confidence)
        if any(contains_token(full_lower, v) for v in [canonical] + aliases):
            if confidence < 0.9:
                confidence = 0.8

        if confidence > 0.0:
            existing = found.get(canonical_id)
            if existing:
                existing["confidence"] = max(existing["confidence"], confidence)
            else:
                found[canonical_id] = {
                    "id": canonical_id,
                    "value": label,
                    "confidence": confidence,
                }

    # Sort by id for stability
    return sorted(found.values(), key=lambda s: s["id"])



# ---------- Main Entity Extraction ----------


def extract_entities(text: str, sections: Dict[str, str] | None = None) -> Dict[str, Any]:
    """
    Main interface: extracts name, emails, phones, and skills from resume text.
    Adds confidence and language metadata.
    """
    clean = clean_text(text)

    # Language detection (two-letter code like 'en', 'fr', ...)
    lang = detect_language(clean) or "en"

    # Name (language-aware model)
    name_info = extract_name_with_confidence(text, lang)

    # Emails
    emails = extract_emails_raw(clean)
    email_conf = 0.95 if emails else 0.0
    email_objects = [{"value": e, "confidence": email_conf} for e in emails]

    # Phones
    phones_raw = extract_phones_raw(clean)
    normalized_phones: list[str] = []
    phone_objects: list[dict] = []
    for ph in phones_raw:
        norm = normalize_phone(ph)
        if norm and norm not in normalized_phones:
            normalized_phones.append(norm)
            phone_objects.append(
                {"value": norm, "confidence": score_phone(norm)}
            )

    # Skills (canonical ids + labels + confidence)
    skills_objs = extract_skills_with_confidence(clean, sections=sections)

    return {
        # Language info
        "language": lang,

        # Rich fields
        "name": name_info,
        "emails_detailed": email_objects,
        "primary_email_detailed": email_objects[0] if email_objects else {"value": None, "confidence": 0.0},
        "phones_detailed": phone_objects,
        "primary_phone_detailed": phone_objects[0] if phone_objects else {"value": None, "confidence": 0.0},
        "skills_detailed": skills_objs,

        # Canonical and flat skills for consumers
        "skills": [s["id"] for s in skills_objs],
        "skills_flat": [s["value"] for s in skills_objs],

        # Legacy flat fields
        "name_flat": name_info["value"],
        "emails": emails,
        "primary_email": emails[0] if emails else None,
        "phones": normalized_phones,
        "primary_phone": normalized_phones[0] if normalized_phones else None,
    }
