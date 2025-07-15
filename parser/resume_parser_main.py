import sys
import json
from resume_parser.extract_text import extract_text
from resume_parser.extract_entities import extract_entities
from resume_parser.extract_experience import extract_experience





def parse_resume(file_path):
    try:
        text = extract_text(file_path)
        entities = extract_entities(text)
        experience = extract_experience(text)
        entities["experience"] = experience

        print(json.dumps(entities))  # Output result to stdout for Node.js to read
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        parse_resume(sys.argv[1])
    else:
        print(json.dumps({"error": "No file path provided"}))
