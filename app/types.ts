export type ImageStyle =
  | "realistic"
  | "cartoon"
  | "anime"
  | "illustration"
  | "oil painting"
  | "digital art"
  | "none";

export type Resolution = "standard" | "hd" | "ultra-hd";

export type DownloadFormat = "image/jpeg" | "image/png" | "image/webp";

export const STYLE_LABELS: Record<ImageStyle, string> = {
  realistic: "Realistic",
  cartoon: "Cartoon",
  anime: "Anime",
  illustration: "Illustration",
  "oil painting": "Oil painting",
  "digital art": "Digital art",
  none: "No style",
};

export const STYLE_PROMPT_SUFFIX: Record<Exclude<ImageStyle, "none">, string> = {
  realistic: "photorealistic, highly detailed, 8k",
  cartoon: "cartoon style, vibrant colors, clean lines",
  anime: "anime style, Japanese animation, detailed",
  illustration: "digital illustration, artistic, detailed",
  "oil painting": "oil painting style, brush strokes, classical art",
  "digital art": "digital art, concept art, detailed",
};

export const RESOLUTION_OPTIONS: { value: Resolution; label: string; size: number }[] = [
  { value: "standard", label: "Standard (1024px)", size: 1024 },
  { value: "hd", label: "HD (1280px)", size: 1280 },
  { value: "ultra-hd", label: "Ultra HD (1536px)", size: 1536 },
];
