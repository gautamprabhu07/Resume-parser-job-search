# app.py

import os
import json
import streamlit as st
from resume_parser.extract_text import extract_text
from resume_parser.extract_entities import extract_entities
from resume_parser.extract_experience import extract_experience

# Configure Streamlit app layout and title
st.set_page_config(page_title="📄 AI Resume Parser", layout="centered")
st.title("📄 AI-Powered Resume Parser")
st.write("Upload a resume (PDF, DOCX, TXT) to extract structured information using NLP.")

# File uploader widget
uploaded_file = st.file_uploader("Choose a resume file", type=["pdf", "docx", "txt"])

if uploaded_file:
    # Ensure folders exist
    os.makedirs("resumes", exist_ok=True)
    os.makedirs("output_json", exist_ok=True)

    # Save uploaded file
    file_path = os.path.join("resumes", uploaded_file.name)
    with open(file_path, "wb") as f:
        f.write(uploaded_file.read())

    with st.spinner("🔍 Extracting text from resume..."):
        raw_text = extract_text(file_path)

    with st.spinner("🧠 Parsing structured information..."):
        parsed_data = extract_entities(raw_text)
        parsed_data["experience"] = extract_experience(raw_text)

    # Show output
    st.subheader("📊 Extracted Resume Information")
    st.json(parsed_data)

    # Save structured data to JSON file
    output_filename = os.path.splitext(uploaded_file.name)[0] + ".json"
    output_path = os.path.join("output_json", output_filename)
    with open(output_path, "w", encoding="utf-8") as out_file:
        json.dump(parsed_data, out_file, indent=4, ensure_ascii=False)

    st.success("✅ Resume parsed and saved successfully!")

    # Provide download button
    with open(output_path, "rb") as f:
        st.download_button("⬇️ Download JSON Output", f, file_name=output_filename, mime="application/json")
