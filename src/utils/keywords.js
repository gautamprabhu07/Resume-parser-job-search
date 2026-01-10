// src/utils/keywords.js

/**
 * Safely extract keyword candidates (skills) from parsed resume JSON.
 * Supports:
 *  - skills: string[]
 *  - skills_detailed: { value: string, confidence: number }[]
 */
export function extractKeywords(parsedData) {
  if (!parsedData || typeof parsedData !== 'object') return [];

  // If canonical string skills are present
  if (Array.isArray(parsedData.skills)) {
    return parsedData.skills.filter(s => typeof s === 'string' && s.trim().length > 0);
  }

  // If detailed skills are present
  if (Array.isArray(parsedData.skills_detailed)) {
    return parsedData.skills_detailed
      .map(s => (s && typeof s.value === 'string' ? s.value.trim() : ''))
      .filter(Boolean);
  }

  return [];
}

/**
 * Build a keyword string for Jooble:
 *  - limit total count
 *  - sort detailed skills by confidence if available
 */
export function buildKeywordString(parsedData, max = 5) {
  let skills = [];

  if (Array.isArray(parsedData.skills_detailed)) {
    skills = [...parsedData.skills_detailed]
      .filter(s => s && typeof s.value === 'string')
      .sort((a, b) => (b.confidence || 0) - (a.confidence || 0))
      .map(s => s.value.trim())
      .filter(Boolean);
  } else {
    skills = extractKeywords(parsedData);
  }

  if (!skills.length) {
    return 'software developer';
  }

  return skills
    .slice(0, max)
    .join(' ')
    .slice(0, 120); // hard cap to protect Jooble and keep relevance
}
