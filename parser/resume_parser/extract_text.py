# resume_parser/extract_text.py

from resume_parser.utils import extract_text_from_file

def extract_text(path):
    """
    Wrapper for extracting and cleaning resume text from file.
    Delegates to utils.py.
    """
    return extract_text_from_file(path)
