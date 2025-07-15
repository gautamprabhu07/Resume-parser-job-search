# resume_parser/extract_entities.py

import re
import spacy
from resume_parser.utils import clean_text, normalize_skill

# Load SpaCy English model — medium version has better accuracy
nlp = spacy.load("en_core_web_md")

# Expandable skill set
SKILL_SET = {
    "python", "java", "c++", "sql", "machine learning", "deep learning",
    "tensorflow", "pytorch", "aws", "docker", "linux", "git", "data science",
    "html", "css", "javascript", "react", "node.js", "express", "flask"
}

def extract_email(text: str) -> str | None:
    """
    Extracts the first email address using regex.
    """
    match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    return match.group(0) if match else None

def extract_phone(text: str) -> str | None:
    """
    Extracts the first phone number using regex.
    Handles optional country code and various separators.
    """
    match = re.search(r'(\+?\d{1,3}[\s\-]?)?(\(?\d{3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}', text)
    return match.group(0) if match else None

def extract_name(text: str) -> str | None:
    """
    Uses spaCy NER to extract the first PERSON entity (assumed to be candidate name).
    """
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text.strip()
    return None

def extract_skills(text: str) -> list[str]:
    """
    Finds skills mentioned in text from predefined SKILL_SET.
    Uses normalized matching for better accuracy.
    """
    text_lower = text.lower()
    found = [skill for skill in SKILL_SET if normalize_skill(skill) in text_lower]
    return list(set(found))

def extract_entities(text: str) -> dict:
    """
    Main interface: extracts name, email, phone, and skills from resume text.
    """
    text = clean_text(text)

    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text)
    }
