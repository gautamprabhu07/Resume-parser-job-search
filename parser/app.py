from flask import Flask, request, jsonify
import os
import json
from resume_parser.extract_text import extract_text
from resume_parser.extract_entities import extract_entities
from resume_parser.extract_experience import extract_experience

from flask_cors import CORS
app = Flask(__name__)
CORS(app)

# Ensure required folders exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'resumes')
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'output_json')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Root endpoint for testing
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Resume Parser API is running."}), 200

@app.route("/parse-resume", methods=["POST"])
def parse_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No resume file provided"}), 400

    file = request.files["resume"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    # Save uploaded file
    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)

    try:
        # Run parsing pipeline
        raw_text = extract_text(file_path)
        parsed_data = extract_entities(raw_text)
        parsed_data["experience"] = extract_experience(raw_text)

        # Save JSON output
        output_filename = os.path.splitext(filename)[0] + ".json"
        output_path = os.path.join(OUTPUT_DIR, output_filename)
        with open(output_path, "w", encoding="utf-8") as out_file:
            json.dump(parsed_data, out_file, indent=4, ensure_ascii=False)

        return jsonify(parsed_data)

    except Exception as e:
        return jsonify({"error": f"Failed to parse resume: {str(e)}"}), 500

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)

