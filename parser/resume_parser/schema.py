# resume_parser/schema.py

from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class ContactField(BaseModel):
    value: Optional[str] = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class SkillField(BaseModel):
    value: str
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ExperienceEntry(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    start_year: Optional[int] = None
    end_year: Optional[int] = None
    years: Optional[float] = None
    responsibilities: List[str] = Field(default_factory=list)
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class EducationEntry(BaseModel):
    degree_raw: Optional[str] = None
    line: Optional[str] = None
    graduation_year: Optional[int] = None
    confidence: float = Field(default=0.0, ge=0.0, le=1.0)


class ResumeOutput(BaseModel):
    # Core contacts (rich fields)
    name: ContactField
    primary_email: ContactField
    primary_phone: ContactField

    # Skills (rich fields)
    skills: List[SkillField] = Field(default_factory=list)

    # Experience / education (rich fields)
    experience: List[ExperienceEntry] = Field(default_factory=list)
    education: List[EducationEntry] = Field(default_factory=list)

    # Language metadata
    language: Optional[str] = None

    # Optional legacy/extra fields (if you want to keep them)
    # These are optional so they don't break validation if missing.
    name_flat: Optional[str] = None
    emails: Optional[list[str]] = None
    phones: Optional[list[str]] = None
    skills_flat: Optional[list[str]] = None
