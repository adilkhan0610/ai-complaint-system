"use server";

export async function suggestCategoryAndPriority(text) {
  let category = "General";
  let priority = "Low";

  const lower = text.toLowerCase();

  if (lower.includes("water") || lower.includes("pipe") || lower.includes("leak")) {
    category = "Plumbing";
    priority = "High";
  } else if (lower.includes("light") || lower.includes("fan") || lower.includes("electric")) {
    category = "Electrical";
    priority = "Medium";
  } else if (lower.includes("theft") || lower.includes("security")) {
    category = "Security";
    priority = "High";
  } else if (lower.includes("garbage") || lower.includes("clean")) {
    category = "Cleaning";
    priority = "Low";
  }

  return { category, priority };
}
