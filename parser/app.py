from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import hashlib
import json

from resume_parser.extract_text import extract_text
from resume_parser.extract_entities import extract_entities
from resume_parser.extract_experience import extract_experience
from resume_parser.extract_education import extract_education
from resume_parser.sections import detect_sections
from resume_parser.adapter import build_resume_output

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(__file__)
UPLOAD_DIR = os.path.join(BASE_DIR, "resumes")
OUTPUT_DIR = os.path.join(BASE_DIR, "output_json")
CACHE_DIR = os.path.join(BASE_DIR, "cache")

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)


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

    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_DIR, filename)
    file.save(file_path)

    try:
        raw_text = extract_text(file_path)

        text_hash = hash_text_sha1(raw_text)
        cached = load_cached_result(text_hash)
        if cached is not None:
            return jsonify(cached), 200

        sections = detect_sections(raw_text)

        parsed_data = extract_entities(raw_text, sections=sections)
        parsed_data["experience"] = extract_experience(raw_text, sections=sections)
        parsed_data["education"] = extract_education(raw_text, sections=sections)

        resume_output = build_resume_output(parsed_data)
        output_data = resume_output.model_dump()

        save_cached_result(text_hash, output_data)

        output_filename = os.path.splitext(filename)[0] + ".json"
        with open(os.path.join(OUTPUT_DIR, output_filename), "w", encoding="utf-8") as f:
            json.dump(output_data, f, indent=4, ensure_ascii=False)

        return jsonify(output_data), 200

    except Exception as e:
        return jsonify({"error": f"Failed to parse resume: {str(e)}"}), 500


def hash_text_sha1(text: str) -> str:
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def cache_path_for_hash(text_hash: str) -> str:
    return os.path.join(CACHE_DIR, f"{text_hash}.json")


def load_cached_result(text_hash: str):
    path = cache_path_for_hash(text_hash)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return None
    return None


def save_cached_result(text_hash: str, data: dict):
    path = cache_path_for_hash(text_hash)
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
    except Exception:
        pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port, debug=True)
