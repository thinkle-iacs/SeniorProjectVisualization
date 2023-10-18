export function getColor(category) {
  const orderedKeywordMapping = {
    "business": "#0000FF", // indigo (formal)
    "festyle": "#FFA500",  // Vivid Orange
    "environment": "#4CAF50", // green
    "computer": "#00BCD4", // cyan
    "iacs": "#c6094b", // school color - red
    "animal": "#8BC34A", // light green
    "outdoor": "#CDDC39", // lime
    "nature": "#9E9E9E", // grey
    "gender": "#FF4081", // bright pink (associated with gender themes)
    "science": "#008000", // indigo
    "technology": "#03A9F4", // light blue
    "politic": "#313131",    // Stately Deep Grey
    "medic": "#E91E63", // pink (medical items often have a pink variant)
    "electronic": "#9E9E9E", // grey (neutral, techy)
    "program": "#3949AB", // deep blue (consistent with science/technology)
    "art": "#F44336", // red (often associated with passion/creativity)
    "design": "#FF9800", // orange
    "animation": "#7C4DFF", // deep purple
    "write": "#795548", // brown (paper-like)
    "film": "#607D8B", // blue grey (neutral, filmy)
    "dance": "#D32F2F", // dark red
    "music": "#3F51B5", // indigo
    "audio": "#00BCD4", // cyan
    "craft": "#FFC107", // amber
    "photo": "#4FC3F7", // light blue (sky-like)
    "woodwork": "#8D6E63", // brown (wood-like)
    "theater": "#CDDC39", // lime
    "literature": "#5D4037", // brown (book-like)
    "comedy": "#FFEB3B", // yellow (bright, cheerful)
    "social": "#03A9F4", // light blue
    "culture": "#00BCD4", // cyan
    "religion": "#673AB7", // deep purple
    "philosophy": "#FF5722", // deep orange
    "lifestyle": "#8BC34A", // light green
    "gaming": "#C2185B", // pink (often used in gaming logos)
    "food": "#FF9800", // orange (often used in food advertising)
    "travel": "#009688", // teal
    "self": "#4CAF50", // green
    "family": "#FFEB3B", // yellow (warm, familial)
    "mental": "#673AB7", // deep purple (calm, serene)
    "physical": "#E64A19", // deep orange
    "cosmetology": "#E91E63", // pink
    "education": "#CDDC39", // lime (fresh, new beginnings)
    "sport": "#7CB342", // lime green
    "profession": "#3F51B5", // indigo
    "garden": "#4CAF50", // green
    "childhood": "#FFC107", // amber (warm, nostalgic)
    "parent": "#FF9800", // orange
    "politic": "#455A64", // blue grey (neutral, formal)
    "law": "#5D4037", // brown (wood, gavels, court)
    "community": "#4CAF50", // green (growth, together)
    "justice": "#303F9F", // indigo (calm, stable)
    "econom": "#607D8B", // blue grey (neutral, formal)
    "event": "#00BCD4", // cyan (fresh, exciting)
    "build": "#5D4037", // brown (wood, construction)
    "finance": "#3F51B5", // indigo (stable, trustworthy)
    "automotive": "#455A64", // blue grey (machinery, cars)
    "fashion": "#E91E63", // pink (bold, stylish)
    "singing": "#3F51B5", // indigo (associated with music)
    "advertising": "#FFCA28", // amber (catchy, attention-grabbing)
    "photography": "#4FC3F7", // light blue (already included as "photo", might consider another shade if you want differentiation)
    "language": "#FFD54F", // sunflower yellow (communication, diversity)  
    "supernatural": "#9C27B0", // purple (mysticism, unknown)
    "media": "#03A9F4", // light blue (broad and communicative)
    "representation": "#E53935", // bright red (visibility, importance)
    "history": "#795548", // brown (earth, age, past)
  };


  category = category.toLowerCase();

  for (let keyword in orderedKeywordMapping) {
    if (category.includes(keyword)) {
      return orderedKeywordMapping[keyword];
    }
  }

  // Fallback colors
  const fallbackColors = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a"];
  return fallbackColors[category.length % fallbackColors.length];
}


export function getTextColor(bgColor) {
  // Ensure the input color is in the format: "#RRGGBB"
  if (!/^#[0-9A-F]{6}$/i.test(bgColor)) {
    console.warn("Invalid color format:", bgColor);
    return "#000000"; // default to black text
  }

  // Extract RGB values
  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return white for dark colors and black for light colors
  return luminance < 0.5 ? "#FFFFFF" : "#000000";
}