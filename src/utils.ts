import { readdirSync } from "fs";

export function shuffleArray(array: unknown[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function firstPDF(): string | null {
  try {
    const files = readdirSync(".");
    const pdfFile = files.find((file) => file.toLowerCase().endsWith(".pdf"));
    return pdfFile || null;
  } catch (error) {
    return null;
  }
}
