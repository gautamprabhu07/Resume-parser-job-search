from resume_parser.schema import ResumeOutput, ContactField, SkillField, ExperienceEntry, EducationEntry

def build_resume_output(parsed_data: dict) -> ResumeOutput:
    # Contacts
    name_info = parsed_data.get("name", {"value": None, "confidence": 0.0})
    primary_email_info = parsed_data.get(
        "primary_email_detailed", {"value": None, "confidence": 0.0}
    )
    primary_phone_info = parsed_data.get(
        "primary_phone_detailed", {"value": None, "confidence": 0.0}
    )

    # Skills
    skills_detailed = parsed_data.get("skills_detailed", [])
    skills = [
        SkillField(value=s.get("value"), confidence=float(s.get("confidence", 0.0)))
        for s in skills_detailed
        if s.get("value")
    ]

    # Experience
    experience_raw = parsed_data.get("experience", [])
    experience = [
        ExperienceEntry(
            title=exp.get("title"),
            company=exp.get("company"),
            start_year=exp.get("start_year"),
            end_year=exp.get("end_year"),
            years=exp.get("years"),
            responsibilities=exp.get("responsibilities") or [],
            confidence=float(exp.get("confidence", 0.0)),
        )
        for exp in experience_raw
    ]

    # Education
    education_raw = parsed_data.get("education", [])
    education = [
        EducationEntry(
            degree_raw=ed.get("degree_raw"),
            line=ed.get("line"),
            graduation_year=ed.get("graduation_year"),
            confidence=float(ed.get("confidence", 0.0)),
        )
        for ed in education_raw
    ]

    # Language
    language = parsed_data.get("language")

    # Optional legacy / extras
    name_flat = parsed_data.get("name_flat")
    emails = parsed_data.get("emails")
    phones = parsed_data.get("phones")
    skills_flat = parsed_data.get("skills")

    return ResumeOutput(
        name=ContactField(
            value=name_info.get("value"),
            confidence=float(name_info.get("confidence", 0.0)),
        ),
        primary_email=ContactField(
            value=primary_email_info.get("value"),
            confidence=float(primary_email_info.get("confidence", 0.0)),
        ),
        primary_phone=ContactField(
            value=primary_phone_info.get("value"),
            confidence=float(primary_phone_info.get("confidence", 0.0)),
        ),
        skills=skills,
        experience=experience,
        education=education,
        language=language,
        name_flat=name_flat,
        emails=emails,
        phones=phones,
        skills_flat=skills_flat,
    )
