import { existsSync } from "fs";
import { firstPDF } from "../utils";
import { useDeck } from "../stages/deck.js";
import { usePages } from "../stages/pages.js";
import { useAI } from "../stages/ai.js";
import { useNotes } from "../stages/notes.js";
import { useShuffle } from "../stages/shuffle.js";
import { useSync } from "../stages/sync.js";
import { Context } from "../types";

export async function pdfCommand({ anki, pdfParser, bar, openai, args }: Context) {
  const file = args.file || firstPDF();
  if (!file || typeof file !== "string") {
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

  pdfParser.on("pdfParser_dataError", (errData) =>
    console.error("parserError" in errData ? errData.parserError : errData),
  );
  pdfParser.on("pdfParser_dataReady", async (data) => {
    console.clear();
    console.log(`PDF on path '${file}' parsed successfully.\n`);

    const deck = await useDeck({ title: data.Meta.Title, anki });
    const cardData = await usePages({ data, bar });
    const cards = await useAI({ cardData, openai, bar });
    useShuffle({ cards });
    await useNotes({ cards, anki, bar, deck });
    await useSync({ anki });

    console.log("All done!");
  });

  await pdfParser.loadPDF(file);
}
