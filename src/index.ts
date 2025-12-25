#!/usr/bin/env node

import { YankiConnect } from "yanki-connect";
import PDFParser from "pdf2json";
import OpenAI from "openai";
import dotenv from "dotenv";
import { SingleBar, Presets } from "cli-progress";
import { existsSync, readdirSync } from "fs";
import { useDeck } from "./stages/deck.js";
import { usePages } from "./stages/pages.js";
import { useAI } from "./stages/ai.js";
import { useNotes } from "./stages/notes.js";
import { useShuffle } from "./stages/shuffle.js";
import { useSync } from "./stages/sync.js";

dotenv.config();

function firstPDF(): string | null {
  try {
    const files = readdirSync(".");
    const pdfFile = files.find((file) => file.toLowerCase().endsWith(".pdf"));
    return pdfFile || null;
  } catch (error) {
    return null;
  }
}

const file = process.argv[2] || firstPDF();
if (!file) {
  console.error(
    "\nPlease provide a PDF file path as a command-line argument or place a PDF file in the current directory.\n",
  );
  process.exit(1);
}
if (!process.env.DEEPSEEK_API_KEY) {
  console.error("\nPlease set the DEEPSEEK_API_KEY environment variable.\n");
  process.exit(1);
}
if (!existsSync(file)) {
  console.error(`\nThe file "${file}" does not exist.\n`);
  process.exit(1);
}

const parser = new PDFParser();
const anki = new YankiConnect();
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});
const bar = new SingleBar({}, Presets.shades_classic);

parser.on("pdfParser_dataError", (errData) => console.error("parserError" in errData ? errData.parserError : errData));
parser.on("pdfParser_dataReady", async (data) => {
  console.clear();
  console.log(`PDF on path '${file}' parsed successfully.\n`);

  const deck = await useDeck({ data, anki });
  const cardData = await usePages({ data, bar });
  const cards = await useAI({ cardData, openai, bar });
  useShuffle({ cards });
  await useNotes({ cards, anki, bar, deck });
  await useSync({ anki });

  console.log("All done!");
});

//parser.loadPDF("Vocab_N5.pdf");
//await parser.loadPDF("Vocab_N4.pdf");
//await parser.loadPDF("Vocab_N3.pdf");
(async function () {
  await parser.loadPDF(file);
})();
